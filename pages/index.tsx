import type { NextPage } from 'next';
import { useState, useReducer } from 'react';
import Project from '../components/Project';
import Sidebar from '../components/Sidebar/Sidebar';
import UserContext from '../utils/contexts/UserContext';
import ProjectInterface from '../utils/classes/Project';
import TodoInterface from '../utils/classes/Todo';

const Home: NextPage = () => {
  interface State {
    projectList: ProjectInterface[];
    todoList: TodoInterface[];
  }
  const [{ projectList }, dispatch] = useReducer(reducer, {
    projectList: [],
    todoList: [],
  });
  function reducer(
    state: State,
    action:
      | {
          type: 'add' | 'edit';
          itemType: 'project';
          payload: ProjectInterface;
        }
      | {
          type: 'add' | 'edit';
          itemType: 'todo';
          payload: TodoInterface;
        }
      | {
          type: 'delete';
          itemType: 'project' | 'todo';
          payload: number;
        }
  ) {
    let { projectList, todoList } = state;

    // handle todos
    if (action.itemType === 'todo') {
      switch (action.type) {
        case 'add': {
          todoList.push(action.payload);

          projectList = projectList.map((p) => {
            if (p.id === action.payload.id) {
              p.todoList.push(action.payload);
            }
            return p;
          });

          return {
            todoList,
            projectList,
          };
        }

        case 'edit': {
          const idx = todoList.findIndex((t) => t.id === action.payload.id);
          if (idx === -1) return state;

          todoList[idx] = action.payload;

          projectList = projectList.map((p) => {
            if (p.id === todoList[idx].project)
              p.todoList = p.todoList.map((todo) => {
                if (todo.id === action.payload.id) todo = action.payload;
                return todo;
              });
            return p;
          });
        }

        case 'delete': {
          const idx = todoList.findIndex((t) => t.id === action.payload);
          if (idx === -1) return state;

          projectList = projectList.map((p) => {
            if (p.id === todoList[idx].project)
              p.todoList = p.todoList.filter(
                (todo) => todo.id !== todoList[idx].id
              );
            return p;
          });

          todoList.splice(idx, 1);
        }
      }
    }

    // handle projects
    if (action.itemType === 'project') {
      switch (action.type) {
        case 'add': {
          projectList.push(action.payload);
        }

        case 'edit': {
          projectList = projectList.map((p) => {
            if (p.id === action.payload.id) p = action.payload;
            return p;
          });
        }

        case 'delete': {
          projectList = projectList.filter((p) => p.id !== action.payload);
        }
      }
    }

    return {
      projectList,
      todoList,
    };
  }

  const [activeProject, setActiveProject] = useState(0);

  return (
    <UserContext.Provider
      value={{
        projectList,
        dispatch,
      }}
    >
      <Sidebar setActiveProject={setActiveProject} />
      <Project {...projectList[activeProject]} />
    </UserContext.Provider>
  );
};

export default Home;
