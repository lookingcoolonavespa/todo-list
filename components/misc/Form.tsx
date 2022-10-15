import { ReactNode, useRef } from 'react';
import useInputError from '../../utils/hooks/useInputError';
import InputField from './InputField';
import { SignUpFields, Validator } from '../../types/types';
import Field from '../../utils/classes/Field';

interface FormProps<K extends string> {
  fields: Field<K>[];
  inputValues: Record<K, string>;
  validators: Record<K, Validator>;
  btns: ReactNode | ReactNode[];
  classNames: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitAction: (
    setInputError: React.Dispatch<React.SetStateAction<Record<K, string>>>
  ) => () => Promise<void>;
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
}: FormProps<SignUpFields[number]>) {
  const formRef = useRef<HTMLFormElement>(null);
  const fieldNames = fields.map((f) => f.name as string);
  const { inputError, setInputError, validateInput, submitForm } =
    useInputError(fieldNames, validators);

  return (
    <form
      ref={formRef}
      autoComplete="nope"
      onSubmit={async (e) => {
        cleanUp = cleanUp || close;
        await submitForm(e, inputValues, submitAction(setInputError), cleanUp);
      }}
      className={classNames}
    >
      <div className="flex flex-col gap-y-3 mb-10">
        <input type="password" hidden />
        {/* need this to turn off autocomplete */}
        {fields.map((f, idx) => {
          return (
            <InputField
              key={idx}
              autoFocus={idx === 0}
              onBlur={() => {
                setTimeout(
                  () => validateInput(f.name, inputValues[f.name]),
                  200
                );
              }}
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
