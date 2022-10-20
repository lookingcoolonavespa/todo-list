import { CustomValidator } from 'express-validator';
import { Validator } from '../types/types';
import { Client } from 'pg';

export const doPasswordsMatch: CustomValidator = async (value, { req }) =>
  value === req.body.password;

export const isValueUnique = async (
  client: Client,
  value: string,
  table: string,
  column: string
) => {
  const entity = await client.query(
    `SELECT id FROM ${process.env.SCHEMA}.${table} WHERE ${column} = '${value}'`
  );

  return !entity.rows.length;
};

export const checkUsername: Validator = (username: string) => {
  if (username.match(/^[A-Za-z0-9_]{6,20}$/)) return { error: '' };
  else
    return {
      error:
        'username must be between 6 and 20 characters. Only characters allowed are alphanumeric characters or underscores.',
    };
};

export const checkPassword: Validator = (value: string) => ({
  error: value.match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
  )
    ? ''
    : 'password must be minimum eight and maximum 20 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
});

export const confirmPassword: (password: string) => Validator =
  (password: string) => (value: string) => ({
    error: value === password ? '' : 'passwords do not match',
  });
