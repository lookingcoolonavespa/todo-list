import { createContext } from 'react';
import Project from '../classes/Project';
import { Dispatch } from '../../types/types';

const UserContext = createContext<{
  projectList: Project[];
  dispatch: Dispatch;
}>({
  projectList: [],
  dispatch: () => undefined,
});

export default UserContext;
