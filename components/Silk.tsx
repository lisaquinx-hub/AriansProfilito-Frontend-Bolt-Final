/* eslint-disable react/no-unknown-property */
'use client';

import React, { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
import { Color, Mesh, ShaderMaterial, type IUniform } from 'three';

type NormalizedRGB = [number, number, number];

const fallbackColor: NormalizedRGB = [234 / 255, 242 / 255, 1];

const hexToNormalizedRGB = (hex: string): NormalizedRGB => {
  const clean = hex.replace('#', '');

  if (!/^[\da-f]{6}$/i.test(clean)) return fallbackColor;

  return [
    Number.parseInt(clean.slice(0, 2), 16) / 255,
    Number.parseInt(clean.slice(2, 4), 16) / 255,
    Number.parseInt(clean.slice(4, 6), 16) / 255,
  ];
};

interface UniformValue<T = number | Color> {
  value: T;
}

interface SilkUniforms {
  uSpeed: UniformValue<number>;
  uScale: UniformValue<number>;
  uNoiseIntensity: UniformValue<number>;
  uColor: UniformValue<Color>;
  uRotation: UniformValue<number>;
  uTime: UniformValue<number>;
  [uniform: string]: IUniform;
}

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
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
  float rnd = noise(gl_FragCoord.xy);
  vec2 tex = rotateUvs(vUv * uScale, uRotation) * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  // Keep every animated fold inside a light luminance range. This preserves
  // Silk's movement while guaranteeing dark light-theme copy stays readable.
  vec3 base = mix(vec3(1.0), uColor, 0.78);
  float foldShade = (1.0 - pattern) * 0.095;
  float grain = (rnd - 0.5) * 0.018 * uNoiseIntensity;
  vec3 color = clamp(base - foldShade + grain, vec3(0.78), vec3(1.0));

  gl_FragColor = vec4(color, 1.0);
}
`;

interface SilkPlaneProps {
  uniforms: SilkUniforms;
}

const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    const mesh = ref as React.MutableRefObject<Mesh | null>;
    mesh.current?.scale.set(viewport.width, viewport.height, 1);
  }, [ref, viewport.height, viewport.width]);

  useFrame((_state: RootState, delta: number) => {
    const mesh = (ref as React.MutableRefObject<Mesh | null>).current;
    if (!mesh) return;

    const material = mesh.material as ShaderMaterial & { uniforms: SilkUniforms };
    material.uniforms.uTime.value += 0.1 * Math.min(delta, 0.1);
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
});

SilkPlane.displayName = 'SilkPlane';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

export default function Silk({
  speed = 5,
  scale = 1,
  color = '#EAF2FF',
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkProps) {
  const meshRef = useRef<Mesh>(null);

  const uniforms = useMemo<SilkUniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [color, noiseIntensity, rotation, scale, speed]
  );

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.25]}
        frameloop="always"
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        fallback={<div className="h-full w-full bg-[#f8fafc]" />}
      >
        <SilkPlane ref={meshRef} uniforms={uniforms} />
      </Canvas>
    </div>
  );
}
