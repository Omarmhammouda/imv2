"use client";

import MaskText from "@/components/anim/MaskText";
import Reveal from "@/components/anim/Reveal";
import VideoBackground from "@/components/VideoBackground";
import { scrollTo } from "@/components/providers/SmoothScroll";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <VideoBackground
        className={styles.bg}
        src="/video/dust.mp4"
        poster="/img/bg/dust.jpg"
      />
      <div className={styles.scrim} />

      <div className={`${styles.main} container`}>
        <span className={styles.tag}>(Contact) — 06 / 06</span>
        <MaskText
          as="h2"
          className={styles.headline}
          text="Let’s paint something sleepless"
          stagger={0.04}
        />
        <Reveal y={30} delay={0.1}>
          <a
            className={styles.email}
            href="mailto:hello@insomniamurals.studio"
            data-cursor="hover"
          >
            hello@insomniamurals.studio
          </a>
        </Reveal>
        <Reveal className={styles.meta} stagger={0.06} y={18}>
          <a href="#" data-cursor="hover">
            Instagram
          </a>
          <a href="#" data-cursor="hover">
            Behance
          </a>
          <a href="#" data-cursor="hover">
            Are.na
          </a>
          <span>New York — 24 / 7</span>
        </Reveal>
      </div>

      <div className={styles.flourish} aria-hidden>
        Insomnia
      </div>

      <footer className={styles.foot}>
        <span>© 2026 Insomnia Murals</span>
        <span>Built after dark — Three.js · GSAP · Lenis</span>
        <button
          className={styles.top}
          onClick={() => scrollTo("#top")}
          data-cursor="hover"
        >
          ↑ Back to top
        </button>
      </footer>
    </section>
  );
}
