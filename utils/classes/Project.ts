import Todo from './Todo';

export default class Project {
  id: string;
  title: string;
  todoList: Todo[];

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
    this.todoList = [];
  }
}
