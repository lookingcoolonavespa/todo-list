import { NextApiRequest, NextApiResponse } from 'next';
import { body, validationResult } from 'express-validator';
import { connectToPool } from '../../../utils/pool';
import initMiddleware from '../../../utils/initMiddleware';
import validateMiddleware from '../../../utils/validateMiddleware';
import { isValueUnique } from '../../../utils/validators';
import { PoolClient } from 'pg';
import emitPusherEvent from '../../../utils/pusher';

let client: PoolClient | undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = connectToPool();
  client = client || (await pool.connect());

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
            body('userid').custom(async function isUserIdValid(userid: string) {
              const result = await isValueUnique(
                client as PoolClient,
                userid,
                'users',
                'id'
              );
              if (result) throw new Error('no user exists with that id');
              return true;
            }),
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
          ])
        )(req, res);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        await client.query(
          `INSERT INTO todos (id, title, userid, project, due_date) VALUES ('${req.body.id}', '${req.body.title}', '${req.body.userid}', '${req.body.project}', '${req.body.due_date}');`
        );

        await emitPusherEvent(res, req.body.userid, 'add-todo', {
          id: req.body.id,
          title: req.body.title,
          project: req.body.project,
          due_date: req.body.due_date,
        });

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

/*
  due_date: '2022-10-16',
  project: 'ab538609-415d-46de-ace4-b11ca3689c31',
  title: 'added twice',
  completed: false

  UPDATE todos SET title = 'added twice', project = 'ab538609-415d-46de-ace4-b11ca3689c31', due_date = '2022-10-16' WHERE id = 'c96fa872-acce-4086-af1e-d8e6a7816794';
*/
