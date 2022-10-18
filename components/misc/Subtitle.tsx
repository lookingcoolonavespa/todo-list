interface SubtitleProps {
  title: string;
  className?: string;
}

export default function Subtitle({ title, className }: SubtitleProps) {
  return (
    <h4
      className={`${
        className || ''
      } text-sm font-medium opacity-60 select-none`}
    >
      {title}
    </h4>
  );
}
