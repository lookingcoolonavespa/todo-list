import { NextApiRequest, NextApiResponse } from 'next';
import { body, validationResult } from 'express-validator';
import { connectToPool } from '../../utils/pool';
import initMiddleware from '../../utils/initMiddleware';
import validateMiddleware from '../../utils/validateMiddleware';
import { isValueUnique } from '../../utils/validators';
import { PoolClient } from 'pg';

let client: PoolClient | undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
          ])
        )(req, res);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        await client.query(
          `INSERT INTO projects (id, title, userid) VALUES ('${req.body.id}', '${req.body.title}', '${req.body.userid}')`
        );

        return res.status(200).end();
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }
}
