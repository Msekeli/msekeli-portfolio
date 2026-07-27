import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error in app tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-bg-primary px-6 text-center text-text-primary">
          <h1 className="text-xl font-semibold">Something went wrong.</h1>
          <p className="text-text-secondary text-sm">
            Please refresh the page. If the problem continues, try again
            later.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
