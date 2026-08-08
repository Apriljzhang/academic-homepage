import { withBase } from '../utils/paths';

export const researchSubnav = [
  { href: withBase('/research'), label: 'Overview' },
  { href: withBase('/research/themes'), label: 'Work in progress' },
  { href: withBase('/research/publications'), label: 'Publications' },
  { href: withBase('/research/funding'), label: 'Funded projects' },
] as const;

export const teachingSubnav = [
  { href: withBase('/teaching'), label: 'Overview' },
  { href: withBase('/teaching/approach'), label: 'Approach & experience' },
  { href: withBase('/teaching/supervision'), label: 'Supervision' },
  { href: withBase('/teaching/training'), label: 'Training' },
] as const;

export const serviceSubnav = [
  { href: withBase('/service'), label: 'Overview' },
  { href: withBase('/service/organisation'), label: 'Conference Organiser' },
  { href: withBase('/service/journal-editor'), label: 'Journal editor' },
  { href: withBase('/service/april'), label: 'APRIL skill' },
  { href: withBase('/service/presentations'), label: 'Presentations' },
] as const;
