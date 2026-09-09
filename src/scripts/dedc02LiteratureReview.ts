const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
const currentLabel = document.querySelector<HTMLElement>('.slide-count span');
const totalLabel = document.querySelector<HTMLElement>('[data-slide-total]');
const progress = document.querySelector<HTMLElement>('.progress-track span');
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const overviewList = overview?.querySelector('ol');
const globalTranslate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
const delayedDebugSlide = document.querySelector<HTMLElement>('[data-delayed-debug-reveal]');
const delayedDebugCards = Array.from(delayedDebugSlide?.querySelectorAll<HTMLDetailsElement>('.debug-card') || []);
const delayedDebugRevealMs = 2 * 60 * 1000;
let delayedDebugTimer = 0;
let current = 0;

if (totalLabel) totalLabel.textContent = String(slides.length);
slides.forEach((slide) => { slide.dataset.language = 'en'; });

function isChinese(slide = slides[current]) {
  return slide?.dataset.language === 'zh';
}

function syncGlobalTranslate() {
  if (!globalTranslate) return;
  const chinese = isChinese();
  globalTranslate.textContent = chinese ? 'English' : '中文';
  globalTranslate.setAttribute('aria-pressed', String(chinese));
}

function resetDelayedDebugReveal() {
  window.clearTimeout(delayedDebugTimer);
  delayedDebugTimer = 0;
  if (!delayedDebugSlide) return;
  delayedDebugSlide.dataset.explanationsReady = 'false';
  delayedDebugCards.forEach((card) => {
    card.open = false;
    card.querySelector('summary')?.setAttribute('aria-disabled', 'true');
  });
}

function revealDelayedDebugExplanations() {
  if (!delayedDebugSlide?.classList.contains('is-active')) return;
  delayedDebugSlide.dataset.explanationsReady = 'true';
  delayedDebugCards.forEach((card) => {
    card.querySelector('summary')?.setAttribute('aria-disabled', 'false');
    card.open = true;
  });
  delayedDebugTimer = 0;
}

function syncDelayedDebugReveal() {
  resetDelayedDebugReveal();
  if (!delayedDebugSlide?.classList.contains('is-active')) return;
  delayedDebugTimer = window.setTimeout(revealDelayedDebugExplanations, delayedDebugRevealMs);
}

function showSlide(index: number) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  if (currentLabel) currentLabel.textContent = String(current + 1);
  if (progress) progress.style.width = String(((current + 1) / slides.length) * 100) + '%';
  overviewList?.querySelectorAll('li').forEach((item, itemIndex) => item.classList.toggle('is-current', itemIndex === current));
  history.replaceState(null, '', '#slide-' + String(current + 1));
  syncGlobalTranslate();
  syncDelayedDebugReveal();
}

delayedDebugCards.forEach((card) => {
  card.querySelector('summary')?.addEventListener('click', (event) => {
    if (delayedDebugSlide?.dataset.explanationsReady !== 'true') event.preventDefault();
  });
  card.addEventListener('toggle', () => {
    if (delayedDebugSlide?.dataset.explanationsReady !== 'true' && card.open) card.open = false;
  });
});

document.querySelectorAll<HTMLElement>('[data-nav]').forEach((button) => {
  button.addEventListener('click', () => showSlide(current + (button.dataset.nav === 'next' ? 1 : -1)));
});

globalTranslate?.addEventListener('click', () => {
  const slide = slides[current];
  if (!slide) return;
  const toChinese = !isChinese(slide);
  slide.dataset.language = toChinese ? 'zh' : 'en';
  slide.querySelectorAll<HTMLElement>('[data-language="en"]').forEach((panel) => { panel.hidden = toChinese; });
  slide.querySelectorAll<HTMLElement>('[data-language="zh"]').forEach((panel) => { panel.hidden = !toChinese; });
  syncGlobalTranslate();
});

if (overviewList) {
  slides.forEach((slide, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = slide.dataset.title || 'Slide ' + String(index + 1);
    button.addEventListener('click', () => { showSlide(index); overview?.close(); });
    item.append(button);
    overviewList.append(item);
  });
}

