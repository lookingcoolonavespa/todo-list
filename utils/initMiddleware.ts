import { NextApiRequest, NextApiResponse } from 'next';

type Middleware<R> = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (result?: R) => void
) => void;

export default function initMiddleware<R>(
  middleware: Middleware<R>
): (req: NextApiRequest, res: NextApiResponse) => Promise<R> {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}
