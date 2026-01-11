import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">SYSTEM FAILURE</h1>
          <p className="mb-6 text-lg">CRITICAL ERROR DETECTED IN DECRYPTION MODULE.</p>
          <div className="bg-red-900/20 border border-red-500 p-4 rounded text-red-400 text-sm mb-8 max-w-md overflow-auto">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-bold rounded shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all"
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;