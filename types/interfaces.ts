import Project from '../utils/classes/Project';
import Todo from '../utils/classes/Todo';

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface LoggedInUser {
  id: string;
  loggedIn: boolean;
}
