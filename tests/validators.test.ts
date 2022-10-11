import { describe, it } from '@jest/globals';
import { checkUsername } from '../utils/validators';

describe('checkUsername works', () => {
  it('returns an error when username is shorter than 6 characters', () => {
    expect(checkUsername('five').error).toBeTruthy();
  });

  it('returns an error when username is greater than 20 characters', () => {
    expect(checkUsername(Array(21).fill('a').join('')).error).toBeTruthy();
  });

  it('doesnt return an error when username is 6 characters', () => {
    expect(checkUsername(Array(6).fill('a').join('')).error).toBeFalsy();
  });

  it('doesnt return an error when username is 20 characters', () => {
    expect(checkUsername(Array(20).fill('a').join('')).error).toBeFalsy();
  });

  it('returns an error when there is a space anywhere in the username', () => {
    expect(checkUsername(' 123456')).toBeTruthy();
    expect(checkUsername('1 23456')).toBeTruthy();
    expect(checkUsername('1 2345 6')).toBeTruthy();
    expect(checkUsername('123456 ')).toBeTruthy();
    expect(checkUsername(' 123456 ')).toBeTruthy();
  });

  it('doesnt return an error when username is only filled with alphanumeric characters', () => {
    expect(checkUsername('1Abz5f').error).toBeFalsy();
  });

  it('returns an error when there is a special character anywhere in the username', () => {
    expect(checkUsername('123456@')).toBeTruthy();
  });
});
