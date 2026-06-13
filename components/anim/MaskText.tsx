"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { state, on } from "@/lib/store";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** delay added after the trigger fires */
  delay?: number;
  stagger?: number;
  /** start the animation immediately on mount instead of on scroll */
  immediate?: boolean;
};

/**
 * Splits text into words, each masked behind an overflow-hidden wrapper, then
 * rises into place — on scroll by default, or immediately (used for the hero
 * once the preloader hands off).
 */
export default function MaskText({
  text,
  as: TagName = "span",
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(".mw");
    gsap.set(targets, { yPercent: 115 });

    const play = (d = delay) =>
      gsap.to(targets, {
        yPercent: 0,
        duration: 1.05,
        ease: "power4.out",
        stagger,
        delay: d,
      });

    if (state.reducedMotion) {
      gsap.set(targets, { yPercent: 0 });
      return;
    }

    let st: ScrollTrigger | undefined;
    let off: (() => void) | undefined;

    if (immediate) {
      if (state.loaded) play(delay + 0.1);
      else off = on("loaded", () => play(delay + 0.15));
    } else {
      st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => play(),
      });
    }

    return () => {
      st?.kill();
      off?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrap: React.CSSProperties = {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "top",
  };
  const inner: React.CSSProperties = {
    display: "inline-block",
    willChange: "transform",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag: any = TagName;
  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span style={wrap}>
            <span className="mw" style={inner}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
