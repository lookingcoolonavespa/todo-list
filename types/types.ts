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
      itemType: 'project' | 'todo';
      payload: number;
    }
>;
