import React, { Component, ErrorInfo, ReactNode } from "react";
import { safeStorage } from "../utils/storage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Slow Skin Concept app:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBFAF6] text-[#04251F] flex flex-col items-center justify-center p-6 text-center font-serif">
          <div className="max-w-md p-8 bg-white rounded-2xl shadow-sm border border-[#EFE7D8]">
            <h1 className="text-xl font-medium tracking-wide mb-3 text-[#B9A06F]">
              Instytut Zdrowej Skóry Slow Skin Concept
            </h1>
            <p className="text-sm font-sans text-[#07382F]/80 mb-6 leading-relaxed">
              Zresetowano stan widoku. Kliknij poniższy przycisk, aby natychmiast odświeżyć aplikację.
            </p>
            {this.state.error?.message && (
              <pre className="text-[11px] text-red-600 bg-red-50 p-2 rounded mb-4 font-mono text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                try {
                  safeStorage.clear();
                } catch (e) {}
                this.setState({ hasError: false, error: null });
                window.location.href = window.location.pathname;
              }}
              className="px-6 py-2.5 bg-[#04251F] text-white text-xs uppercase tracking-widest rounded-full hover:bg-[#B9A06F] transition-colors"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

