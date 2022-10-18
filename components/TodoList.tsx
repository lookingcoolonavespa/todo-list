import { useContext, useState } from 'react';
import TodoInterface from '../utils/classes/Todo';
import UserContext from '../utils/contexts/UserContext';
import useTodoDetails from '../utils/hooks/useTodoDetails';
import DuoBtnsText from './misc/DuoBtnsText';
import Functions from './misc/Functions';
import InputBox from './misc/InputBox';
import axios from 'axios';

interface TodoListProps {
  list: TodoInterface[];
}

export default function TodoList({ list }: TodoListProps) {
  return (
    <section className="flex flex-col">
      {list.map((t) => (
        <Todo key={t.id} {...t} />
      ))}
    </section>
  );
}

function Todo({ id, title, due_date, completed, project }: TodoInterface) {
  const { dispatch, projectList } = useContext(UserContext);
  const [edit, setEdit] = useState(false);

  const { todoDetails, onChange, reset } = useTodoDetails({
    title,
    completed,
    project,
    due_date,
  });

  const rootClasses = 'flex gap-x-4 border-b-[1px] py-4 first:border-t-[1px]';

  return (
    <>
      {!edit ? (
        <article className={rootClasses}>
          <section className="relative">
            <input
              type="checkbox"
              checked={completed}
              readOnly
              className="peer"
            />
            <span className="tooltip rect-btn peer-hover:scale-100">
              {todoDetails.completed ? 'Completed' : 'Not completed'}
            </span>
          </section>
          <section className="flex-1">
            <div>{title}</div>
            <div className="bottom-row flex justify-between items-baseline">
              <div>Due : {due_date}</div>
              <Functions
                editCb={() => setEdit(true)}
                trashCb={async () => {
                  try {
                    const res = await axios.delete(`/api/todos/${id}`);

                    if (res.status === 200) {
                      dispatch({
                        type: 'delete',
                        itemType: 'todo',
                        payload: { id },
                      });
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }}
              />
            </div>
          </section>
        </article>
      ) : (
        <form
          className={rootClasses}
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              const res = await axios.put(`/api/todos/${id}`, {
                ...todoDetails,
              });

              if (res.status === 200) {
                dispatch({
                  type: 'edit',
                  itemType: 'todo',
                  payload: { id, ...todoDetails },
                });

                setEdit(false);
              }
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <section className="relative">
            <input
              type="checkbox"
              name="completed"
              checked={todoDetails.completed}
              onChange={onChange}
              className="peer"
            />
            <span className="tooltip rect-btn peer-hover:scale-100">
              {todoDetails.completed ? 'Completed' : 'Not completed'}
            </span>
          </section>
          <section className="flex-1 flex flex-col gap-y-2">
            <div>
              <InputBox
                name="title"
                value={todoDetails.title}
                onChange={onChange}
                className="w-full"
              />
            </div>
            <div className="flex gap-x-10 items-baseline mb-3">
              <div>
                Due :{' '}
                <input
                  type="date"
                  name="due_date"
                  value={todoDetails.due_date}
                  onChange={onChange}
                  className="bg-transparent cursor-pointer"
                />
              </div>
              <select
                name="project"
                value={todoDetails.project}
                onChange={onChange}
                className="bg-transparent cursor-pointer"
              >
                {projectList.map((p) => {
                  return (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  );
                })}
              </select>
            </div>
            <DuoBtnsText
              leftText="Save changes"
              rightText="Cancel"
              rightCb={() => {
                setEdit(false);
                reset();
              }}
              className="mb-6"
            />
          </section>
        </form>
      )}
    </>
  );
}
