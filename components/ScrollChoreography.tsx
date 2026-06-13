"use client";

import { useEffect } from "react";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";
import { state } from "@/lib/store";

/**
 * Headless: maps scroll position onto the WebGL scene.
 * - state.hero  → can rotation + camera dolly (over the first ~1.8 screens)
 * - state.spray → a burst pulse as the hero hands off to the studio section
 */
export default function ScrollChoreography() {
  useEffect(() => {
    registerGsap();
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;

    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=185%",
      onUpdate: (self) => {
        const p = self.progress;
        state.hero = p;
        // triangular pulse peaking mid-handoff (0.32 .. 0.68)
        const pulse = Math.max(0, 1 - Math.abs(p - 0.5) / 0.18);
        state.spray = pulse * pulse * (3 - 2 * pulse); // smoothstep
      },
    });

    ScrollTrigger.refresh();
    return () => st.kill();
  }, []);

  return null;
}
