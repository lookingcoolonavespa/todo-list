import Todo from './Todo';
import TodoInterface from '../utils/classes/Todo';

interface TodoListProps {
  list: TodoInterface[];
}

export default function TodoList({ list }: TodoListProps) {
  return (
    <section>
      {list.map((t, i) => (
        <Todo key={i} {...t} />
      ))}
    </section>
  );
}
