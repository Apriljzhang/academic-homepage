/** Prefix path with Astro `base` when non-empty (e.g. project Pages). */
export function withBase(path: string): string {
  const raw = import.meta.env.BASE_URL;
  const base = raw.endsWith('/') ? raw.slice(0, -1) : raw;
  let p = path.startsWith('/') ? path : `/${path}`;
  // Match `trailingSlash: 'always'` for directory URLs.
  // Do not append "/" to file paths — GitHub Pages 404s on `host.html/`.
  const isFile = /\.[a-zA-Z0-9]+$/.test(p);
  if (p !== '/' && !p.endsWith('/') && !isFile) {
    p = `${p}/`;
  }
  if (!base || base === '') return p;
  return `${base}${p}`;
}
