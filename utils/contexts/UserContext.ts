import { createContext } from 'react';
import Project from '../classes/Project';
import { Dispatch } from '../../types/types';

const UserContext = createContext<{
  projectList: Project[];
  dispatch: Dispatch;
  activeProject: number;
  setActiveProject: React.Dispatch<React.SetStateAction<number>> | null;
}>({
  projectList: [],
  dispatch: () => undefined,
  activeProject: 0,
  setActiveProject: null,
});

export default UserContext;
