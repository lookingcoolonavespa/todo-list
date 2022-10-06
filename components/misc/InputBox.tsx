import { ChangeEvent } from 'react';

interface TextInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
}

export default function InputBox(props: TextInputProps) {
  return (
    <input
      type="text"
      {...props}
      className={`min-w-0 bg-gray-300 text-gray-900 py-1 px-2 rounded flex-shrink ${
        props.className || ''
      }`}
    />
  );
}
