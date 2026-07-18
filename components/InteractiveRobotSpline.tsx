'use client';

import { Component, Suspense, lazy, useState, type ReactNode } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

interface SplineErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface SplineErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<
  SplineErrorBoundaryProps,
  SplineErrorBoundaryState
> {
  state: SplineErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SplineErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function RobotLoader({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-transparent ${className ?? ''}`}
      role="status"
      aria-label="در حال بارگذاری ربات سه‌بعدی"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
    </div>
  );
}

function RobotFallback({
  className,
  onRetry,
}: {
  className?: string;
  onRetry: () => void;
}) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-transparent px-6 ${className ?? ''}`}
      data-testid="spline-fallback"
    >
      <div className="rounded-2xl border border-border/60 bg-background/70 px-6 py-5 text-center shadow-lg backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">مدل سه‌بعدی موقتاً بارگذاری نشد.</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          تلاش دوباره
        </button>
      </div>
    </div>
  );
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const [attempt, setAttempt] = useState(0);

  return (
    <SplineErrorBoundary
      key={`${scene}:${attempt}`}
      fallback={
        <RobotFallback className={className} onRetry={() => setAttempt((value) => value + 1)} />
      }
    >
      <Suspense fallback={<RobotLoader className={className} />}>
        <Spline scene={scene} className={className} />
      </Suspense>
    </SplineErrorBoundary>
  );
}
