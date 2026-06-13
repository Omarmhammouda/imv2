/**
 * Prefix a public-asset path with the configured base path so absolute
 * references (videos, the GLB, posters) resolve correctly when the site is
 * served from a sub-path — e.g. GitHub Pages at /imv2/.
 *
 * next/image and next/font handle basePath automatically; this is only needed
 * for raw <video>/<source>/fetch URLs that Next does not rewrite.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const asset = (path: string): string =>
  path.startsWith("/") ? `${BASE}${path}` : path;
