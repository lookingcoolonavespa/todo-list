import Link from 'next/link';

interface DuoBtnsLinkProps {
  leftText: string;
  rightText: string;
  href: string;
  className?: string;
}

export default function DuoBtnsLink({
  leftText,
  rightText,
  href,
  className,
}: DuoBtnsLinkProps) {
  return (
    <div className={`btn-ctn flex gap-x-1 text-gray-300 ${className || ''}`}>
      <button type="submit" className="action-btn rect-btn">
        {leftText}
      </button>
      <Link href={href}>
        <button type="button" className="underline_on_hover rect-btn">
          {rightText}
        </button>
      </Link>
    </div>
  );
}
