/**
 * Update the institutional address here if you do not use an environment variable.
 * Optional: PUBLIC_CITYU_EMAIL in `.env` for CI.
 */
function fromEnv(name: string): string | undefined {
  const v = import.meta.env[name];
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : undefined;
}

export const contact = {
  /** Primary — City University of Macau */
  cityu: fromEnv('PUBLIC_CITYU_EMAIL') ?? 'aprilzhang@cityu.edu.mo',
  gmail: 'apriljzhang@gmail.com',
} as const;
