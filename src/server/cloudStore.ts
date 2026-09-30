import { AsyncLocalStorage } from 'node:async_hooks';
import type { RequestHandler } from 'express';
import type { NormalizedStore } from '../data/repository';
import { cloudStorageEnabled, storeCollection } from './firebaseAdmin';

type Context = { store: NormalizedStore; original: Record<string, any>; dirty: boolean };
export const storeContext = new AsyncLocalStorage<Context>();
const equal = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
export class StoreConflict extends Error {}

// Concurrent requests may append different inquiries. Never silently replace another edit.
export function mergeValue(original: any, edited: any, current: any): any {
  if (equal(original, edited)) return current;
  if (equal(original, current) || equal(edited, current)) return edited;
  const keyed = (v: any) => Array.isArray(v) && v.every(x => x && typeof x.id === 'string') && new Set(v.map(x => x.id)).size === v.length;
  if (keyed(original) && keyed(edited) && keyed(current)) {
    const result = new Map(current.map((x: any) => [x.id, x]));
    const before = new Map(original.map((x: any) => [x.id, x]));
    const after = new Map(edited.map((x: any) => [x.id, x]));
    for (const id of new Set([...before.keys(), ...after.keys()])) {
      const value = mergeValue(before.get(id), after.get(id), result.get(id));
      if (value === undefined) result.delete(id); else result.set(id, value);
    }
    return [...result.values()];
  }
  throw new StoreConflict('Content changed in another session. Reload before saving again.');
}

export async function commitStore(ctx: Context, collection = storeCollection()) {
  if (!ctx.dirty) return;
  const edited = JSON.parse(JSON.stringify(ctx.store));
  const keys = Object.keys(edited).filter(k => !equal(ctx.original[k], edited[k]));
  if (!keys.length) return;
  await collection.firestore.runTransaction(async tx => {
    const refs = keys.map(k => collection.doc(k));
    const snapshots = await tx.getAll(...refs);
    const values = keys.map((key, i) => mergeValue(ctx.original[key], edited[key], snapshots[i].data()?.value));
    values.forEach((value, i) => {
      if (Buffer.byteLength(JSON.stringify(value)) > 900_000) throw new Error('CMS section exceeds storage size limit; archive older records before saving.');
      tx.set(refs[i], { value });
    });
  });
}

export function createCloudStoreMiddleware(getCollection = storeCollection): RequestHandler { return async (_req, res, next) => {
  if (!cloudStorageEnabled()) return next();
  try {
    const collection = getCollection();
    const snapshot = await collection.get();
    const original = Object.fromEntries(snapshot.docs.map(doc => [doc.id, doc.data().value]));
    if (!original.version || !original.settings || !Array.isArray(original.users)) throw new Error('Firebase CMS is not initialized. Run npm run firebase:seed.');
    const ctx: Context = { original, store: structuredClone(original) as NormalizedStore, dirty: false };
    // All app mutations respond through send/json. Hold end until durable commit succeeds.
    const end = res.end.bind(res);
    res.end = function (...args: any[]) {
      res.end = end;
      if (!ctx.dirty || res.statusCode >= 400) return end(...args);
      commitStore(ctx, collection).then(() => end(...args)).catch(error => {
        console.error('Firebase commit failed:', error);
        res.removeHeader('Content-Length');
        res.removeHeader('ETag');
        res.status(error instanceof StoreConflict ? 409 : 503).json({ error: error instanceof StoreConflict ? error.message : 'Could not save data. Please retry.' });
      });
      return res;
    } as typeof res.end;
    storeContext.run(ctx, next);
  } catch (error) {
    console.error('Firebase CMS unavailable:', error);
    res.setHeader('Cache-Control', 'no-store');
    res.status(503).json({ error: 'CMS connection unavailable. Check server Firebase configuration and initialization.' });
  }
}; }
export const cloudStoreMiddleware = createCloudStoreMiddleware();
