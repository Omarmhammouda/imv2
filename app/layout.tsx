import type { Metadata, Viewport } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import GrainOverlay from "@/components/GrainOverlay";
import Nav from "@/components/Nav";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--f-display",
  display: "swap",
});

const sans = Archivo({
  subsets: ["latin"],
  variable: "--f-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--f-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Insomnia Murals — Nocturnal Mural & Brand Studio",
  description:
    "Insomnia Murals is a sleepless studio painting large-scale murals and building bold brand identities. High-contrast, cinematic, neon-on-concrete.",
  keywords: [
    "mural studio",
    "street art",
    "brand identity",
    "large-scale murals",
    "Insomnia Murals",
  ],
  openGraph: {
    title: "Insomnia Murals",
    description: "Large-scale murals & brand identity, painted after dark.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Preloader />
        <Cursor />
        <Nav />
        <SmoothScroll>{children}</SmoothScroll>
        <GrainOverlay />
      </body>
    </html>
  );
}
