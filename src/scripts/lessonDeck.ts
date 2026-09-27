/** Shared navigation rules for HTML lessons. See docs/lesson-design.md. */
export function syncLessonNavigation(current: number, total: number) {
  document.querySelector('[data-overview]')?.setAttribute('aria-label', `Slide ${current + 1} of ${total}. Open slide overview`);
  document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach((button) => {
    button.disabled = button.dataset.nav === 'next' ? current === total - 1 : current === 0;
  });
  document.querySelectorAll<HTMLElement>('.overview-dialog li').forEach((item, index) => {
    const active = index === current;
    item.classList.toggle('is-current', active);
    const button = item.querySelector('button');
    if (active) button?.setAttribute('aria-current', 'step');
    else button?.removeAttribute('aria-current');
  });
}

export function bindLessonShortcuts(showSlide: (index: number) => void, getCurrent: () => number, total: number, overview: HTMLDialogElement | null) {
  const interactive = 'button, a, input, textarea, select, summary, [contenteditable], [draggable="true"], [role="button"], [role="listbox"], [data-exit-drop], video, iframe';
  const isInteractive = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest(interactive));
  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || isInteractive(event.target) || document.querySelector('dialog[open]')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); showSlide(getCurrent() + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); showSlide(getCurrent() - 1); }
    if (event.key === 'Home') { event.preventDefault(); showSlide(0); }
    if (event.key === 'End') { event.preventDefault(); showSlide(total - 1); }
    if (event.key.toLowerCase() === 'o') overview?.showModal();
    if (event.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  });
  let start: { x: number; y: number } | null = null;
  document.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    start = touch && !isInteractive(event.target) && !document.querySelector('dialog[open]') ? { x: touch.clientX, y: touch.clientY } : null;
  }, { passive: true });
  document.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(getCurrent() + (dx < 0 ? 1 : -1));
    start = null;
  }, { passive: true });
}
