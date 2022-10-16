import { createContext } from 'react';
import Project from '../classes/Project';
import { UserData } from '../../types/types';

const UserContext = createContext<{
  projectList: Project[];
  activeProject: string;
  setActiveProject: React.Dispatch<React.SetStateAction<string>> | null;
  user: UserData;
}>({
  projectList: [],
  activeProject: '',
  setActiveProject: null,
  user: {
    id: '',
    loggedIn: false,
  },
});

export default UserContext;
