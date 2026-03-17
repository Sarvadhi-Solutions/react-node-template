import { ReduxProvider } from './ReduxProvider';
import { QueryProvider } from './QueryProvider';
import { ToastProvider } from '@/components/ui/toast';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
