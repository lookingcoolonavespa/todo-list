import { Client } from 'pg';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = new Client();

    await client.connect();

    const query = 'SELECT id, project, title FROM todos';
    const data = await client.query(query);
    client.end();

    res.status(200).json({ data: data.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
