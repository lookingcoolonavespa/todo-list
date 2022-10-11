import { subsections } from '../utils/constants';
import Project from '../utils/classes/Project';
import Todo from '../utils/classes/Todo';
import { Dispatch as ReactDispatch } from 'react';

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
      payload: number;
    }
  | {
      type: 'delete';
      itemType: 'todo';
      payload: { id: number; project: number };
    }
>;

export type Validator =
  | ((value: string) => { error: string })
  | ((value: string, confirmStr: string) => { error: string });
