import { clsx } from 'clsx';
import type { DiseaseSection } from '@/data/types';

interface SidebarProps {
  sections: DiseaseSection[];
  activeSection?: string;
  onSectionClick: (sectionId: string) => void;
}

export function Sidebar({ sections, activeSection, onSectionClick }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 px-3">
          Sections
        </span>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={clsx(
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all',
              activeSection === section.id
                ? 'bg-med-red/10 text-med-red font-bold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
            )}
          >
            {section.title}
          </button>
        ))}
      </div>
    </aside>
  );
}
