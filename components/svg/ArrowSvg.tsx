import React from 'react';

interface Props {
  dir: 'left' | 'right' | 'up' | 'down';
  size?: string;
}
export default function ArrowSvg({ dir, size = '24' }: Props) {
  return (
    <>
      {
        {
          left: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" />
            </svg>
          ),
          right: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
            </svg>
          ),
          up: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 11.828l-2.828 2.829-1.415-1.414L12 9l4.243 4.243-1.415 1.414L12 11.828z" />
            </svg>
          ),
          down: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z" />
            </svg>
          ),
        }[dir]
      }
    </>
  );
}
