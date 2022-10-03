import React, { useState, useContext } from 'react';
import UserContext from '../../utils/contexts/UserContext';
import Project from '../../utils/classes/Project';

export default function ProjectForm() {
  const [title, setTitle] = useState('');
  const ctxt = useContext(UserContext);
  if (!ctxt) return <div></div>;

  const { dispatch } = ctxt;

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <button
        type="button"
        onClick={() =>
          dispatch({
            itemType: 'project',
            type: 'add',
            payload: new Project(title),
          })
        }
      >
        +
      </button>
    </div>
  );
}
