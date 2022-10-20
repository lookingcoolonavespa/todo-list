import { NextApiRequest, NextApiResponse } from 'next';
import { body, validationResult } from 'express-validator';
import { connectToClient } from '../../../utils/client';
import initMiddleware from '../../../utils/initMiddleware';
import validateMiddleware from '../../../utils/validateMiddleware';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user || !req.session.user.loggedIn) return res.status(401);

  const startTime = Date.now();
  const client = await connectToClient();

  console.log('after connecting', Date.now() - startTime);
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

        console.log('after validating', Date.now() - startTime);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        const output = await client.query(
          `INSERT INTO ${process.env.SCHEMA}.projects (title, userid) VALUES ($1, $2) RETURNING id;`,
          [req.body.title, req.session.user.id]
        );

        console.log('after query', Date.now() - startTime);
        return res.status(200).send(output.rows[0].id);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
