import Todo from './Todo';

let id = 0;

export default class Project {
  id: number;
  title: string;
  todoList: Todo[];

  constructor(title: string) {
    this.id = id++;
    this.title = title;
    this.todoList = [];
  }
}
