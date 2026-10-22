import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';

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

// The three scenarios are teaching illustrations, not empirical study results.
const cases = [{en:'A survey shows an unexpected pattern. You want to interview selected respondents to understand it.',zh:'問卷出現意料之外的模式，你希望訪談特定受訪者以理解原因。',answer:'e',feedbackEn:'Explanatory sequential: quantitative results guide interview selection and questions; the final interpretation explains those results.',feedbackZh:'解釋型循序：量化結果決定訪談對象與問題，最終整合詮釋回應初步結果。'},{en:'The relevant dimensions of a new learning experience are unclear. Explore learners’ accounts, develop a measure, then examine it quantitatively.',zh:'新學習經驗的相關面向尚不清楚。先探索學生敘述，再發展量表並進行量化檢視。',answer:'x',feedbackEn:'Exploratory sequential: qualitative findings build the measure, with development and evaluation made explicit.',feedbackZh:'探索型循序：以質性發現建構量表，清楚展示發展與評估過程。'},{en:'You collect survey responses and interviews in the same period to compare how they portray the same classroom experience.',zh:'同期收集問卷與訪談，以比較兩者如何呈現同一課堂經驗。',answer:'c',feedbackEn:'Convergent: analyse each strand and merge comparable findings. Concurrent collection alone would not demonstrate integration.',feedbackZh:'聚合式：分別分析，再合併可比較的發現。僅有同期蒐集仍不足以展示整合。'}];
let caseIndex = 0;

function updateCase() {
  const english = document.getElementById('scenario-en');
  const chinese = document.getElementById('scenario-zh');
  if (english) english.textContent = cases[caseIndex].en;
  if (chinese) chinese.textContent = cases[caseIndex].zh;
  document.querySelectorAll<HTMLElement>('[data-quiz]').forEach((quiz) => {
    const feedback = quiz.querySelector<HTMLElement>('.feedback');
    if (feedback) feedback.textContent = quiz.closest('.zh')
      ? '選擇設計，並說明如何整合。'
      : 'Choose a design and explain the integration.';
    quiz.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach((button) => {
      button.classList.remove('selected');
      button.setAttribute('aria-pressed', 'false');
    });
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach((button) => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    const quiz = button.closest<HTMLElement>('.quiz');
    if (!quiz) return;
    const chinese = Boolean(quiz.closest('.zh'));
    const correct = button.dataset.answer === cases[caseIndex].answer;
    quiz.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach((choice) => {
      choice.classList.toggle('selected', choice === button);
      choice.setAttribute('aria-pressed', String(choice === button));
    });
    const feedback = quiz.querySelector<HTMLElement>('.feedback');
    if (feedback) {
      const lead = correct
        ? chinese ? '合適。' : 'A good fit. '
        : chinese ? '再想想整合的目的。' : 'Reconsider what the integration is intended to do. ';
      feedback.textContent = lead + (chinese ? cases[caseIndex].feedbackZh : cases[caseIndex].feedbackEn);
    }
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-nextcase]').forEach((button) => {
  button.addEventListener('click', () => { caseIndex = (caseIndex + 1) % cases.length; updateCase(); });
});

// Keep English and Chinese versions of the same design note in sync within this tab.
document.querySelectorAll<HTMLTextAreaElement>('[data-field]').forEach((input) => {
  input.addEventListener('input', () => {
    document.querySelectorAll<HTMLTextAreaElement>(`[data-field="${input.dataset.field}"]`).forEach((peer) => {
      if (peer !== input) peer.value = input.value;
    });
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-download]').forEach((button) => {
  button.addEventListener('click', () => {
    const labels = {
      purpose: 'Research problem and mixed purpose',
      design: 'Design, timing, emphasis, and sample relationship',
      integration: 'Integration operation, product, and inference boundary',
    };
    let text = '# My mixed methods design\n\n';
    Object.entries(labels).forEach(([key, label]) => {
      const value = document.querySelector<HTMLTextAreaElement>(`[data-field="${key}"]`)?.value || '';
      text += `## ${label}\n${value}\n\n`;
    });
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-mixed-methods-design.md';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
});
