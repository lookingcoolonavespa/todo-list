import { Pool } from 'pg';

let cachedPool: Pool;

export function connectToPool() {
  if (!cachedPool) cachedPool = new Pool();
  return cachedPool;
}
