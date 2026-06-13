"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { state, on } from "@/lib/store";
import { scrollTo } from "./providers/SmoothScroll";
import styles from "./Nav.module.css";

const LINKS = [
  { label: "Studio", href: "#studio" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
];

export default function Nav() {
  const nav = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const el = nav.current;
    if (!el) return;
    gsap.set(el, { yPercent: -120, opacity: 0 });
    const reveal = () =>
      gsap.to(el, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
    if (state.loaded) reveal();
    const off = on("loaded", reveal);
    return off;
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    scrollTo(href, -10);
  };

  return (
    <header ref={nav} className={styles.nav}>
      <a
        className={styles.brand}
        href="#top"
        onClick={(e) => go(e, "#top")}
        data-cursor="hover"
      >
        Insomnia<span className={styles.dotRed} />
        <span className={styles.mk}>MURALS</span>
      </a>

      <nav className={styles.menu} aria-label="Primary">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
            <span>{l.label}</span>
          </a>
        ))}
      </nav>

      <div className={styles.right}>
        <span className={styles.clock} suppressHydrationWarning>
          {time} · NYC
        </span>
        <a
          className={styles.cta}
          href="#contact"
          onClick={(e) => go(e, "#contact")}
          data-cursor="hover"
        >
          <span className={styles.pulse} />
          <span className={styles.label}>Start a project</span>
        </a>
      </div>
    </header>
  );
}
