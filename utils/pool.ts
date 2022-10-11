import { Pool } from 'pg';

let cachedPool: any;

export function connectToPool() {
  if (!cachedPool) cachedPool = new Pool();
  return cachedPool;
}