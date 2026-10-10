import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';

const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
const currentLabel = document.querySelector<HTMLElement>('.slide-count span');
const totalLabel = document.querySelector<HTMLElement>('[data-slide-total]');
const progress = document.querySelector<HTMLElement>('.progress-track span');
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const overviewList = overview?.querySelector('ol');
const translate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
let current = 0;

if (totalLabel) totalLabel.textContent = String(slides.length);
slides.forEach((slide) => { slide.dataset.language = 'en'; });

function syncTranslate() {
  if (!translate) return;
  const chinese = slides[current]?.dataset.language === 'zh';
  translate.textContent = chinese ? 'English' : '中文';
  translate.setAttribute('aria-pressed', String(chinese));
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
  syncLessonNavigation(current, slides.length);
  history.replaceState(null, '', `#slide-${current + 1}`);
  syncTranslate();
}

document.querySelectorAll<HTMLElement>('[data-nav]').forEach((button) => {
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
initLessonTimer();

function isChinese(element: Element) { return element.closest('[data-language="zh"]') !== null; }

document.querySelectorAll<HTMLElement>('[data-qa-quiz]').forEach((quiz) => {
  const buttons = Array.from(quiz.querySelectorAll<HTMLButtonElement>('[data-choice]'));
  const feedback = quiz.querySelector<HTMLElement>('[data-feedback]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const correct = button.dataset.choice === quiz.dataset.answer;
    buttons.forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
    quiz.dataset.result = correct ? 'correct' : 'incorrect';
    if (feedback) {
      feedback.hidden = false;
      feedback.textContent = isChinese(quiz)
        ? correct ? '這是此題最有根據的選擇。請向同伴解釋你的理由。' : '再試一次：這個標籤與片段及研究問題的關係是甚麼？'
        : correct ? 'Strongest choice for this question. Explain your reasoning to a partner.' : 'Try again: how does this label relate to the excerpt and question?';
    }
  }));
});

document.querySelectorAll<HTMLElement>('[data-qa-match]').forEach((activity) => {
  const selects = Array.from(activity.querySelectorAll<HTMLSelectElement>('select[data-answer]'));
  const result = activity.querySelector<HTMLElement>('[data-result]');
  activity.querySelector<HTMLButtonElement>('[data-check]')?.addEventListener('click', () => {
    const correct = selects.filter((select) => select.value === select.dataset.answer).length;
    selects.forEach((select) => { select.dataset.result = !select.value ? 'pending' : select.value === select.dataset.answer ? 'correct' : 'incorrect'; });
    if (result) result.textContent = isChinese(activity)
      ? `配對正確：${correct} / ${selects.length}。與同伴解釋一個選擇。`
      : `${correct} of ${selects.length} matched. Explain one choice to a partner.`;
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-check-scenarios]').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.parentElement?.querySelector<HTMLElement>('[data-qa-scenarios]');
    panel?.querySelectorAll<HTMLSelectElement>('select[data-answer]').forEach((select) => {
      const feedback = select.parentElement?.querySelector<HTMLElement>('[data-case-feedback]');
      const correct = select.value === select.dataset.answer;
      select.dataset.result = !select.value ? 'pending' : correct ? 'correct' : 'incorrect';
      if (feedback) feedback.textContent = !select.value
        ? isChinese(button) ? '請先選擇方法。' : 'Choose a method first.'
        : `${isChinese(button) ? correct ? '契合。' : '再考慮。' : correct ? 'Good fit. ' : 'Reconsider. '}${select.dataset.why || ''}`;
    });
  });
});

const lensPrompts = {
  en: {
    thematic: 'How does peer demonstration contribute to confidence across T1–T3?',
    content: 'What forms of guidance are mentioned, and how can they be categorised?',
    discourse: 'How does T1 contrast “the workshop” with “Mei” to position credible expertise?',
  },
  zh: {
    thematic: '在T1至T3之中，同儕示範如何促成信心？',
    content: '提及哪些指引形式？如何分類？',
    discourse: 'T1如何對比「工作坊」與「美」，將誰定位為可信的專家？',
  },
};
document.querySelectorAll<HTMLElement>('[data-qa-lenses]').forEach((activity) => {
  const buttons = Array.from(activity.querySelectorAll<HTMLButtonElement>('[data-lens]'));
  const output = activity.querySelector<HTMLElement>('[data-lens-output]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    buttons.forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
    const language = isChinese(activity) ? 'zh' : 'en';
    const lens = button.dataset.lens as keyof typeof lensPrompts.en;
    if (output && lens in lensPrompts[language]) output.textContent = lensPrompts[language][lens];
  }));
});

document.querySelectorAll<HTMLTextAreaElement>('textarea[data-save]').forEach((field) => {
  const key = `dedc02-w7-${field.dataset.save}`;
  try { field.value = localStorage.getItem(key) || ''; } catch { /* Private browsing may block storage. */ }
  field.addEventListener('input', () => { try { localStorage.setItem(key, field.value); } catch { /* Keep editing available. */ } });
});

bindLessonShortcuts(showSlide, () => current, slides.length, overview);
const initialHash = Number(location.hash.replace('#slide-', ''));
showSlide(Number.isFinite(initialHash) && initialHash > 0 ? initialHash - 1 : 0);
