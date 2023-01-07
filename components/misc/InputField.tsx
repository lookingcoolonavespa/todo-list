import React, { HTMLInputTypeAttribute } from 'react';
import Field from '../../utils/classes/Field';

interface InputFieldProps extends Field<string> {
  error: string;
  type: HTMLInputTypeAttribute;
  autoFocus: boolean;
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
}

export default function InputField({
  label,
  error,
  ...inputProps
}: InputFieldProps) {
  return (
    <div className="max-w-[219px] md:max-w-[268px]">
      <div>
        {label && (
          <label className="block mb-2">
            <span>{label}</span>
          </label>
        )}
        <div>
          <input className="input_text" {...inputProps} />
        </div>
      </div>
      <span
        className={`block text-sm text-red-500 mt-2 transition-all ${
          error ? 'max-h-[100px]' : 'max-h-0'
        }`}
      >
        {error || ''}
      </span>
    </div>
  );
}
