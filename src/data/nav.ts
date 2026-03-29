import { withBase } from '../utils/paths';

export const navItems = [
  { href: withBase('/'), label: 'Home' },
  { href: withBase('/about'), label: 'About' },
  { href: withBase('/research'), label: 'Research' },
  { href: withBase('/teaching'), label: 'Teaching' },
  { href: withBase('/service'), label: 'Service' },
] as const;
