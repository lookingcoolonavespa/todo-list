import { uuid } from 'uuidv4';
import Todo from './Todo';

export default class Project {
  id: string;
  title: string;
  todoList: Todo[];

  constructor(title: string) {
    this.id = uuid();
    this.title = title;
    this.todoList = [];
  }
}
