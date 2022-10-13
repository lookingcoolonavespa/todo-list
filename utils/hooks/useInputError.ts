import React, { useState } from 'react';
import { Validator } from '../../types/types';

export default function useInputError(
  inputNames: string[],
  validators: {
    [K in typeof inputNames[number]]: Validator;
  }
) {
  const [inputError, setInputError] = useState(
    () =>
      inputNames.reduce((acc: { [key: string]: string }, curr: string) => {
        acc[curr] = '';
        return acc;
      }, {}) // turn inputNames into object keys
  );

  function validateInput(name: keyof typeof inputError, value: string) {
    const validationStatus = validators[name](value);

    const error = validationStatus.error;
    setInputError((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !validationStatus.error;
  }

  async function submitForm(
    e: React.FormEvent<HTMLFormElement>,
    inputValues: {
      [K in typeof inputNames[number]]: string;
    },
    submitAction: (() => Promise<void>) | (() => void),
    cleanUp: () => void
  ) {
    e.preventDefault();

    let errors = false;
    for (const fname of inputNames) {
      // iterate through each input field and validate

      const valid = validateInput(fname, inputValues[fname]);
      if (!valid) errors = true;
    }

    if (errors) return;
    await submitAction();
    cleanUp();
  }

  return { inputError, validateInput, submitForm };
}
