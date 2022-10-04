import React, { useState, useContext } from 'react';
import UserContext from '../utils/contexts/UserContext';
import Project from '../utils/classes/Project';
import InputBox from './misc/InputBox';
import Subtitle from './misc/Subtitle';
interface SidebarProps {
  setActiveProject: React.Dispatch<React.SetStateAction<number>>;
}

export default function Sidebar({ setActiveProject }: SidebarProps) {
  const { projectList } = useContext(UserContext);

  return (
    <aside className="w-64 flex flex-col gap-y-5 py-10 px-5 bg-slate-800 min-h-full">
      <ProjectForm />
      <Subtitle title="Projects" />
      {projectList.map((p) => (
        <ProjectName key={p.id} {...p} />
      ))}
    </aside>
  );
}

function ProjectName({ title, id }: Project) {
  return (
    <button
      type="button"
      className="bg-slate-700 py-2 rounded hover:bg-slate-600"
    >
      {title}
    </button>
  );
}

function ProjectForm() {
  const [title, setTitle] = useState('');
  const ctxt = useContext(UserContext);
  if (!ctxt) return <div></div>;

  const { dispatch } = ctxt;

  return (
    <div className="flex flex-col">
      <Subtitle title="Add a new project" className="mb-3" />
      <div className="basis-9 flex justify-center items-center gap-x-3 ">
        <InputBox
          type="text"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <button
          type="button"
          className="action-btn text-2xl w-8 h-9 flex flex-shrink-0 justify-center items-center"
          onClick={() => {
            if (!title) return;
            dispatch({
              itemType: 'project',
              type: 'add',
              payload: new Project(title),
            });
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
