import { publications } from './cv';

export type Collaborator = {
  name: string;
  /** City/region used as the map endpoint for red collaborator lines. */
  affiliation?: string;
  lat?: number;
  lng?: number;
};

/**
 * Known affiliations for publication co-authors.
 * Keys must match names parsed from citation author lists (Surname, Initials.).
 */
export const collaboratorAffiliations: Record<string, string> = {
  'Bai, W.': 'Nanjing, CN',
  'Chen, Z.': 'Oxford, UK',
  'Ji, T.': 'Zhuhai, CN',
  'Lu, Y.': 'Nottingham, UK',
  'Wright, C.': 'Leeds, UK',
  'Zhang, L.': 'Henan, CN',
  'Zheng, Y.': 'Southampton, UK',
};

/** Map coordinates keyed by affiliation label (not by person). */
export const affiliationLocations: Record<string, { lat: number; lng: number }> = {
  'Nanjing, CN': { lat: 32.0603, lng: 118.7969 },
  'Oxford, UK': { lat: 51.752, lng: -1.2577 },
  'Zhuhai, CN': { lat: 22.2707, lng: 113.5767 },
  'Nottingham, UK': { lat: 52.9548, lng: -1.1581 },
  'Leeds, UK': { lat: 53.8008, lng: -1.5491 },
  'Henan, CN': { lat: 34.7657, lng: 113.7532 },
  'Southampton, UK': { lat: 50.9097, lng: -1.4044 },
};

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

function parseAuthors(citationHtml: string): string[] {
  // Typical pattern: "Surname, I., Surname, I., & Surname, I. (YEAR). ..."
  const txt = stripHtml(citationHtml);
  const beforeYear = txt.split('(')[0] ?? '';
  const normalized = beforeYear.replace(/\s*&\s*/g, ', ').replace(/\s+and\s+/gi, ', ');
  const parts = normalized
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  // Reconstruct pairs "Surname, I." from the comma split.
  const out: string[] = [];
  for (let i = 0; i < parts.length - 1; i += 2) {
    const surname = parts[i];
    const initials = parts[i + 1];
    if (!surname || !initials) continue;
    out.push(`${surname}, ${initials}`.replace(/\s+/g, ' ').trim());
  }
  return out;
}

function isSelfAuthor(name: string): boolean {
  // Publications use "Zhang, A. J."; older forms may appear as "Zhang, J." / "Zhang, J. W.".
  return /^Zhang,\s*(A\.?\s*)?J(\.|$|\s)/i.test(name);
}

/** Publication co-authors only (self excluded). Location comes from affiliation when known. */
export function getCollaborators(): Collaborator[] {
  const allAuthors = publications.flatMap((p) => parseAuthors(p.citationHtml));
  const unique = Array.from(new Set(allAuthors)).filter((n) => !isSelfAuthor(n));

  return unique
    .map((name) => {
      const affiliation = collaboratorAffiliations[name];
      const loc = affiliation ? affiliationLocations[affiliation] : undefined;
      return {
        name,
        affiliation,
        lat: loc?.lat,
        lng: loc?.lng,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type CollaboratorRoute = {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
};

/**
 * Red map lines: only publication co-authors who have a known affiliation location.
 * Visitor dots are never included here.
 */
export function getCollaboratorRoutes(home: {
  lat: number;
  lng: number;
  label?: string;
}): CollaboratorRoute[] {
  return getCollaborators()
    .filter(
      (c): c is Collaborator & { affiliation: string; lat: number; lng: number } =>
        Boolean(c.affiliation) && typeof c.lat === 'number' && typeof c.lng === 'number',
    )
    .map((c) => ({
      start: home,
      end: {
        lat: c.lat,
        lng: c.lng,
        label: `${c.name} (${c.affiliation})`,
      },
    }));
}
