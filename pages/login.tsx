import axios, { AxiosError } from 'axios';
import { NextPage } from 'next';
import Router from 'next/router';
import { ChangeEvent, useState } from 'react';
import DuoBtnsLink from '../components/misc/DuoBtnsLink';
import Form from '../components/misc/Form';
import Logo from '../components/misc/Logo';
import Field from '../utils/classes/Field';
import {
  checkPassword,
  checkUsername,
  confirmPassword,
} from '../utils/validators';

async function login(
  username: string,
  password: string,
  handleError?: (err: unknown) => void
) {
  try {
    await axios.post('/api/users/login', {
      username: username,
      password: password,
    });

    Router.push('/');
  } catch (err) {
    handleError && handleError(err);
  }
}

const Login: NextPage = () => {
  const [inputValues, setInputValues] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  function handleInputChange(e: ChangeEvent) {
    const el = e.target as HTMLInputElement;
    setInputValues((prev) => ({
      ...prev,
      [el.name]: el.value,
    }));
  }

  return (
    <main className="flex flex-col min-h-screen main-bg justify-center">
      <header>
        <Logo className="flex justify-center mb-6" />
      </header>
      <Form
        inputValues={inputValues}
        fields={[
          new Field('Username', 'username', 'text'),
          new Field('Password', 'password', 'password'),
        ]}
        validators={{
          username: checkUsername,
          confirmPassword: confirmPassword(inputValues.password),
          password: checkPassword,
        }}
        handleInputChange={handleInputChange}
        submitAction={(handleError) => {
          async () =>
            await login(
              inputValues.username,
              inputValues.password,
              handleError
            );
        }}
        btns={
          <div>
            <DuoBtnsLink
              leftText="Log in"
              rightText="Sign up"
              href="/sign_up"
              className="mb-5"
            />
            <a
              className="cursor-pointer hover:underline"
              onClick={async () => {
                await login('nksupermarket', 'SijQeJX@hnzgcZ5');
              }}
            >
              Log in with guest account
            </a>
          </div>
        }
        close={() => {}}
        classNames="flex justify-center items-center flex-col w-full "
      />
    </main>
  );
};

export default Login;
