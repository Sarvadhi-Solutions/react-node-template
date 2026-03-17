import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { DocsSidebar } from './components/DocsSidebar';

const SECTION_IDS = [
  'getting-started',
  'project-structure',
  'typescript',
  'components',
  'state-management',
  'api-layer',
  'react-query',
  'forms',
  'routing',
  'styling',
  'testing',
  'quick-reference',
];

export function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleSectionClick = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed top navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
            <span className="font-semibold text-lg text-foreground">React Boilerplate</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Layout: sidebar + content */}
      <div className="flex pt-16">
        <DocsSidebar activeSection={activeSection} onSectionClick={handleSectionClick} />

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-12 space-y-20">

            {/* ──────────────── Section 1: Getting Started ──────────────── */}
            <section id="getting-started">
              <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Get up and running with the React Boilerplate in five simple steps. This project is designed to be cloned, renamed, and immediately productive.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-3">Quick Start</h3>
              <div className="space-y-3 mb-8">
                {[
                  { step: '1', text: 'Copy and rename', code: 'cp -r react-boilerplate my-new-project && cd my-new-project' },
                  { step: '2', text: 'Update project name in', code: 'package.json, index.html, and globals.css' },
                  { step: '3', text: 'Create environment file', code: 'cp .env.example .env.local' },
                  { step: '4', text: 'Install dependencies', code: 'npm install' },
                  { step: '5', text: 'Start development', code: 'npm run local' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.text}</span>
                      <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs font-mono overflow-x-auto mt-1.5">
                        <code>{item.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-3">NPM Scripts</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">Command</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['npm run local', 'Dev server at :5000 (uses .env.local)'],
                      ['npm run dev', 'Dev server at :5001 (uses .env.development)'],
                      ['npm run stg', 'Dev server at :5002 (uses .env.staging)'],
                      ['npm run prd', 'Dev server at :5003 (uses .env.production)'],
                      ['npm run build', 'Production build (TypeScript check + Vite build)'],
                      ['npm run lint', 'ESLint strict mode (0 warnings allowed)'],
                      ['npm run test', 'Vitest watch mode'],
                      ['npm run test:run', 'Run tests once'],
                      ['npm run test:coverage', 'Test coverage report'],
                    ].map(([cmd, desc]) => (
                      <tr key={cmd} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5">
                          <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">{cmd}</code>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ──────────────── Section 2: Project Structure ──────────────── */}
            <section id="project-structure">
              <h2 className="text-2xl font-bold text-foreground mb-4">Project Structure</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The project follows a pages-first architecture. Features live in dedicated folders under{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/pages/&#123;feature&#125;/</code>{' '}
                with shared infrastructure organized by concern.
              </p>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 overflow-x-auto">
                <pre className="text-xs font-mono leading-relaxed text-gray-700">
                  <code>{`src/
\u251C\u2500\u2500 components/
\u2502   \u251C\u2500\u2500 layout/        \u2192 AppShell, ProtectedRoute, PublicRoute, RoleGuard
\u2502   \u251C\u2500\u2500 shared/        \u2192 ErrorBoundary, PageLoader, AppUpdateBanner
\u2502   \u2514\u2500\u2500 ui/            \u2192 UI primitives (toast). Add your component library here.
\u251C\u2500\u2500 contexts/          \u2192 React contexts (SidebarContext \u2014 example pattern)
\u251C\u2500\u2500 hooks/             \u2192 Custom hooks (useIntersectionObserver \u2014 example)
\u251C\u2500\u2500 lib/               \u2192 Core utilities: cn(), logger, sanitize, permissions
\u251C\u2500\u2500 pages/{feature}/   \u2192 Feature pages (page.tsx + components/ + index.ts)
\u251C\u2500\u2500 providers/         \u2192 Root providers: Redux > QueryClient > Toast
\u251C\u2500\u2500 routes/            \u2192 Route definitions with lazy loading + role guards
\u251C\u2500\u2500 services/
\u2502   \u251C\u2500\u2500 configs/       \u2192 Axios baseService + apiService (auto-unwraps response.data.data)
\u2502   \u251C\u2500\u2500 react-query/   \u2192 QueryClient + query keys
\u2502   \u2514\u2500\u2500 {feature}/     \u2192 Feature API methods + mutation hooks
\u251C\u2500\u2500 store/
\u2502   \u251C\u2500\u2500 hooks.ts       \u2192 Typed useAppSelector / useAppDispatch
\u2502   \u251C\u2500\u2500 rootReducer.ts \u2192 Register all slices here
\u2502   \u251C\u2500\u2500 storeSetup.ts  \u2192 Redux + persist config (only auth persisted)
\u2502   \u2514\u2500\u2500 slices/        \u2192 One slice per feature (authSlice included)
\u251C\u2500\u2500 styles/globals.css \u2192 Design tokens (CSS variables)
\u251C\u2500\u2500 test/              \u2192 Vitest setup, test utilities, MSW mock handlers
\u251C\u2500\u2500 types/             \u2192 TypeScript definitions per domain
\u2514\u2500\u2500 utils/
    \u251C\u2500\u2500 constants/     \u2192 API endpoints, app constants, master data codes
    \u251C\u2500\u2500 common-functions/ \u2192 getApiErrorMessage()
    \u251C\u2500\u2500 validations/   \u2192 ALL Zod schemas (centralized)
    \u2514\u2500\u2500 status-styles.ts \u2192 Status code \u2192 Tailwind class mapping`}</code>
                </pre>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg my-4">
                <p className="text-sm text-indigo-800">
                  Each feature follows the pages-first pattern: create a new folder under{' '}
                  <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">src/pages/&#123;feature&#125;/</code>{' '}
                  with <strong>page.tsx</strong> as the main component, <strong>components/</strong> for feature-specific components, and <strong>index.ts</strong> for barrel exports.
                </p>
              </div>
            </section>

            {/* ──────────────── Section 3: TypeScript Rules ──────────────── */}
            <section id="typescript">
              <h2 className="text-2xl font-bold text-foreground mb-4">TypeScript Rules</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The project enforces strict TypeScript to catch errors at compile time. These rules are non-negotiable and enforced by the build system.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2">Path Alias</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Always use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">@/</code> for all{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/</code> imports. Never use relative paths like{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">../../</code>.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2">verbatimModuleSyntax is ON</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Type-only imports <strong>MUST</strong> use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">import type</code> syntax. The build will fail if this is violated.
              </p>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`// CORRECT
import type { Task, TaskStatus } from '@/types/task';
import { useAppSelector, type RootState } from '@/store/hooks';

// WRONG — build will fail (TS1484)
import { Task } from '@/types/task';`}</code>
              </pre>

              <h3 className="text-lg font-semibold text-foreground mb-2">Strict Mode</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">strict: true</code>,{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">noUnusedLocals: true</code>,{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">noUnusedParameters: true</code> are all enforced. Zero unused variables or imports allowed.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2">Type Naming Conventions</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">Category</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">Convention</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">File Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2.5 text-foreground">API response types</td>
                      <td className="px-4 py-2.5"><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">snake_case</code> fields</td>
                      <td className="px-4 py-2.5 text-muted-foreground">src/types/&#123;feature&#125;-api.ts</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-foreground">App-level types</td>
                      <td className="px-4 py-2.5"><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">camelCase</code> fields</td>
                      <td className="px-4 py-2.5 text-muted-foreground">src/types/&#123;feature&#125;.ts</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-foreground">Props interfaces</td>
                      <td className="px-4 py-2.5"><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">&#123;ComponentName&#125;Props</code></td>
                      <td className="px-4 py-2.5 text-muted-foreground">Above the component</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ──────────────── Section 4: Component Rules ──────────────── */}
            <section id="components">
              <h2 className="text-2xl font-bold text-foreground mb-4">Component Rules</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Consistent component patterns keep the codebase readable and predictable across the entire team.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2">Named Exports Only</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Always use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">export function MyComponent()</code>. Never use{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">export default</code> (the only exception is Redux slice reducers).
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2">Props Pattern</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Always define a <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">&#123;ComponentName&#125;Props</code> interface directly above the component function.
              </p>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`interface ProjectCardProps {
  project: ProjectListItem;
  onEdit: (project: ProjectListItem) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  // ...
}`}</code>
              </pre>

              <h3 className="text-lg font-semibold text-foreground mb-2">Context Pattern</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                All context files must have{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">/* eslint-disable react-refresh/only-export-components */</code>{' '}
                at the top. Follow the pattern: <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">createContext&lt;T | undefined&gt;(undefined)</code>{' '}
                → Provider component → <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">useXxx()</code> hook that throws if context is missing.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2">Icons</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Use Lucide React for all icons. Always set{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">strokeWidth=&#123;1.5&#125;</code> for visual consistency.
              </p>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">Size</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">Class</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2.5 text-foreground">Tiny</td>
                      <td className="px-4 py-2.5"><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">h-3 w-3</code></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-foreground">Default</td>
                      <td className="px-4 py-2.5"><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">h-4 w-4</code></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-foreground">Medium</td>
                      <td className="px-4 py-2.5"><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">h-5 w-5</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">Styling</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">cn()</code> from{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">@/lib/utils</code> for all className composition. Reference CSS variables from{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">globals.css</code>.
              </p>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`className={cn(
  'base-classes here',
  isActive && 'bg-indigo-50 text-indigo-700',
  variant === 'destructive' && 'bg-red-50 text-red-700',
)}`}</code>
              </pre>

              <h3 className="text-lg font-semibold text-foreground mb-2">Custom Hooks</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Place in <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/hooks/</code>. Name with{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">use</code> prefix. Follow React hooks rules.
              </p>
            </section>

            {/* ──────────────── Section 5: State Management ──────────────── */}
            <section id="state-management">
              <h2 className="text-2xl font-bold text-foreground mb-4">State Management</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Redux Toolkit handles all API data and UI state. React Context is reserved for global UI concerns only.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2">Redux (ALL API data + UI state)</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 mb-4">
                <li>Every feature gets a slice at <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/store/slices/&#123;feature&#125;Slice.ts</code></li>
                <li>Always use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">useAppSelector</code> / <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">useAppDispatch</code> from <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/store/hooks.ts</code>. NEVER use raw <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">useSelector</code></li>
                <li>GET APIs: Use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">createAsyncThunk</code> with <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">.pending</code> / <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">.fulfilled</code> / <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">.rejected</code></li>
                <li>Register every new slice in <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/store/rootReducer.ts</code></li>
                <li>Only the <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">auth</code> slice is persisted</li>
              </ul>

              <h4 className="text-base font-semibold text-foreground mb-2">Slice Template</h4>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (params: ItemListParams) => itemsApi.list(params),
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => { state.isLoading = true; })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchItems.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});`}</code>
              </pre>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg my-4">
                <p className="text-sm text-indigo-800">
                  <strong>Provider Nesting Order:</strong>{' '}
                  <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">ReduxProvider</code> →{' '}
                  <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">QueryProvider</code> →{' '}
                  <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">ToastProvider</code> →{' '}
                  <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">&#123;children&#125;</code>
                </p>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">React Context</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use <strong>only</strong> for global UI state (sidebar collapse, timer). <strong>Not</strong> for API data. API data always goes through Redux.
              </p>
            </section>

            {/* ──────────────── Section 6: API Layer ──────────────── */}
            <section id="api-layer">
              <h2 className="text-2xl font-bold text-foreground mb-4">API Layer</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The API layer provides two Axios wrappers with different response handling, plus conventions for consistent endpoint management.
              </p>

              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 mb-4">
                <li><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">baseService</code> — Axios instance with auth interceptor + 401 redirect</li>
                <li><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">apiService</code> — Wrapper that auto-unwraps <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">response.data.data</code></li>
                <li>Always use <strong>PUT</strong> for updates (not PATCH) — backend expects PUT</li>
                <li>Use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">API_ENDPOINTS</code> constants — never hardcode URL paths</li>
                <li>Use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">apiService</code> for JSON, <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">baseService</code> for FormData uploads</li>
              </ul>

              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`export const itemsApi = {
  list: (params?: ListParams) =>
    baseService.get<{ data: Item[] }>(API_ENDPOINTS.ITEMS, { params })
      .then(r => r.data),
  create: (data: CreatePayload) =>
    apiService.post<Item>(API_ENDPOINTS.ITEMS, data),
  update: (id: string, data: UpdatePayload) =>
    apiService.put<Item>(\`\${API_ENDPOINTS.ITEMS}/\${id}\`, data),
  delete: (id: string) =>
    apiService.delete<void>(\`\${API_ENDPOINTS.ITEMS}/\${id}\`),
};`}</code>
              </pre>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-4">
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> The backend expects <strong>PUT</strong> for all update operations. Using PATCH will result in errors. Always use{' '}
                  <code className="bg-amber-100 text-amber-700 px-1 py-0.5 rounded text-xs font-mono">apiService.put()</code>.
                </p>
              </div>
            </section>

            {/* ──────────────── Section 7: React Query ──────────────── */}
            <section id="react-query">
              <h2 className="text-2xl font-bold text-foreground mb-4">React Query</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                React Query is used for mutations (create, update, delete). On success, re-dispatch the Redux fetch thunk to refresh the list with current filters.
              </p>

              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 mb-4">
                <li>Mutations defined in <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/services/&#123;feature&#125;/&#123;feature&#125;.query.ts</code></li>
                <li>On success: re-dispatch Redux fetch thunk to refresh list</li>
                <li>Always add toast notifications for both success and error</li>
              </ul>

              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`export function useCreateItem() {
  const refetch = useRefetchItems();
  return useMutation({
    mutationFn: (data: CreatePayload) => itemsApi.create(data),
    onSuccess: () => {
      toast.success('Item created successfully');
      refetch();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to create item'));
    },
  });
}`}</code>
              </pre>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg my-4">
                <p className="text-sm text-indigo-800">
                  <strong>Important:</strong> Every mutation <strong>MUST</strong> have both{' '}
                  <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">onSuccess</code> and{' '}
                  <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">onError</code> handlers with toast notifications.
                </p>
              </div>
            </section>

            {/* ──────────────── Section 8: Forms & Validation ──────────────── */}
            <section id="forms">
              <h2 className="text-2xl font-bold text-foreground mb-4">Forms & Validation</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                All form validation is centralized using Zod schemas. This ensures consistent validation rules across the application.
              </p>

              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 mb-4">
                <li><strong>ALL</strong> Zod schemas live in <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/utils/validations/index.ts</code> — NEVER in component files</li>
                <li>Schema naming: <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">&#123;action&#125;&#123;Entity&#125;Schema</code> (camelCase)</li>
                <li>Type naming: <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">&#123;Action&#125;&#123;Entity&#125;FormValues</code> (PascalCase)</li>
                <li>Required strings: <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">.min(1, &apos;Name is required&apos;)</code>, not just <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">.string()</code></li>
                <li>RHF: <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">useForm&lt;T&gt;(&#123; resolver: zodResolver(schema) &#125;)</code></li>
              </ul>

              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`// src/utils/validations/index.ts
export const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});
export type CreateItemFormValues = z.infer<typeof createItemSchema>;`}</code>
              </pre>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-4">
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> Never define Zod schemas in component files. Always import from the centralized validations file. This makes it easy to reuse schemas and keeps validation logic in one place.
                </p>
              </div>
            </section>

            {/* ──────────────── Section 9: Routing ──────────────── */}
            <section id="routing">
              <h2 className="text-2xl font-bold text-foreground mb-4">Routing</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Routes are defined centrally with lazy loading, error boundaries, and role-based access control built in.
              </p>

              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 mb-4">
                <li>Routes defined in <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/routes/route.tsx</code> with lazy loading</li>
                <li>Use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">React.lazy()</code> + <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">Suspense</code> + <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">ErrorBoundary</code> for all pages</li>
                <li><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">ProtectedRoute</code> checks auth, redirects to <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">/login</code></li>
                <li><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">PublicRoute</code> redirects authenticated users to <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">/dashboard</code></li>
                <li><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">RoleGuard</code> wraps pages that need specific roles</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-2">Adding a New Route</h3>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`// 1. Create page: src/pages/users/page.tsx
export function UsersPage() { /* ... */ }

// 2. Lazy import in routes:
const UsersPage = lazy(() =>
  import('@/pages/users/page').then(m => ({ default: m.UsersPage }))
);

// 3. Add to route config inside AppShell children:
{ path: 'users', element: <LazyPage><UsersPage /></LazyPage> }`}</code>
              </pre>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg my-4">
                <p className="text-sm text-indigo-800">
                  <strong>Tip:</strong> The <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">.then(m =&gt; (&#123; default: m.UsersPage &#125;))</code> pattern is required because we use named exports. <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">React.lazy()</code> expects a default export, so we map the named export.
                </p>
              </div>
            </section>

            {/* ──────────────── Section 10: Styling & Tokens ──────────────── */}
            <section id="styling">
              <h2 className="text-2xl font-bold text-foreground mb-4">Styling & Design Tokens</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                All colors are defined as CSS variables in{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/styles/globals.css</code>. Use{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">cn()</code> for all className composition. No inline{' '}
                <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">style=&#123;&#125;</code> except for truly dynamic values.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-3">Color Palette</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                {[
                  { name: 'Primary', hex: '#6366F1', bg: '#6366F1' },
                  { name: 'Success', hex: '#4ADE80', bg: '#4ADE80' },
                  { name: 'Warning', hex: '#FBBF24', bg: '#FBBF24' },
                  { name: 'Destructive', hex: '#F87171', bg: '#F87171' },
                  { name: 'Info', hex: '#60A5FA', bg: '#60A5FA' },
                ].map((color) => (
                  <div key={color.name} className="text-center">
                    <div
                      className="w-full h-16 rounded-lg shadow-sm border border-gray-200 mb-2"
                      style={{ backgroundColor: color.bg }}
                    />
                    <p className="text-sm font-medium text-foreground">{color.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">Key Rules</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5">
                <li>Use <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">cn()</code> from <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">@/lib/utils</code> for ALL className composition</li>
                <li>Reference CSS variables from <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">globals.css</code> (e.g., <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">var(--primary)</code>)</li>
                <li>No inline <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">style=&#123;&#125;</code> except for truly dynamic values (e.g., calculated widths)</li>
                <li>Primary color is Indigo (<code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">#6366F1</code>)</li>
              </ul>
            </section>

            {/* ──────────────── Section 11: Testing ──────────────── */}
            <section id="testing">
              <h2 className="text-2xl font-bold text-foreground mb-4">Testing</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The project comes with a complete testing setup: Vitest for test running, Testing Library for component testing, and MSW for API mocking.
              </p>

              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 mb-4">
                <li>Stack: <strong>Vitest</strong> + <strong>Testing Library</strong> + <strong>MSW</strong> (Mock Service Worker)</li>
                <li>Test files: <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/**/*.test.ts</code> or <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">src/**/*.test.tsx</code></li>
                <li><code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">renderWithProviders</code> utility wraps in Redux + Query + Router</li>
                <li>MSW handlers mock API responses for tests</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-2">Writing a Test</h3>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`import { renderWithProviders } from '@/test/test-utils';

describe('DashboardPage', () => {
  it('should render welcome message', () => {
    const { getByText } = renderWithProviders(<DashboardPage />);
    expect(getByText(/welcome/i)).toBeInTheDocument();
  });
});`}</code>
              </pre>

              <h3 className="text-lg font-semibold text-foreground mb-2">Adding MSW Handlers</h3>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto my-4">
                <code>{`// src/test/msw/handlers/items.handlers.ts
import { http, HttpResponse } from 'msw';

export const itemsHandlers = [
  http.get('*/items', () =>
    HttpResponse.json({
      success: true,
      data: { data: [] },
      pagination: { total: 0 },
    })
  ),
];`}</code>
              </pre>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg my-4">
                <p className="text-sm text-indigo-800">
                  <strong>Tip:</strong> Always use <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">renderWithProviders</code> instead of raw <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-xs font-mono">render</code> from Testing Library. It wraps your component in all necessary providers (Redux, React Query, Router) so hooks work correctly in tests.
                </p>
              </div>
            </section>

            {/* ──────────────── Section 12: Quick Reference ──────────────── */}
            <section id="quick-reference">
              <h2 className="text-2xl font-bold text-foreground mb-4">Quick Reference</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The top 10 coding rules to keep in mind at all times. These are non-negotiable and enforced by the build system or code review.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    num: 1,
                    title: 'import type',
                    desc: 'for type-only imports (verbatimModuleSyntax enforced)',
                  },
                  {
                    num: 2,
                    title: 'Named exports only',
                    desc: 'never export default (except Redux reducers)',
                  },
                  {
                    num: 3,
                    title: 'Redux for all API data',
                    desc: 'createAsyncThunk for GETs',
                  },
                  {
                    num: 4,
                    title: 'React Query for mutations',
                    desc: 'with toast on success/error',
                  },
                  {
                    num: 5,
                    title: 'Centralized Zod schemas',
                    desc: 'ALL in src/utils/validations/index.ts',
                  },
                  {
                    num: 6,
                    title: 'Toast on every mutation',
                    desc: 'success + error with getApiErrorMessage',
                  },
                  {
                    num: 7,
                    title: 'Master data by code',
                    desc: 'never hardcode status names',
                  },
                  {
                    num: 8,
                    title: 'Logger, not console.log',
                    desc: 'use logger from @/lib/logger',
                  },
                  {
                    num: 9,
                    title: 'cn() for classNames',
                    desc: 'from @/lib/utils',
                  },
                  {
                    num: 10,
                    title: 'Optional chaining ?.',
                    desc: 'always for nullable/API data',
                  },
                ].map((rule) => (
                  <div key={rule.num} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                      {rule.num}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{rule.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
