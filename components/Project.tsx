import React, { useState, useRef, useEffect, useContext } from 'react';
import ProjectInterface from '../utils/classes/Project';
import TodoList from './TodoList';
import { SubsectionType } from '../types/types';
import { subsections } from '../utils/constants';
import TodoForm from './TodoForm';
import Functions from './misc/Functions';
import DuoBtnsText from './misc/DuoBtnsText';
import axios from 'axios';
import UserContext from '../utils/contexts/UserContext';

interface ProjectProps {
  details?: ProjectInterface;
  activeProject: string;
}

export default function Project({ details, activeProject }: ProjectProps) {
  const [subsection, setSubsection] = useState<SubsectionType>('All');

  if (!details)
    return (
      <main className="flex justify-center items-center flex-grow">
        <div>No projects yet</div>
      </main>
    );

  return (
    <main className="main-bg flex-grow py-11 px-5 md:rounded-tl-md">
      <div className=" max-w-3xl flex flex-col gap-y-9 md:gap-y-11 sm:px-[10%] lg:px-0 m-auto">
        <ProjectHeader
          active={subsection}
          setActive={setSubsection}
          {...details}
        />
        <TodoForm key={activeProject} classNames=" m-x-[100%]" />
        <TodoList list={details.todoList} />
      </div>
    </main>
  );
}

interface ProjectHeaderProps extends ProjectInterface {
  active: SubsectionType;
  setActive: React.Dispatch<React.SetStateAction<SubsectionType>>;
}

function ProjectHeader({ title, id, active, setActive }: ProjectHeaderProps) {
  const { dispatch, isMobile } = useContext(UserContext);

  const [edit, setEdit] = useState(false);
  const [projectTitle, setProjectTitle] = useState(title);

  const subsectionRef = useRef<Record<SubsectionType, HTMLElement>>(
    {} as Record<SubsectionType, HTMLElement>
  );

  const underlineRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    function updateTitleBeingEdited() {
      setProjectTitle(title);
    },
    [title]
  );

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

  const titleSize = isMobile ? 'text-xl' : 'text-3xl';
  return (
    <header className="mt-4 md:mt-0">
      {!edit ? (
        <section className="mb-5 md:mb-7 flex gap-x-3 justify-center md:justify-start">
          <h2 className={`${titleSize} font-medium`}>{title}</h2>
          <Functions
            editCb={() => setEdit(true)}
            trashCb={async () => {
              try {
                const res = await axios.delete(`/api/projects/${id}`);
                if (res.status === 200) {
                  dispatch({
                    type: 'delete',
                    itemType: 'project',
                    payload: id,
                  });
                }
              } catch (err) {
                console.log(err);
              }
            }}
          />
        </section>
      ) : (
        <form
          className="mb-7 flex flex-col md:flex-row md:items-center"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              const res = await axios.put(`/api/projects/${id}`, {
                title: projectTitle,
              });

              if ((res.status = 200)) {
                dispatch({
                  type: 'edit',
                  itemType: 'project',
                  payload: {
                    id: id,
                    title: projectTitle,
                  },
                });

                setEdit(false);
              }
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <input
            type="text"
            className={`${titleSize} font-medium bg-transparent w-64 mr-4 border-b-[1px] border-b-gray-300 py-2 mb-5 md:mb-0`}
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
        <div className="flex gap-x-10 md:gap-x-20 justify-center md:justify-start">
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
          className={`text-md md:text-lg px-3 -ml-3 mb-2 ${
            active ? '' : 'opacity-40'
          }`}
          onClick={() => setActive(title)}
        >
          {title}
        </h3>
      </button>
    );
  }
);
Subsection.displayName = 'Subsection';
