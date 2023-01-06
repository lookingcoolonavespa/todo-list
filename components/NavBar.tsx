import axios from 'axios';
import Router from 'next/router';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../utils/contexts/UserContext';
import Logo from './misc/Logo';
import AccountSvg from './svg/AccountSvg';
import styles from '../styles/TodoForm.module.css';

export function NavBar() {
  const { user } = useContext(UserContext);

  return (
    <nav className="h-14 secondary-bg flex justify-between items-center px-5 py-2">
      <section className="left">
        <Logo className="flex" />
      </section>
      <section className="right flex items-center gap-x-2">
        <div className="flex gap-x-2 select-none">
          <AccountSvg />
          <span className="leading-[24px]">{user.username}</span>
        </div>
        <button
          type="button"
          className="underline-on-hover rect-btn max-h-[70%]"
          onClick={async () => {
            await axios.post(`/api/users//logout`, { id: user.id });

            Router.push('/login');
          }}
        >
          Log out
        </button>
      </section>
    </nav>
  );
}

export function MobileNavBar() {
  const { user } = useContext(UserContext);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  console.log(userMenuVisible);
  useEffect(() => {
    document.addEventListener('click', () => setUserMenuVisible(false));
  }, []);
  return (
    <nav className="h-14 secondary-bg flex justify-between items-center px-5">
      <section className="left">
        <Logo className="flex" />
      </section>
      <section className="right flex items-center gap-x-2 h-full">
        <div className="relative h-full flex items-center cursor-pointer">
          <div
            className="flex gap-x-2 select-none"
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuVisible(true);
            }}
          >
            <AccountSvg />
            <span className="leading-[24px]">{user.username}</span>
          </div>
          {userMenuVisible ? (
            <ul
              className={`absolute top-[100%] ${styles.bg}  ${styles.main} w-full flex justify-center rounded-b-md z-10`}
            >
              <li
                className="underline-on-hover rect-btn max-h-[70%] cursor-pointer hover:bg-slate-500"
                onClick={async () => {
                  await axios.post(`/api/users//logout`, { id: user.id });

                  Router.push('/login');
                }}
              >
                Log out
              </li>
            </ul>
          ) : null}
        </div>
      </section>
    </nav>
  );
}
