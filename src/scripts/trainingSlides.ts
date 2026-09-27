const deck = document.querySelector<HTMLElement>('[data-training-deck]');

if (deck) {
  const slides = Array.from(deck.querySelectorAll<HTMLElement>('.presentation-slide'));
  const previous = deck.querySelector<HTMLButtonElement>('[data-deck-prev]');
  const next = deck.querySelector<HTMLButtonElement>('[data-deck-next]');
  const currentLabel = deck.querySelector<HTMLElement>('[data-deck-current]');
  const progress = deck.querySelector<HTMLElement>('[data-deck-progress]');
  const languageButton = deck.querySelector<HTMLButtonElement>('[data-deck-language]');
  const overview = deck.querySelector<HTMLDialogElement>('.presentation-overview');
  const fullscreenButton = deck.querySelector<HTMLButtonElement>('[data-deck-fullscreen]');
  let current = 0;
  let language: 'en' | 'zh' = 'en';

  function showSlide(index: number, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
      if (active) slide.scrollTop = 0;
    });
    if (previous) previous.disabled = current === 0;
    if (next) next.disabled = current === slides.length - 1;
    if (currentLabel) currentLabel.textContent = String(current + 1);
    if (progress) progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    deck?.querySelectorAll<HTMLButtonElement>('[data-deck-jump]').forEach((button) => {
      if (Number(button.dataset.deckJump) === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    if (updateHash) history.replaceState(null, '', `#slide-${current + 1}`);
  }

  function readHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    showSlide(match ? Number(match[1]) - 1 : 0, false);
  }

  previous?.addEventListener('click', () => showSlide(current - 1));
  next?.addEventListener('click', () => showSlide(current + 1));
  languageButton?.addEventListener('click', () => {
    language = language === 'en' ? 'zh' : 'en';
    deck.querySelectorAll<HTMLElement>('[data-deck-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.deckPanel !== language;
    });
    document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en-GB';
    languageButton.textContent = language === 'zh' ? 'English' : '中文';
    languageButton.setAttribute('aria-pressed', String(language === 'zh'));
  });
  deck.querySelector('[data-deck-overview]')?.addEventListener('click', () => overview?.showModal());
  deck.querySelector('[data-deck-close]')?.addEventListener('click', () => overview?.close());
  deck.querySelectorAll<HTMLButtonElement>('[data-deck-jump]').forEach((button) => {
    button.addEventListener('click', () => {
      showSlide(Number(button.dataset.deckJump));
      overview?.close();
    });
  });
  deck.querySelector('[data-deck-print]')?.addEventListener('click', () => window.print());
  let printedDetails: HTMLDetailsElement[] = [];
  window.addEventListener('beforeprint', () => {
    printedDetails = Array.from(deck.querySelectorAll<HTMLDetailsElement>('details:not([open])'));
    printedDetails.forEach((detail) => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => {
    printedDetails.forEach((detail) => { detail.open = false; });
    printedDetails = [];
  });
  fullscreenButton?.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { /* Fullscreen can be unavailable in an embedded browser. */ }
  });
  document.addEventListener('fullscreenchange', () => {
    if (fullscreenButton) fullscreenButton.textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen';
  });
  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    if (overview?.open || target?.closest('input, textarea, select, [contenteditable]')) return;
    if (event.key === ' ' && target?.closest('button, summary, a')) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault(); showSlide(current + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault(); showSlide(current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault(); showSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault(); showSlide(slides.length - 1);
    } else if (event.key.toLowerCase() === 'o') {
      overview?.showModal();
    }
  });
  let touchStart: { x: number; y: number } | undefined;
  deck.querySelector('.presentation-stage')?.addEventListener('touchstart', (event) => {
    const touch = (event as TouchEvent).touches[0];
    if (!(event.target as HTMLElement).closest('a, button, summary')) touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  deck.querySelector('.presentation-stage')?.addEventListener('touchend', (event) => {
    const touch = (event as TouchEvent).changedTouches[0];
    if (touchStart) {
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(current + (dx < 0 ? 1 : -1));
    }
    touchStart = undefined;
  }, { passive: true });
  window.addEventListener('hashchange', readHash);
  readHash();
}
