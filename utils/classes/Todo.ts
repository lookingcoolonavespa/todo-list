import { DateStr } from '../../types/types';

export default class Todo {
  id: string;
  project: string;
  title: string;
  dueDate: DateStr;
  completed: boolean;

  constructor(id: string, project: string, title: string, dueDate: DateStr) {
    this.id = id;
    this.project = project;
    this.title = title;
    this.dueDate = dueDate;
    this.completed = false;
  }
}
