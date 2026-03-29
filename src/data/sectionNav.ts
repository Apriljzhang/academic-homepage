import { withBase } from '../utils/paths';

export const researchSubnav = [
  { href: withBase('/research'), label: 'Overview' },
  { href: withBase('/research/themes'), label: 'Research themes' },
  { href: withBase('/research/publications'), label: 'Publications' },
  { href: withBase('/research/funding'), label: 'Funded projects' },
] as const;

export const teachingSubnav = [
  { href: withBase('/teaching'), label: 'Overview' },
  { href: withBase('/teaching/approach'), label: 'Approach & experience' },
  { href: withBase('/teaching/supervision'), label: 'Supervision' },
] as const;

export const serviceSubnav = [
  { href: withBase('/service'), label: 'Overview' },
  { href: withBase('/service/organisation'), label: 'Conference organisation' },
  { href: withBase('/service/presentations'), label: 'Presentations' },
  { href: withBase('/service/memberships'), label: 'Professional memberships' },
] as const;
