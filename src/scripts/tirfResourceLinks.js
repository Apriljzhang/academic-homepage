// Keep references from replacing a workshop page containing the teacher's entries.
export function initTirfResourceLinks(root) {
 root.querySelectorAll('.tirf-deck a[href^="https://"]').forEach(link => {
  link.target = '_blank';
  link.rel = 'noopener';
 });
}
