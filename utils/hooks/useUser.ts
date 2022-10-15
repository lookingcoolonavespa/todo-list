import axios from 'axios';
import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useUser({ redirectTo = '', redirectIfFound = false }) {
  const { data: user, mutate: mutateUser } = useSWR('/api/user', fetcher);

  useEffect(() => {
    if (!redirectTo || !user) return;

    if (
      (redirectTo && !redirectIfFound && !user.loggedIn) ||
      (redirectIfFound && user.loggedIn)
    )
      Router.push(redirectTo);
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
}
