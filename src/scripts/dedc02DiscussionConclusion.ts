import { bindLessonShortcuts, syncLessonNavigation } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
import legacyActivities from '../data/dedc02DiscussionLegacy.json';

const slides = Array.from(document.querySelectorAll<HTMLElement>('.dc-deck .slide'));
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const translate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
let current = 0;
type QuizState = { choice: string | null; checked: boolean };
type SavedState = { responses: Record<string, string>; quizzes: Record<string, QuizState>; review: Record<string, boolean> };
const storageKey = 'dedc02-discussion-conclusion-v1';
const state: SavedState = { responses: {}, quizzes: {}, review: {} };
let storageAvailable = true;
try {
  const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (saved && typeof saved === 'object') {
    const data = saved as Partial<SavedState>;
    for (const [key, value] of Object.entries(data.responses || {})) if (typeof value === 'string') state.responses[key] = value;
    for (const [key, value] of Object.entries(data.quizzes || {})) if (value && (typeof value.choice === 'string' || value.choice === null)) state.quizzes[key] = { choice: value.choice, checked: value.checked === true };
    for (const [key, value] of Object.entries(data.review || {})) if (typeof value === 'boolean') state.review[key] = value;
  }
} catch { storageAvailable = false; }

function language() { return slides[current]?.dataset.language === 'zh' ? 'zh' : 'en'; }
function updateSaveStatus(saved = false) {
  document.querySelectorAll<HTMLElement>('[data-save-status]').forEach(node => {
    const zh = Boolean(node.closest('[data-language="zh"]'));
    node.textContent = !storageAvailable
      ? zh ? '此瀏覽器無法保存回應；請在離開前下載。' : 'This browser cannot save responses. Download them before leaving.'
      : saved ? zh ? '已保存在此瀏覽器。' : 'Saved in this browser.'
        : zh ? '輸入會保存在此瀏覽器；切換語言會保留原文。' : 'Entries stay in this browser. Switching language keeps your original wording.';
  });
}
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); storageAvailable = true; }
  catch { storageAvailable = false; }
  updateSaveStatus(true);
}
function syncLanguage() {
  const slide = slides[current];
  if (!slide || !translate) return;
  const zh = slide.dataset.language === 'zh';
  translate.textContent = zh ? 'English' : '中文';
  translate.setAttribute('aria-pressed', String(zh));
  const part = slide.querySelector<HTMLElement>('.eyebrow');
  if (part) part.textContent = (zh ? part.dataset.partZh : part.dataset.partEn) || '';
}
function showSlide(index: number, updateHash = true) {
  current = Math.max(0, Math.min(slides.length - 1, Number.isFinite(index) ? index : 0));
  slides.forEach((slide, i) => {
    const active = i === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slide.inert = !active;
    if (active) slide.scrollTop = 0;
  });
  const currentLabel = document.querySelector('[data-current-slide]');
  const progress = document.querySelector<HTMLElement>('.progress-track span');
  if (currentLabel) currentLabel.textContent = String(current + 1);
  if (progress) progress.style.width = `${(current + 1) / slides.length * 100}%`;
  syncLessonNavigation(current, slides.length);
  syncLanguage();
  if (updateHash) history.replaceState(null, '', `#slide-${current + 1}`);
}
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(button => button.addEventListener('click', () => showSlide(current + (button.dataset.nav === 'next' ? 1 : -1))));
translate?.addEventListener('click', () => {
  const slide = slides[current];
  if (!slide) return;
  const zh = slide.dataset.language !== 'zh';
  slide.dataset.language = zh ? 'zh' : 'en';
  slide.querySelectorAll<HTMLElement>('[data-language="en"]').forEach(node => { node.hidden = zh; });
  slide.querySelectorAll<HTMLElement>('[data-language="zh"]').forEach(node => { node.hidden = !zh; });
  syncLanguage();
});
const list = overview?.querySelector('ol');
slides.forEach((slide, i) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = `${slide.dataset.title} / ${slide.dataset.titleZh}`;
  button.addEventListener('click', () => { showSlide(i); overview?.close(); });
  item.append(button); list?.append(item);
});
const total = document.querySelector('[data-slide-total]');
if (total) total.textContent = String(slides.length);
document.querySelector('[data-overview]')?.addEventListener('click', () => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click', () => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click', () => {
  const action = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  void action.catch(() => {});
});
const openedForPrint = new Set<HTMLDetailsElement>();
window.addEventListener('beforeprint', () => {
  document.querySelectorAll<HTMLDetailsElement>('.published-example:not([open])').forEach(example => {
    openedForPrint.add(example);
    example.open = true;
  });
});
window.addEventListener('afterprint', () => {
  openedForPrint.forEach(example => { example.open = false; });
  openedForPrint.clear();
});
document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
bindLessonShortcuts(showSlide, () => current, slides.length, overview);
initLessonTimer();
const hashSlide = () => Number(location.hash.match(/^#slide-(\d+)$/)?.[1] || 1) - 1;
window.addEventListener('hashchange', () => showSlide(hashSlide(), false));

function renderQuiz(id: string) {
  const value = state.quizzes[id] || { choice: null, checked: false };
  document.querySelectorAll<HTMLElement>('[data-quiz]').forEach(root => {
    if (root.dataset.quiz !== id) return;
    const zh = root.dataset.quizLanguage === 'zh';
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-choice]'));
    const selected = buttons.find(button => button.dataset.choice === value.choice);
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
    map.style.setProperty('--selected-row', String(buttons.indexOf(selected) + 2));
    const output = root.querySelector<HTMLElement>('[data-feedback]');
    if (!output) return;
    output.classList.toggle('needs-review', Boolean(value.checked && selected?.dataset.fits !== 'true'));
    if (value.checked && selected) {
      const prefix = selected.dataset.fits === 'true' ? zh ? '有理據。' : 'Supported reasoning. ' : zh ? '需要修正。' : 'Reconsider this claim. ';
      output.textContent = prefix + selected.querySelector('[data-explanation]')?.textContent;
    } else output.textContent = value.choice === null
      ? zh ? '先作判斷並說明理由，再查看回應。' : 'Make a judgement and explain why before checking.'
      : zh ? '已選擇。說明理由，再檢視回應。' : 'Selected. Explain your reasoning, then check.';
  });
}
document.querySelectorAll<HTMLElement>('[data-quiz]').forEach(root => {
  const id = root.dataset.quiz!;
  renderQuiz(id);
  root.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach(button => button.addEventListener('click', () => {
    state.quizzes[id] = { choice: button.dataset.choice || '0', checked: false }; renderQuiz(id); persist();
  }));
  root.querySelector('[data-check]')?.addEventListener('click', () => {
    if (state.quizzes[id]?.choice == null) {
      const feedback = root.querySelector('[data-feedback]');
      if (feedback) feedback.textContent = root.dataset.quizLanguage === 'zh' ? '請先選擇一項，再檢視理由。' : 'Choose an option before examining the reasoning.';
      return;
    }
    state.quizzes[id].checked = true; renderQuiz(id); persist();
  });
  root.querySelector('[data-retry]')?.addEventListener('click', () => { state.quizzes[id] = { choice: null, checked: false }; renderQuiz(id); persist(); });
});

document.querySelectorAll<HTMLTextAreaElement>('[data-response]').forEach(field => {
  const key = field.dataset.response!;
  field.value = state.responses[key] || '';
  field.addEventListener('input', () => {
    state.responses[key] = field.value;
    document.querySelectorAll<HTMLTextAreaElement>('[data-response]').forEach(peer => { if (peer !== field && peer.dataset.response === key) peer.value = field.value; });
    persist();
  });
});
document.querySelectorAll<HTMLInputElement>('[data-review]').forEach(input => {
  const key = input.dataset.review!;
  input.checked = state.review[key] === true;
  input.addEventListener('change', () => {
    state.review[key] = input.checked;
    document.querySelectorAll<HTMLInputElement>('[data-review]').forEach(peer => { if (peer.dataset.review === key) peer.checked = input.checked; });
    persist();
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-annotation]').forEach(button => button.addEventListener('click', () => {
  const root = button.closest('.annotation-example');
  const key = button.getAttribute('aria-pressed') === 'true' ? 'clear' : button.dataset.annotation;
  root?.querySelectorAll<HTMLButtonElement>('[data-annotation]').forEach(peer => peer.setAttribute('aria-pressed', String(peer.dataset.annotation === key)));
  root?.querySelectorAll<HTMLElement>('[data-move]').forEach(row => row.classList.toggle('highlighted', Boolean(key && key !== 'clear' && row.dataset.move?.split(' ').includes(key))));
  const note = root?.querySelector<HTMLElement>('[data-annotation-note]');
  const selected = Array.from(root?.querySelectorAll<HTMLButtonElement>('[data-annotation]') || []).find(peer => peer.dataset.annotation === key);
  if (note) note.textContent = selected?.dataset.annotationHelp || '';
}));

document.querySelectorAll('[data-export]').forEach(button => button.addEventListener('click', () => {
  const lang = language();
  const lines = ['# DEDC02 — Discussion and Conclusion', '', lang === 'zh' ? '先前版本保存在此瀏覽器的課堂回應。' : 'Lesson responses saved in this browser by an earlier version.', ''];
  const seen = new Set<string>();
  document.querySelectorAll<HTMLTextAreaElement>(`.slide-inner > [data-language="${lang}"] [data-response]`).forEach(field => {
    const key = field.dataset.response!;
    if (seen.has(key)) return;
    seen.add(key);
    lines.push(`## ${field.dataset.label}`, '', state.responses[key] || (lang === 'zh' ? '［未填寫］' : '[Not entered]'), '');
  });
  const earlierResponses = Object.entries(state.responses).filter(([key]) => !seen.has(key));
  if (earlierResponses.length) {
    lines.push(lang === 'zh' ? '## 先前活動保存的回應' : '## Saved responses from earlier activities', '');
    earlierResponses.forEach(([key, value]) => lines.push(`### ${key}`, '', value, ''));
  }
  lines.push(lang === 'zh' ? '## 活動選擇與推理回應' : '## Activity choices and reasoning', '');
  document.querySelectorAll<HTMLElement>(`[data-quiz-language="${lang}"]`).forEach(root => {
    const value = state.quizzes[root.dataset.quiz!];
    const selected = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-choice]')).find(option => option.dataset.choice === value?.choice);
    if (!selected) return;
    lines.push(`### ${root.querySelector('.question')?.textContent}`, '', selected.dataset.optionLabel || '', '');
    if (value?.checked) lines.push(selected.querySelector('[data-explanation]')?.textContent || '', '');
  });
  const renderedQuizzes = new Set(Array.from(document.querySelectorAll<HTMLElement>('[data-quiz]')).map(root => root.dataset.quiz));
  const legacy = legacyActivities as Record<string, Record<string, { prompt: string; options: { label: string; why: string }[] }>>;
  Object.entries(state.quizzes).forEach(([key, value]) => {
    if (renderedQuizzes.has(key) || value.choice == null) return;
    const activity = legacy[key]?.[lang];
    const selected = activity?.options[Number(value.choice)];
    if (!selected) return;
    lines.push(`### ${activity.prompt}`, '', selected.label, '');
    if (value.checked) lines.push(selected.why, '');
  });
  lines.push(lang === 'zh' ? '## 同儕檢視記錄' : '## Peer review record', '');
  document.querySelectorAll<HTMLInputElement>(`.slide-inner > [data-language="${lang}"] [data-review]`).forEach(input => lines.push(`- [${input.checked ? 'x' : ' '}] ${input.closest('label')?.querySelector('span')?.textContent}`));
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'DEDC02-discussion-conclusion-responses.md';
  document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelectorAll('[data-export-status]').forEach(output => { output.textContent = output.closest('[data-language="zh"]') ? '已準備下載回應檔案。' : 'Response file prepared for download.'; });
}));
const hasPreviousResponses = Object.values(state.responses).some(value => value.trim()) || Object.values(state.quizzes).some(value => value.choice !== null) || Object.values(state.review).some(Boolean);
document.querySelectorAll<HTMLElement>('[data-previous-responses]').forEach(button => { button.hidden = !hasPreviousResponses; });
updateSaveStatus();
showSlide(hashSlide());

