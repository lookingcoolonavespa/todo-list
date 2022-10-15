import { body, validationResult } from 'express-validator';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToPool } from '../../utils/pool';
import initMiddleware from '../../utils/initMiddleware';
import validateMiddleware from '../../utils/validateMiddleware';
import { isUsernameInUse } from '../../utils/validators';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PoolClient } from 'pg';
import { LoggedInUser } from '../../types/interfaces';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../utils/session';

let client: PoolClient | undefined;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = connectToPool();
  client = client || (await pool.connect());

  switch (req.method) {
    case 'GET': {
      if (req.session.user) {
        // const data = await client.query(
        //   'Select users.username, projects.id, projects.title FROM users JOIN projects ON id = userid'
        // );
        // console.log(data);

        res.json({
          ...req.session.user,
          loggedIn: true,
        });
      } else {
        return res.json({
          loggedIn: false,
          id: '',
        });
      }
      break;
    }
    case 'POST': {
      try {
        await initMiddleware(
          validateMiddleware([
            body('username')
              .trim()
              .notEmpty()
              .withMessage('username is missing')
              .isLength({ max: 100 })
              .withMessage('username is too long brudda')
              .custom(isUsernameInUse(client)),
            body('password')
              .trim()
              .notEmpty()
              .withMessage('password is missing'),
          ])
        )(req, res);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        const hashed = await hash(req.body.password, 10);
        const uuid = randomUUID();
        await client.query(
          `INSERT INTO users (id, username, password) VALUES ('${uuid}', '${req.body.username}', '${hashed}')`
        );

        const user: LoggedInUser = {
          id: uuid,
          loggedIn: true,
        };
        req.session.user = user;
        await req.session?.save();

        return res.status(200).json({}).end();
      } catch (err) {
        console.log(err);
        return res.status(500).json({ errors: err });
      } finally {
        client.release(true);
        client = undefined;
      }
    }
    default:
      return res.status(405);
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
