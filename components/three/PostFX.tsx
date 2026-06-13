"use client";

import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import type { Quality } from "@/lib/store";

export default function PostFX({ quality }: { quality: Quality }) {
  if (quality === "low") {
    return (
      <EffectComposer>
        <Vignette eskil={false} offset={0.28} darkness={0.85} />
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.03} />
      </EffectComposer>
    );
  }

  if (quality === "med") {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.52}
          luminanceSmoothing={0.22}
          mipmapBlur
          radius={0.62}
        />
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
        <Vignette eskil={false} offset={0.26} darkness={0.9} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.58}
        luminanceSmoothing={0.22}
        mipmapBlur
        radius={0.62}
      />
      <DepthOfField
        focusDistance={0.012}
        focalLength={0.05}
        bokehScale={2.6}
        height={480}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0009, 0.0011)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
      <Vignette eskil={false} offset={0.26} darkness={0.9} />
    </EffectComposer>
  );
}
