import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
          </div>

          <h3 className="text-lg font-medium text-foreground mb-1">Something went wrong</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-1">
            An unexpected error occurred. Please try again.
          </p>
          {this.state.error && (
            <p className="text-xs text-muted-foreground/70 max-w-md mb-4">
              {this.state.error.message}
            </p>
          )}

          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-foreground hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
