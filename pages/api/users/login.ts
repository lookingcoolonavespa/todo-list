import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { PoolClient } from 'pg';
import { connectToPool } from '../../../utils/pool';
import bcrypt from 'bcryptjs';
import { User } from '../../../types/interfaces';
import { sessionOptions } from '../../../utils/session';

let client: PoolClient;

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  const pool = connectToPool();
  client = client || (await pool.connect());

  try {
    const data = await client.query<User>(
      `Select id, username, password FROM users WHERE username = '${username}';`
    );
    const user = data.rows[0];
    if (!user) throw new Error();

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      req.session.user = {
        username: user.username,
        loggedIn: true,
        id: user.id,
      };
      await req.session.save();
      res.status(200).end();
    } else {
      throw new Error('incorrect credentials');
    }
  } catch (err) {
    return res.status(401).send('incorrect credentials');
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
