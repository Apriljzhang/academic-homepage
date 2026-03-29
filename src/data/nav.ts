import { withBase } from '../utils/paths';

export const navItems = [
  { href: withBase('/'), label: 'Home' },
  { href: withBase('/about'), label: 'About' },
  { href: withBase('/publications'), label: 'Publications' },
  { href: withBase('/grants'), label: 'Grants' },
  { href: withBase('/talks'), label: 'Talks' },
] as const;
