import React, { useState } from 'react';
import ProjectInterface from '../utils/classes/Project';
import { SubsectionType } from '../types/types';
import ProjectHeader from './ProjectHeader/ProjectHeader';
import TodoList from './TodoList';

interface ProjectProps extends ProjectInterface {}

export default function Project({ title, todoList }: ProjectProps) {
  const [subsection, setSubsection] = useState<SubsectionType>('today');

  if (!title && !todoList) return <main>No projects yet</main>;

  return (
    <main>
      <ProjectHeader
        title={title}
        active={subsection}
        setActive={setSubsection}
      />
      <TodoList list={todoList} />
    </main>
  );
}
