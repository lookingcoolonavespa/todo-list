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
    <div>
      <div>
        {label && (
          <label className="label">
            <span>{label}</span>
          </label>
        )}
        <div>
          <input className="text-gray-700" {...inputProps} />
        </div>
      </div>
      {error && <span>{error}</span>}
    </div>
  );
}
