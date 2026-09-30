// Vercel executes this file as native ESM. Keep the TypeScript extension so
// its function bundler includes server.ts instead of leaving a runtime import
// for the non-existent /var/task/server path.
import app, { ready } from '../server.ts';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  await ready;
  return app(req, res);
}
