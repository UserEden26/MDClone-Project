import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    statusCode: number;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, statusCode: 500 }; // Default to 500
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        // Update state to trigger fallback UI
        return { hasError: true, statusCode: 500 };
    }

    componentDidCatch(error: any) {
        console.error('Caught an error:', error);

        // Optionally, set a status code based on the error
        const statusCode = error?.statusCode || 500;
        this.setState({ statusCode });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: 'center', marginTop: '20%' }}>
                    <h1 style={{ fontSize: '10rem', margin: 0 }}>
                        {this.state.statusCode}
                    </h1>
                    <p style={{ fontSize: '1.5rem' }}>Something went wrong.</p>
                    <button onClick={() => (window.location.href = '/login')}>
                        Go Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
