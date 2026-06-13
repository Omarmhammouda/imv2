"use client";

import MaskText from "@/components/anim/MaskText";
import Reveal from "@/components/anim/Reveal";
import VideoBackground from "@/components/VideoBackground";
import styles from "./Services.module.css";

const SERVICES = [
  {
    no: "01",
    name: "Mural Design",
    desc: "From a blank facade to a city landmark. We concept, design and hand-paint large-scale work that holds up close and reads from a block away.",
    items: [
      "Hand-painted murals",
      "Large-format facades",
      "Anamorphic & 3D",
      "Interior installations",
      "Live painting",
      "Restoration",
    ],
  },
  {
    no: "02",
    name: "Brand Identity",
    desc: "The same hand that scales to a wall distils to a mark. Identities with grit and discipline — built to live on concrete, screens and everything between.",
    items: [
      "Logo & wordmark",
      "Visual systems",
      "Typography",
      "Art direction",
      "Packaging",
      "Brand guidelines",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className={styles.services}>
      <VideoBackground
        className={styles.bg}
        src="/video/ink.mp4"
        poster="/img/bg/ink.jpg"
        opacity={0.5}
      />
      <div className={styles.scrim} />

      <div className="container">
        <div className={styles.head}>
          <MaskText as="h2" className={styles.title} text="What we do" />
          <span className={styles.tag}>(Services) — 04 / 06</span>
        </div>

        {SERVICES.map((s) => (
          <div className={styles.row} key={s.no}>
            <div className={styles.rowHead}>
              <span className={styles.no}>{s.no}</span>
              <MaskText as="h3" className={styles.svcName} text={s.name} />
            </div>
            <Reveal className={styles.detail} y={36}>
              <p className={styles.desc}>{s.desc}</p>
              <ul className={styles.list}>
                {s.items.map((it) => (
                  <li key={it} data-cursor="hover">
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
