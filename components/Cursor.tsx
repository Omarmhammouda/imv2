"use client";

import { useEffect, useRef } from "react";
import { state } from "@/lib/store";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      // feed normalized pointer to the WebGL scene
      state.pointerRaw.x = (e.clientX / window.innerWidth) * 2 - 1;
      state.pointerRaw.y = -((e.clientY / window.innerHeight) * 2 - 1);
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      }
      if (label.current) {
        label.current.style.transform = `translate(${ringPos.x}px, ${
          ringPos.y + 0.5
        }px) translate(-50%, -50%)`;
      }
      // ease the pointer the scene actually reads
      state.pointer.x += (state.pointerRaw.x - state.pointer.x) * 0.08;
      state.pointer.y += (state.pointerRaw.y - state.pointer.y) * 0.08;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const setState = (s: string, text = "") => {
      if (ring.current) ring.current.dataset.state = s;
      if (label.current) {
        label.current.textContent = text;
        label.current.style.opacity = text ? "1" : "0";
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "[data-cursor], a, button"
      ) as HTMLElement | null;
      if (!el) {
        setState("", "");
        return;
      }
      const kind = el.getAttribute("data-cursor");
      const text = el.getAttribute("data-cursor-label") || "";
      if (kind === "view") setState("view", text || "View");
      else setState("hover", text);
    };

    const onDown = () => ring.current?.style.setProperty("scale", "0.82");
    const onUp = () => ring.current?.style.removeProperty("scale");
    const onLeave = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dot.current) dot.current.style.opacity = "1";
      if (ring.current) ring.current.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" data-state="" aria-hidden />
      <div ref={label} className="cursor-label" aria-hidden />
    </>
  );
}
