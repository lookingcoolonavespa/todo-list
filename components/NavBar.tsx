import axios from 'axios';
import Router from 'next/router';
import { useContext } from 'react';
import UserContext from '../utils/contexts/UserContext';
import Logo from './misc/Logo';
import AccountSvg from './svg/AccountSvg';

export default function NavBar() {
  const { user } = useContext(UserContext);

  return (
    <nav className="h-14 bg-slate-800 flex justify-between items-center px-5 py-2">
      <section className="left">
        <Logo className="flex" />
      </section>
      <section className="right flex items-center gap-x-2">
        <div className="flex gap-x-2 select-none">
          <AccountSvg />
          <span>{user.username}</span>
        </div>
        <button
          type="button"
          className="underline-on-hover rect-btn max-h-[70%] "
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
