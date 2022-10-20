import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { connectToClient } from '../../../utils/client';
import bcrypt from 'bcryptjs';
import { User } from '../../../types/interfaces';
import { sessionOptions } from '../../../utils/session';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  const client = await connectToClient();

  try {
    const data = await client.query<User>(
      `Select id, username, password FROM ${process.env.SCHEMA}.users WHERE username = '${username}';`
    );
    const user = data.rows[0];
    if (!user) throw new Error();

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      req.session.user = {
        username: user.username,
        loggedIn: true,
        id: user.id,
        projects: '',
        todos: '',
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
