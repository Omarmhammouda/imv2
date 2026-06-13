"use client";

import { useEffect, useRef } from "react";
import { state } from "@/lib/store";

type Props = {
  src?: string;
  poster: string;
  className?: string;
  opacity?: number;
  blend?: React.CSSProperties["mixBlendMode"];
};

/**
 * Full-bleed looping background video with a still-image poster fallback.
 * If the source is missing or the device is low-power / reduced-motion, only
 * the poster renders — so the section always looks intentional.
 */
export default function VideoBackground({
  src,
  poster,
  className,
  opacity = 1,
  blend,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (state.reducedMotion || state.quality === "low" || !src) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  const showVideo = src && !state.reducedMotion && state.quality !== "low";

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity,
        mixBlendMode: blend,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {showVideo ? (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}
