import { DateStr } from '../../types/types';

export default class Todo {
  id: string;
  project: string;
  title: string;
  due_date: DateStr;
  completed: boolean;

  constructor(id: string, project: string, title: string, due_date: DateStr) {
    this.id = id;
    this.project = project;
    this.title = title;
    this.due_date = due_date;
    this.completed = false;
  }
}
