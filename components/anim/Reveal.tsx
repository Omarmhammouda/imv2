"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { state } from "@/lib/store";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  /** stagger direct children instead of animating the block as one */
  stagger?: number;
  start?: string;
};

export default function Reveal({
  children,
  as: TagName = "div",
  className,
  y = 42,
  delay = 0,
  duration = 1.1,
  stagger,
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const targets =
      stagger != null ? (Array.from(el.children) as HTMLElement[]) : [el];

    if (state.reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y });
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () =>
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          ease: "power3.out",
          delay,
          stagger: stagger ?? 0,
        }),
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag: any = TagName;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
