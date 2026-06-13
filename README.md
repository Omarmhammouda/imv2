# Insomnia Murals

A nocturnal, cinematic site for a fictional mural + brand studio — built in the spirit of
[igloo.inc](https://igloo.inc), rebranded for a sleepless, midnight-paint, neon-on-concrete
world. High-contrast black & white with a single red accent used sparingly.

> Large-scale murals & brand identity, painted after dark.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + Turbopack
- **Three.js** via **@react-three/fiber** + **drei** — the hero spray-can scene
- Custom **GLSL** shaders for the ambient mist field and the spray burst
- **@react-three/postprocessing** — bloom, depth-of-field, chromatic aberration, grain, vignette
- **GSAP** + **ScrollTrigger** — all scroll-driven animation
- **Lenis** — smooth momentum scroll, synced to GSAP's ticker and ScrollTrigger

## Run

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
```

## Architecture

```
app/
  layout.tsx          fonts (Anton / Archivo / JetBrains Mono), metadata, chrome
  page.tsx            composes the WebGL scene + all sections
  globals.css         design tokens, cursor, grain/vignette, type system
components/
  Preloader.tsx       staged loader: counter, status cycle, slat-curtain reveal
  Cursor.tsx          custom cursor (also feeds pointer parallax to the scene)
  Nav.tsx             fixed nav with live clock
  GrainOverlay.tsx    film grain + vignette
  VideoBackground.tsx looping bg video w/ poster fallback (reduced-motion aware)
  ScrollChoreography.tsx  maps scroll → can rotation/dolly + spray pulse
  providers/SmoothScroll.tsx   Lenis ⇄ GSAP ticker ⇄ ScrollTrigger
  anim/               MaskText (masked word reveals) + Reveal (scroll fade/rise)
  three/
    Scene.tsx         R3F canvas, studio lighting (Lightformer env), post FX
    SprayCan.tsx      GLB can (with procedural lathe fallback) + idle/scroll/pointer motion
    MistParticles.tsx GPU ambient paint-dust field (simplex-noise drift)
    SprayBurst.tsx    GPU red spray burst, gated by scroll position
    PostFX.tsx        quality-tiered effect composer
  sections/           Hero, Studio, Marquee, Work, Interlude, Services, Process, Contact
lib/
  store.ts            module-singleton state shared DOM ⇄ WebGL (no re-renders)
  gsap.ts             plugin registration
  glsl.ts             reusable simplex-noise GLSL
```

## Performance / accessibility

- **Quality tiers** (`lib/store.ts → detectQuality`) scale particle counts, DPR and post-FX
  by device memory / cores / pointer type. Mobile drops DoF + chromatic aberration and lowers
  the shader cost.
- **`prefers-reduced-motion`** disables Lenis (native scroll), the grain animation, and the
  scroll-scrubbed reveals.
- Background **videos lazy-load** (`preload="metadata"`) and only play while in view
  (IntersectionObserver). Each section always has a still poster fallback.

## Generated assets

All visual assets were generated and saved locally under `public/`:

- **`public/models/can.glb`** — the hero spray can. Image → 3D (Meshy `image_to_3d`, textured + PBR)
  from a generated product render. `SprayCan.tsx` falls back to a fully procedural lathe-built can
  if the GLB is absent (`USE_GLB = false`).
- **`public/video/*.mp4`** — looping section backgrounds (mist, ink, drip, dust), image→video
  (Seedance 1.5) from monochrome-plus-red keyframes.
- **`public/img/murals/*`** — the Work grid (6 generated murals).
- **`public/img/bg/*`** — video poster frames / fallbacks.

`assets/_src/` holds the original full-res source renders (not shipped).

> Asset-pipeline note: the Higgsfield video MCP's `show_generations` / `job_display` failed to
> return Kling jobs (they stored a `null` aspect_ratio that broke output validation). Seedance
> jobs store it correctly, so the looping clips were generated with `seedance_1_5` and fetched
> via `show_generations(type:"video", size:1)`.
