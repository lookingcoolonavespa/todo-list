import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../utils/session';
import { PoolClient } from 'pg';
import { connectToPool } from '../../../utils/pool';

let client: PoolClient | undefined;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405);
  const pool = connectToPool();
  client = client || (await pool.connect());

  const { uid } = req.query;
  try {
    const data = await client.query(
      `SELECT ${process.env.SCHEMA}.projects.id AS project_id, ${process.env.SCHEMA}.projects.title AS project_title, ${process.env.SCHEMA}.todos.title AS todo_title, ${process.env.SCHEMA}.todos.id AS todo_id, ${process.env.SCHEMA}.todos.due_date, ${process.env.SCHEMA}.todos.completed
      FROM ${process.env.SCHEMA}.projects LEFT OUTER JOIN ${process.env.SCHEMA}.todos ON ${process.env.SCHEMA}.projects.id = todos.project WHERE projects.userid = '${uid}';`
    );

    res.status(200).json({
      rows: data.rows,
      loggedIn: true,
    });
  } catch (err) {
    return res.status(401).json({
      loggedIn: false,
      id: '',
    });
  } finally {
    client.release(true);
    client = undefined;
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

/*
SELECT projects.id AS project_id, projects.title AS project_title, todos.title AS todo_title, todos.id AS todo_id, todos.due_date
FROM projects LEFT OUTER JOIN todos ON projects.id = todos.project WHERE projects.userid = 'e565937e-9962-4ecb-8eaa-86cc912d58d9';
 */
