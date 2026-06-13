"use client";

import MaskText from "@/components/anim/MaskText";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Insomnia Murals" data-hero>
      {/* top meta row */}
      <div className={styles.row}>
        <div className={styles.eyebrow}>
          <span className={styles.blip} />
          Nocturnal Mural Studio
        </div>
        <div className={`${styles.eyebrow} ${styles.hideMobile}`}>
          40.7128° N — 74.0060° W
        </div>
      </div>

      {/* giant wordmark wrapping the 3D can */}
      <div className={styles.title} aria-hidden>
        <MaskText as="span" className={styles.line} text="Insomnia" immediate delay={0} />
        <MaskText
          as="span"
          className={`${styles.line} ${styles.lower}`}
          text="Murals"
          immediate
          delay={0.12}
        />
      </div>
      <h1 className="sr-only">Insomnia Murals — nocturnal mural &amp; brand studio</h1>

      {/* bottom row: tagline + scroll cue */}
      <div className={styles.row}>
        <p className={styles.tagline}>
          We paint while the city sleeps — large-scale murals &amp;{" "}
          <span className={styles.accent}>brand identities</span> built after dark.
        </p>
        <div className={styles.scrollCue}>
          <span className={styles.index}>01 — 06</span>
          <span className={styles.word}>Scroll</span>
          <span className={styles.scrollLine} />
        </div>
      </div>
    </section>
  );
}
