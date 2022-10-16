import { NextApiRequest, NextApiResponse } from 'next';
import { body, validationResult } from 'express-validator';
import { connectToPool } from '../../../utils/pool';
import initMiddleware from '../../../utils/initMiddleware';
import validateMiddleware from '../../../utils/validateMiddleware';
import { isValueUnique } from '../../../utils/validators';
import { PoolClient } from 'pg';
import emitPusherEvent from '../../../utils/pusher';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';

let client: PoolClient | undefined;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user || !req.session.user.loggedIn) return res.status(401);

  const pool = connectToPool();
  client = client || (await pool.connect());

  switch (req.method) {
    case 'POST': {
      // create a project
      try {
        await initMiddleware(
          validateMiddleware([
            body('title')
              .trim()
              .notEmpty()
              .withMessage('project title is missing')
              .isLength({ max: 40 })
              .withMessage('title is too long bruh'),
          ])
        )(req, res);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        await client.query(
          `INSERT INTO projects (id, title, userid) VALUES ('${req.body.id}', '${req.body.title}', '${req.session.user.id}')`
        );

        await emitPusherEvent(res, req.body.userid, 'add-project', {
          id: req.body.id,
          title: req.body.title,
        });

        return res.status(200).end();
      } catch (err) {
        res.status(500).json(err);
      } finally {
        client.release(true);
        client = undefined;
      }
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
