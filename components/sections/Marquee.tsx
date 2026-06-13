import styles from "./Marquee.module.css";

const WORDS = [
  "Large-Scale Murals",
  "Brand Identity",
  "Art Direction",
  "Type & Lettering",
  "Environmental Design",
];

export default function Marquee({ outline = false }: { outline?: boolean }) {
  const set = (
    <div className={styles.item} aria-hidden>
      {WORDS.map((w, i) => (
        <span key={i} className={outline ? styles.outline : undefined}>
          {w}
          <span className={styles.star}> ✦ </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        {set}
        {set}
      </div>
    </div>
  );
}
