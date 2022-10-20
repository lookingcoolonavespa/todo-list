import { NextApiRequest, NextApiResponse } from 'next';
import { body, validationResult } from 'express-validator';
import { connectToClient } from '../../../utils/client';
import initMiddleware from '../../../utils/initMiddleware';
import validateMiddleware from '../../../utils/validateMiddleware';
import { isValueUnique } from '../../../utils/validators';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user || !req.session.user.loggedIn) return res.status(401);

  const client = await connectToClient();

  switch (req.method) {
    case 'POST': {
      // create a todo
      try {
        await initMiddleware(
          validateMiddleware([
            body('title')
              .trim()
              .notEmpty()
              .withMessage('project title is missing')
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
          ])
        )(req, res);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        const output = await client.query(
          `INSERT INTO ${process.env.SCHEMA}.todos (title, userid, project, due_date) VALUES ($1, $2, $3, $4) RETURNING id;`,
          [
            req.body.title,
            req.session.user.id,
            req.body.project,
            req.body.due_date,
          ]
        );

        return res.status(200).send(output.rows[0].id);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
