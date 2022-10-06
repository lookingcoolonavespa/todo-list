import { useState, useContext } from 'react';
import UserContext from '../utils/contexts/UserContext';
import styles from '../styles/TodoForm.module.css';
import Subtitle from './misc/Subtitle';
import ArrowSvg from './svg/ArrowSvg';
import normalizeDate from '../utils/normalizeDate';
import Todo from '../utils/classes/Todo';
import useTodoDetails from '../utils/hooks/useTodoDetails';

export default function TodoForm() {
  const { projectList, activeProject, dispatch } = useContext(UserContext);

  const [visible, setVisible] = useState(true);

  const { todoDetails, onChange, reset } = useTodoDetails({
    title: '',
    dueDate: normalizeDate(new Date()),
    project: activeProject,
  });

  return (
    <article>
      <button
        className="w-full"
        type="button"
        onClick={() => setVisible((prev) => !prev)}
      >
        <header className={`flex justify-between ${visible ? 'mb-5' : ''}`}>
          <Subtitle title="Add a new todo" />
          <ArrowSvg dir={visible ? 'up' : 'down'} />
        </header>
      </button>
      <form
        className={`${styles.bg} ${
          styles.main
        } overflow-hidden rounded transition-all shadow-md ${
          visible ? 'max-h-52' : 'max-h-0'
        }`}
        onSubmit={(e) => {
          e.preventDefault();

          if (
            !todoDetails.title ||
            !todoDetails.dueDate ||
            typeof todoDetails.project !== 'number'
          )
            return;

          dispatch({
            type: 'add',
            itemType: 'todo',
            payload: new Todo(
              todoDetails.project,
              todoDetails.title,
              new Date(todoDetails.dueDate)
            ),
          });

          reset();
        }}
      >
        <div className="flex flex-col gap-y-3 py-6 px-8">
          <section className="flex flex-col gap-y-3 rounded outline-1 outline-gray-700 outline px-5 py-3 mb-2">
            <div>
              <input
                className="bg-transparent w-full text-gray-700 py-1 placeholder:text-gray-700"
                type="text"
                name="title"
                value={todoDetails.title}
                placeholder="What's your todo called?"
                onChange={onChange}
              />
            </div>
            <div className="flex gap-x-3">
              <input
                type="date"
                name="dueDate"
                value={todoDetails.dueDate}
                className="bg-transparent cursor-pointer"
                onChange={onChange}
              />
              <select
                className="bg-transparent cursor-pointer"
                name="project"
                value={todoDetails.project}
                onChange={onChange}
              >
                {projectList.map((p) => {
                  return (
                    <option key={p.id} value={p.id} className="text-white">
                      {p.title}
                    </option>
                  );
                })}
              </select>
            </div>
          </section>
          <div>
            <button className="action-btn py-2 px-4 " type="submit">
              Add Todo
            </button>
          </div>
        </div>
      </form>
    </article>
  );
}
