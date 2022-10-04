import { useState, useContext } from 'react';
import UserContext from '../utils/contexts/UserContext';
import styles from '../styles/TodoForm.module.css';
import Subtitle from './misc/Subtitle';
import ArrowSvg from './svg/ArrowSvg';

export default function TodoForm() {
  const { projectList } = useContext(UserContext);

  const [visible, setVisible] = useState(true);

  return (
    <article>
      <button
        className="w-full"
        type="button"
        onClick={() => setVisible((prev) => !prev)}
      >
        <header className="mb-5 flex justify-between">
          <Subtitle title="Add a new todo" />
          <ArrowSvg dir={visible ? 'down' : 'up'} />
        </header>
      </button>
      <form
        className={`${styles.bg} ${
          styles.main
        } overflow-hidden rounded transition-all ${
          visible ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-y-3 py-6 px-8">
          <section className="flex flex-col gap-y-3 rounded outline-1 outline-gray-700 outline px-5 py-3 mb-2">
            <div>
              <input
                className={`${styles.bg} w-full text-gray-700 py-1 placeholder:text-gray-700`}
                type="text"
                placeholder="What's your todo called?"
              />
            </div>
            <div className="flex gap-x-3">
              <input type="date" className={`${styles.bg}`} />
              <select className={`${styles.bg}`}>
                {projectList.map((p) => {
                  return <option key={p.id}>{p.title}</option>;
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
