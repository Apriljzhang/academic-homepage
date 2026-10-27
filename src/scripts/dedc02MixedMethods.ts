import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
import { designScenarios as cases, diagramTasks, reasoningTasks } from '../data/dedc02MixedMethodsLesson';

const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
const totalLabel = document.querySelector<HTMLElement>('[data-slide-total]');
const currentLabel = document.querySelector<HTMLElement>('[data-current-slide]');
const progress = document.querySelector<HTMLElement>('.progress-track span');
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const translate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
let current = 0;

if (totalLabel) totalLabel.textContent = String(slides.length);

function syncTranslate() {
  if (!translate) return;
  const chinese = slides[current]?.dataset.language === 'zh';
  translate.textContent = chinese ? 'English' : '中文';
  translate.setAttribute('aria-pressed', String(chinese));
}

function showSlide(index: number, updateHash = true) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slide.inert = !active;
    if (active) slide.scrollTop = 0;
  });
  if (currentLabel) currentLabel.textContent = String(current + 1);
  if (progress) progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  syncLessonNavigation(current, slides.length);
  syncTranslate();
  if (updateHash) history.replaceState(null, '', `#slide-${current + 1}`);
}

document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach((button) => {
  button.addEventListener('click', () => showSlide(current + (button.dataset.nav === 'next' ? 1 : -1)));
});
translate?.addEventListener('click', () => {
  const slide = slides[current];
  if (!slide) return;
  const chinese = slide.dataset.language !== 'zh';
  slide.dataset.language = chinese ? 'zh' : 'en';
  slide.querySelectorAll<HTMLElement>('[data-language="en"]').forEach((panel) => { panel.hidden = chinese; });
  slide.querySelectorAll<HTMLElement>('[data-language="zh"]').forEach((panel) => { panel.hidden = !chinese; });
  syncTranslate();
});

const overviewList = overview?.querySelector('ol');
slides.forEach((slide, index) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = slide.dataset.title || `Slide ${index + 1}`;
  button.addEventListener('click', () => { showSlide(index); overview?.close(); });
  item.append(button);
  overviewList?.append(item);
});
document.querySelector('[data-overview]')?.addEventListener('click', () => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click', () => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
document.querySelectorAll('[data-print]').forEach((button) => button.addEventListener('click', () => window.print()));
initLessonTimer();
bindLessonShortcuts(showSlide, () => current, slides.length, overview);

function hashSlide() {
  return Number(location.hash.match(/slide-(\d+)/)?.[1] || 1) - 1;
}
window.addEventListener('hashchange', () => showSlide(hashSlide(), false));
showSlide(hashSlide());

// Each map offers the same three relationships in English and Chinese.
function selectDesign(design: string | null) {
  document.querySelectorAll<HTMLElement>('[data-design-map]').forEach((map) => {
    map.querySelectorAll<HTMLButtonElement>('[data-design-choice]').forEach((button) => {
      const selected = button.dataset.designChoice === design;
      button.setAttribute('aria-expanded', String(selected));
      button.classList.toggle('selected', selected);
    });
    map.querySelectorAll<HTMLElement>('[data-design-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.designPanel !== design;
    });
    const instruction = map.querySelector<HTMLElement>('.design-empty');
    if (instruction) instruction.hidden = design !== null;
  });
}
document.querySelectorAll<HTMLButtonElement>('[data-design-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    const design = button.dataset.designChoice || null;
    selectDesign(design);
    const panel = button.closest('[data-design-map]')?.querySelector<HTMLElement>(`[data-design-panel="${design}"]`);
    panel?.scrollIntoView({ block: 'nearest' });
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-design-back]').forEach((button) => {
  button.addEventListener('click', () => {
    selectDesign(null);
    button.closest('[data-design-map]')?.querySelector('.design-choices')?.scrollIntoView({ block: 'start' });
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-jump-key]').forEach((button) => {
  button.addEventListener('click', () => {
    const index = slides.findIndex((slide) => slide.dataset.slideKey === button.dataset.jumpKey);
    if (index >= 0) showSlide(index);
  });
});

