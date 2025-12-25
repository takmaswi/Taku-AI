import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error boundary to catch and display React errors
 */
export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen items-center justify-center bg-red-50 p-4 dark:bg-red-900/20">
                    <div className="max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                            <h1 className="text-xl font-bold text-red-900 dark:text-red-100">
                                Something went wrong
                            </h1>
                        </div>
                        <p className="mt-2 text-red-800 dark:text-red-200">
                            {this.state.error?.message || 'Unknown error'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                            Reload App
                        </button>
                        <p className="mt-2 text-xs text-gray-500">
                            Check console for error details
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
