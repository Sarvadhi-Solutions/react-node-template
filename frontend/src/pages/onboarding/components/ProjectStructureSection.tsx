import { useState, useCallback } from 'react';
import { Folder, FolderOpen, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  children?: TreeNode[];
}

const projectTree: TreeNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'layout', type: 'folder', description: 'AppShell, route guards' },
          { name: 'shared', type: 'folder', description: 'Reusable components' },
          { name: 'ui', type: 'folder', description: 'UI primitives (toast)' },
        ],
      },
      { name: 'contexts', type: 'folder', description: 'React contexts' },
      { name: 'hooks', type: 'folder', description: 'Custom hooks' },
      { name: 'lib', type: 'folder', description: 'Utilities (cn, logger, permissions)' },
      {
        name: 'pages',
        type: 'folder',
        description: 'Feature-first pages',
        children: [
          { name: 'auth', type: 'folder', description: 'Login page' },
          { name: 'dashboard', type: 'folder', description: 'Dashboard page' },
        ],
      },
      { name: 'providers', type: 'folder', description: 'Root providers' },
      { name: 'routes', type: 'folder', description: 'Route definitions' },
      {
        name: 'services',
        type: 'folder',
        children: [
          { name: 'configs', type: 'folder', description: 'Axios + API config' },
          { name: 'react-query', type: 'folder', description: 'Query client + keys' },
        ],
      },
      {
        name: 'store',
        type: 'folder',
        children: [
          { name: 'slices', type: 'folder', description: 'Redux slices' },
        ],
      },
      { name: 'styles', type: 'folder', description: 'CSS variables + tokens' },
      { name: 'test', type: 'folder', description: 'Vitest + MSW + utils' },
      { name: 'types', type: 'folder', description: 'TypeScript definitions' },
      { name: 'utils', type: 'folder', description: 'Constants, validations, helpers' },
    ],
  },
];

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
  parentPath: string;
}

function TreeNodeItem({ node, depth, expandedPaths, onToggle, parentPath }: TreeNodeItemProps) {
  const nodePath = `${parentPath}/${node.name}`;
  const isExpanded = expandedPaths.has(nodePath);
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggle(nodePath);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-md transition-colors text-sm',
          hasChildren ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default',
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {/* Chevron for folders with children */}
        {hasChildren ? (
          <ChevronRight
            className={cn(
              'h-3 w-3 text-gray-400 transition-transform duration-200 flex-shrink-0',
              isExpanded && 'rotate-90',
            )}
            strokeWidth={1.5}
          />
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}

        {/* Icon */}
        {node.type === 'folder' ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-indigo-500 flex-shrink-0" strokeWidth={1.5} />
          ) : (
            <Folder className="h-4 w-4 text-indigo-400 flex-shrink-0" strokeWidth={1.5} />
          )
        ) : (
          <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
        )}

        {/* Name and description */}
        <span className="font-medium text-gray-800">{node.name}</span>
        {node.description && (
          <span className="text-xs text-gray-400 ml-1">{node.description}</span>
        )}
      </button>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child) => (
            <TreeNodeItem
              key={`${nodePath}/${child.name}`}
              node={child}
              depth={depth + 1}
              expandedPaths={expandedPaths}
              onToggle={onToggle}
              parentPath={nodePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectStructureSection() {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(['/src', '/src/components', '/src/pages', '/src/services', '/src/store']),
  );
  const { ref: sectionRef, isVisible } = useIntersectionObserver();

  const handleToggle = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div
          ref={sectionRef}
          className={cn(
            'text-center mb-14 opacity-0',
            isVisible && 'animate-fade-in opacity-100',
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Project Architecture
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Organized, scalable, and ready for growth
          </p>
        </div>

        {/* Tree container */}
        <div
          className={cn(
            'max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6 opacity-0',
            isVisible && 'animate-slide-in-left',
          )}
          style={{ animationFillMode: 'forwards' }}
        >
          {projectTree.map((node) => (
            <TreeNodeItem
              key={node.name}
              node={node}
              depth={0}
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
              parentPath=""
            />
          ))}
        </div>
      </div>
    </section>
  );
}
