/** Canonical Google Scholar profile URL (use across site and JSON-LD). */
export const googleScholarProfileUrl =
  'https://scholar.google.com/citations?user=UXwVmZ8AAAAJ&hl=en' as const;

/** Official School of Education staff profile (City University of Macau). */
export const cityUStaffProfileUrl = 'https://soe.cityu.edu.mo/en/staffs-1/387' as const;

/** Research identifiers and aggregator profiles — shown as compact chips (no section blurb). */
export const academicIds = {
  googleScholar: {
    label: 'Google Scholar',
    href: googleScholarProfileUrl,
  },
  cityuProfile: {
    label: 'CityU SOE profile',
    href: cityUStaffProfileUrl,
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

/** Display order in the contact card (Scholar first, then institutional profile). */
export const academicProfileLinks = [
  academicIds.googleScholar,
  academicIds.cityuProfile,
  academicIds.orcid,
  academicIds.scopus,
  academicIds.webOfScience,
] as const;

/** @deprecated use academicIds — kept for any legacy imports */
export const researcherProfiles = academicIds;
