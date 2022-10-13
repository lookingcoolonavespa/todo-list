import { body, validationResult } from 'express-validator';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToPool } from '../../utils/pool';
import initMiddleware from '../../utils/initMiddleware';
import validateMiddleware from '../../utils/validateMiddleware';
import { isUsernameInUse } from '../../utils/validators';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = connectToPool();
  const client = await pool.connect();

  switch (req.method) {
    case 'GET': {
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
        await client.query(
          `INSERT INTO users (id, username, password) VALUES ('${randomUUID()}', '${
            req.body.username
          }', '${hashed}')`
        );

        return res.status(200).end();

        break;
      } catch (err) {
        console.log(err);
        return res.status(422).json({ errors: err });
      } finally {
        client.release();
      }
    }
    default:
      return res.status(405);
  }
}
