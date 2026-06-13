"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { state, emit, on, initEnvironment } from "@/lib/store";
import SprayCan from "./SprayCan";
import MistParticles from "./MistParticles";
import PostFX from "./PostFX";

/** Camera dolly + parallax driven by scroll and pointer. */
function Rig() {
  const { camera } = useThree();
  const base = useRef(new THREE.Vector3(0, 0, 6.2));
  useFrame(() => {
    const h = state.hero;
    // dolly in slightly then pull back as the hero scrubs out
    const z = base.current.z - Math.sin(h * Math.PI) * 1.1 + h * 1.4;
    const targetX = state.pointer.x * 0.45;
    const targetY = 0.2 + state.pointer.y * 0.35 + h * 0.3;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (z - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Ready() {
  useEffect(() => {
    const id = requestAnimationFrame(() => emit("ready"));
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}

function Studio() {
  return (
    <Environment resolution={256}>
      {/* key */}
      <Lightformer
        form="rect"
        intensity={3.2}
        position={[-3.5, 4, 4]}
        scale={[8, 10, 1]}
        color="#ffffff"
      />
      {/* cool rim from behind */}
      <Lightformer
        form="rect"
        intensity={2.4}
        position={[4, 2, -5]}
        rotation={[0, Math.PI, 0]}
        scale={[10, 10, 1]}
        color="#cfd6e6"
      />
      {/* soft fill */}
      <Lightformer
        form="rect"
        intensity={0.7}
        position={[3, -2, 3]}
        scale={[6, 6, 1]}
        color="#9aa0b0"
      />
      {/* bright streak for a moving metal highlight */}
      <Lightformer
        form="ring"
        intensity={2.0}
        position={[0, 1, 5]}
        scale={[3, 3, 1]}
        color="#ffffff"
      />
    </Environment>
  );
}

export default function Scene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(1.5);
  const [quality, setQuality] = useState(state.quality);
  const [canScale, setCanScale] = useState(0.72);

  useEffect(() => {
    initEnvironment();
    setDpr(state.dpr);
    setQuality(state.quality);
    setCanScale(state.isMobile ? 0.6 : 0.72);

    // reveal the canvas once the preloader lifts
    const reveal = () => {
      if (wrap.current) wrap.current.style.opacity = "1";
    };
    if (state.loaded) reveal();
    const off = on("loaded", reveal);
    return off;
  }, []);

  return (
    <div ref={wrap} className="scene-canvas">
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ fov: 34, position: [0, 0.2, 6.2], near: 0.1, far: 100 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <Studio />
          <ambientLight intensity={0.15} />
          <spotLight
            position={[-4, 6, 5]}
            angle={0.5}
            penumbra={1}
            intensity={70}
            color="#ffffff"
            distance={30}
          />
          <directionalLight position={[6, 3, -4]} intensity={1.8} color="#dfe4f0" />

          <group position={[0, -0.15, 0]}>
            <SprayCan scale={canScale} />
          </group>

          <MistParticles
            count={
              quality === "high" ? 1400 : quality === "med" ? 800 : 380
            }
          />

          <Rig />
          <PostFX quality={quality} />
          <Ready />
        </Suspense>
      </Canvas>
    </div>
  );
}
