export const subsections = ['All', 'Today', 'Upcoming'] as const;

export const signUpFields = [
  'username',
  'password',
  'confirmPassword',
] as const;

export const LOGGED_OUT_USER = {
  id: '',
  loggedIn: false,
  username: '',
  projects: '',
  todos: '',
};
