'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl';
import './Silk.css';

type NormalizedRGB = [number, number, number];

const FALLBACK_COLOR: NormalizedRGB = [234 / 255, 242 / 255, 1];

const hexToNormalizedRGB = (hex: string): NormalizedRGB => {
  const clean = hex.replace('#', '');

  if (!/^[\da-f]{6}$/i.test(clean)) {
    return FALLBACK_COLOR;
  }

  return [
    Number.parseInt(clean.slice(0, 2), 16) / 255,
    Number.parseInt(clean.slice(2, 4), 16) / 255,
    Number.parseInt(clean.slice(4, 6), 16) / 255,
  ];
};

const vertex = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  vec2 r = e * sin(e * texCoord);
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c) * uv;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 centeredUv = vUv - 0.5;
  centeredUv.x *= aspect;

  float rnd = noise(gl_FragCoord.xy);
  vec2 tex = rotateUvs(centeredUv * uScale, uRotation) * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.04 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec3 foldColor = mix(uColor, vec3(0.64, 0.78, 0.97), 0.42);
  vec3 highlightColor = mix(vec3(1.0), uColor, 0.22);
  float fold = smoothstep(0.08, 0.94, pattern);
  float grain = (rnd - 0.5) * 0.016 * uNoiseIntensity;
  vec3 finalColor = clamp(mix(foldColor, highlightColor, fold) + grain, vec3(0.72), vec3(1.0));

  gl_FragColor = vec4(finalColor, 0.94);
}
`;

export interface SilkProps {
  animate?: boolean;
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

export default function Silk({
  animate = true,
  speed = 5,
  scale = 1,
  color = '#EAF2FF',
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    let active = true;
    let frame = 0;
    let resizeObserver: ResizeObserver | null = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    container.dataset.silkStatus = 'loading';

    const stop = () => {
      active = false;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    try {
      if (typeof window.WebGLRenderingContext === 'undefined') {
        container.dataset.silkStatus = 'css-fallback';
        return;
      }

      // OGL falls back from WebGL2 to WebGL1, matching the working DarkVeil
      // renderer and avoiding Three.js/WebGL2-only failures in Firefox.
      const renderer = new Renderer({
        canvas,
        webgl: 1,
        alpha: true,
        depth: false,
        antialias: false,
        dpr: 1,
        powerPreference: 'low-power',
      });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const geometry = new Triangle(gl);
      const uniforms = {
        uResolution: { value: new Vec2(1, 1) },
        uTime: { value: 0 },
        uColor: { value: new Float32Array(hexToNormalizedRGB(color)) },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uRotation: { value: rotation },
        uNoiseIntensity: { value: noiseIntensity },
      };
      const program = new Program(gl, { vertex, fragment, uniforms, transparent: true });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        if (!active) return;
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);
        const renderScale = width >= 900 ? 0.72 : 0.86;
        renderer.setSize(
          Math.max(1, Math.round(width * renderScale)),
          Math.max(1, Math.round(height * renderScale))
        );
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        uniforms.uResolution.value.set(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.render({ scene: mesh });
      };

      const startedAt = performance.now();
      const minimumFrameTime = 1000 / 24;
      let lastRenderedAt = startedAt - minimumFrameTime;

      const renderFrame = (time: number) => {
        if (!active) return;

        if (!document.hidden && time - lastRenderedAt >= minimumFrameTime) {
          lastRenderedAt = time;
          uniforms.uTime.value = (time - startedAt) * 0.001;
          renderer.render({ scene: mesh });
          container.dataset.silkStatus = 'ready';
        }

        frame = requestAnimationFrame(renderFrame);
      };

      const handleContextLost = (event: Event) => {
        event.preventDefault();
        container.dataset.silkStatus = 'css-fallback';
        stop();
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      canvas.addEventListener('webglcontextlost', handleContextLost);
      resize();

      if (!animate || reducedMotion) {
        container.dataset.silkStatus = 'ready';
      } else {
        frame = requestAnimationFrame(renderFrame);
      }

      return () => {
        stop();
        resizeObserver?.disconnect();
        canvas.removeEventListener('webglcontextlost', handleContextLost);
      };
    } catch {
      container.dataset.silkStatus = 'css-fallback';
      stop();
    }
  }, [animate, color, noiseIntensity, rotation, scale, speed]);

  return (
    <div
      ref={containerRef}
      className="silk-root"
      data-silk-motion={animate ? 'animated' : 'still'}
    >
      <div className="silk-fallback-flow" aria-hidden="true" />
      <canvas ref={canvasRef} className="silk-canvas" />
    </div>
  );
}
