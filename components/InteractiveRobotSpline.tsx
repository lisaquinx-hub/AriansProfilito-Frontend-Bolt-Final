'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Application } from '@splinetool/runtime';

const SPLINE_RUNTIME_ASSET_PATH = '/api/spline/runtime';
const SCENE_TIMEOUT_MS = 20_000;

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

type RobotStatus = 'loading' | 'ready' | 'error';

function safelyDispose(application: Application | null) {
  try {
    application?.dispose();
  } catch {
    // A partially initialized WebGL application can reject cleanup. The canvas
    // is discarded by React, so there is nothing else to recover here.
  }
}

function RobotLoader() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-transparent"
      role="status"
      aria-label="در حال بارگذاری ربات سه‌بعدی"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
    </div>
  );
}

function RobotFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-transparent px-6"
      data-testid="spline-fallback"
      role="status"
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<RobotStatus>('loading');

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      setStatus('error');
      return;
    }

    let disposed = false;
    let application: Application | null = null;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), SCENE_TIMEOUT_MS);

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      safelyDispose(application);
      application = null;

      if (!disposed) {
        setStatus('error');
      }
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    setStatus('loading');

    const loadScene = async () => {
      try {
        const response = await fetch(scene, {
          cache: 'force-cache',
          credentials: 'same-origin',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Spline scene request failed with status ${response.status}.`);
        }

        const sceneData = await response.arrayBuffer();

        if (sceneData.byteLength === 0) {
          throw new Error('Spline scene response was empty.');
        }

        const { Application: SplineApplication } = await import('@splinetool/runtime');

        if (disposed) return;

        application = new SplineApplication(canvas, {
          renderMode: 'auto',
          wasmPath: SPLINE_RUNTIME_ASSET_PATH,
        });

        // The published type currently says `void`, while the runtime returns a
        // Promise. `await` supports both and keeps all startup failures handled.
        await application.start(sceneData);

        if (disposed) {
          safelyDispose(application);
          application = null;
          return;
        }

        setStatus('ready');
      } catch {
        safelyDispose(application);
        application = null;

        if (!disposed) {
          setStatus('error');
        }
      } finally {
        window.clearTimeout(timeout);
      }
    };

    void loadScene();

    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timeout);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      safelyDispose(application);
      application = null;
    };
  }, [attempt, scene]);

  return (
    <div
      className={`relative h-full w-full ${className ?? ''}`}
      data-spline-status={status}
    >
      <canvas
        ref={canvasRef}
        className={`h-full w-full transition-opacity duration-300 ${
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
        data-testid="spline-canvas"
        aria-hidden="true"
      />
      {status === 'loading' && <RobotLoader />}
      {status === 'error' && <RobotFallback onRetry={retry} />}
    </div>
  );
}
