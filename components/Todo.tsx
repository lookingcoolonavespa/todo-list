import TodoInterface from '../utils/classes/Todo';

interface TodoProps extends TodoInterface {}

export default function Todo({ title, dueDate, completed }: TodoProps) {
  return (
    <article>
      <div>{title}</div>
      <div>{dueDate.toString()}</div>
    </article>
  );
}
