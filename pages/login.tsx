import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
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
        submitAction={async () => {
          try {
            const data = await axios.post('http://localhost:3000/api/user', {
              username: inputValues.username,
              password: inputValues.password,
            });

            console.log(data);
          } catch (err) {
            console.log(err);
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
