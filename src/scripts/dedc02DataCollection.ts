const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
const currentLabel = document.querySelector<HTMLElement>('.slide-count span');
const totalLabel = document.querySelector<HTMLElement>('[data-slide-total]');
const progress = document.querySelector<HTMLElement>('.progress-track span');
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const overviewList = overview?.querySelector('ol');
const globalTranslate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
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

function showSlide(index: number) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  if (currentLabel) currentLabel.textContent = String(current + 1);
  if (progress) progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  overviewList?.querySelectorAll('li').forEach((item, itemIndex) => item.classList.toggle('is-current', itemIndex === current));
  history.replaceState(null, '', `#slide-${current + 1}`);
  syncGlobalTranslate();
}

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
    button.textContent = slide.dataset.title || `Slide ${index + 1}`;
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
  timerOutput.textContent = `${String(Math.floor(timerRemaining / 60)).padStart(2, '0')}:${String(timerRemaining % 60).padStart(2, '0')}`;
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

document.querySelectorAll<HTMLElement>('[data-question-clinic]').forEach((clinic) => {
  const question = clinic.querySelector<HTMLElement>('[data-clinic-question]');
  const lenses = Array.from(clinic.querySelectorAll<HTMLButtonElement>('[data-clinic-lens]'));
  const panels = Array.from(clinic.querySelectorAll<HTMLElement>('[data-clinic-panel]'));
  const reset = clinic.querySelector<HTMLButtonElement>('[data-clinic-reset]');
  lenses.forEach((lens) => {
    lens.addEventListener('click', () => {
      const selected = lens.dataset.clinicLens || '';
      lenses.forEach((item) => item.setAttribute('aria-pressed', String(item === lens)));
      panels.forEach((panel) => { panel.hidden = panel.dataset.clinicPanel !== selected; });
      question?.classList.add('is-being-examined');
    });
  });
  reset?.addEventListener('click', () => {
    lenses.forEach((lens) => lens.setAttribute('aria-pressed', 'false'));
    panels.forEach((panel) => { panel.hidden = true; });
    question?.classList.remove('is-being-examined');
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-guide-flip]').forEach((card) => {
  card.addEventListener('click', () => {
    const flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(flipped));
    card.querySelector<HTMLElement>('[data-guide-front]')?.setAttribute('aria-hidden', String(flipped));
    card.querySelector<HTMLElement>('[data-guide-back]')?.setAttribute('aria-hidden', String(!flipped));
  });
});

