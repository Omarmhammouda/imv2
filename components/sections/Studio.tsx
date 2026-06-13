"use client";

import MaskText from "@/components/anim/MaskText";
import Reveal from "@/components/anim/Reveal";
import styles from "./Studio.module.css";

const STATS = [
  { n: "127", u: "+", label: "Walls painted" },
  { n: "41", u: "", label: "Cities marked" },
  { n: "09", u: "", label: "Years awake" },
  { n: "01", u: "", label: "Obsession" },
];

export default function Studio() {
  return (
    <section id="studio" className={`${styles.studio} container`}>
      <div className={styles.head}>
        <span className={styles.tag}>(Studio) — Who we are</span>
        <span className={styles.num}>02 / 06</span>
      </div>

      <MaskText
        as="h2"
        className={styles.statement}
        text="We turn blank concrete into landmarks — and unknown names into brands that refuse to be ignored."
        stagger={0.03}
      />

      <div className={styles.lower}>
        <Reveal>
          <p className={styles.body}>
            Insomnia Murals is a nocturnal studio working at the seam between
            fine art and brand. We scale ideas to the side of a building and
            distil them down to a logo — same restless hand, same midnight
            discipline. No stock gestures, no safe grey. One red line, drawn
            with intent.
          </p>
        </Reveal>

        <Reveal as="dl" className={styles.stats} stagger={0.08} y={28}>
          {STATS.map((s) => (
            <div className={styles.stat} key={s.label}>
              <dt>
                {s.n}
                <span className={styles.u}>{s.u}</span>
              </dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
