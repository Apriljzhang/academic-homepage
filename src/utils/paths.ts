/** Prefix path with Astro `base` when non-empty (e.g. project Pages). */
export function withBase(path: string): string {
  const raw = import.meta.env.BASE_URL;
  const base = raw.endsWith('/') ? raw.slice(0, -1) : raw;
  let p = path.startsWith('/') ? path : `/${path}`;
  // Match `trailingSlash: 'always'` so links resolve the same as canonical URLs.
  if (p !== '/' && !p.endsWith('/')) {
    p = `${p}/`;
  }
  if (!base || base === '') return p;
  return `${base}${p}`;
}
