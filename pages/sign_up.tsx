import axios, { AxiosError } from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import DuoBtnsLink from '../components/misc/DuoBtnsLink';
import DuoBtns from '../components/misc/DuoBtnsText';
import Form from '../components/misc/Form';
import Logo from '../components/misc/Logo';
import { SignUpFields } from '../types/types';
import Field from '../utils/classes/Field';
import { signUpFields } from '../utils/constants';
import {
  checkPassword,
  checkUsername,
  confirmPassword,
} from '../utils/validators';

const Sign_Up: NextPage = () => {
  const [inputValues, setInputValues] = useState<Record<SignUpFields, string>>({
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
          new Field('Confirm password', 'confirmPassword', 'password'),
        ]}
        validators={{
          username: checkUsername,
          confirmPassword: confirmPassword(inputValues.password),
          password: checkPassword,
        }}
        handleInputChange={handleInputChange}
        submitAction={(
            setInputError: React.Dispatch<
              React.SetStateAction<Record<SignUpFields, string>>
            >
          ) =>
          async () => {
            try {
              const res = await axios.post('http://localhost:3000/api/user', {
                username: inputValues.username,
                password: inputValues.password,
              });

              if (res.status === 200) Router.push('/');
              return;
            } catch (err) {
              const error = err as AxiosError;
              if (!error) return;
              if (error.response?.status === 422) {
                const data = error.response.data as {
                  errors: { [key: string]: string }[];
                };
                setInputError((prev) => {
                  const errs = Array.isArray(data.errors)
                    ? data.errors.reduce((acc, curr) => {
                        acc[curr.param] = curr.msg;
                        return acc;
                      }, {})
                    : {};

                  return {
                    ...prev,
                    ...errs,
                  };
                });
              }
            }
          }}
        btns={
          <DuoBtnsLink leftText="Sign up" rightText="Cancel" href="/login" />
        }
        close={() => {}}
        classNames="flex justify-center items-center flex-col w-full "
      />
    </main>
  );
};

export default Sign_Up;