document.querySelectorAll<HTMLElement>('[data-qsort-activity]').forEach((activity) => {
  const cards = Array.from(activity.querySelectorAll<HTMLElement>('[data-qsort-card]'));
  const status = activity.querySelector<HTMLElement>('[data-qsort-status]');
  const chinese = activity.closest('[data-language="zh"]') !== null;

  cards.forEach((card) => {
    const choices = Array.from(card.querySelectorAll<HTMLButtonElement>('[data-qsort-choice]'));
    choices.forEach((choice) => choice.addEventListener('click', () => {
      card.dataset.choice = choice.dataset.qsortChoice;
      choices.forEach((button) => button.setAttribute('aria-pressed', String(button === choice)));
      card.classList.remove('is-correct', 'is-incorrect');
      const feedback = card.querySelector<HTMLElement>('[data-qsort-feedback]');
      if (feedback) feedback.hidden = true;
      if (status) status.textContent = chinese ? '選擇已更新；完成後再檢查。' : 'Selection updated. Check when ready.';
    }));
  });

  activity.querySelector<HTMLButtonElement>('[data-qsort-check]')?.addEventListener('click', () => {
    if (cards.some((card) => !card.dataset.choice)) {
      if (status) status.textContent = chinese ? '請先為每張卡片選擇類別。' : 'Choose a category for every card first.';
      return;
    }
    let correct = 0;
    cards.forEach((card) => {
      const matches = card.dataset.choice === card.dataset.answer;
      if (matches) correct += 1;
      card.classList.toggle('is-correct', matches);
      card.classList.toggle('is-incorrect', !matches);
      const feedback = card.querySelector<HTMLElement>('[data-qsort-feedback]');
      if (feedback) feedback.hidden = false;
    });
    if (status) status.textContent = chinese ? `${correct}／${cards.length} 項正確。檢視每張卡片的原因。` : `${correct} of ${cards.length} correct. Read the reason on each card.`;
  });

  activity.querySelector<HTMLButtonElement>('[data-qsort-reset]')?.addEventListener('click', () => {
    cards.forEach((card) => {
      delete card.dataset.choice;
      card.classList.remove('is-correct', 'is-incorrect');
      card.querySelectorAll<HTMLButtonElement>('[data-qsort-choice]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
      const feedback = card.querySelector<HTMLElement>('[data-qsort-feedback]');
      if (feedback) feedback.hidden = true;
    });
    if (status) status.textContent = chinese ? '先作出選擇。' : 'Make your choices first.';
  });
});

document.querySelectorAll<HTMLElement>('[data-qtype-picker]').forEach((picker) => {
  const options = Array.from(picker.querySelectorAll<HTMLButtonElement>('[data-qtype-option]'));
  const panels = Array.from(picker.querySelectorAll<HTMLElement>('[data-qtype-panel]'));
  options.forEach((option) => option.addEventListener('click', () => {
    const selected = option.getAttribute('aria-expanded') !== 'true';
    options.forEach((button) => button.setAttribute('aria-expanded', String(selected && button === option)));
    panels.forEach((panel) => { panel.hidden = !selected || panel.dataset.qtypePanel !== option.dataset.qtypeOption; });
  }));
});

document.querySelectorAll<HTMLDetailsElement>('.debug-card').forEach((card) => {
  card.querySelector<HTMLElement>('summary')?.addEventListener('click', (event) => {
    event.preventDefault();
    card.open = !card.open;
  });
});

document.querySelectorAll<HTMLTextAreaElement>('textarea[data-save]').forEach((field) => {
  const key = `dedc02-w5-collection-${field.dataset.save || ''}`;
  try { field.value = localStorage.getItem(key) || ''; } catch {}
  field.addEventListener('input', () => {
    try { localStorage.setItem(key, field.value); } catch {}
    document.querySelectorAll<HTMLTextAreaElement>(`textarea[data-save="${field.dataset.save || ''}"]`).forEach((peer) => {
      if (peer !== field) peer.value = field.value;
    });
    buildPdfResponseSummary();
  });
});

document.querySelectorAll<HTMLElement>('[data-evidence-card]').forEach((card) => {
  const select = card.querySelector<HTMLSelectElement>('[data-evidence-select]');
  const check = card.querySelector<HTMLButtonElement>('[data-evidence-check]');
  const status = card.querySelector<HTMLElement>('[data-evidence-status]');
  const reveal = card.querySelector<HTMLElement>('[data-evidence-reveal]');
  const matchId = card.dataset.matchId || '';
  const storageKey = `dedc02-w5-instrument-match-${matchId}`;

  const showResult = (value: string, announce = true) => {
    const correct = Boolean(value) && value === card.dataset.answer;
    if (reveal) reveal.hidden = !correct;
    card.classList.toggle('is-matched', correct);
    if (!status || !announce) return;
    const chinese = card.closest<HTMLElement>('[data-language="zh"]') !== null;
    if (!value) status.textContent = chinese ? '先選擇一種工具。' : 'Choose an instrument type first.';
    else if (correct) status.textContent = chinese ? '配對正確。現在把你的筆記與報告指南比較。' : 'Matched. Compare your notes with the reporting guide.';
    else status.textContent = chinese ? '再讀方法描述：這項工具實際如何生成或擷取資料？' : 'Read the Methods description again: how did this tool generate or extract data?';
  };

  try {
    const saved = localStorage.getItem(storageKey) || '';
    if (select && saved) {
      select.value = saved;
      showResult(saved, false);
    }
  } catch {}

  select?.addEventListener('change', () => {
    try { localStorage.setItem(storageKey, select.value); } catch {}
    document.querySelectorAll<HTMLElement>(`[data-evidence-card][data-match-id="${matchId}"]`).forEach((peerCard) => {
      const peerSelect = peerCard.querySelector<HTMLSelectElement>('[data-evidence-select]');
      const peerReveal = peerCard.querySelector<HTMLElement>('[data-evidence-reveal]');
      if (peerSelect && peerSelect !== select) peerSelect.value = select.value;
      if (peerReveal) peerReveal.hidden = true;
      peerCard.classList.remove('is-matched');
    });
    if (reveal) reveal.hidden = true;
    card.classList.remove('is-matched');
  });
  check?.addEventListener('click', () => showResult(select?.value || ''));
});

document.querySelectorAll<HTMLElement>('[data-audit-checklist]').forEach((checklist) => {
  const choices = Array.from(checklist.querySelectorAll<HTMLButtonElement>('[data-audit-choice]'));
  const status = checklist.querySelector<HTMLElement>('[data-audit-status]');
  choices.forEach((choice) => choice.addEventListener('click', () => {
    const selected = choice.getAttribute('aria-pressed') !== 'true';
    choice.setAttribute('aria-pressed', String(selected));
    const count = choices.filter((item) => item.getAttribute('aria-pressed') === 'true').length;
    if (status) {
      const chinese = checklist.closest<HTMLElement>('.slide')?.dataset.language === 'zh';
      status.textContent = chinese ? `已標示 ${count} 項。把未標示的項目變成同儕提問。` : `${count} items marked. Turn every unmarked item into a peer-review question.`;
    }
  }));
});

const pdfDialog = document.querySelector<HTMLDialogElement>('.pdf-dialog');
const pdfMessage = document.querySelector<HTMLTextAreaElement>('[data-pdf-message]');
const pdfMessagePrint = document.querySelector<HTMLElement>('[data-pdf-message-print]');
const pdfResponseSummary = document.querySelector<HTMLElement>('[data-pdf-response-summary]');

function buildPdfResponseSummary() {
  if (!pdfResponseSummary) return;
  pdfResponseSummary.replaceChildren();
  const seen = new Set<string>();
  document.querySelectorAll<HTMLTextAreaElement>('textarea[data-save]').forEach((field) => {
    const responseKey = field.dataset.save || '';
    const response = field.value.trim();
    if (!responseKey || !response || seen.has(responseKey)) return;
    seen.add(responseKey);
    const item = document.createElement('article');
    const heading = document.createElement('h2');
    const body = document.createElement('p');
    heading.textContent = field.dataset.responseLabel || responseKey;
    body.textContent = response;
    item.append(heading, body);
    pdfResponseSummary.append(item);
  });
  if (!pdfResponseSummary.childElementCount) {
    const empty = document.createElement('p');
    empty.textContent = 'No saved activity responses yet.';
    pdfResponseSummary.append(empty);
  }
}
buildPdfResponseSummary();
window.addEventListener('beforeprint', buildPdfResponseSummary);
document.querySelectorAll<HTMLElement>('[data-pdf-open]').forEach((button) => {
  button.addEventListener('click', () => pdfDialog?.showModal());
});
document.querySelector('[data-pdf-download]')?.addEventListener('click', () => {
  if (pdfMessagePrint) pdfMessagePrint.textContent = pdfMessage?.value.trim() || 'My data collection plan and activity responses.';
  buildPdfResponseSummary();
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
