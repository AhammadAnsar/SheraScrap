import app, { ready } from '../server';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  await ready;
  return app(req, res);
}
