import { subsections } from '../utils/constants';
import Project from '../utils/classes/Project';
import Todo from '../utils/classes/Todo';
import { Dispatch as ReactDispatch } from 'react';
import { signUpFields } from '../utils/constants';

export type SubsectionType = typeof subsections[number];

export type Dispatch = ReactDispatch<
  | {
      type: 'add' | 'edit';
      itemType: 'project';
      payload: Project;
    }
  | {
      type: 'add' | 'edit';
      itemType: 'todo';
      payload: Todo;
    }
  | {
      type: 'delete';
      itemType: 'project';
      payload: string;
    }
  | {
      type: 'delete';
      itemType: 'todo';
      payload: { id: string; project: string };
    }
>;

export type Validator = (
  value: string,
  confirmStr?: string
) => { error: string };

export type StringKeys<I> = Extract<keyof I, string>;

export type SignUpFields = typeof signUpFields[number];

type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type YYYY =
  | `19${zeroToNine}${zeroToNine}`
  | `20${zeroToNine}${zeroToNine}`;
export type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
export type DD = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`;
export type DateStr = `${YYYY}-${MM}-${DD}`;
