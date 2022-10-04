import React, { useState, useRef, useEffect } from 'react';
import ProjectInterface from '../utils/classes/Project';
import TodoList from './TodoList';
import { SubsectionType } from '../types/types';
import { subsections } from '../utils/constants';

interface ProjectProps extends ProjectInterface {}

export default function Project({ title, todoList }: ProjectProps) {
  const [subsection, setSubsection] = useState<SubsectionType>('Today');

  if (!title && !todoList)
    return (
      <main className="flex justify-center items-center flex-1">
        <div>No projects yet</div>
      </main>
    );

  return (
    <main className="flex mx-[10%] my-10">
      <ProjectHeader
        title={title}
        active={subsection}
        setActive={setSubsection}
      />
      <TodoList list={todoList} />
    </main>
  );
}

interface ProjectHeaderProps {
  title: string;
  active: SubsectionType;
  setActive: React.Dispatch<React.SetStateAction<SubsectionType>>;
}

function ProjectHeader({ title, active, setActive }: ProjectHeaderProps) {
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
      <section className="mb-7">
        <h2 className="text-3xl font-medium">{title}</h2>
      </section>
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
