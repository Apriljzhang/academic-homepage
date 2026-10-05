import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
import { initEthicsWordCloud } from './ethicsWordCloud';

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
  if (progress) progress.style.width = String(((current + 1) / slides.length) * 100) + '%';
  syncLessonNavigation(current, slides.length);
  history.replaceState(null, '', '#slide-' + (current + 1));
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
  if (slide.classList.contains('cloud-slide')) {
    slide.querySelectorAll<HTMLElement>('[data-cloud-en]').forEach((node) => {
      node.textContent = node.dataset[chinese ? 'cloudZh' : 'cloudEn'] || '';
    });
  }
  syncTranslate();
});
if (overviewList) {
  slides.forEach((slide, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = slide.dataset.title || 'Slide ' + (index + 1);
    button.addEventListener('click', () => { showSlide(index); overview?.close(); });
    item.append(button);
    overviewList.append(item);
  });
}
document.querySelector('[data-overview]')?.addEventListener('click', () => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click', () => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
initLessonTimer();
initEthicsWordCloud();

document.querySelectorAll<HTMLElement>('[data-choice-group]').forEach((group) => {
  const choices = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-choice]'));
  const feedback = group.querySelector<HTMLElement>('[data-choice-feedback]');
  choices.forEach((choice) => choice.addEventListener('click', () => {
    choices.forEach((button) => button.setAttribute('aria-pressed', String(button === choice)));
    const chinese = group.closest('[data-language="zh"]') !== null;
    if (feedback) feedback.textContent = chinese
      ? '已選擇。向同伴解釋這項修改能處理甚麼，以及還留下甚麼問題。'
      : 'Choice recorded. Explain to a partner what this redesign addresses and what it leaves unresolved.';
  }));
});

bindLessonShortcuts(showSlide, () => current, slides.length, overview);
const initialHash = Number(location.hash.replace('#slide-', ''));
const cloudView = new URLSearchParams(location.search).get('cloud');
showSlide(cloudView === 'student' || cloudView === 'instructor' ? 1 : Number.isFinite(initialHash) && initialHash > 0 ? initialHash - 1 : 0);
