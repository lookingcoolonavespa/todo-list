import { createContext } from 'react';
import Project from '../classes/Project';
import { UserData } from '../../types/interfaces';
import { LOGGED_OUT_USER } from '../constants';
import { Dispatch } from '../../types/types';

const UserContext = createContext<{
  projectList: Project[];
  dispatch: Dispatch;
  activeProject: string;
  setActiveProject: React.Dispatch<React.SetStateAction<string>> | null;
  user: UserData;
  isMobile: boolean;
}>({
  projectList: [],
  dispatch: () => {},
  activeProject: '',
  setActiveProject: null,
  user: LOGGED_OUT_USER,
  isMobile: false,
});

export default UserContext;
