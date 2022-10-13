import { ReactNode } from 'react';

interface DuoBtnsTextProps {
  leftText: string;
  rightText: string;
  rightCb: () => void;
  className?: string;
}

export default function DuoBtnsTextText({
  leftText,
  rightText,
  rightCb,
  className,
}: DuoBtnsTextProps) {
  return (
    <div className={`btn-ctn flex gap-x-1 text-gray-300 ${className || ''}`}>
      <button type="submit" className="action-btn rect-btn">
        {leftText}
      </button>
      <button
        type="button"
        className="underline_on_hover rect-btn"
        onClick={rightCb}
      >
        {rightText}
      </button>
    </div>
  );
}
