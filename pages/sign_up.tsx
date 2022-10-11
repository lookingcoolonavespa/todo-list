import { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import Form from '../components/misc/Form';
import Field from '../utils/classes/Field';
import { checkUsername } from '../utils/validators';

const Sign_Up: NextPage = () => {
  const [inputValues, setInputValues] = useState({
    username: '',
    password: '',
    confirmPw: '',
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
        }}
      />
    </main>
  );
};

export default Sign_Up;
