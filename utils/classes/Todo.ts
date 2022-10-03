let id = 0;

export default class Todo {
  id: number;
  project: number;
  title: string;
  dueDate: Date;
  completed: boolean;

  constructor(project: number, title: string, dueDate: Date) {
    this.id = id++;
    this.project = project;
    this.title = title;
    this.dueDate = dueDate;
    this.completed = false;
  }
}
