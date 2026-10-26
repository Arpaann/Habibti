import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', background: '#F3EFE6', minHeight: '100vh', color: '#171715' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '28px', marginBottom: '10px' }}>Something went wrong loading HABIBTI</h2>
          <p style={{ color: '#777168', marginBottom: '20px' }}>An error occurred while initializing the portrait studio:</p>
          <pre style={{ background: '#E9E2D5', padding: '16px', borderRadius: '4px', overflowX: 'auto', fontSize: '13px', border: '1px solid #DCD3C4' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#171715', color: '#F3EFE6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
