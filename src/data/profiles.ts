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
    label: 'CityU Macau',
    href: cityUStaffProfileUrl,
  },
  researchGate: {
    label: 'ResearchGate',
    href: 'https://www.researchgate.net/profile/April-Zhang-16?ev=hdr_xprf',
  },
  orcid: {
    label: 'ORCID',
    href: 'https://orcid.org/0000-0003-1019-2539',
  },
} as const;

/** Display order for academic profile links. */
export const academicProfileLinks = [
  academicIds.cityuProfile,
  academicIds.orcid,
  academicIds.researchGate,
  academicIds.googleScholar,
] as const;

/** @deprecated use academicIds — kept for any legacy imports */
export const researcherProfiles = academicIds;
