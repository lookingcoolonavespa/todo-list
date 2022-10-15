import React, { useState, useContext } from 'react';
import UserContext from '../utils/contexts/UserContext';
import Project from '../utils/classes/Project';
import InputBox from './misc/InputBox';
import Subtitle from './misc/Subtitle';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

export default function Sidebar() {
  const { projectList } = useContext(UserContext);

  return (
    <aside className="w-64 flex flex-col gap-y-5 py-10 px-5 bg-slate-800 min-h-full">
      <ProjectForm />
      <Subtitle title="Projects" />
      {projectList.map((p) => (
        <ProjectBtn key={p.id} {...p} />
      ))}
    </aside>
  );
}

function ProjectBtn({ title, id }: Project) {
  const { setActiveProject } = useContext(UserContext);

  return (
    <button
      type="button"
      className="bg-slate-700 py-2 rounded hover:bg-slate-600"
      onClick={() => setActiveProject && setActiveProject(id)}
    >
      {title}
    </button>
  );
}

function ProjectForm() {
  const [title, setTitle] = useState('');

  const {
    user: { id: userid },
  } = useContext(UserContext);

  return (
    <form
      className="flex flex-col"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!title) return;

        try {
          const res = await axios.post('/api/projects', {
            title,
            userid,
            id: uuid(),
          });

          if ((res.status = 200)) setTitle('');
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
