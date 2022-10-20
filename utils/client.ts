import { Client } from 'pg';

let cachedClient: Client;

export async function connectToClient() {
  if (!cachedClient) {
    cachedClient = new Client();
    await cachedClient.connect();
  }
  return cachedClient;
}
