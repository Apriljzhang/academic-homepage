import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
import { initClassNameDraw } from './classNameDraw';

const slides = Array.from(document.querySelectorAll<HTMLElement>('.u5-deck .slide'));
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const translate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
let current = 0;
function syncTranslation() {
  const zh = slides[current]?.dataset.currentLanguage === 'zh';
  if (translate) {
    translate.textContent = zh ? 'English' : '中文';
    translate.setAttribute('aria-pressed', String(zh));
  }
}
function showSlide(index: number) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === current);
    slide.setAttribute('aria-hidden', String(i !== current));
    if (i === current) slide.scrollTop = 0;
  });
  const label = document.querySelector('[data-current-slide]');
  if (label) label.textContent = String(current + 1);
  const progress = document.querySelector<HTMLElement>('.progress-track span');
  if (progress) progress.style.width = `${(current + 1) / slides.length * 100}%`;
  syncLessonNavigation(current, slides.length);
  syncTranslation();
  history.replaceState(null, '', `#slide-${current + 1}`);
}
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
const total = document.querySelector('[data-slide-total]');
if (total) total.textContent = String(slides.length);
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(button => button.addEventListener('click', () => showSlide(current + (button.dataset.nav === 'next' ? 1 : -1))));
translate?.addEventListener('click', () => {
  const slide = slides[current];
  const language = slide.dataset.currentLanguage === 'zh' ? 'en' : 'zh';
  slide.dataset.currentLanguage = language;
  slide.querySelectorAll<HTMLElement>('[data-language]').forEach(panel => { panel.hidden = panel.dataset.language !== language; });
  syncTranslation();
});
document.querySelector('[data-overview]')?.addEventListener('click', () => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click', () => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click', () => {
  const result = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  void result.catch(() => {});
});
document.querySelectorAll<HTMLElement>('[data-u5-quiz]').forEach(quiz => {
  quiz.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach(button => button.addEventListener('click', () => {
    const correct = button.dataset.choice === quiz.dataset.correct;
    const zh = quiz.dataset.languageCode === 'zh';
    quiz.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const feedback = quiz.querySelector<HTMLElement>('[data-quiz-feedback]');
    if (feedback) feedback.textContent = correct
      ? `${zh ? '答對了。' : 'Correct. '}${quiz.dataset.explanation}`
      : (zh ? '再試一次，留意時間線索和句子形式。' : 'Try again. Look at the time clue and sentence form.');
  }));
});
bindLessonShortcuts(showSlide, () => current, slides.length, overview);
initLessonTimer();
initClassNameDraw();
showSlide(Number(location.hash.match(/^#slide-(\d+)$/)?.[1] || 1) - 1);
