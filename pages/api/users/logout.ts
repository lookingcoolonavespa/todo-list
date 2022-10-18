import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { LOGGED_OUT_USER } from '../../../utils/constants';
import { sessionOptions } from '../../../utils/session';

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  req.session.destroy();
  res.json(LOGGED_OUT_USER);
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
