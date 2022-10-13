import type { NextPage } from 'next';
import { useState, useReducer, useEffect } from 'react';
import Project from '../components/Project';
import Sidebar from '../components/Sidebar';
import UserContext from '../utils/contexts/UserContext';
import ProjectClass from '../utils/classes/Project';
import TodoClass from '../utils/classes/Todo';

const defaultProject = new ProjectClass('first project');

const Home: NextPage = () => {
  interface State {
    projectList: ProjectClass[];
    todoList: TodoClass[];
  }
  const [{ projectList }, dispatch] = useReducer(reducer, {
    projectList: [defaultProject],
    todoList: [],
  });
  function reducer(
    state: State,
    action:
      | {
          type: 'add' | 'edit';
          itemType: 'project';
          payload: ProjectClass;
        }
      | {
          type: 'add' | 'edit';
          itemType: 'todo';
          payload: TodoClass;
        }
      | {
          type: 'delete';
          itemType: 'project';
          payload: number;
        }
      | {
          type: 'delete';
          itemType: 'todo';
          payload: { id: number; project: number };
        }
  ) {
    let { projectList, todoList } = state;
    // handle todos
    if (action.itemType === 'todo') {
      switch (action.type) {
        case 'add': {
          todoList = todoList.concat(action.payload);

          projectList = projectList.map((p) => {
            if (p.id === action.payload.project) {
              return {
                ...p,
                todoList: p.todoList.concat(action.payload),
              };
            }
            return p;
          });

          break;
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

          break;
        }

        case 'delete': {
          projectList = projectList.map((p) => {
            if (p.id === action.payload.project)
              return {
                ...p,
                todoList: p.todoList.filter(
                  (todo) => todo.id !== action.payload.id
                ),
              };
            return p;
          });

          todoList = todoList.filter((t) => t.id === action.payload.id);

          break;
        }

        default:
          return state;
      }
    }

    // handle projects
    if (action.itemType === 'project') {
      switch (action.type) {
        case 'add': {
          if (!action.payload) return state;
          projectList = projectList.concat(action.payload);

          break;
        }

        case 'edit': {
          projectList = projectList.map((p) => {
            if (p.id === action.payload.id) p = action.payload;
            return p;
          });

          break;
        }

        case 'delete': {
          projectList = projectList.filter((p) => p.id !== action.payload);
          todoList = todoList.filter((t) => (t.project = action.payload));

          break;
        }

        default:
          return state;
      }
    }

    return {
      projectList,
      todoList,
    };
  }

  const [activeProject, setActiveProject] = useState(0);

  useEffect(function addDefaultTodo() {
    dispatch({
      type: 'add',
      itemType: 'todo',
      payload: new TodoClass(0, 'rule the world', new Date()),
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        projectList,
        dispatch,
        activeProject,
        setActiveProject,
      }}
    >
      <div className="flex flex-row min-h-screen main-bg">
        <Sidebar />
        <Project
          details={projectList.find((p) => p.id === activeProject)}
          activeProject={activeProject}
        />
      </div>
    </UserContext.Provider>
  );
};

export default Home;
