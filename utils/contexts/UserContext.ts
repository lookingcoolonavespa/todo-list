import { createContext } from 'react';
import Project from '../classes/Project';
import { Dispatch } from '../../types/types';
import { HydratedUser } from '../../types/interfaces';

const UserContext = createContext<{
  projectList: Project[];
  dispatch: Dispatch;
  activeProject: string;
  setActiveProject: React.Dispatch<React.SetStateAction<string>> | null;
  user: HydratedUser;
}>({
  projectList: [],
  dispatch: () => undefined,
  activeProject: '',
  setActiveProject: null,
  user: {
    id: '',
    projects: [],
    todos: [],
  },
});

export default UserContext;
