import { NextApiRequest, NextApiResponse } from 'next';
import { connectToClient } from '../../../utils/client';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user || !req.session.user.loggedIn) return res.status(401);

  const client = await connectToClient();

  switch (req.method) {
    case 'PUT': {
      const imports = {
        initMiddleware: await import('../../../utils/initMiddleware'),
        validateMiddleware: await import('../../../utils/validateMiddleware'),
        expressValidator: await import('express-validator'),
      };
      const initMiddleware = imports.initMiddleware.default;
      const validateMiddleware = imports.validateMiddleware.default;
      const { body, validationResult } = imports.expressValidator.default;
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
          `UPDATE ${process.env.SCHEMA}.projects SET title = $1 WHERE id = $2;`,
          [req.body.title, req.query.id]
        );

        return res.status(200).end();
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    case 'DELETE': {
      try {
        await client.query(
          `DELETE FROM ${process.env.SCHEMA}.projects WHERE id = $1`,
          [req.query.id]
        );

        return res.status(200).end();
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
