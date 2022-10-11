import {
  ResultFactory,
  ValidationError,
  ValidationChain,
} from 'express-validator';
import { NextApiRequest, NextApiResponse } from 'next';

export default function validateMiddleware(
  validations: ValidationChain[]
): (req: NextApiRequest) => void {
  return async (req) => {
    await Promise.all(validations.map((v) => v.run(req)));
  };
}
