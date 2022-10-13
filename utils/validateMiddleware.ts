import {
  ResultFactory,
  ValidationError,
  ValidationChain,
} from 'express-validator';
import next, { NextApiRequest, NextApiResponse } from 'next';

export default function validateMiddleware(
  validations: ValidationChain[]
): (req: NextApiRequest, res: NextApiResponse, next: () => void) => void {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    next();
  };
}
