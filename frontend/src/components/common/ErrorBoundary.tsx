'use client';

import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                            <span className="text-4xl text-red-600">⚠️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Something went wrong</h1>
                        <p className="text-gray-600">
                            We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
