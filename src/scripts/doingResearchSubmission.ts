import {syncLessonNavigation, bindLessonShortcuts} from './lessonDeck';

const slides = Array.from(document.querySelectorAll<HTMLElement>('.submission-deck .slide'));
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const languageButton = document.querySelector<HTMLButtonElement>('[data-global-translate]');
const legacyAnchors: Record<string,string> = {
  credit:'finish', contributions:'authorship', integrity:'submission',
  'letter-check':'letter-draft', 'peer-review':'finish',
};
let current = 0;

function syncLanguage() {
  const zh = slides[current].dataset.language === 'zh';
  if (languageButton) {
    languageButton.textContent = zh ? 'English' : '中文';
    languageButton.setAttribute('aria-pressed',String(zh));
  }
  document.documentElement.lang = zh ? 'zh-Hant' : 'en-GB';
}

function showSlide(index:number) {
  current = Math.max(0,Math.min(slides.length-1,index));
  slides.forEach((slide,i) => {
    const active = i === current;
    slide.classList.toggle('is-active',active);
    slide.setAttribute('aria-hidden',String(!active));
    slide.inert = !active;
  });
  document.querySelector('[data-current-slide]')!.textContent = String(current+1);
  const bar = document.querySelector<HTMLElement>('.progress-track span');
  if (bar) bar.style.width = `${100*(current+1)/slides.length}%`;
  syncLessonNavigation(current,slides.length);
  syncLanguage();
  history.replaceState(null,'',`#${slides[current].id}`);
}

slides.forEach((slide,index) => {
  slide.dataset.language = 'en';
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = slide.dataset.title || slide.id;
  button.addEventListener('click',() => {overview?.close(); showSlide(index);});
  item.append(button);
  overview?.querySelector('ol')?.append(item);
});
document.querySelector('[data-slide-total]')!.textContent = String(slides.length);
languageButton?.addEventListener('click',() => {
  const slide = slides[current];
  const lang = slide.dataset.language === 'zh' ? 'en' : 'zh';
  slide.dataset.language = lang;
  slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p => p.hidden = p.dataset.language !== lang);
  syncLanguage();
});
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(button => button.addEventListener('click',() => showSlide(current+(button.dataset.nav === 'next' ? 1 : -1))));
document.querySelector('[data-overview]')?.addEventListener('click',() => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click',() => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click',() => {
  const result = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  result.catch(() => {});
});
bindLessonShortcuts(showSlide,() => current,slides.length,overview);
function hashIndex() {
  const hash = location.hash.slice(1);
  return Math.max(0,slides.findIndex(s => s.id === (legacyAnchors[hash] || hash)));
}
showSlide(hashIndex());
window.addEventListener('hashchange',() => {const index=hashIndex(); if (index!==current) showSlide(index);});

window.addEventListener('beforeprint',() => {
  const language = slides[current].dataset.language;
  slides.forEach(slide => slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p => p.hidden = p.dataset.language !== language));
});
window.addEventListener('afterprint',() => slides.forEach(slide => slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p => p.hidden = p.dataset.language !== slide.dataset.language)));
document.querySelectorAll('[data-print-work]').forEach(button => button.addEventListener('click',() => window.print()));
