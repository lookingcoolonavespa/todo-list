import { ChangeEvent } from 'react';

interface TextInputProps {
  type: 'text';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputBox({ type, value, onChange }: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="min-w-0 bg-gray-300 text-gray-900 py-1 px-2 rounded flex-shrink"
    />
  );
}