let caseIndex = 0;
let atEnd = false;
const selections: Array<string | undefined> = [];
function updateCase() {
  const item = cases[caseIndex];
  document.querySelectorAll<HTMLElement>('[data-quiz]').forEach((quiz) => {
    const chinese = Boolean(quiz.closest('.zh'));
    const question = quiz.querySelector<HTMLElement>('.lead');
    if (question) question.textContent = chinese ? item.zh : item.en;
    const counter = quiz.querySelector<HTMLElement>('[data-scenario-count]');
    if (counter) counter.textContent = `${chinese ? '情境' : 'Scenario'} ${caseIndex + 1} / ${cases.length}`;
    const selected = selections[caseIndex];
    quiz.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach((button) => {
      button.classList.toggle('selected', button.dataset.answer === selected);
      button.setAttribute('aria-pressed', String(button.dataset.answer === selected));
    });
    const feedback = quiz.querySelector<HTMLElement>('.feedback');
    if (feedback) {
      const correct = selected === item.answer;
      const lead = correct ? chinese ? '合適。' : 'A good fit. ' : chinese ? '再想想整合的目的。' : 'Reconsider the purpose of integration. ';
      feedback.textContent = selected
        ? lead + (chinese ? item.feedbackZh : item.feedbackEn)
        : chinese ? '選擇設計，並說明整合位置。' : 'Choose a design and identify the integration point.';
    }
    const previous = quiz.querySelector<HTMLButtonElement>('[data-prevcase]');
    if (previous) previous.disabled = caseIndex === 0;
    const next = quiz.querySelector<HTMLButtonElement>('[data-nextcase]');
    if (next) {
      next.textContent = caseIndex === cases.length - 1 ? chinese ? '完成' : 'Finish' : chinese ? '下一情境 →' : 'Next scenario →';
      next.disabled = atEnd;
    }
    const restart = quiz.querySelector<HTMLElement>('[data-restart]');
    if (restart) restart.hidden = !atEnd;
    const endMessage = quiz.querySelector<HTMLElement>('[data-case-complete]');
    if (endMessage) {
      endMessage.hidden = !atEnd;
      endMessage.textContent = chinese ? '已到五個情境的最後一題，可回看或重新開始。' : 'End of the five scenarios. Revisit any item or restart.';
    }
  });
}
document.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach((button) => {
  button.addEventListener('click', () => { selections[caseIndex] = button.dataset.answer; updateCase(); });
});
document.querySelectorAll<HTMLButtonElement>('[data-nextcase]').forEach((button) => {
  button.addEventListener('click', () => {
    if (caseIndex < cases.length - 1) caseIndex += 1;
    else atEnd = true;
    updateCase();
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-prevcase]').forEach((button) => {
  button.addEventListener('click', () => { caseIndex = Math.max(0, caseIndex - 1); atEnd = false; updateCase(); });
});
document.querySelectorAll<HTMLButtonElement>('[data-restart]').forEach((button) => {
  button.addEventListener('click', () => { caseIndex = 0; atEnd = false; selections.length = 0; updateCase(); });
});
updateCase();

// Build diagrams from the description. State is shared across language views.
type DiagramTask = { accept: string[][]; en: { tokens: Record<string, string>; hint: string }; zh: { tokens: Record<string, string>; hint: string } };
const tasks = diagramTasks as Record<string, DiagramTask>;
type DiagramState = { slots: Array<string | null>; selected: string | null; checked: boolean; needsAll: boolean };
const diagramStates: Record<string, DiagramState> = {};
function diagramState(key: string) {
  return diagramStates[key] ||= { slots: tasks[key].accept.map(() => null), selected: null, checked: false, needsAll: false };
}
function renderDiagram(key: string) {
  const task = tasks[key], state = diagramState(key);
  const filled = state.slots.filter(Boolean).length;
  const correct = state.slots.filter((token, i) => token && task.accept[i].includes(token)).length;
  document.querySelectorAll<HTMLElement>('[data-diagram-task]').forEach((root) => {
    if (root.dataset.diagramTask !== key) return;
    const zh = root.dataset.taskLanguage === 'zh', copy = zh ? task.zh : task.en;
    root.querySelectorAll<HTMLButtonElement>('[data-task-token]').forEach((button) => {
      const token = button.dataset.taskToken!;
      const placed = state.slots.includes(token);
      button.setAttribute('aria-pressed', String(state.selected === token));
      button.classList.toggle('selected', state.selected === token);
      button.classList.toggle('is-placed', placed);
      const label = button.querySelector('[data-token-status]');
      if (label) label.textContent = placed ? zh ? '已放置；可選取移動' : 'Placed; select to move' : zh ? '可放置' : 'Available';
    });
    root.querySelectorAll<HTMLButtonElement>('[data-task-slot]').forEach((button) => {
      const index = Number(button.dataset.taskSlot), token = state.slots[index];
      const label = button.querySelector('[data-slot-label]'), status = button.querySelector('[data-slot-status]');
      if (label) label.textContent = token ? copy.tokens[token] : zh ? '放置步驟' : 'Place a step';
      const fits = Boolean(token && task.accept[index].includes(token));
      button.classList.toggle('is-filled', Boolean(token));
      button.classList.toggle('is-correct', state.checked && fits);
      button.classList.toggle('needs-review', state.checked && !fits);
      button.draggable = Boolean(token);
      if (status) status.textContent = state.checked ? fits ? zh ? '✓ 位置合適' : '✓ Fits here' : zh ? '檢視此步驟' : 'Review this step' : '';
    });
    const feedback = root.querySelector<HTMLElement>('[data-diagram-feedback]');
    if (feedback) {
      if (state.checked) feedback.textContent = `${correct} / ${state.slots.length} ${zh ? '位置合適。' : 'steps fit. '}` + (correct === state.slots.length ? zh ? '請解釋資料如何在階段之間連接。' : 'Explain what connects the evidence between these steps.' : copy.hint);
      else if (state.needsAll) feedback.textContent = zh ? '請先填滿所有位置，再檢查。' : 'Fill every box before checking. Choose a card, then a blank box.';
      else if (state.selected) feedback.textContent = (zh ? '已選擇：' : 'Selected: ') + copy.tokens[state.selected] + (zh ? '。請選位置。' : '. Choose its box.');
      else feedback.textContent = `${filled} / ${state.slots.length} ${zh ? '已放置。閱讀描述並完成設計。' : 'placed. Read the description and complete the design.'}`;
    }
  });
}
function placeStep(key: string, index: number, token: string | null) {
  const state = diagramState(key);
  if (token && !(token in tasks[key].en.tokens)) return;
  if (token) state.slots = state.slots.map((value) => value === token ? null : value);
  state.slots[index] = token;
  state.selected = null; state.checked = false; state.needsAll = false;
  renderDiagram(key);
}
document.querySelectorAll<HTMLElement>('[data-diagram-task]').forEach((root) => {
  const key = root.dataset.diagramTask!;
  root.querySelectorAll<HTMLButtonElement>('[data-task-token]').forEach((button) => {
    const token = button.dataset.taskToken!;
    button.addEventListener('click', () => {
      const state = diagramState(key);
      state.selected = state.selected === token ? null : token;
      renderDiagram(key);
    });
    button.addEventListener('dragstart', (event) => {
      if (!event.dataTransfer) return;
      event.dataTransfer.setData('text/plain', `${key}:${token}`);
      event.dataTransfer.effectAllowed = 'move';
    });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-task-slot]').forEach((button) => {
    const index = Number(button.dataset.taskSlot);
    button.addEventListener('click', () => placeStep(key, index, diagramState(key).selected));
    button.addEventListener('dragstart', (event) => {
      const token = diagramState(key).slots[index];
      if (!token || !event.dataTransfer) { event.preventDefault(); return; }
      event.dataTransfer.setData('text/plain', `${key}:${token}`);
      event.dataTransfer.effectAllowed = 'move';
    });
    button.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
      button.classList.add('drop-target');
    });
    button.addEventListener('dragleave', () => button.classList.remove('drop-target'));
    button.addEventListener('drop', (event) => {
      event.preventDefault(); button.classList.remove('drop-target');
      const [source, token] = (event.dataTransfer?.getData('text/plain') || '').split(':');
      if (source === key && token) placeStep(key, index, token);
    });
  });
  root.querySelector('[data-check-diagram]')?.addEventListener('click', () => {
    const state = diagramState(key);
    state.needsAll = state.slots.some((token) => !token);
    state.checked = !state.needsAll; state.selected = null;
    renderDiagram(key);
  });
  root.querySelector('[data-reset-diagram]')?.addEventListener('click', () => {
    delete diagramStates[key]; renderDiagram(key);
  });
});
Object.keys(tasks).forEach(renderDiagram);

