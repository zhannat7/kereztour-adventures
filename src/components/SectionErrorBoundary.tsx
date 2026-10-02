import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  name?: string;
};

type State = {
  hasError: boolean;
};

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Kereztour section error${this.props.name ? ` (${this.props.name})` : ""}:`, error, info);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
