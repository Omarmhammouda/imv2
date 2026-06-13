"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import Studio from "@/components/sections/Studio";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import Interlude from "@/components/sections/Interlude";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import ScrollChoreography from "@/components/ScrollChoreography";

// WebGL scene is client-only
const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

export default function Home() {
  return (
    <main id="top">
      <Scene />
      <Hero />
      <Studio />
      <Marquee />
      <Work />
      <Interlude
        src="/video/mist.mp4"
        poster="/img/bg/hero.jpg"
        eyebrow="Manifesto"
        pre="We don’t fill walls —"
        em="we keep cities"
        post="awake."
        attr="— Insomnia Murals, est. after midnight"
      />
      <Services />
      <Process />
      <Interlude
        src="/video/drip.mp4"
        poster="/img/bg/drip.jpg"
        eyebrow="Ethos"
        pre="Every wall earns"
        em="one red line."
      />
      <Contact />
      <ScrollChoreography />
    </main>
  );
}
