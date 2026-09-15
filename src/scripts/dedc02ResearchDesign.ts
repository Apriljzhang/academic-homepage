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

document.querySelectorAll<HTMLElement>('[data-design-match]').forEach((activity) => {
  const tokens = Array.from(activity.querySelectorAll<HTMLButtonElement>('[data-design-token]'));
  const slots = Array.from(activity.querySelectorAll<HTMLElement>('[data-study-slot]'));
  const reset = activity.querySelector<HTMLButtonElement>('[data-design-reset]');
  const status = activity.querySelector<HTMLElement>('[data-design-status]');
  const chinese = activity.closest<HTMLElement>('[data-language="zh"]') !== null;
  let selectedDesign = '';

  const announceProgress = () => {
    const matched = slots.filter((slot) => slot.classList.contains('is-correct')).length;
    if (!status) return;
    status.textContent = matched === slots.length
      ? (chinese ? '六項研究全部配對正確；所有 PDF 已解鎖。' : 'All six studies are matched; every PDF is unlocked.')
      : (chinese ? `已配對 ${matched}／${slots.length} 項研究。` : `${matched} of ${slots.length} studies matched.`);
  };

  const selectToken = (token: HTMLButtonElement) => {
    if (token.disabled) return;
    const design = token.dataset.designToken || '';
    selectedDesign = selectedDesign === design ? '' : design;
    tokens.forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.designToken === selectedDesign)));
    if (status) {
      status.textContent = selectedDesign
        ? (chinese ? '已選擇設計；請在相應研究按「放置設計」。' : 'Design selected; use “Place design” on the matching study.')
        : (chinese ? '已取消選擇。' : 'Selection cleared.');
    }
  };

  const attemptMatch = (design: string, slot: HTMLElement) => {
    if (!design || slot.classList.contains('is-correct')) return;
    const token = tokens.find((item) => item.dataset.designToken === design);
    const drop = slot.querySelector<HTMLButtonElement>('[data-paper-drop]');
    const download = slot.querySelector<HTMLAnchorElement>('.paper-download');
    const correct = design === slot.dataset.answer;

    slots.forEach((item) => item.classList.remove('is-incorrect'));
    slots.forEach((item) => item.querySelector('[data-paper-drop]')?.removeAttribute('aria-invalid'));
    slot.classList.toggle('is-correct', correct);
    slot.classList.toggle('is-incorrect', !correct);

    if (!correct) {
      drop?.setAttribute('aria-invalid', 'true');
      if (status) status.textContent = chinese ? '這項配對不正確；重新閱讀研究問題及證據線索。' : 'That match is not correct. Re-read the question and evidence clues.';
      return;
    }

    const label = token?.textContent?.trim() || design;
    if (drop) {
      drop.dataset.defaultLabel ||= drop.textContent?.trim() || (chinese ? '放置設計' : 'Place design');
      drop.textContent = label;
      drop.disabled = true;
    }
    if (download) download.hidden = false;
    if (token) {
      token.disabled = true;
      token.setAttribute('aria-pressed', 'false');
    }
    selectedDesign = '';
    announceProgress();
  };

  tokens.forEach((token) => {
    token.addEventListener('click', () => selectToken(token));
    token.addEventListener('dragstart', (event) => {
      if (token.disabled || !event.dataTransfer) {
        event.preventDefault();
        return;
      }
      const design = token.dataset.designToken || '';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', design);
      token.classList.add('is-dragging');
    });
    token.addEventListener('dragend', () => token.classList.remove('is-dragging'));
  });

  slots.forEach((slot) => {
    const drop = slot.querySelector<HTMLButtonElement>('[data-paper-drop]');
    if (drop) drop.dataset.defaultLabel = drop.textContent?.trim() || (chinese ? '放置設計' : 'Place design');
    drop?.addEventListener('click', () => {
      if (!selectedDesign) {
        if (status) status.textContent = chinese ? '請先選擇上方的一種研究設計。' : 'Select a research design above first.';
        return;
      }
      attemptMatch(selectedDesign, slot);
    });
    slot.addEventListener('dragover', (event) => {
      if (slot.classList.contains('is-correct')) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
      drop?.classList.add('is-over');
    });
    slot.addEventListener('dragleave', (event) => {
      const nextTarget = event.relatedTarget;
      if (!(nextTarget instanceof Node) || !slot.contains(nextTarget)) drop?.classList.remove('is-over');
    });
    slot.addEventListener('drop', (event) => {
      event.preventDefault();
      drop?.classList.remove('is-over');
      attemptMatch(event.dataTransfer?.getData('text/plain') || '', slot);
    });
  });

  reset?.addEventListener('click', () => {
    selectedDesign = '';
    tokens.forEach((token) => {
      token.disabled = false;
      token.setAttribute('aria-pressed', 'false');
      token.classList.remove('is-dragging');
    });
    slots.forEach((slot) => {
      slot.classList.remove('is-correct', 'is-incorrect');
      const drop = slot.querySelector<HTMLButtonElement>('[data-paper-drop]');
      if (drop) {
        drop.disabled = false;
        drop.textContent = drop.dataset.defaultLabel || (chinese ? '放置設計' : 'Place design');
        drop.removeAttribute('aria-invalid');
      }
      const download = slot.querySelector<HTMLAnchorElement>('.paper-download');
      if (download) download.hidden = true;
    });
    announceProgress();
  });
});

