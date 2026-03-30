import { withBase } from '../utils/paths';

export const navItems = [
  { href: withBase('/'), label: 'Home' },
  { href: withBase('/research'), label: 'Research' },
  { href: withBase('/teaching'), label: 'Teaching' },
  { href: withBase('/service'), label: 'Service' },
  { href: withBase('/blog'), label: 'Blog' },
  { href: withBase('/visits'), label: 'Hello, World' },
] as const;
