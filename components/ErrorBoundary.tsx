
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render(): ReactNode {
    const { children } = this.props;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold mb-2">خطایی رخ داده است</h2>
          <p>مشکلی در بارگذاری این بخش پیش آمده است. لطفا صفحه را مجدداً بارگذاری کنید.</p>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
