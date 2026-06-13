"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { state } from "@/lib/store";
import VideoBackground from "@/components/VideoBackground";
import MaskText from "@/components/anim/MaskText";
import styles from "./Interlude.module.css";

type Props = {
  src?: string;
  poster: string;
  eyebrow?: string;
  pre: string;
  em: string;
  post?: string;
  attr?: string;
};

export default function Interlude({
  src,
  poster,
  eyebrow = "Manifesto",
  pre,
  em,
  post = "",
  attr,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.reducedMotion) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        media.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={styles.interlude}>
      <div ref={media} className={styles.media}>
        <VideoBackground src={src} poster={poster} />
      </div>
      <div className={styles.scrim} />
      <div className={styles.inner}>
        <span className={styles.eyebrow}>({eyebrow})</span>
        <h2 className={styles.quote}>
          {pre} <span className={styles.em}>{em}</span> {post}
        </h2>
        {attr ? <MaskText as="p" className={styles.attr} text={attr} /> : null}
      </div>
    </section>
  );
}
