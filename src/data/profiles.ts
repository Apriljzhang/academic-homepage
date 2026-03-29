/** Canonical Google Scholar profile URL (use across site and JSON-LD). */
export const googleScholarProfileUrl =
  'https://scholar.google.com/citations?user=UXwVmZ8AAAAJ&hl=en' as const;

/** Research identifiers and aggregator profiles — shown as compact chips (no section blurb). */
export const academicIds = {
  googleScholar: {
    label: 'Google Scholar',
    href: googleScholarProfileUrl,
  },
  orcid: {
    label: 'ORCID',
    href: 'https://orcid.org/0000-0003-1019-2539',
  },
  scopus: {
    label: 'Scopus',
    href: 'https://www.scopus.com/authid/detail.uri?authorId=59513309400',
  },
  webOfScience: {
    label: 'Web of Science',
    href: 'https://www.webofscience.com/wos/author/record/MGV-0744-2025',
  },
} as const;

/** @deprecated use academicIds — kept for any legacy imports */
export const researcherProfiles = academicIds;
