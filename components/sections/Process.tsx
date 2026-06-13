"use client";

import MaskText from "@/components/anim/MaskText";
import Reveal from "@/components/anim/Reveal";
import styles from "./Process.module.css";

const STEPS = [
  {
    no: "01",
    title: "Recon",
    text: "We walk the wall. Site, light, sightlines and the story the place already tells — before a single line is drawn.",
  },
  {
    no: "02",
    title: "Sketch",
    text: "Concepts on paper, then to scale. Composition is tested at building size and pressure-checked until it’s undeniable.",
  },
  {
    no: "03",
    title: "Paint",
    text: "Nights on the lift. Blocking, rendering, the slow build from primer to the final red line that ties it together.",
  },
  {
    no: "04",
    title: "Reveal",
    text: "Documentation, motion and a brand kit so the work keeps working long after the scaffolding comes down.",
  },
];

export default function Process() {
  return (
    <section id="process" className={styles.process}>
      <div className={`${styles.inner} container`}>
        <div className={styles.left}>
          <span className={styles.tag}>(Process) — 05 / 06</span>
          <MaskText as="h2" className={styles.bigTitle} text="How it happens" />
          <p className={styles.lede}>
            Four moves, repeated with discipline. Slow where it counts, fast
            where it doesn’t.
          </p>
        </div>

        <div className={styles.steps}>
          {STEPS.map((s) => (
            <Reveal key={s.no} className={styles.step} y={40}>
              <span className={styles.no}>{s.no}</span>
              <div className={styles.body}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
