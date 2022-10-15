import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { PoolClient } from 'pg';
import { connectToPool } from '../../utils/pool';
import bcrypt from 'bcryptjs';
import { User } from '../../types/interfaces';
import { sessionOptions } from '../../utils/session';

let client: PoolClient;

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  const pool = connectToPool();
  client = client || (await pool.connect());

  try {
    const data = await client.query<User>(
      `Select id, password FROM users WHERE username = '${username}';`
    );
    const user = data.rows[0];

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      req.session.user = {
        loggedIn: true,
        id: user.id,
      };
      await req.session.save();
      res.json(user);
    } else {
      return res.status(401).send('incorrect credentials');
    }
  } catch (err) {
    console.log(err);
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
