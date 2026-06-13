"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { state } from "@/lib/store";
import { asset } from "@/lib/asset";
import SprayBurst from "./SprayBurst";

const TWO_PI = Math.PI * 2;

/** Prefer the generated GLB; fall back to the procedural can. */
const USE_GLB = true;
const GLB_PATH = "/models/can.glb";
/** yaw so the printed wordmark faces the camera at rest (tuned visually). */
const GLB_YAW = Math.PI;

/* ----------------------------- GLB model ----------------------------- */

function CanModel() {
  const { scene } = useGLTF(asset(GLB_PATH));
  const model = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const targetH = 3.0;
    const k = targetH / size.y;
    s.scale.setScalar(k);
    s.position.set(-center.x * k, -center.y * k, -center.z * k);
    s.rotation.y = GLB_YAW;
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.envMapIntensity = 1.1;
          mat.needsUpdate = true;
        }
      }
    });
    return s;
  }, [scene]);

  return <primitive object={model} />;
}
useGLTF.preload(asset(GLB_PATH));

/* -------------------------- procedural can --------------------------- */

function makeLabelTexture(): THREE.CanvasTexture {
  const w = 2048;
  const h = 1024;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#0a0a0b";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.6;
    const tone = Math.random();
    ctx.fillStyle =
      tone > 0.7
        ? `rgba(236,233,225,${Math.random() * 0.08})`
        : `rgba(0,0,0,${Math.random() * 0.25})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TWO_PI);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(236,233,225,0.05)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * w, Math.random() * h);
    ctx.bezierCurveTo(
      Math.random() * w,
      Math.random() * h,
      Math.random() * w,
      Math.random() * h,
      Math.random() * w,
      Math.random() * h
    );
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(236,233,225,0.5)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.lineTo(w, 250);
  ctx.moveTo(0, h - 250);
  ctx.lineTo(w, h - 250);
  ctx.stroke();

  const cx = w * 0.5;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ece9e1";
  ctx.font = '900 300px Impact, "Arial Narrow", sans-serif';
  ctx.fillText("INSOMNIA", cx, h * 0.46);
  ctx.fillText("MURALS", cx, h * 0.46 + 280);

  ctx.font = '600 52px "Arial Narrow", Arial, sans-serif';
  ctx.fillStyle = "#b8b6ae";
  ctx.fillText("MIDNIGHT SERIES · HIGH-PRESSURE · 400ML", cx, 200);
  ctx.fillText("NET WT — PAINT AFTER DARK", cx, h - 170);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBodyGeometry(): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(0.0, 0.02),
    new THREE.Vector2(0.34, 0.0),
    new THREE.Vector2(0.55, 0.02),
    new THREE.Vector2(0.6, 0.1),
    new THREE.Vector2(0.6, 1.92),
    new THREE.Vector2(0.585, 2.04),
    new THREE.Vector2(0.5, 2.2),
    new THREE.Vector2(0.36, 2.34),
    new THREE.Vector2(0.3, 2.44),
    new THREE.Vector2(0.295, 2.56),
    new THREE.Vector2(0.27, 2.6),
    new THREE.Vector2(0.0, 2.61),
  ];
  const g = new THREE.LatheGeometry(pts, 96);
  g.translate(0, -1.305, 0);
  g.computeVertexNormals();
  return g;
}

function ProceduralCan() {
  const bodyGeo = useMemo(makeBodyGeometry, []);
  const labelTex = useMemo(makeLabelTexture, []);
  return (
    <group>
      <mesh geometry={bodyGeo} castShadow>
        <meshStandardMaterial
          color="#c4c4c9"
          metalness={1}
          roughness={0.42}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.604, 0.604, 1.78, 96, 1, true]} />
        <meshStandardMaterial
          map={labelTex}
          metalness={0.1}
          roughness={0.82}
          envMapIntensity={0.4}
        />
      </mesh>
      <group position={[0, 1.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.44, 0.46, 0.66, 64]} />
          <meshPhysicalMaterial
            color="#ff2d18"
            metalness={0}
            roughness={0.42}
            clearcoat={0.6}
            clearcoatRoughness={0.35}
            envMapIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.4, 0.43, 0.06, 64]} />
          <meshPhysicalMaterial
            color="#e0210c"
            metalness={0}
            roughness={0.5}
            clearcoat={0.4}
          />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.12, 32]} />
          <meshStandardMaterial color="#111113" metalness={0.2} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.44, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.045, 0.14, 16]} />
          <meshStandardMaterial color="#0c0c0d" metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------- wrapper ----------------------------- */

export default function SprayCan({ scale = 1 }: { scale?: number }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useFrame((stt) => {
    const g = group.current;
    const inr = inner.current;
    if (!g || !inr) return;
    const t = stt.clock.elapsedTime;

    // idle spin + scroll-scrubbed rotation
    // (+PI base so the "Insomnia Murals" wordmark faces the camera at rest)
    const idle = t * 0.1;
    const scrub = state.hero * TWO_PI * 1.15;
    inr.rotation.y = Math.PI + idle + scrub;

    // pointer parallax tilt (eased pointer from the cursor module)
    const px = state.pointer.x;
    const py = state.pointer.y;
    g.rotation.x += (py * 0.16 - g.rotation.x) * 0.06;
    g.rotation.z += (-px * 0.12 - g.rotation.z) * 0.06;

    // gentle float + slight rise as the hero scrubs
    g.position.y =
      Math.sin(t * 0.6) * 0.06 + Math.cos(t * 0.27) * 0.04 - state.hero * 0.5;
    g.position.x += (px * 0.18 - g.position.x) * 0.05;
  });

  return (
    <group ref={group} scale={scale} dispose={null}>
      <group ref={inner}>
        {USE_GLB ? <CanModel /> : <ProceduralCan />}

        {/* spray burst emitter sits at the nozzle */}
        <group position={[0, 1.62, 0.05]}>
          <SprayBurst count={state.quality === "low" ? 240 : 600} />
        </group>
      </group>
    </group>
  );
}
