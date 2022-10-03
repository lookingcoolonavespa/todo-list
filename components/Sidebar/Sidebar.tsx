import ProjectForm from './ProjectForm';

interface SidebarProps {
  setActiveProject: React.Dispatch<React.SetStateAction<number>>;
}

export default function Sidebar({ setActiveProject }: SidebarProps) {
  return (
    <aside>
      <ProjectForm />
    </aside>
  );
}
