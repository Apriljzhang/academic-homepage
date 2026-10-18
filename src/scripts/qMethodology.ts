import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';

const accessKey = 'q-methodology-202610-access';
const sortKey = 'q-methodology-202610-sort';
const planKey = 'q-methodology-202610-plan';
const slides = Array.from(document.querySelectorAll<HTMLElement>('.q-deck .slide'));
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const translate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
const workshop = document.querySelector<HTMLElement>('[data-q-workshop]');
const gate = document.querySelector<HTMLElement>('[data-q-access]');
let current = 0;
let unlocked = false;
let ranks: Record<string, string> = {};
let plan: Record<string, string> = {};
const capacities: Record<string, number> = { '-2': 1, '-1': 2, '0': 3, '1': 2, '2': 1 };
const chinese = (element: Element) => Boolean(element.closest('[data-language="zh"]'));
const safeRead = (key: string): Record<string, string> => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  } catch { /* Sorting remains usable if local storage is unavailable. */ }
  return {};
};
const safeSave = (key: string, value: Record<string, string>) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
};
const savedRanks = safeRead(sortKey);
for (let id = 1; id <= 9; id += 1) {
  if (typeof savedRanks[id] === 'string' && Object.hasOwn(capacities, savedRanks[id])) ranks[id] = savedRanks[id];
}
const savedPlan = safeRead(planKey);
for (const key of ['question', 'participants']) {
  if (typeof savedPlan[key] === 'string') plan[key] = savedPlan[key];
}

