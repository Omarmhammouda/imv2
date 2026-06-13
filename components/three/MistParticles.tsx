"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { simplex3d } from "@/lib/glsl";
import { state } from "@/lib/store";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uScroll;
attribute float aScale;
attribute float aSpeed;
attribute float aSeed;
attribute float aRed;
varying float vRed;
varying float vAlpha;
${simplex3d}
void main() {
  vRed = aRed;
  vec3 p = position;

  // slow drifting field — each mote follows a low-freq noise flow
  float t = uTime * 0.05 * aSpeed + aSeed * 6.2831;
  p.x += snoise(vec3(p.yz * 0.25, t)) * 1.6;
  p.y += snoise(vec3(p.zx * 0.25, t + 10.0)) * 1.6 + uTime * 0.04 * aSpeed;
  p.z += snoise(vec3(p.xy * 0.25, t + 20.0)) * 1.4;

  // wrap vertically so the field never empties
  p.y = mod(p.y + 9.0, 18.0) - 9.0;

  // subtle pull toward camera as you scroll (depth parallax)
  p.z += uScroll * 2.0;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = -mv.z;
  vAlpha = smoothstep(22.0, 6.0, dist) * smoothstep(0.5, 4.0, dist);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / dist);
}
`;

const fragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uRedColor;
varying float vRed;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  vec3 col = mix(uColor, uRedColor, vRed);
  gl_FragColor = vec4(col, a * vAlpha * (0.35 + vRed * 0.5));
}
`;

export default function MistParticles({ count = 1200 }: { count?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const seeds = new Float32Array(count);
    const reds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      scales[i] = Math.random() * 1.4 + 0.3;
      speeds[i] = Math.random() * 1.2 + 0.4;
      seeds[i] = Math.random();
      // ~4% of motes are red
      reds[i] = Math.random() < 0.04 ? 1 : 0;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aRed", new THREE.BufferAttribute(reds, 1));

    const u = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(state.dpr, 2) },
      uSize: { value: 26 },
      uScroll: { value: 0 },
      uColor: { value: new THREE.Color("#d9d6cd") },
      uRedColor: { value: new THREE.Color("#ff2d18") },
    };
    return { geometry: g, uniforms: u };
  }, [count]);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uScroll.value += (state.scroll - u.uScroll.value) * 0.05;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
