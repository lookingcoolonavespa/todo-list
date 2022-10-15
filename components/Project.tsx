import React, { useState, useRef, useEffect, useContext } from 'react';
import ProjectInterface from '../utils/classes/Project';
import TodoList from './TodoList';
import { SubsectionType } from '../types/types';
import { subsections } from '../utils/constants';
import TodoForm from './TodoForm';
import Functions from './misc/Functions';
import UserContext from '../utils/contexts/UserContext';
import DuoBtnsText from './misc/DuoBtnsText';

interface ProjectProps {
  details?: ProjectInterface;
  activeProject: string;
}

export default function Project({ details, activeProject }: ProjectProps) {
  const [subsection, setSubsection] = useState<SubsectionType>('Today');

  if (!details)
    return (
      <main className="flex justify-center items-center flex-grow">
        <div>No projects yet</div>
      </main>
    );

  return (
    <main className="flex flex-col basis-[768px] flex-shrink gap-y-11 my-10 md:mx-[10%] lg:mx-auto max-w-3xl">
      <ProjectHeader
        active={subsection}
        setActive={setSubsection}
        {...details}
      />
      <TodoForm key={activeProject} />
      <TodoList list={details.todoList} />
    </main>
  );
}

interface ProjectHeaderProps extends ProjectInterface {
  active: SubsectionType;
  setActive: React.Dispatch<React.SetStateAction<SubsectionType>>;
}

function ProjectHeader({
  title,
  id,
  todoList,
  active,
  setActive,
}: ProjectHeaderProps) {
  const { dispatch } = useContext(UserContext);

  const [edit, setEdit] = useState(false);
  const [projectTitle, setProjectTitle] = useState(title);

  const subsectionRef = useRef<Record<SubsectionType, HTMLElement>>(
    {} as Record<SubsectionType, HTMLElement>
  );

  const underlineRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    function animateUnderline() {
      const activeEl = subsectionRef.current[active];
      const underlineEl = underlineRef.current;

      if (!activeEl || !underlineEl) return;
      const { left, right } = activeEl.getBoundingClientRect();
      const { left: uLeft } = underlineEl.getBoundingClientRect();

      function getTranslateX() {
        const style = window.getComputedStyle(underlineEl as HTMLElement);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
      }

      underlineEl.style.width = `${right - left}px`;
      underlineEl.style.transform = `translateX(${
        left - uLeft + getTranslateX()
      }px)`;
    },
    [active]
  );
  return (
    <header>
      {!edit ? (
        <section className="mb-7 flex gap-x-3">
          <h2 className="text-3xl font-medium">{title}</h2>
          <Functions
            editCb={() => setEdit(true)}
            trashCb={() => {
              dispatch({
                type: 'delete',
                itemType: 'project',
                payload: id,
              });
            }}
          />
        </section>
      ) : (
        <form
          className="mb-7 flex items-center"
          onSubmit={(e) => {
            e.preventDefault();

            dispatch({
              type: 'edit',
              itemType: 'project',
              payload: {
                id,
                todoList,
                title: projectTitle,
              },
            });

            setEdit(false);
          }}
        >
          <input
            type="text"
            className="text-3xl font-medium bg-transparent w-64 mr-4 border-b-[1px] border-b-gray-300 py-2"
            value={projectTitle}
            onChange={(e) => {
              setProjectTitle(e.target.value);
            }}
          />
          <DuoBtnsText
            leftText="Save changes"
            rightText="Cancel"
            rightCb={() => {
              setEdit(false);
              setProjectTitle(title);
            }}
          />
        </form>
      )}
      <section>
        <div className="flex gap-x-20">
          {subsections.map((s) => (
            <Subsection
              ref={(el) => {
                if (!el) return;
                subsectionRef.current[s] = el;
              }}
              key={s}
              title={s}
              active={active === s}
              setActive={setActive}
            />
          ))}
        </div>
        <div
          ref={underlineRef}
          className="h-0.5 w-10 bg-orange-400 -m-0.5"
        ></div>
      </section>
    </header>
  );
}

interface SubsectionProps {
  active: boolean;
  title: SubsectionType;
  setActive: React.Dispatch<React.SetStateAction<SubsectionType>>;
}
const Subsection = React.forwardRef<HTMLHeadingElement, SubsectionProps>(
  ({ title, active, setActive }, ref) => {
    return (
      <button type="button">
        <h3
          ref={ref}
          className={`text-lg px-3 -ml-3 mb-2 ${active ? '' : 'opacity-40'}`}
          onClick={() => setActive(title)}
        >
          {title}
        </h3>
      </button>
    );
  }
);
Subsection.displayName = 'Subsection';
