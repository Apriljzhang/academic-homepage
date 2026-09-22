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
  document.querySelectorAll<HTMLElement>('[data-guide-prompt]').forEach((prompt) => {
    const item = prompt.dataset.guidePrompt || '';
    const selected = prompt.closest<HTMLElement>('[data-guide-explorer]')?.dataset.selectedGuide || '';
    prompt.hidden = !selected || item !== selected || prompt.closest<HTMLElement>('[data-language]')?.dataset.language !== slide.dataset.language;
  });
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

document.querySelectorAll<HTMLElement>('[data-guide-explorer]').forEach((explorer) => {
  const buttons = Array.from(explorer.querySelectorAll<HTMLButtonElement>('[data-guide-item]'));
  const prompts = Array.from(explorer.querySelectorAll<HTMLElement>('[data-guide-prompt]'));
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.guideItem || '';
      const wasSelected = explorer.dataset.selectedGuide === selected;
      explorer.dataset.selectedGuide = wasSelected ? '' : selected;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(!wasSelected && item === button)));
      prompts.forEach((prompt) => {
        const matchesItem = prompt.dataset.guidePrompt === selected;
        const matchesLanguage = prompt.closest<HTMLElement>('[data-language]')?.dataset.language === explorer.closest<HTMLElement>('.slide')?.dataset.language;
        prompt.hidden = wasSelected || !matchesItem || !matchesLanguage;
      });
    });
  });
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

document.querySelectorAll<HTMLElement>('[data-procedure-builder]').forEach((builder) => {
  const cards = Array.from(builder.querySelectorAll<HTMLButtonElement>('[data-procedure-card]'));
  const timeline = builder.querySelector<HTMLElement>('[data-procedure-timeline]');
  const reset = builder.querySelector<HTMLButtonElement>('[data-procedure-reset]');
  const status = builder.querySelector<HTMLElement>('[data-procedure-status]');
  const update = () => {
    const chosen = cards.filter((card) => card.getAttribute('aria-pressed') === 'true');
    if (timeline) {
      timeline.replaceChildren(...chosen.map((card) => {
        const item = document.createElement('span');
        item.textContent = card.textContent?.trim() || '';
        return item;
      }));
    }
    if (status) {
      const chinese = builder.closest<HTMLElement>('.slide')?.dataset.language === 'zh';
      status.textContent = chosen.length
        ? (chinese ? `已選擇 ${chosen.length} 個需要說明的程序決策。現在討論它們的先後與理由。` : `${chosen.length} procedure decisions selected. Now discuss their order and rationale.`)
        : (chinese ? '選擇你認為研究者必須說明的程序決策。' : 'Select the procedure decisions a researcher must make visible.');
    }
  };
  cards.forEach((card) => card.addEventListener('click', () => {
    card.setAttribute('aria-pressed', String(card.getAttribute('aria-pressed') !== 'true'));
    update();
  }));
  reset?.addEventListener('click', () => {
    cards.forEach((card) => card.setAttribute('aria-pressed', 'false'));
    update();
  });
  update();
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
  });
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
