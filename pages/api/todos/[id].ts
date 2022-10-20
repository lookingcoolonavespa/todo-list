import { NextApiRequest, NextApiResponse } from 'next';
import { connectToClient } from '../../../utils/client';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user || !req.session.user.loggedIn) return res.status(401);
  const client = await connectToClient();

  switch (req.method) {
    case 'PUT': {
      try {
        const imports = {
          initMiddleware: await import('../../../utils/initMiddleware'),
          validateMiddleware: await import('../../../utils/validateMiddleware'),
          validators: await import('../../../utils/validators'),
          expressValidator: await import('express-validator'),
        };
        const initMiddleware = imports.initMiddleware.default;
        const validateMiddleware = imports.validateMiddleware.default;
        const { body, validationResult } = imports.expressValidator.default;
        const isValueUnique = imports.validators.isValueUnique;

        await initMiddleware(
          validateMiddleware([
            body('title')
              .trim()
              .notEmpty()
              .withMessage('todo title is missing')
              .isLength({ max: 40 })
              .withMessage('title is too long bruh'),
            body('due_date')
              .trim()
              .notEmpty()
              .withMessage('due date is missing')
              .matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)
              .withMessage('due date is not in the correct format'),
            body('project').custom(async function isProjectValid(
              project: string
            ) {
              const result = await isValueUnique(
                client,
                project,
                'projects',
                'id'
              );
              if (result) throw new Error('no project exists with that id');
              return true;
            }),
            body('completed')
              .notEmpty()
              .withMessage('complete status is empty')
              .isBoolean()
              .withMessage('complete status needs to be a boolean'),
          ])
        )(req, res);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        await client.query(
          `UPDATE ${process.env.SCHEMA}.todos SET title = $1, project = $2, completed = $3, due_date = $4 WHERE id = $5;`,
          [
            req.body.title,
            req.body.project,
            req.body.completed,
            req.body.due_date,
            req.query.id,
          ]
        );

        return res.status(200).end();
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    case 'DELETE': {
      try {
        await client.query(
          `DELETE FROM ${process.env.SCHEMA}.todos WHERE id = $1`,
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
