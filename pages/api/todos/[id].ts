import { NextApiRequest, NextApiResponse } from 'next';
import { body, validationResult } from 'express-validator';
import { connectToPool } from '../../../utils/pool';
import initMiddleware from '../../../utils/initMiddleware';
import validateMiddleware from '../../../utils/validateMiddleware';
import { isValueUnique } from '../../../utils/validators';
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
                client as PoolClient,
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

        console.log({ ...req.body, id: req.query.id });
        await client.query(
          `UPDATE ${process.env.SCHEMA}.todos SET title = '${req.body.title}', project = '${req.body.project}', completed = '${req.body.completed}', due_date = '${req.body.due_date}' WHERE id = '${req.query.id}';`
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
          `DELETE FROM ${process.env.SCHEMA}.todos WHERE id = '${req.query.id}'`
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
