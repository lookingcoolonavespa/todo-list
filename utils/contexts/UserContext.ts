import { createContext } from 'react';
import Project from '../classes/Project';
import { Dispatch } from '../../types/types';

const UserContext = createContext<{
  projectList: Project[];
  dispatch: Dispatch;
  activeProject: string;
  setActiveProject: React.Dispatch<React.SetStateAction<string>> | null;
}>({
  projectList: [],
  dispatch: () => undefined,
  activeProject: '',
  setActiveProject: null,
});

export default UserContext;
