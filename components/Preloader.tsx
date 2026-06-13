"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { state, emit, on } from "@/lib/store";
import styles from "./Preloader.module.css";

const STATUS = [
  "PREPARING CANVAS",
  "MIXING PIGMENT",
  "PRESSURIZING CAN",
  "CALIBRATING LIGHT",
  "ENTERING THE VOID",
];

const SLATS = 6;

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const ui = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const statusEl = useRef<HTMLDivElement>(null);
  const w1 = useRef<HTMLSpanElement>(null);
  const w2 = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = state.reducedMotion;
    let ready = false;
    let finished = false;

    const offReady = on("ready", () => {
      ready = true;
    });
    // hard fallback so we never hang on a stalled asset
    const maxWait = window.setTimeout(() => {
      ready = true;
    }, 5000);

    const ctx = gsap.context(() => {
      // entrance of the wordmark
      gsap.set([w1.current, w2.current], { yPercent: 115 });
      gsap.to([w1.current, w2.current], {
        yPercent: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.1,
      });

      // cycle status text
      let si = 0;
      const cycle = window.setInterval(() => {
        si = (si + 1) % STATUS.length;
        if (statusEl.current) statusEl.current.textContent = STATUS[si];
      }, 620);

      const progress = { v: 0 };
      const render = () => {
        const v = Math.floor(progress.v);
        if (counter.current)
          counter.current.textContent = String(v).padStart(3, "0");
        if (fill.current) fill.current.style.width = `${progress.v}%`;
      };

      const exit = () => {
        if (finished) return;
        finished = true;
        window.clearInterval(cycle);
        state.loaded = true;

        const tl = gsap.timeline({
          onComplete: () => {
            setGone(true);
            emit("loaded");
          },
        });
        tl.to(ui.current, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" })
          .to(
            root.current!.querySelectorAll(`.${styles.slat}`),
            {
              yPercent: -100,
              duration: 1.1,
              ease: "expo.inOut",
              stagger: { each: 0.07, from: "center" },
            },
            "-=0.1"
          )
          .set(root.current, { display: "none" });
      };

      // race the counter against real asset readiness
      gsap.to(progress, {
        v: 92,
        duration: reduced ? 0.4 : 2.0,
        ease: "power1.out",
        onUpdate: render,
        onComplete: () => {
          const settle = () => {
            if (ready) {
              gsap.to(progress, {
                v: 100,
                duration: reduced ? 0.2 : 0.6,
                ease: "power2.out",
                onUpdate: render,
                onComplete: () => gsap.delayedCall(0.25, exit),
              });
            } else {
              // creep slowly while waiting
              gsap.to(progress, {
                v: Math.min(99, progress.v + 1.5),
                duration: 0.4,
                ease: "none",
                onUpdate: render,
                onComplete: settle,
              });
            }
          };
          settle();
        },
      });
    }, root);

    return () => {
      offReady();
      window.clearTimeout(maxWait);
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className={styles.preloader} aria-hidden>
      <div className={styles.slats} style={{ ["--n" as string]: SLATS }}>
        {Array.from({ length: SLATS }).map((_, i) => (
          <div key={i} className={styles.slat} />
        ))}
      </div>

      <div ref={ui} className={styles.ui}>
        <div className={styles.top}>
          <div className={styles.brandTag}>
            <span className={styles.blip} />
            INSOMNIA MURALS
          </div>
          <div ref={statusEl} className={styles.status}>
            {STATUS[0]}
          </div>
        </div>

        <div className={styles.center}>
          <span className={styles.word}>
            <span ref={w1}>Insomnia</span>
          </span>
          <span className={`${styles.word} ${styles.two}`}>
            <span ref={w2}>Murals</span>
          </span>
        </div>

        <div className={styles.bottom}>
          <div className={styles.counter}>
            <span ref={counter}>000</span>
            <sup>%</sup>
          </div>
          <div className={styles.meta}>
            Nocturnal mural studio
            <br />& brand identity
          </div>
        </div>
      </div>

      <div className={styles.track}>
        <div ref={fill} className={styles.fill} />
      </div>
    </div>
  );
}
