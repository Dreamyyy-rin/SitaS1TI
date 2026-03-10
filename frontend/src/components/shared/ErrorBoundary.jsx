import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-lg font-bold text-red-800 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-sm text-red-600 mb-4">
            {this.state.error?.message ||
              "Terjadi kesalahan saat memuat komponen"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              if (this.props.onRetry) this.props.onRetry();
            }}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
          {process.env.NODE_ENV === "development" && this.state.errorInfo && (
            <details className="mt-4 text-xs text-red-500">
              <summary>Detail Error</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto max-h-40">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
