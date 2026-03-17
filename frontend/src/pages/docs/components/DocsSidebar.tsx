import { useCallback } from 'react';
import {
  Rocket,
  FolderTree,
  FileType,
  Component,
  Database,
  Globe,
  RefreshCw,
  FormInput,
  Route,
  Paintbrush,
  TestTube,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SECTIONS: SectionItem[] = [
  { id: 'getting-started', label: 'Getting Started', icon: Rocket },
  { id: 'project-structure', label: 'Project Structure', icon: FolderTree },
  { id: 'typescript', label: 'TypeScript Rules', icon: FileType },
  { id: 'components', label: 'Component Rules', icon: Component },
  { id: 'state-management', label: 'State Management', icon: Database },
  { id: 'api-layer', label: 'API Layer', icon: Globe },
  { id: 'react-query', label: 'React Query', icon: RefreshCw },
  { id: 'forms', label: 'Forms & Validation', icon: FormInput },
  { id: 'routing', label: 'Routing', icon: Route },
  { id: 'styling', label: 'Styling & Tokens', icon: Paintbrush },
  { id: 'testing', label: 'Testing', icon: TestTube },
  { id: 'quick-reference', label: 'Quick Reference', icon: Zap },
];

interface DocsSidebarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function DocsSidebar({ activeSection, onSectionClick }: DocsSidebarProps) {
  const handleClick = useCallback(
    (sectionId: string) => {
      onSectionClick(sectionId);
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    },
    [onSectionClick],
  );

  return (
    <aside className="w-64 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 bg-white">
      <nav className="py-6 px-3">
        <p className="px-3 mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Documentation
        </p>
        <ul className="space-y-0.5">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => handleClick(section.id)}
                  className={cn(
                    'flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-muted-foreground hover:bg-gray-50 hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>{section.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
