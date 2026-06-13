"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { state, initEnvironment } from "@/lib/store";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerGsap();
    initEnvironment();

    // Reduced motion: skip Lenis, drive ScrollTrigger from native scroll.
    if (state.reducedMotion) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        state.scroll = max > 0 ? window.scrollY / max : 0;
        ScrollTrigger.update();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("load", refresh);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // native momentum on touch devices feels better + is cheaper
      syncTouch: false,
    });
    window.__lenis = lenis;
    document.documentElement.classList.add("lenis");

    lenis.on("scroll", () => {
      state.scroll = lenis.progress || 0;
      state.velocity = lenis.velocity || 0;
      ScrollTrigger.update();
    });

    // Drive Lenis from GSAP's ticker so animation + scroll share one clock.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger measurements correct.
    ScrollTrigger.refresh();
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}

/** Smoothly scroll to an element or position (anchor nav). */
export function scrollTo(target: string | number, offset = 0) {
  if (typeof window === "undefined") return;
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset, duration: 1.4 });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
  }
}
