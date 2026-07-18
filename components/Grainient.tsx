'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import './Grainient.css';

interface GrainientProps {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
}

interface Uniform<T> {
  value: T;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  float n=mix(
    mix(dot(-1.0+2.0*hash(i),f),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0)),f-vec2(1.0)),u.x),u.y
  );
  return 0.5+0.5*n;
}
void mainImage(out vec4 o,vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  float blendX=(tuv*Rot(radians(uBlendAngle))).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  vec3 layer1=mix(uColor3,uColor2,S(edge0,edge1,blendX));
  vec3 layer2=mix(uColor2,uColor1,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(0.5-b+s,-0.3-b-s,tuv.y));
  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  o=vec4(clamp(col,0.0,1.0),1.0);
}
void main(){
  vec4 color=vec4(0.0);
  mainImage(color,gl_FragCoord.xy);
  fragColor=color;
}
`;

export default function Grainient({
  timeSpeed = 0.25,
  colorBalance = 0,
  warpStrength = 1,
  warpFrequency = 5,
  warpSpeed = 2,
  warpAmplitude = 50,
  blendAngle = 0,
  blendSoftness = 0.05,
  rotationAmount = 500,
  noiseScale = 2,
  grainAmount = 0.1,
  grainScale = 2,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1,
  saturation = 1,
  centerX = 0,
  centerY = 0,
  zoom = 0.9,
  color1 = '#FF9FFC',
  color2 = '#5227FF',
  color3 = '#B497CF',
  className = '',
}: GrainientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    let active = true;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let canvas: HTMLCanvasElement | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    container.dataset.grainientStatus = 'loading';

    const stop = () => {
      active = false;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    try {
      if (typeof window.WebGL2RenderingContext === 'undefined') {
        container.dataset.grainientStatus = 'fallback';
        return;
      }

      const renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.25),
      });
      const gl = renderer.gl;
      canvas = gl.canvas as HTMLCanvasElement;
      canvas.className = 'grainient-canvas';
      container.appendChild(canvas);

      const geometry = new Triangle(gl);
      const uniforms = {
        iTime: { value: 0 } as Uniform<number>,
        iResolution: { value: new Float32Array([1, 1]) } as Uniform<Float32Array>,
        uTimeSpeed: { value: timeSpeed } as Uniform<number>,
        uColorBalance: { value: colorBalance } as Uniform<number>,
        uWarpStrength: { value: warpStrength } as Uniform<number>,
        uWarpFrequency: { value: warpFrequency } as Uniform<number>,
        uWarpSpeed: { value: warpSpeed } as Uniform<number>,
        uWarpAmplitude: { value: warpAmplitude } as Uniform<number>,
        uBlendAngle: { value: blendAngle } as Uniform<number>,
        uBlendSoftness: { value: blendSoftness } as Uniform<number>,
        uRotationAmount: { value: rotationAmount } as Uniform<number>,
        uNoiseScale: { value: noiseScale } as Uniform<number>,
        uGrainAmount: { value: grainAmount } as Uniform<number>,
        uGrainScale: { value: grainScale } as Uniform<number>,
        uGrainAnimated: { value: grainAnimated ? 1 : 0 } as Uniform<number>,
        uContrast: { value: contrast } as Uniform<number>,
        uGamma: { value: gamma } as Uniform<number>,
        uSaturation: { value: saturation } as Uniform<number>,
        uCenterOffset: { value: new Float32Array([centerX, centerY]) } as Uniform<Float32Array>,
        uZoom: { value: zoom } as Uniform<number>,
        uColor1: { value: new Float32Array(hexToRgb(color1)) } as Uniform<Float32Array>,
        uColor2: { value: new Float32Array(hexToRgb(color2)) } as Uniform<Float32Array>,
        uColor3: { value: new Float32Array(hexToRgb(color3)) } as Uniform<Float32Array>,
      };
      const program = new Program(gl, { vertex, fragment, uniforms });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        if (!active) return;
        const rect = container.getBoundingClientRect();
        renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
        uniforms.iResolution.value[0] = gl.drawingBufferWidth;
        uniforms.iResolution.value[1] = gl.drawingBufferHeight;
        renderer.render({ scene: mesh });
      };

      const startedAt = performance.now();
      const minimumFrameTime = 1000 / 30;
      let lastRenderedAt = startedAt - minimumFrameTime;
      const loop = (time: number) => {
        if (!active) return;

        if (time - lastRenderedAt >= minimumFrameTime) {
          lastRenderedAt = time;
          uniforms.iTime.value = (time - startedAt) * 0.001;
          renderer.render({ scene: mesh });
          container.dataset.grainientStatus = 'ready';
        }

        frame = requestAnimationFrame(loop);
      };

      const tryStart = () => {
        if (!active || reducedMotion || !isVisible || !isPageVisible || frame) return;
        frame = requestAnimationFrame(loop);
      };

      const tryStop = () => {
        if (!frame) return;
        cancelAnimationFrame(frame);
        frame = 0;
      };

      const handleVisibility = () => {
        isPageVisible = !document.hidden;
        if (isPageVisible) tryStart();
        else tryStop();
      };

      const handleContextLost = (event: Event) => {
        event.preventDefault();
        container.dataset.grainientStatus = 'fallback';
        stop();
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      intersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) tryStart();
        else tryStop();
      });
      intersectionObserver.observe(container);
      document.addEventListener('visibilitychange', handleVisibility);
      canvas.addEventListener('webglcontextlost', handleContextLost);
      resize();

      if (reducedMotion) {
        container.dataset.grainientStatus = 'ready';
      } else {
        tryStart();
      }

      return () => {
        stop();
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        document.removeEventListener('visibilitychange', handleVisibility);
        canvas?.removeEventListener('webglcontextlost', handleContextLost);
        canvas?.remove();
      };
    } catch {
      container.dataset.grainientStatus = 'fallback';
      stop();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      canvas?.remove();
    }
  }, [
    blendAngle,
    blendSoftness,
    centerX,
    centerY,
    color1,
    color2,
    color3,
    colorBalance,
    contrast,
    gamma,
    grainAmount,
    grainAnimated,
    grainScale,
    noiseScale,
    rotationAmount,
    saturation,
    timeSpeed,
    warpAmplitude,
    warpFrequency,
    warpSpeed,
    warpStrength,
    zoom,
  ]);

  return <div ref={containerRef} className={`grainient-container ${className}`.trim()} />;
}
