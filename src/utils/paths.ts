/** Prefix path with Astro `base` when non-empty (e.g. project Pages). */
export function withBase(path: string): string {
  const raw = import.meta.env.BASE_URL;
  const base = raw.endsWith('/') ? raw.slice(0, -1) : raw;
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!base || base === '') return p;
  return `${base}${p}`;
}
