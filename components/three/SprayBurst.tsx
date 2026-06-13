"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { simplex3d } from "@/lib/glsl";
import { state } from "@/lib/store";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSpray;
attribute vec3 aDir;
attribute float aSpeed;
attribute float aSeed;
attribute float aScale;
varying float vLife;
varying float vSeed;
varying float vSpray;
${simplex3d}
void main() {
  float life = fract(uTime * aSpeed * 0.45 + aSeed);
  vLife = life;
  vSeed = aSeed;
  vSpray = uSpray;

  float reach = 3.4 * (0.4 + uSpray);
  vec3 p = aDir * life * reach;

  // turbulent dispersion that grows along the life
  float t = uTime * 0.3 + aSeed * 30.0;
  vec3 turb = vec3(
    snoise(vec3(aDir.yz * 2.0, t)),
    snoise(vec3(aDir.zx * 2.0, t + 5.0)),
    snoise(vec3(aDir.xy * 2.0, t + 9.0))
  );
  p += turb * life * 1.3;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float grow = mix(0.4, 2.4, life);
  gl_PointSize = uPixelRatio * aScale * grow * 30.0 / max(-mv.z, 0.5);
}
`;

const fragment = /* glsl */ `
uniform vec3 uRed;
uniform vec3 uWhite;
varying float vLife;
varying float vSeed;
varying float vSpray;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  // bright hot core near emission, cooling to red as it disperses
  vec3 col = mix(uWhite, uRed, smoothstep(0.0, 0.35, vLife));
  float fade = (1.0 - vLife) * smoothstep(0.0, 0.08, vLife);
  gl_FragColor = vec4(col, a * fade * vSpray * 0.9);
}
`;

export default function SprayBurst({ count = 600 }: { count?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const dirs = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);

    // emission cone, biased up & slightly forward from the nozzle
    const base = new THREE.Vector3(0.12, 1.0, 0.18).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      base
    );

    for (let i = 0; i < count; i++) {
      const spread = 0.42;
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.7) * spread;
      const dir = new THREE.Vector3(
        Math.cos(theta) * r,
        1.0,
        Math.sin(theta) * r
      )
        .applyQuaternion(q)
        .normalize();
      dirs[i * 3] = dir.x;
      dirs[i * 3 + 1] = dir.y;
      dirs[i * 3 + 2] = dir.z;
      speeds[i] = Math.random() * 1.0 + 0.6;
      seeds[i] = Math.random();
      scales[i] = Math.random() * 0.9 + 0.4;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aDir", new THREE.BufferAttribute(dirs, 3));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const u = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(state.dpr, 2) },
      uSpray: { value: 0 },
      uRed: { value: new THREE.Color("#ff2d18") },
      uWhite: { value: new THREE.Color("#ffd9d2") },
    };
    return { geometry: g, uniforms: u };
  }, [count]);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    // ease toward the target spray intensity
    u.uSpray.value += (state.spray - u.uSpray.value) * 0.12;
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
