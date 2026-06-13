/**
 * Module-singleton state shared between the DOM (GSAP/React) and the WebGL
 * scene (read inside useFrame). Kept outside React so high-frequency updates
 * (scroll, pointer) never trigger re-renders.
 */

export type Quality = "high" | "med" | "low";

export interface AppState {
  /** whole-document scroll progress 0..1 */
  scroll: number;
  /** smoothed scroll velocity (signed) */
  velocity: number;
  /** hero pin progress 0..1 (drives can rotation + dolly) */
  hero: number;
  /** spray burst intensity 0..1, ramped by a ScrollTrigger */
  spray: number;
  /** normalized pointer -1..1 (eased) */
  pointer: { x: number; y: number };
  /** raw pointer -1..1 (immediate) */
  pointerRaw: { x: number; y: number };
  /** preloader finished + first reveal done */
  loaded: boolean;
  reducedMotion: boolean;
  quality: Quality;
  isMobile: boolean;
  dpr: number;
}

export const state: AppState = {
  scroll: 0,
  velocity: 0,
  hero: 0,
  spray: 0,
  pointer: { x: 0, y: 0 },
  pointerRaw: { x: 0, y: 0 },
  loaded: false,
  reducedMotion: false,
  quality: "high",
  isMobile: false,
  dpr: 1.5,
};

type Event = "ready" | "loaded" | "quality";
type Handler = () => void;
const handlers: Record<Event, Set<Handler>> = {
  ready: new Set(),
  loaded: new Set(),
  quality: new Set(),
};

export function on(event: Event, fn: Handler): () => void {
  handlers[event].add(fn);
  return () => {
    handlers[event].delete(fn);
  };
}

export function emit(event: Event) {
  handlers[event].forEach((fn) => fn());
}

/** Detect device capability once, on the client. */
export function detectQuality(): Quality {
  if (typeof window === "undefined") return "high";
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 820;
  if (narrow || coarse) {
    return mem <= 4 || cores <= 4 ? "low" : "med";
  }
  if (mem <= 4 || cores <= 4) return "med";
  return "high";
}

export function initEnvironment() {
  if (typeof window === "undefined") return;
  state.reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  state.isMobile = window.matchMedia("(max-width: 820px)").matches;
  state.quality = detectQuality();
  state.dpr =
    state.quality === "high"
      ? Math.min(window.devicePixelRatio, 2)
      : state.quality === "med"
      ? 1.5
      : 1;
}
