interface LogoProps {
  className: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={className}>
      <span>
        <h1 className="title">TODO</h1>
      </span>
      <span className="text-rose-500">
        <h1 className="title">LIST</h1>
      </span>
    </div>
  );
}
