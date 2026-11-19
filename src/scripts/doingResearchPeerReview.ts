import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';

const slides = Array.from(document.querySelectorAll<HTMLElement>('.peer-review-deck .slide'));
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const languageButton = document.querySelector<HTMLButtonElement>('[data-global-translate]');
const storageKey = 'doing-research-peer-review-v1';
const fields = Array.from(document.querySelectorAll<HTMLTextAreaElement>('[data-response]'));
let current = 0;
let answers: Record<string, string> = {};
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const [key, value] of Object.entries(saved)) if (typeof value === 'string') answers[key] = value;
  }
} catch { storageAvailable = false; }
const isChinese = () => slides[current]?.dataset.language === 'zh';
function status(en: string, zh: string) {
  document.querySelectorAll<HTMLElement>('[data-save-status]').forEach(node => {
    node.textContent = node.closest('[data-language]')?.getAttribute('data-language') === 'zh' ? zh : en;
  });
}
function syncLanguage() {
  const zh = isChinese();
  if (languageButton) {
    languageButton.textContent = zh ? 'English' : '中文';
    languageButton.setAttribute('aria-pressed', String(zh));
  }
  document.documentElement.lang = zh ? 'zh-Hant' : 'en-GB';
  overview?.querySelectorAll('li button').forEach((button, i) => {
    button.textContent = (zh ? slides[i].dataset.titleZh : slides[i].dataset.title) || slides[i].id;
  });
  const title = overview?.querySelector('h2');
  if (title) title.textContent = zh ? '期刊論文同行評審' : 'Peer review for journal articles';
  if (!storageAvailable) status('Browser storage is unavailable. Download your responses before closing the page.', '瀏覽器無法儲存，關閉前請下載回應。');
}
function showSlide(index: number) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => {
    const active = i === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slide.inert = !active;
  });
  const counter = document.querySelector('[data-current-slide]');
  if (counter) counter.textContent = String(current + 1);
  const bar = document.querySelector<HTMLElement>('.progress-track span');
  if (bar) bar.style.width = `${100 * (current + 1) / slides.length}%`;
  syncLessonNavigation(current, slides.length);
  syncLanguage();
  history.replaceState(null, '', `#${slides[current].id}`);
}
slides.forEach((slide, index) => {
  slide.dataset.language = 'en';
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = slide.dataset.title || slide.id;
  button.addEventListener('click', () => { overview?.close(); showSlide(index); });
  item.append(button);
  overview?.querySelector('ol')?.append(item);
});
const total = document.querySelector('[data-slide-total]');
if (total) total.textContent = String(slides.length);
languageButton?.addEventListener('click', () => {
  const slide = slides[current];
  const lang = isChinese() ? 'en' : 'zh';
  slide.dataset.language = lang;
  slide.querySelectorAll<HTMLElement>('[data-language]').forEach(panel => panel.hidden = panel.dataset.language !== lang);
  syncLanguage();
});
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(button => button.addEventListener('click', () => showSlide(current + (button.dataset.nav === 'next' ? 1 : -1))));
document.querySelector('[data-overview]')?.addEventListener('click', () => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click', () => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click', () => {
  const action = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  action.catch(() => {});
});
bindLessonShortcuts(showSlide, () => current, slides.length, overview);
function hashIndex() { return Math.max(0, slides.findIndex(slide => slide.id === location.hash.slice(1))); }
showSlide(hashIndex());
window.addEventListener('hashchange', () => showSlide(hashIndex()));
fields.forEach(field => {
  const key = field.dataset.response!;
  field.value = answers[key] || '';
  field.addEventListener('input', () => {
    answers[key] = field.value;
    fields.filter(other => other !== field && other.dataset.response === key).forEach(other => other.value = field.value);
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
      storageAvailable = true;
      status('Practice responses saved in this browser.', '練習回應已儲存於此瀏覽器。');
    } catch {
      storageAvailable = false;
      status('Unable to save in this browser. Download your responses to keep them.', '無法在此瀏覽器儲存；請下載回應以保留內容。');
    }
  });
});
document.querySelectorAll('[data-export]').forEach(button => button.addEventListener('click', () => {
  const lang = isChinese() ? 'zh' : 'en';
  const title = lang === 'zh' ? '期刊論文同行評審 — 練習回應' : 'Peer review for journal articles — practice responses';
  const parts = [title, 'Doing Research · Topic 4', 'Fictional training case / 虛構教學案例', ''];
  const seen = new Set<string>();
  fields.filter(field => field.closest('[data-language]')?.getAttribute('data-language') === lang).forEach(field => {
    const key = field.dataset.response!;
    if (seen.has(key)) return;
    seen.add(key);
    parts.push((field.parentElement?.firstChild?.textContent || key).trim(), answers[key] || (lang === 'zh' ? '（未填寫）' : '(Not completed)'), '');
  });
  const url = URL.createObjectURL(new Blob([parts.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'peer-review-practice-responses.txt';
  document.body.append(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  status('Response download prepared.', '已準備下載練習回應。');
}));
document.querySelectorAll('[data-clear]').forEach(button => button.addEventListener('click', () => {
  if (!window.confirm(isChinese() ? '清除此課程的所有練習回應？此操作無法復原。' : 'Clear all practice responses for this lesson? This cannot be undone.')) return;
  answers = {};
  fields.forEach(field => field.value = '');
  try { localStorage.removeItem(storageKey); } catch { /* In-memory responses are still cleared. */ }
  status('Practice responses cleared.', '練習回應已清除。');
}));
let detailsBeforePrint: boolean[] = [];
window.addEventListener('beforeprint', () => {
  const lang = isChinese() ? 'zh' : 'en';
  slides.forEach(slide => slide.querySelectorAll<HTMLElement>('[data-language]').forEach(panel => panel.hidden = panel.dataset.language !== lang));
  const details = Array.from(document.querySelectorAll<HTMLDetailsElement>('.peer-review-deck details'));
  detailsBeforePrint = details.map(detail => detail.open);
  details.forEach(detail => detail.open = true);
  fields.forEach(field => {
    let printed = field.parentElement?.querySelector<HTMLElement>('.print-response');
    if (!printed) { printed = document.createElement('p'); printed.className = 'print-response'; field.after(printed); }
    printed.textContent = field.value || '________________________';
  });
});
window.addEventListener('afterprint', () => {
  slides.forEach(slide => slide.querySelectorAll<HTMLElement>('[data-language]').forEach(panel => panel.hidden = panel.dataset.language !== slide.dataset.language));
  document.querySelectorAll<HTMLDetailsElement>('.peer-review-deck details').forEach((detail, i) => detail.open = detailsBeforePrint[i] || false);
});
document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
