import { Component } from "react";

// Catches render errors so a single broken page doesn't blank the whole app.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="max-w-lg rounded-2xl bg-white p-8 shadow-card">
            <h1 className="text-xl font-bold text-brand-navy">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500">
              An unexpected error occurred while rendering this page.
            </p>
            <pre className="mt-4 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-red-300">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button onClick={() => (window.location.href = "/")} className="btn-primary mt-6">
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
