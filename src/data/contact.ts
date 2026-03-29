/**
 * Update institutional and Outlook addresses here if you do not use env vars.
 * Optional: PUBLIC_CITYU_EMAIL, PUBLIC_OUTLOOK_EMAIL in `.env` for CI.
 */
function fromEnv(name: string): string | undefined {
  const v = import.meta.env[name];
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : undefined;
}

export const contact = {
  /** Primary — City University of Macau */
  cityu: fromEnv('PUBLIC_CITYU_EMAIL') ?? 'aprilzhang@cityu.edu.mo',
  gmail: 'apriljzhang@gmail.com',
  outlook: fromEnv('PUBLIC_OUTLOOK_EMAIL') ?? 'apriljzhang@outlook.com',
} as const;
