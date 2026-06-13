"use client";

import Image from "next/image";
import MaskText from "@/components/anim/MaskText";
import Reveal from "@/components/anim/Reveal";
import styles from "./Work.module.css";

type Project = {
  id: string;
  name: string;
  cat: string;
  place: string;
  img: string;
  shape: "tall" | "wide";
};

const LEFT: Project[] = [
  { id: "01", name: "Lucid", cat: "Portrait Mural", place: "Brooklyn ’24", img: "/img/murals/portrait.jpg", shape: "tall" },
  { id: "04", name: "Release", cat: "Surreal", place: "Mexico City ’23", img: "/img/murals/hands.jpg", shape: "wide" },
  { id: "05", name: "Sleep Is For Later", cat: "Typographic", place: "New York ’25", img: "/img/murals/type.jpg", shape: "tall" },
];

const RIGHT: Project[] = [
  { id: "02", name: "Wildstyle", cat: "Abstract", place: "Berlin ’23", img: "/img/murals/calligraphy.jpg", shape: "wide" },
  { id: "03", name: "Nightwatch", cat: "Wildlife", place: "Lisbon ’24", img: "/img/murals/raven.jpg", shape: "tall" },
  { id: "06", name: "Static", cat: "Op-Art", place: "Tokyo ’24", img: "/img/murals/opart.jpg", shape: "wide" },
];

function Card({ p }: { p: Project }) {
  return (
    <Reveal as="div" y={60}>
      <a
        className={styles.card}
        href="#contact"
        data-cursor="view"
        data-cursor-label="View"
        aria-label={`${p.name} — ${p.cat}, ${p.place}`}
      >
        <div className={`${styles.media} ${styles[p.shape]}`}>
          <span className={styles.chip}>({p.id})</span>
          <span className={styles.view}>View case</span>
          <Image
            src={p.img}
            alt={`${p.name} mural`}
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.caption}>
          <span className={styles.name}>{p.name}</span>
          <span className={styles.cat}>
            {p.cat}
            <br />
            {p.place}
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export default function Work() {
  return (
    <section id="work" className={styles.work}>
      <div className="container">
        <div className={styles.head}>
          <MaskText as="h2" className={styles.title} text="Selected Work" />
          <span className={styles.tag}>
            (Work) — 03 / 06 · <span className={styles.accent}>06</span> of 127
          </span>
        </div>

        <div className={styles.grid}>
          <div className={styles.col}>
            {LEFT.map((p) => (
              <Card key={p.id} p={p} />
            ))}
          </div>
          <div className={`${styles.col} ${styles.right}`}>
            {RIGHT.map((p) => (
              <Card key={p.id} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
