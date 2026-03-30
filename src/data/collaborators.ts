import { publications } from './cv';

export type Collaborator = {
  name: string;
  affiliation?: string;
};

/**
 * OPTIONAL: fill in known affiliations for co-authors here.
 * Keys should match the name extracted from citations (surname + initials).
 */
export const collaboratorAffiliations: Record<string, string> = {
  // Example:
  // 'Wright, C.': 'University of ...',
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

export function getCollaborators(): Collaborator[] {
  const allAuthors = publications.flatMap((p) => parseAuthors(p.citationHtml));
  const unique = Array.from(new Set(allAuthors));

  // Exclude self entries (any Zhang, J. / Zhang, J. W. variants).
  const filtered = unique.filter((n) => !/^Zhang,\s*J(\.|$)/.test(n) && !/^Zhang,\s*J\w*\./.test(n));

  return filtered
    .map((name) => ({ name, affiliation: collaboratorAffiliations[name] }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