// Commit to a reasoned choice before receiving option-specific feedback.
type ReasoningTask = { answer: number; en: { feedback: string[] }; zh: { feedback: string[] } };
const reasoning = reasoningTasks as Record<string, ReasoningTask>;
const reasoningStates: Record<string, { selected: number | null; checked: boolean }> = {};
function renderReasoning(key: string) {
  const state = reasoningStates[key] ||= { selected: null, checked: false };
  document.querySelectorAll<HTMLElement>('[data-reasoning-task]').forEach((root) => {
    if (root.dataset.reasoningTask !== key) return;
    const zh = root.dataset.taskLanguage === 'zh';
    root.querySelectorAll<HTMLButtonElement>('[data-reasoning-option]').forEach((button) => {
      const selected = Number(button.dataset.reasoningOption) === state.selected;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('selected', selected);
    });
    const feedback = root.querySelector<HTMLElement>('[data-reasoning-feedback]');
    if (feedback) {
      if (state.checked && state.selected !== null) feedback.textContent = (state.selected === reasoning[key].answer ? zh ? '合適。' : 'Supported. ' : zh ? '再檢視理由。' : 'Reconsider the reasoning. ') + (zh ? reasoning[key].zh : reasoning[key].en).feedback[state.selected];
      else feedback.textContent = state.selected === null ? zh ? '先選一項並說明理由，再檢查。' : 'Choose an option and explain why, then check.' : zh ? '已選擇。請先說明理由，再檢查。' : 'Choice selected. Explain your reasoning before checking.';
    }
    const check = root.querySelector<HTMLButtonElement>('[data-check-reasoning]');
    if (check) check.disabled = state.selected === null;
  });
}
document.querySelectorAll<HTMLElement>('[data-reasoning-task]').forEach((root) => {
  const key = root.dataset.reasoningTask!;
  root.querySelectorAll<HTMLButtonElement>('[data-reasoning-option]').forEach((button) => {
    button.addEventListener('click', () => {
      reasoningStates[key] = { selected: Number(button.dataset.reasoningOption), checked: false };
      renderReasoning(key);
    });
  });
  root.querySelector('[data-check-reasoning]')?.addEventListener('click', () => {
    reasoningStates[key].checked = true; renderReasoning(key);
  });
  root.querySelector('[data-reset-reasoning]')?.addEventListener('click', () => {
    delete reasoningStates[key]; renderReasoning(key);
  });
});
Object.keys(reasoning).forEach(renderReasoning);
