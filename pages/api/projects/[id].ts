import { NextApiRequest, NextApiResponse } from 'next';
import { body, validationResult } from 'express-validator';
import { connectToPool } from '../../../utils/pool';
import initMiddleware from '../../../utils/initMiddleware';
import validateMiddleware from '../../../utils/validateMiddleware';
import { PoolClient } from 'pg';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';

let client: PoolClient | undefined;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user || !req.session.user.loggedIn) return res.status(401);

  const pool = connectToPool();
  client = client || (await pool.connect());

  switch (req.method) {
    case 'PUT': {
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
          `UPDATE ${process.env.SCHEMA}.projects SET title = '${req.body.title}' WHERE id = '${req.query.id}';`
        );

        return res.status(200).end();
      } catch (err) {
        return res.status(500).json(err);
      } finally {
        client.release(true);
        client = undefined;
        return;
      }
    }

    case 'DELETE': {
      try {
        await client.query(
          `DELETE FROM ${process.env.SCHEMA}.projects WHERE id = '${req.query.id}'`
        );

        return res.status(200).end();
      } catch (err) {
        return res.status(500).json(err);
      } finally {
        client.release(true);
        client = undefined;
        return;
      }
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