document.querySelector('[data-overview]')?.addEventListener('click', () => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click', () => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());

const timerInput = document.querySelector<HTMLInputElement>('[data-timer-minutes]');
const timerStart = document.querySelector<HTMLButtonElement>('[data-timer-start]');
const timerReset = document.querySelector<HTMLButtonElement>('[data-timer-reset]');
const timerOutput = document.querySelector<HTMLOutputElement>('[data-timer-output]');
let timerRemaining = 0;
let timerInterval = 0;

function paintTimer() {
  if (!timerOutput) return;
  timerOutput.hidden = timerRemaining <= 0;
  timerOutput.textContent = String(Math.floor(timerRemaining / 60)).padStart(2, '0') + ':' + String(timerRemaining % 60).padStart(2, '0');
}

timerStart?.addEventListener('click', () => {
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = 0;
    timerStart.textContent = 'Start';
    return;
  }
  if (timerRemaining <= 0) {
    const minutes = Number(timerInput?.value || 0);
    if (minutes <= 0) { timerInput?.focus(); return; }
    timerRemaining = Math.round(minutes * 60);
    paintTimer();
  }
  timerStart.textContent = 'Pause';
  timerInterval = window.setInterval(() => {
    timerRemaining = Math.max(0, timerRemaining - 1);
    paintTimer();
    if (!timerRemaining) {
      window.clearInterval(timerInterval);
      timerInterval = 0;
      timerStart.textContent = 'Start';
    }
  }, 1000);
});

timerReset?.addEventListener('click', () => {
  window.clearInterval(timerInterval);
  timerInterval = 0;
  timerRemaining = 0;
  if (timerStart) timerStart.textContent = 'Start';
  if (timerInput) timerInput.value = '';
  paintTimer();
});

document.querySelectorAll<HTMLTextAreaElement>('textarea[data-save]').forEach((field) => {
  const key = 'dedc02-w3-lr-' + String(field.dataset.save);
  try { field.value = localStorage.getItem(key) || ''; } catch {}
  field.addEventListener('input', () => {
    try { localStorage.setItem(key, field.value); } catch {}
  });
});

document.querySelectorAll<HTMLElement>('[data-check-activity]').forEach((activity) => {
  const check = activity.querySelector<HTMLButtonElement>('[data-check]');
  const clear = activity.querySelector<HTMLButtonElement>('[data-clear]');
  const status = activity.querySelector<HTMLElement>('[data-status]');
  const selects = Array.from(activity.querySelectorAll<HTMLSelectElement>('select[data-answer]'));

  check?.addEventListener('click', () => {
    if (selects.some((select) => !select.value)) {
      if (status) status.textContent = isChinese() ? '請先完成所有選項。' : 'Complete every choice first.';
      return;
    }
    let correct = 0;
    selects.forEach((select) => {
      const row = select.closest<HTMLElement>('.sort-row');
      const match = select.value === select.dataset.answer;
      row?.classList.toggle('is-correct', match);
      row?.classList.toggle('is-incorrect', !match);
      if (match) correct += 1;
    });
    if (status) {
      status.textContent = correct === selects.length
        ? (isChinese() ? '全部正確。請解釋每個判斷的理由。' : 'All correct. Now explain the reason for each decision.')
        : (isChinese() ? '答對 ' + String(correct) + ' 項，共 ' + String(selects.length) + ' 項。請檢查標示的選項。' : String(correct) + ' of ' + String(selects.length) + ' correct. Recheck the marked choices.');
    }
  });

  clear?.addEventListener('click', () => {
    selects.forEach((select) => {
      select.value = '';
      const row = select.closest<HTMLElement>('.sort-row');
      row?.classList.remove('is-correct', 'is-incorrect');
    });
    if (status) status.textContent = '';
  });
});

document.querySelectorAll<HTMLElement>('[data-choice-group]').forEach((group) => {
  group.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      group.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
    });
  });
});

