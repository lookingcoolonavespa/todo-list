import { ReactNode, useRef } from 'react';
import useInputError from '../../utils/hooks/useInputError';
import InputField from './InputField';
import { StringKeys, Validator } from '../../types/types';
import Field from '../../utils/classes/Field';

interface FormProps<K extends { [key: string]: string }> {
  fields: Field<StringKeys<K>>[];
  inputValues: Record<keyof K, string>;
  validators: Record<keyof K, Validator>;
  btns: ReactNode | ReactNode[];
  classNames: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitAction: (() => Promise<void>) | (() => void);
  cleanUp?: () => void;
  close: () => void;
}

export default function Form({
  fields,
  inputValues,
  validators,
  btns,
  classNames,
  handleInputChange,
  submitAction,
  cleanUp,
  close,
}: FormProps<{
  username: string;
  password: string;
  confirmPassword: string;
}>) {
  const formRef = useRef<HTMLFormElement>(null);
  const fieldNames = fields.map((f) => f.name as string);
  const { inputError, validateInput, submitForm } = useInputError(
    fieldNames,
    validators
  );

  return (
    <form
      ref={formRef}
      autoComplete="nope"
      onSubmit={async (e) => {
        cleanUp = cleanUp || close;
        await submitForm(e, inputValues, submitAction, cleanUp);
      }}
      className={classNames}
    >
      <div className="content">
        <input type="password" hidden />
        {/* need this to turn off autocomplete */}
        {fields.map((f, idx) => {
          return (
            <InputField
              key={idx}
              autoFocus={idx === 0}
              onBlur={() => validateInput(f.name, inputValues[f.name])}
              error={inputError[f.name]}
              onChange={(e) => {
                if (inputError[f.name]) {
                  validateInput(f.name, inputValues[f.name]);
                }
                handleInputChange(e);
              }}
              value={inputValues[f.name] || ''}
              {...f}
            />
          );
        })}
      </div>
      <footer>{btns}</footer>
    </form>
  );
}
