import Project from '../utils/classes/Project';
import Todo from '../utils/classes/Todo';

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface UserData {
  id: string;
  loggedIn: boolean;
  username: string;
  projects: string;
  todos: string;
}

export interface RequestError extends Error {
  status: number;
}
