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
  if (progress) progress.style.width = String(((current + 1) / slides.length) * 100) + '%';
  overviewList?.querySelectorAll('li').forEach((item, itemIndex) => item.classList.toggle('is-current', itemIndex === current));
  history.replaceState(null, '', '#slide-' + String(current + 1));
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
  const key = 'dedc02-w4-design-' + String(field.dataset.save);
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
  const chinese = activity.closest<HTMLElement>('[data-language="zh"]') !== null;

  check?.addEventListener('click', () => {
    if (selects.some((select) => !select.value)) {
      if (status) status.textContent = chinese ? '請先完成所有配對。' : 'Complete every match first.';
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
        ? (chinese ? '全部正確。現在解釋每個選擇的理由。' : 'All correct. Now explain the rationale for each choice.')
        : (chinese ? `答對 ${correct} 項，共 ${selects.length} 項。請重新檢查標示的選項。` : `${correct} of ${selects.length} correct. Recheck the marked choices.`);
    }
  });

  clear?.addEventListener('click', () => {
    selects.forEach((select) => {
      select.value = '';
      select.closest<HTMLElement>('.sort-row')?.classList.remove('is-correct', 'is-incorrect');
    });
    if (status) status.textContent = '';
  });
});

document.querySelectorAll<HTMLDetailsElement>('.debug-card').forEach((card) => {
  card.querySelector<HTMLElement>('summary')?.addEventListener('click', (event) => {
    event.preventDefault();
    card.open = !card.open;
  });
});

const pdfDialog = document.querySelector<HTMLDialogElement>('.pdf-dialog');
const pdfMessage = document.querySelector<HTMLTextAreaElement>('[data-pdf-message]');
const pdfMessagePrint = document.querySelector<HTMLElement>('[data-pdf-message-print]');
document.querySelector('[data-pdf-open]')?.addEventListener('click', () => pdfDialog?.showModal());
document.querySelector('[data-pdf-download]')?.addEventListener('click', () => {
  if (pdfMessagePrint) pdfMessagePrint.textContent = pdfMessage?.value.trim() || 'My research design and alignment notes.';
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
