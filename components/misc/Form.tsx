import { Dispatch, SetStateAction, ReactNode, useRef } from 'react';
import InputBox from './InputBox';
import useInputError from '../../utils/hooks/useInputError';
import InputField from './InputField';
import { Validator } from '../../types/types';
import Field from '../../utils/classes/Field';

interface FormProps {
  fields: Field[];
  inputValues: Record<FormProps['fields'][number]['name'], string>;
  validators: Record<FormProps['fields'][number]['name'], Validator>;
  btns: ReactNode | ReactNode[];
  classNames: {
    main: string;
    btnCtn: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  submitAction: (() => Promise<void>) | (() => void);
  cleanUp?: () => void;
  close: () => void;
  setError: Dispatch<SetStateAction<string>>;
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
}: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fieldNames = fields.map((f) => f.name);
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
                validateInput(f.name, inputValues[f.name]);
                handleInputChange(e);
              }}
              value={inputValues[f.name] || ''}
              {...f}
            />
          );
        })}
      </div>
      <footer>
        <div className={classNames.btnCtn}>{btns}</div>
      </footer>
    </form>
  );
}
