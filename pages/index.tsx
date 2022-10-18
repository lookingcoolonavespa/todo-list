import type { NextPage } from 'next';
import { useState, useReducer } from 'react';
import Project from '../components/Project';
import Sidebar from '../components/Sidebar';
import UserContext from '../utils/contexts/UserContext';
import ProjectClass from '../utils/classes/Project';
import TodoClass from '../utils/classes/Todo';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../utils/session';
import { UserData } from '../types/interfaces';
import { DateStr, DispatchArgs } from '../types/types';
import axios from 'axios';
import Router from 'next/router';
import Todo from '../utils/classes/Todo';
import NavBar from '../components/NavBar';

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  if (req.session.user?.loggedIn) {
    try {
      const response = await axios.get(
        `${process.env.BASE_URL}/api/users/${req.session.user.id}`
      );
      const data = response.data.rows;

      interface Row {
        project_id: string;
        project_title: string;
        todo_title?: string;
        todo_id?: string;
        due_date?: DateStr;
        completed?: boolean;
      }

      const projectIdHash: { [key: string]: boolean } = {};

      const projects: ProjectClass[] = data
        .filter((r: Row) => {
          const notInHash = !projectIdHash[r.project_id];
          projectIdHash[r.project_id] = true;
          return notInHash;
        })
        .map((r: Row) => new ProjectClass(r.project_id, r.project_title));

      const todos: TodoClass[] = data
        .filter((r: Row) => r.todo_id)
        .map((r: Row) => {
          const todo = new Todo(
            r.todo_id as string,
            r.project_id,
            r.todo_title as string,
            r.due_date as DateStr
          );
          if (r.completed) todo.completed = true;

          return todo;
        });

      todos.forEach((t) => {
        const project = projects.find((p) => {
          return p.id === t.project;
        });
        project?.todoList.push(t);
      });

      const user = {
        username: req.session.user.username,
        id: req.session.user.id,
        projects: JSON.stringify(projects),
        todos: JSON.stringify(todos),
        loggedIn: true,
      };

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
        props: {
          user: {
            loggedIn: false,
            id: '',
            username: '',
            projects: '',
            todos: '',
          } as UserData,
        },
      };
    }
  } else {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: {
          loggedIn: false,
          id: '',
          username: '',
          projects: '',
          todos: '',
        } as UserData,
      },
    };
  }
}, sessionOptions);

interface HomeProps {
  user: UserData;
}

const Home: NextPage<HomeProps> = ({ user }) => {
  if (!user) Router.push('/login');

  interface State {
    projectList: ProjectClass[];
    todoList: TodoClass[];
  }

  const [activeProject, setActiveProject] = useState(
    JSON.parse(user.projects)[0]?.id || ''
  );
  const [{ projectList }, dispatch] = useReducer(reducer, {
    projectList: JSON.parse(user.projects) as ProjectClass[],
    todoList: JSON.parse(user.todos) as TodoClass[],
  });

  function reducer(state: State, action: DispatchArgs) {
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
          const todo = todoList.find((t) => t.id === action.payload.id);

          if (!todo) return state;

          projectList = projectList.map((p) => {
            if (p.id === todo.project)
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
            if (p.id === action.payload.id)
              p = { ...p, title: action.payload.title };
            return p;
          });

          break;
        }

        case 'delete': {
          projectList = projectList.filter((p) => p.id !== action.payload);
          todoList = todoList.filter((t) => (t.project = action.payload));

          setActiveProject(projectList[0]?.id || '');
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

  return (
    <UserContext.Provider
      value={{
        dispatch,
        projectList,
        activeProject,
        setActiveProject,
        user,
      }}
    >
      <div className="min-h-screen main-bg flex flex-col">
        <NavBar />
        <div className="flex flex-row flex-grow">
          <Sidebar />
          <Project
            details={projectList.find((p) => p.id === activeProject)}
            activeProject={activeProject}
          />
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Home;
