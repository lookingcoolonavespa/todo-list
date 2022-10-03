import React from 'react';
import { SubsectionType } from '../../types/types';

interface SubsectionProps {
  active: boolean;
  title: SubsectionType;
  setActive: React.Dispatch<React.SetStateAction<SubsectionType>>;
}

export default function Subsection({
  title,
  active,
  setActive,
}: SubsectionProps) {
  return <div onClick={() => setActive(title)}>{title}</div>;
}
