import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';

const accessKey = 'q-methodology-202611-access';
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
  if (input?.value.trim() === '202611') unlock();
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

let selectedId: string | null = null;
const cards = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-sort-id]'));
const statementText = (id: string, language: string) => cards.find((card) => card.dataset.sortId === id && card.closest<HTMLElement>('[data-language]')?.dataset.language === language)?.querySelector('span')?.textContent || '';
function sortFeedback(en: string, zh: string) {
  document.querySelectorAll<HTMLElement>('[data-sort-feedback]').forEach((output) => { output.textContent = chinese(output) ? zh : en; });
}
function selectCard(id: string | null) {
  selectedId = id;
  cards.forEach((card) => {
    const selected = card.dataset.sortId === id;
    card.classList.toggle('is-selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });
  if (id) sortFeedback(`Card ${id} selected. Choose a grid space, another card to swap, or Return selected card.`, `已選卡片${id}。請選格網位置、另一張卡交換，或移回陳述區。`);
}
function placeCard(id: string, rank?: string, occupant?: string) {
  const previous = ranks[id];
  if (occupant === id) return;
  if (rank && !occupant && Object.values(ranks).filter((value) => value === rank).length >= capacities[rank]) {
    sortFeedback('This column is full. Drop onto a card to swap places.', '此欄已滿，請放到另一張卡上交換位置。');
    return;
  }
  if (occupant) {
    if (previous) ranks[occupant] = previous;
    else delete ranks[occupant];
  }
  if (rank) ranks[id] = rank;
  else delete ranks[id];
  const saved = safeSave(sortKey, ranks);
  selectCard(null);
  renderSort();
  sortFeedback(saved ? `Card ${id} moved${rank ? ` to ${Number(rank) > 0 ? '+' : ''}${rank}` : ' back to the statement area'}.` : 'Saving is unavailable. You can still sort during this visit.', saved ? `卡片${id}已${rank ? `移至${Number(rank) > 0 ? '+' : ''}${rank}` : '移回陳述區'}。` : '此瀏覽器無法儲存；本次頁面仍可繼續排序。');
  cards.find((card) => card.dataset.sortId === id && !card.closest<HTMLElement>('[data-language]')?.hidden)?.focus({ preventScroll: true });
}
function renderSort() {
  // Keep the existing cards and saved statement IDs when moving between bank and grid.
  document.querySelectorAll<HTMLElement>('[data-sort-bank]').forEach((bank) => {
    const panel = bank.closest<HTMLElement>('[data-language]')!;
    const localCards = cards.filter((card) => card.closest('[data-language]') === panel);
    localCards.forEach((card) => bank.append(card));
    for (const [rank, capacity] of Object.entries(capacities)) {
      const ids = Object.keys(ranks).filter((id) => ranks[id] === rank).sort((a, b) => Number(a) - Number(b));
      const count = panel.querySelector<HTMLElement>(`[data-rank-count="${rank}"]`);
      if (count) { count.textContent = `${ids.length} / ${capacity}`; count.dataset.overfull = String(ids.length > capacity); }
      const container = panel.querySelector<HTMLElement>(`[data-rank-slots="${rank}"]`)!;
      container.replaceChildren();
      for (let index = 0; index < Math.max(capacity, ids.length); index += 1) {
        const slot = document.createElement('div');
        slot.className = 'q-slot';
        slot.dataset.dropRank = rank;
        if (ids[index]) {
          slot.dataset.occupant = ids[index];
          slot.classList.add('filled');
          slot.append(localCards.find((card) => card.dataset.sortId === ids[index])!);
        } else {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'q-empty-slot';
          button.textContent = '+';
          button.setAttribute('aria-label', chinese(container) ? `放置於${rank}，位置${index + 1}` : `Place at ${rank}, space ${index + 1}`);
          slot.append(button);
        }
        container.append(slot);
      }
    }
  });
  document.querySelectorAll<HTMLElement>('[data-endpoint]').forEach((output) => {
    const id = Object.keys(ranks).find((key) => ranks[key] === output.dataset.endpoint);
    const statement = id ? statementText(id, chinese(output) ? 'zh' : 'en') : '';
    output.textContent = statement ? `${id}. ${statement}` : chinese(output) ? '完成排序後，這裡會顯示你的陳述。' : 'Complete the sort to see your statement here.';
  });
}
cards.forEach((card) => {
  card.addEventListener('click', () => {
    const id = card.dataset.sortId!;
    if (selectedId && selectedId !== id) placeCard(selectedId, ranks[id], id);
    else selectCard(selectedId === id ? null : id);
  });
  card.addEventListener('dragstart', (event) => {
    selectCard(card.dataset.sortId!);
    event.dataTransfer?.setData('text/plain', card.dataset.sortId!);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    card.classList.add('is-dragging');
  });
  card.addEventListener('dragend', () => { card.classList.remove('is-dragging'); document.querySelectorAll('.is-drop-target').forEach((target) => target.classList.remove('is-drop-target')); });
});
document.querySelectorAll<HTMLElement>('.q-sort-workspace').forEach((workspace) => {
  workspace.addEventListener('click', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('[data-drop-rank]');
    if (target && selectedId && !(event.target as Element).closest('[data-sort-id]')) placeCard(selectedId, target.dataset.dropRank, target.dataset.occupant);
  });
  workspace.addEventListener('dragover', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('[data-drop-rank], [data-sort-bank]');
    if (!target || !selectedId) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    workspace.querySelectorAll('.is-drop-target').forEach((element) => element.classList.remove('is-drop-target'));
    target.classList.add('is-drop-target');
  });
  workspace.addEventListener('dragleave', (event) => { (event.target as Element).closest('.is-drop-target')?.classList.remove('is-drop-target'); });
  workspace.addEventListener('drop', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('[data-drop-rank], [data-sort-bank]');
    const id = event.dataTransfer?.getData('text/plain');
    if (!target || !id || !cards.some((card) => card.dataset.sortId === id)) return;
    event.preventDefault();
    placeCard(id, target.dataset.dropRank, target.dataset.occupant);
    workspace.querySelectorAll('.is-drop-target').forEach((element) => element.classList.remove('is-drop-target'));
  });
  workspace.addEventListener('keydown', (event) => { if (event.key === 'Escape') { selectCard(null); sortFeedback('Selection cancelled.', '已取消選取。'); } });
});
document.querySelectorAll<HTMLButtonElement>('[data-return-sort]').forEach((button) => button.addEventListener('click', () => {
  if (selectedId) placeCard(selectedId);
  else sortFeedback('Select a card to return to the statement area.', '請先選取要移回陳述區的卡片。');
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
  selectCard(null);
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
