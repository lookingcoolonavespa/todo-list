import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../utils/session';
import { PoolClient } from 'pg';
import { connectToPool } from '../../../utils/pool';

let client: PoolClient | undefined;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('hit endpoint');
  if (req.method !== 'GET') return res.status(405);
  const pool = connectToPool();
  client = client || (await pool.connect());

  const { uid } = req.query;
  if (req.session.user) {
    const data = await client.query(
      `Select users.username, projects.id, projects.title FROM users JOIN projects ON id = ${uid}`
    );
    console.log(data);

    res.status(200).json({
      ...req.session.user,
      loggedIn: true,
    });
  } else {
    return res.status(401).json({
      loggedIn: false,
      id: '',
    });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
