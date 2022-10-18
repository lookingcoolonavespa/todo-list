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
        submitAction={(setInputError) => async () => {
          try {
            await axios.post('/api/users/login', {
              username: inputValues.username,
              password: inputValues.password,
            });

            Router.push('/');
          } catch (err) {
            const error = err as AxiosError;
            if (!error) return;
            if (error.response?.status === 401) {
              setInputError((prev) => {
                return {
                  ...prev,
                  username: 'username does not match password',
                };
              });
            }
          }
        }}
        btns={
          <DuoBtnsLink leftText="Log in" rightText="Sign up" href="/sign_up" />
        }
        close={() => {}}
        classNames="flex justify-center items-center flex-col w-full "
      />
    </main>
  );
};

export default Login;
