import { SubsectionType } from '../../types/types';
import { subsections } from '../../utils/constants';
import Subsection from './Subsection';

interface ProjectHeaderProps {
  title: string;
  active: SubsectionType;
  setActive: React.Dispatch<React.SetStateAction<SubsectionType>>;
}

export default function ProjectHeader({
  title,
  active,
  setActive,
}: ProjectHeaderProps) {
  return (
    <header>
      <section>{title}</section>
      <section>
        {subsections.map((s) => (
          <Subsection
            key={s}
            title={s}
            active={active === s}
            setActive={setActive}
          />
        ))}
      </section>
    </header>
  );
}
