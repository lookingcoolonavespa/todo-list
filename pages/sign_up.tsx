import axios from 'axios';
import { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import ConfirmCancelBtns from '../components/misc/ConfirmCancelBtns';
import Form from '../components/misc/Form';
import Field from '../utils/classes/Field';
import {
  checkPassword,
  checkUsername,
  confirmPassword,
} from '../utils/validators';

const Sign_Up: NextPage = () => {
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
    <main className="flex flex-row min-h-screen main-bg">
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
          <ConfirmCancelBtns
            confirmText="Sign up"
            cancelText="Cancel"
            cancelCb={() => {}}
          />
        }
        close={() => {}}
        classNames="flex justify-center items-center flex-col w-full "
      />
    </main>
  );
};

export default Sign_Up;