document.querySelectorAll<HTMLElement>('[data-sampling-explorer]').forEach((explorer) => {
  const methods = Array.from(explorer.querySelectorAll<HTMLButtonElement>('[data-sampling-method]'));
  const panels = Array.from(explorer.querySelectorAll<HTMLElement>('[data-sampling-panel]'));
  const emptyStates = Array.from(explorer.querySelectorAll<HTMLElement>('[data-sampling-empty]'));

  methods.forEach((method) => {
    method.addEventListener('click', () => {
      const selected = method.dataset.samplingMethod || '';
      const wasSelected = method.getAttribute('aria-pressed') === 'true';

      methods.forEach((item) => item.setAttribute('aria-pressed', 'false'));
      panels.forEach((panel) => { panel.hidden = true; });

      if (wasSelected) {
        emptyStates.forEach((empty) => { empty.hidden = false; });
        return;
      }

      method.setAttribute('aria-pressed', 'true');
      panels.forEach((panel) => { panel.hidden = panel.dataset.samplingPanel !== selected; });
      emptyStates.forEach((empty) => { empty.hidden = true; });
    });
  });
});

document.querySelectorAll<HTMLElement>('[data-sample-size-explorer]').forEach((explorer) => {
  const routes = Array.from(explorer.querySelectorAll<HTMLButtonElement>('[data-sample-size-route]'));
  const panels = Array.from(explorer.querySelectorAll<HTMLElement>('[data-sample-size-panel]'));
  const empty = explorer.querySelector<HTMLElement>('[data-sample-size-empty]');

  routes.forEach((route) => {
    route.addEventListener('click', () => {
      const selected = route.dataset.sampleSizeRoute || '';
      routes.forEach((item) => item.setAttribute('aria-pressed', String(item === route)));
      panels.forEach((panel) => { panel.hidden = panel.dataset.sampleSizePanel !== selected; });
      if (empty) empty.hidden = true;
    });
  });
});

document.querySelectorAll<HTMLElement>('[data-validity-workbench]').forEach((workbench) => {
  const tabs = Array.from(workbench.querySelectorAll<HTMLButtonElement>('[data-validity-tab]'));
  const panels = Array.from(workbench.querySelectorAll<HTMLElement>('[data-validity-panel]'));

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.validityTab || '';
      tabs.forEach((item) => item.setAttribute('aria-pressed', String(item === tab)));
      panels.forEach((panel) => { panel.hidden = panel.dataset.validityPanel !== selected; });
    });
  });
});

document.querySelectorAll<HTMLElement>('[data-quality-explorer]').forEach((explorer) => {
  const terms = Array.from(explorer.querySelectorAll<HTMLButtonElement>('[data-quality-term]'));
  const panels = Array.from(explorer.querySelectorAll<HTMLElement>('[data-quality-panel]'));
  const empty = explorer.querySelector<HTMLElement>('[data-quality-empty]');
  const resets = Array.from(explorer.querySelectorAll<HTMLButtonElement>('[data-quality-reset]'));

  const closeSafeguards = (returnFocus = false) => {
    const activeTerm = terms.find((term) => term.getAttribute('aria-pressed') === 'true');
    terms.forEach((term) => {
      term.setAttribute('aria-pressed', 'false');
      term.setAttribute('aria-expanded', 'false');
    });
    panels.forEach((panel) => { panel.hidden = true; });
    if (empty) empty.hidden = false;
    if (returnFocus) activeTerm?.focus({ preventScroll: true });
  };

  terms.forEach((term) => {
    term.addEventListener('click', () => {
      const selected = term.dataset.qualityTerm || '';
      const wasOpen = term.getAttribute('aria-pressed') === 'true';
      if (wasOpen) {
        closeSafeguards();
        return;
      }
      terms.forEach((item) => {
        const active = item === term;
        item.setAttribute('aria-pressed', String(active));
        item.setAttribute('aria-expanded', String(active));
      });
      panels.forEach((panel) => { panel.hidden = panel.dataset.qualityPanel !== selected; });
      if (empty) empty.hidden = true;
    });
  });

  resets.forEach((reset) => {
    reset.addEventListener('click', () => closeSafeguards(true));
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