function showSlide(index: number) {
  if (!unlocked) return;
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => {
    const active = i === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    if (active) slide.scrollTop = 0;
  });
  const currentLabel = document.querySelector('[data-current-slide]');
  if (currentLabel) currentLabel.textContent = String(current + 1);
  const progress = document.querySelector<HTMLElement>('.progress-track span');
  if (progress) progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  syncLessonNavigation(current, slides.length);
  history.replaceState(null, '', `#slide-${current + 1}`);
  syncTranslation();
}
function syncTranslation() {
  const zh = slides[current]?.dataset.currentLanguage === 'zh';
  if (translate) {
    translate.textContent = zh ? 'English' : '中文';
    translate.setAttribute('aria-pressed', String(zh));
  }
}
function unlock() {
  if (unlocked || !workshop || !gate) return;
  unlocked = true;
  workshop.hidden = false;
  gate.hidden = true;
  try { sessionStorage.setItem(accessKey, 'yes'); } catch { /* Access works for this visit. */ }
  bindLessonShortcuts(showSlide, () => current, slides.length, overview);
  initLessonTimer();
  const hashIndex = Number(location.hash.match(/^#slide-(\d+)$/)?.[1] || 1) - 1;
  showSlide(hashIndex);
  const heading = slides[current]?.querySelector<HTMLElement>('h1, h2');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus({ preventScroll: true });
}
const totalLabel = document.querySelector('[data-slide-total]');
if (totalLabel) totalLabel.textContent = String(slides.length);
slides.forEach((slide, index) => {
  slide.dataset.currentLanguage = 'en';
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = slide.dataset.title || `Slide ${index + 1}`;
  button.addEventListener('click', () => { showSlide(index); overview?.close(); });
  item.append(button);
  overview?.querySelector('ol')?.append(item);
});
document.querySelector<HTMLFormElement>('[data-q-access-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector<HTMLInputElement>('#q-access-code');
  const feedback = document.querySelector('[data-q-access-feedback]');
  if (input?.value.trim() === '202610') unlock();
  else {
    if (feedback) feedback.textContent = 'That code does not match this workshop. Please check the code provided by your instructor.';
    input?.setAttribute('aria-invalid', 'true');
    input?.focus();
  }
});
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach((button) => button.addEventListener('click', () => showSlide(current + (button.dataset.nav === 'next' ? 1 : -1))));
translate?.addEventListener('click', () => {
  const slide = slides[current];
  if (!slide) return;
  const zh = slide.dataset.currentLanguage !== 'zh';
  slide.dataset.currentLanguage = zh ? 'zh' : 'en';
  slide.querySelectorAll<HTMLElement>('[data-language]').forEach((panel) => { panel.hidden = panel.dataset.language !== (zh ? 'zh' : 'en'); });
  syncTranslation();
});
document.querySelector('[data-overview]')?.addEventListener('click', () => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click', () => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click', () => {
  const result = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  void result.catch(() => {});
});

function renderSort() {
  document.querySelectorAll<HTMLSelectElement>('[data-sort-id]').forEach((select) => { select.value = ranks[select.dataset.sortId || ''] || ''; });
  for (const [rank, capacity] of Object.entries(capacities)) {
    const ids = Object.keys(ranks).filter((id) => ranks[id] === rank).sort((a, b) => Number(a) - Number(b));
    document.querySelectorAll<HTMLElement>(`[data-rank-count="${rank}"]`).forEach((label) => {
      label.textContent = `${ids.length} / ${capacity}`;
      label.dataset.overfull = String(ids.length > capacity);
    });
    document.querySelectorAll<HTMLElement>(`[data-rank-slots="${rank}"]`).forEach((container) => {
      const slots = Array.from({ length: Math.max(capacity, ids.length) }, (_, i) => {
        const slot = document.createElement('span');
        slot.className = 'q-slot';
        slot.textContent = ids[i] || '—';
        if (ids[i]) slot.classList.add('filled');
        return slot;
      });
      container.replaceChildren(...slots);
    });
  }
  document.querySelectorAll<HTMLElement>('[data-endpoint]').forEach((output) => {
    const id = Object.keys(ranks).find((key) => ranks[key] === output.dataset.endpoint);
    const panel = output.closest<HTMLElement>('[data-language]');
    const source = panel?.dataset.language === 'zh' ? 'zh' : 'en';
    const statement = id ? document.querySelector(`[data-language="${source}"] [data-sort-id="${id}"]`)?.closest('label')?.querySelector('span')?.textContent : null;
    output.textContent = statement ? `${id}. ${statement}` : chinese(output) ? '完成排序後，這裡會顯示你的陳述。' : 'Complete the sort to see your statement here.';
  });
}
document.querySelectorAll<HTMLSelectElement>('[data-sort-id]').forEach((select) => select.addEventListener('change', () => {
  const id = select.dataset.sortId!;
  if (Object.hasOwn(capacities, select.value)) ranks[id] = select.value;
  else delete ranks[id];
  const saved = safeSave(sortKey, ranks);
  renderSort();
  document.querySelectorAll<HTMLElement>('[data-sort-feedback]').forEach((output) => { output.textContent = saved ? '' : chinese(output) ? '此瀏覽器無法儲存；本次頁面仍可繼續排序。' : 'Saving is unavailable in this browser. You can still sort during this visit.'; });
}));
document.querySelectorAll<HTMLButtonElement>('[data-check-sort]').forEach((button) => button.addEventListener('click', () => {
  const assigned = Object.keys(ranks).length;
  const fits = Object.entries(capacities).every(([rank, capacity]) => Object.values(ranks).filter((value) => value === rank).length === capacity);
  const output = button.closest('[data-language]')?.querySelector<HTMLElement>('[data-sort-feedback]');
  if (output) output.textContent = chinese(button)
    ? assigned < 9 ? `已分配${assigned}項，共9項。請先為每項選擇位置。` : fits ? '格網已完成。沒有觀點的對錯之分。請解釋你的+2及−2選擇。' : '九項均已分配。請調整至1–2–3–2–1格數，查看各欄的數量。'
    : assigned < 9 ? `${assigned} of 9 statements assigned. Choose a position for every statement.` : fits ? 'Grid complete. Viewpoints have no right or wrong answer. Explain your +2 and −2 choices.' : 'All nine assigned. Adjust the positions to fit 1–2–3–2–1; check each column’s count.';
}));
document.querySelectorAll<HTMLButtonElement>('[data-reset-sort]').forEach((button) => button.addEventListener('click', () => {
  ranks = {};
  safeSave(sortKey, ranks);
  renderSort();
  document.querySelectorAll<HTMLElement>('[data-sort-feedback]').forEach((output) => { output.textContent = chinese(output) ? '排序已重設。' : 'Sort reset.'; });
}));
document.querySelectorAll<HTMLTextAreaElement>('[data-plan]').forEach((input) => {
  input.value = plan[input.dataset.plan!] || '';
  input.addEventListener('input', () => {
    plan[input.dataset.plan!] = input.value;
    const saved = safeSave(planKey, plan);
    document.querySelectorAll<HTMLTextAreaElement>(`[data-plan="${input.dataset.plan}"]`).forEach((other) => { if (other !== input) other.value = input.value; });
    document.querySelectorAll<HTMLElement>('[data-plan-status]').forEach((status) => {
      status.textContent = chinese(status) ? saved ? '筆記已儲存於此瀏覽器，並不提交。' : '此瀏覽器無法儲存；離開前請自行複製筆記。' : saved ? 'Notes saved in this browser. They are not submitted.' : 'Saving is unavailable. Copy your notes before leaving.';
    });
  });
});
renderSort();
try { if (sessionStorage.getItem(accessKey) === 'yes') unlock(); } catch { /* Show the entry form. */ }
