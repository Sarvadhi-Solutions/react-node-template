import {
  Atom,
  FileType,
  Zap,
  Paintbrush,
  Database,
  RefreshCw,
  FormInput,
  Shield,
  Globe,
  TestTube,
  Route,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface TechItem {
  name: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}

const techStack: TechItem[] = [
  { name: 'React', icon: Atom, color: 'bg-blue-50 text-blue-500', desc: 'UI component library' },
  { name: 'TypeScript', icon: FileType, color: 'bg-blue-50 text-blue-600', desc: 'Type-safe JavaScript' },
  { name: 'Vite', icon: Zap, color: 'bg-amber-50 text-amber-500', desc: 'Lightning-fast build tool' },
  { name: 'Tailwind CSS', icon: Paintbrush, color: 'bg-cyan-50 text-cyan-500', desc: 'Utility-first CSS' },
  { name: 'Redux Toolkit', icon: Database, color: 'bg-purple-50 text-purple-500', desc: 'Predictable state container' },
  { name: 'React Query', icon: RefreshCw, color: 'bg-red-50 text-red-400', desc: 'Server state management' },
  { name: 'React Hook Form', icon: FormInput, color: 'bg-pink-50 text-pink-500', desc: 'Performant form library' },
  { name: 'Zod', icon: Shield, color: 'bg-indigo-50 text-indigo-500', desc: 'Schema validation' },
  { name: 'Axios', icon: Globe, color: 'bg-violet-50 text-violet-500', desc: 'HTTP client' },
  { name: 'Vitest', icon: TestTube, color: 'bg-green-50 text-green-500', desc: 'Unit testing framework' },
  { name: 'React Router', icon: Route, color: 'bg-orange-50 text-orange-500', desc: 'Client-side routing' },
  { name: 'Lucide', icon: Sparkles, color: 'bg-amber-50 text-amber-500', desc: 'Beautiful icon library' },
];

export function TechStackSection() {
  const { ref: headingRef, isVisible: headingVisible } = useIntersectionObserver();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver({ threshold: 0.05 });

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div
          ref={headingRef}
          className={cn(
            'text-center mb-14 opacity-0',
            headingVisible && 'animate-fade-in opacity-100',
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Built With The Best
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Every tool in the stack is battle-tested and production-ready
          </p>
        </div>

        {/* Tech grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {techStack.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <div
                key={tech.name}
                className={cn(
                  'rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 opacity-0',
                  gridVisible && 'animate-fade-in-up',
                )}
                style={{
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                    tech.color,
                  )}
                >
                  <IconComponent className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">{tech.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{tech.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
