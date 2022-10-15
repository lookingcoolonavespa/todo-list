import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import { useState, useReducer, useEffect } from 'react';
import Project from '../components/Project';
import Sidebar from '../components/Sidebar';
import UserContext from '../utils/contexts/UserContext';
import ProjectClass from '../utils/classes/Project';
import TodoClass from '../utils/classes/Todo';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../utils/session';
import { HydratedUser, LoggedInUser, User } from '../types/interfaces';
import Pusher from 'pusher-js';
import { v4 as uuid } from 'uuid';
import normalizeDate from '../utils/normalizeDate';
import { DateStr } from '../types/types';
import axios from 'axios';

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  if (req.session.user) {
    const response = await axios.get(`/api/users/${req.session.user.id}`);
    if (response.status === 200) {
      const user = response.data;
      return {
        props: { user: req.session.user },
      };
    }
  }

  res.setHeader('location', '/login');
  res.statusCode = 302;
  res.end();
  return {
    props: {
      user: { loggedIn: false, id: '' } as LoggedInUser,
    },
  };
}, sessionOptions);

interface HomeProps {
  user: HydratedUser;
}

const Home: NextPage<HomeProps> = ({ user }) => {
  interface State {
    projectList: ProjectClass[];
    todoList: TodoClass[];
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
          payload: string;
        }
      | {
          type: 'delete';
          itemType: 'todo';
          payload: { id: string; project: string };
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

  const [activeProject, setActiveProject] = useState('');

  useEffect(function connectToPusher() {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(user.id);

    channel.bind('add-project', (data: { title: string; id: string }) => {
      dispatch({
        type: 'add',
        itemType: 'project',
        payload: new ProjectClass(data.id, data.title),
      });
    });

    channel.bind(
      'add-todo',
      (data: {
        title: string;
        id: string;
        project: string;
        dueDate: DateStr;
      }) => {
        dispatch({
          type: 'add',
          itemType: 'todo',
          payload: new TodoClass(
            data.id,
            data.project,
            data.title,
            data.dueDate
          ),
        });
      }
    );

    return () => {
      pusher.unsubscribe(user.id);
    };
  });

  return (
    <UserContext.Provider
      value={{
        projectList,
        dispatch,
        activeProject,
        setActiveProject,
        user,
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