// Thesis explanations share a selection across the English and Chinese views.
const thesisMaps = Array.from(document.querySelectorAll<HTMLElement>('[data-thesis-language]'));
function fillThesisPurpose(output: HTMLElement, text: string) {
  const parts = text.split('\n');
  if (parts.length === 1) { output.textContent = text; return; }
  const list = document.createElement('ol');
  for (const part of parts) { const item = document.createElement('li'); item.textContent = part; list.append(item); }
  output.replaceChildren(list);
}
function fitThesisExplanations() {
  thesisMaps.forEach(map => {
    const explorer = map.querySelector<HTMLElement>('.thesis-explorer');
    if (!explorer || !map.offsetWidth) return;
    if (window.matchMedia('(max-width: 850px)').matches) { explorer.style.paddingBottom = '0px'; return; }
    const bottom = explorer.getBoundingClientRect().bottom - parseFloat(getComputedStyle(explorer).paddingBottom);
    const outputs = Array.from(map.querySelectorAll<HTMLElement>('.thesis-explanation:not([hidden])'));
    const extra = Math.max(0, ...outputs.map(output => Math.ceil(output.getBoundingClientRect().bottom - bottom)));
    explorer.style.paddingBottom = `${extra}px`;
  });
}
window.addEventListener('resize', fitThesisExplanations);
translate?.addEventListener('click', () => requestAnimationFrame(fitThesisExplanations));
function selectThesisPart(id: string, source: HTMLElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  thesisMaps.forEach(map => {
    const buttons = Array.from(map.querySelectorAll<HTMLButtonElement>('[data-thesis-part]'));
    const selected = buttons.find(button => button.dataset.thesisPart === id);
    if (!selected) return;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
    map.style.setProperty('--selected-row', String(buttons.indexOf(selected) + 2));
    for (const [selector, text, offset] of [
      ['[data-thesis-question-output]', selected.dataset.thesisQuestion || '', -8],
      ['[data-thesis-purpose-output]', selected.dataset.thesisPurpose || '', 8],
    ] as const) {
      const output = map.querySelector<HTMLElement>(selector);
      if (!output) continue;
      if (selector === '[data-thesis-purpose-output]') fillThesisPurpose(output, text); else output.textContent = text;
      output.hidden = false;
      if (!reduced) output.animate([{ opacity: 0, transform: `translateX(${offset}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 180, easing: 'ease-out' });
    }
  });
  requestAnimationFrame(fitThesisExplanations);
  if (window.matchMedia('(max-width: 850px)').matches) source.querySelector('[data-thesis-question-output]')?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' });
}
thesisMaps.forEach(map => {
  const print = document.createElement('div'); print.className = 'thesis-print';
  const heading = document.createElement('div'); heading.className = 'thesis-print-head';
  for (const selector of ['.thesis-question-panel h3', '.thesis-stack h3', '.thesis-purpose-panel h3']) {
    const label = document.createElement('span'); label.textContent = map.querySelector(selector)?.textContent || ''; heading.append(label);
  }
  print.append(heading);
  map.querySelectorAll<HTMLButtonElement>('[data-thesis-part]').forEach(button => {
    button.addEventListener('click', () => selectThesisPart(button.dataset.thesisPart || '', map));
    const row = document.createElement('div'); row.className = 'thesis-print-row';
    const question = document.createElement('p'); question.textContent = button.dataset.thesisQuestion || '';
    const chapter = document.createElement('div'); chapter.className = 'thesis-part'; chapter.dataset.thesisKind = button.dataset.thesisKind; chapter.style.cssText = button.style.cssText; chapter.innerHTML = button.innerHTML;
    const purpose = document.createElement('div'); purpose.className = 'thesis-purpose-content'; fillThesisPurpose(purpose, button.dataset.thesisPurpose || '');
    row.append(question, chapter, purpose); print.append(row);
  });
  map.append(print);
});
