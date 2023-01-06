import React, { useState, useContext } from 'react';
import UserContext from '../utils/contexts/UserContext';
import Project from '../utils/classes/Project';
import InputBox from './misc/InputBox';
import Subtitle from './misc/Subtitle';
import axios from 'axios';
import MenuSvg from './svg/MenuSvg';
import CloseSvg from './svg/CloseSvg';

export function Sidebar() {
  const { projectList, isMobile } = useContext(UserContext);
  return (
    <aside className="w-64 secondary-bg min-h-full z-10">
      <div className="flex flex-col gap-y-5 py-10 px-5 relative ">
        <ProjectForm />
        <Subtitle title="Projects" />
        {projectList.map((p) => (
          <ProjectBtn key={p.id} {...p} />
        ))}
      </div>
    </aside>
  );
}
interface MobileProps {
  className?: string;
  setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
}
export function MobileSidebar({
  className,
  setSidebarVisible,
  visible,
}: MobileProps) {
  const { projectList, isMobile } = useContext(UserContext);

  return (
    <aside
      className={`w-64 secondary-bg min-h-full z-10 absolute ${
        visible ? '' : 'translate-x-[-100%]'
      } ${className || ''}`}
    >
      <div className="flex flex-col gap-y-5 py-10 px-5 relative ">
        <ProjectForm />
        <Subtitle title="Projects" />
        {projectList.map((p) => (
          <ProjectBtn key={p.id} {...p} />
        ))}
        <button
          type="button"
          className="absolute right-[-30px] top-3"
          onClick={() => setSidebarVisible!((prev) => !prev)}
        >
          {visible ? <CloseSvg /> : <MenuSvg classNames="" size="20" />}
        </button>
      </div>
    </aside>
  );
}

function ProjectBtn({ title, id }: Project) {
  const { setActiveProject } = useContext(UserContext);

  return (
    <button
      type="button"
      className="bg-slate-700 py-2 px-3 rounded overflow-hidden hover:bg-slate-600"
      onClick={() => setActiveProject && setActiveProject(id)}
    >
      <div className="overflow-hidden">{title}</div>
    </button>
  );
}

function ProjectForm() {
  const { dispatch } = useContext(UserContext);
  const [title, setTitle] = useState('');

  return (
    <form
      className="flex flex-col"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!title) return;

        try {
          const res = await axios.post('/api/projects', {
            title,
          });

          if (res.status === 200) {
            const id = res.data;
            dispatch({
              type: 'add',
              itemType: 'project',
              payload: new Project(id, title),
            });
            setTitle('');
          }
        } catch (err) {
          console.log(err);
        }
      }}
    >
      <Subtitle title="Add a new project" className="mb-3" />
      <div className="basis-9 flex justify-center items-center gap-x-3 ">
        <InputBox
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <button
          type="submit"
          className="action-btn text-2xl w-8 h-9 flex flex-shrink-0 justify-center items-center"
        >
          +
        </button>
      </div>
    </form>
  );
}