document.querySelectorAll<HTMLElement>('[data-toulmin-match]').forEach((activity) => {
  const bank = activity.querySelector<HTMLElement>('[data-sentence-bank]');
  const cards = Array.from(activity.querySelectorAll<HTMLButtonElement>('.exit-sentence'));
  const zones = Array.from(activity.querySelectorAll<HTMLElement>('.exit-drop'));
  const reveal = activity.querySelector<HTMLButtonElement>('[data-reveal-names]');
  const reset = activity.querySelector<HTMLButtonElement>('[data-reset-match]');
  const status = activity.querySelector<HTMLElement>('[data-match-status]');
  const reviewVideo = activity.querySelector<HTMLElement>('[data-review-video]');
  const chinese = activity.closest<HTMLElement>('[data-language="zh"]') !== null;
  let selected: HTMLButtonElement | null = null;

  const clearSelection = () => {
    selected = null;
    cards.forEach((card) => {
      card.classList.remove('is-selected');
      card.setAttribute('aria-pressed', 'false');
    });
  };

  const clearFeedback = () => {
    zones.forEach((zone) => {
      zone.classList.remove('is-correct', 'is-incorrect');
      const role = zone.querySelector<HTMLElement>('.exit-role');
      if (role) role.hidden = true;
    });
    if (reviewVideo) reviewVideo.hidden = true;
    if (status) status.textContent = '';
  };

  const placeCard = (card: HTMLButtonElement, zone: HTMLElement) => {
    const previousZone = card.closest<HTMLElement>('.exit-drop');
    const occupyingCard = zone.querySelector<HTMLButtonElement>('.exit-sentence');
    if (occupyingCard && occupyingCard !== card) bank?.append(occupyingCard);
    zone.append(card);
    zone.querySelector<HTMLElement>('.exit-placeholder')?.setAttribute('hidden', '');
    if (previousZone && previousZone !== zone && !previousZone.querySelector('.exit-sentence')) {
      previousZone.querySelector<HTMLElement>('.exit-placeholder')?.removeAttribute('hidden');
    }
    clearSelection();
    clearFeedback();
  };

  cards.forEach((card) => {
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', (event) => {
      event.stopPropagation();
      const alreadySelected = selected === card;
      clearSelection();
      if (!alreadySelected) {
        selected = card;
        card.classList.add('is-selected');
        card.setAttribute('aria-pressed', 'true');
      }
    });
    card.addEventListener('dragstart', (event) => {
      event.dataTransfer?.setData('text/plain', card.dataset.cardId || '');
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    });
  });

  zones.forEach((zone) => {
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('is-dragover');
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('is-dragover'));
    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('is-dragover');
      const cardId = event.dataTransfer?.getData('text/plain');
      const card = cards.find((candidate) => candidate.dataset.cardId === cardId);
      if (card) placeCard(card, zone);
    });
    zone.addEventListener('click', () => {
      if (selected) placeCard(selected, zone);
    });
    zone.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && selected) {
        event.preventDefault();
        placeCard(selected, zone);
      }
    });
  });

  reveal?.addEventListener('click', () => {
    clearSelection();
    let correct = 0;
    let placed = 0;
    zones.forEach((zone) => {
      const role = zone.querySelector<HTMLElement>('.exit-role');
      if (role) role.hidden = false;
      const card = zone.querySelector<HTMLButtonElement>('.exit-sentence');
      if (!card) return;
      placed += 1;
      const match = card.dataset.element === zone.dataset.slot;
      zone.classList.toggle('is-correct', match);
      zone.classList.toggle('is-incorrect', !match);
      if (match) correct += 1;
    });
    if (status) {
      const fullyCorrect = placed === zones.length && correct === zones.length;
      if (reviewVideo) reviewVideo.hidden = fullyCorrect;
      status.textContent = fullyCorrect
        ? (chinese ? '六句全部配對正確，元素名稱已顯示。' : 'All six correctly matched. Element names revealed.')
        : (chinese ? `答對 ${correct} 句，共六句。請檢查標示的方格；下方提供複習影片。` : `${correct} of six correctly matched. Recheck the marked boxes; a review video is available below.`);
    }
  });

  reset?.addEventListener('click', () => {
    clearSelection();
    clearFeedback();
    cards
      .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order))
      .forEach((card) => bank?.append(card));
    zones.forEach((zone) => zone.querySelector<HTMLElement>('.exit-placeholder')?.removeAttribute('hidden'));
  });
});

const pdfDialog = document.querySelector<HTMLDialogElement>('.pdf-dialog');
const pdfMessage = document.querySelector<HTMLTextAreaElement>('[data-pdf-message]');
const pdfMessagePrint = document.querySelector<HTMLElement>('[data-pdf-message-print]');
document.querySelector('[data-pdf-open]')?.addEventListener('click', () => pdfDialog?.showModal());
document.querySelector('[data-pdf-download]')?.addEventListener('click', () => {
  if (pdfMessagePrint) pdfMessagePrint.textContent = pdfMessage?.value.trim() || 'My literature review notes and activity responses.';
  pdfDialog?.close();
  window.print();
});

document.addEventListener('keydown', (event) => {
  if (event.defaultPrevented || event.target instanceof HTMLButtonElement || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); showSlide(current + 1); }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); showSlide(current - 1); }
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
  if (event.key.toLowerCase() === 'o') overview?.showModal();
  if (event.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
});

let touchX = 0;
document.addEventListener('touchstart', (event) => { touchX = event.changedTouches[0]?.clientX || 0; }, { passive: true });
document.addEventListener('touchend', (event) => {
  const dx = (event.changedTouches[0]?.clientX || 0) - touchX;
  if (Math.abs(dx) > 70) showSlide(current + (dx < 0 ? 1 : -1));
}, { passive: true });

const initialHash = Number(location.hash.replace('#slide-', ''));
showSlide(Number.isFinite(initialHash) && initialHash > 0 ? initialHash - 1 : 0);
