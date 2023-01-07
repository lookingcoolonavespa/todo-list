import Link from 'next/link';
import LoadingEllipsis from './LoadingEllipsis';

interface DuoBtnsLinkProps {
  leftText: string;
  rightText: string;
  href: string;
  className?: string;
  loading?: boolean;
}

export default function DuoBtnsLink({
  leftText,
  rightText,
  href,
  className,
  loading = false,
}: DuoBtnsLinkProps) {
  return (
    <div className={`btn-ctn flex gap-x-1 text-gray-300 ${className || ''}`}>
      <button
        type="submit"
        className={`action-btn rect-btn w-20 h-9 ${
          loading ? 'pointer-events-none opacity-80' : ''
        }`}
      >
        {loading ? <LoadingEllipsis size="small" /> : leftText}
      </button>
      <Link href={href}>
        <button type="button" className="underline-on-hover rect-btn">
          {rightText}
        </button>
      </Link>
    </div>
  );
}
