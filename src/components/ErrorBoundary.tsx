import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    if (import.meta.env.DEV) {
      const isDOMCleanupError =
        error.message.includes('removeChild') ||
        error.message.includes('not a child') ||
        error.message.includes('Node');

      if (isDOMCleanupError) {
        console.warn('[ErrorBoundary] Suppressed DOM cleanup error in dev mode:', error.message);
        return {
          hasError: false,
          error: null,
          errorInfo: null,
        };
      }
    }

    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const isDOMCleanupError =
      error.message.includes('removeChild') ||
      error.message.includes('not a child') ||
      error.message.includes('Node');

    if (import.meta.env.DEV && isDOMCleanupError) {
      console.warn('[ErrorBoundary] DOM cleanup error in dev mode (suppressed):', error.message);
      return;
    }

    console.error('[ErrorBoundary] Caught an error:', error);
    console.error('[ErrorBoundary] Error details:', errorInfo);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallbackTitle, fallbackMessage } = this.props;
      const { error } = this.state;

      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  {fallbackTitle || 'Something Went Wrong'}
                </h1>
                <p className="text-slate-600 mb-4">
                  {fallbackMessage || 'We encountered an unexpected error while loading this page.'}
                </p>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900 mb-1">Error Details:</p>
                    <p className="text-sm text-red-800 font-mono">{error.message}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={this.handleReset}
                    className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Reload Page
                  </button>

                  <button
                    onClick={() => window.location.href = '/book'}
                    className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Return to Booking
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    If this problem persists, please contact us at{' '}
                    <a href="mailto:bookings@siteboxwanaka.co.nz" className="text-emerald-600 hover:underline">
                      bookings@siteboxwanaka.co.nz
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
