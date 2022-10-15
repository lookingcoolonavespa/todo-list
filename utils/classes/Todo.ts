import { uuid } from 'uuidv4';

export default class Todo {
  id: string;
  project: string;
  title: string;
  dueDate: Date;
  completed: boolean;

  constructor(project: string, title: string, dueDate: Date) {
    this.id = uuid();
    this.project = project;
    this.title = title;
    this.dueDate = dueDate;
    this.completed = false;
  }
}
