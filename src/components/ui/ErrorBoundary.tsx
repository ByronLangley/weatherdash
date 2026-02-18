"use client";

import { Component, type ReactNode } from "react";
import { ErrorCard } from "./ErrorCard";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(
      "ErrorBoundary",
      "Uncaught error in component tree",
      { error: error.message, stack: errorInfo.componentStack }
    );
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorCard
          message={
            this.props.fallbackMessage ??
            "Something went wrong. Please try again."
          }
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}
