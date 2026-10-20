import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
import { initClassNameDraw } from './classNameDraw';

const slides = Array.from(document.querySelectorAll<HTMLElement>('.ge-deck .slide'));
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const translate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
let current = 0;
const storageKey = 'general-english-unit2e-special-places-v1';
const fieldKeys = ['where','when','age','special','who','what','draft','improved','adjective'];
const checkKeys = ['details','adjectives','picture','revision'];
const fields: Record<string,string> = {};
const checks: Record<string,boolean> = {};
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (stored && typeof stored === 'object') {
    for (const key of fieldKeys) if (typeof stored.fields?.[key] === 'string') fields[key] = stored.fields[key];
    for (const key of checkKeys) if (typeof stored.checks?.[key] === 'boolean') checks[key] = stored.checks[key];
  }
} catch { /* The lesson also works without browser storage. */ }

function isChinese() { return slides[current]?.dataset.currentLanguage === 'zh'; }
function syncTranslation() {
  const zh = isChinese();
  if (translate) {
    translate.textContent = zh ? 'English' : '中文';
    translate.setAttribute('aria-pressed',String(zh));
  }
}
function showSlide(index:number) {
  current = Math.max(0,Math.min(slides.length-1,index));
  slides.forEach((slide,i) => {
    slide.classList.toggle('is-active',i===current);
    slide.setAttribute('aria-hidden',String(i!==current));
    if (i===current) slide.scrollTop=0;
  });
  const label=document.querySelector('[data-current-slide]');
  if(label) label.textContent=String(current+1);
  const progress=document.querySelector<HTMLElement>('.progress-track span');
  if(progress) progress.style.width=`${(current+1)/slides.length*100}%`;
  syncLessonNavigation(current,slides.length);
  syncTranslation();
  history.replaceState(null,'',`#slide-${current+1}`);
}
const total=document.querySelector('[data-slide-total]');
if(total) total.textContent=String(slides.length);
slides.forEach((slide,index)=>{
  slide.dataset.currentLanguage='en';
  const item=document.createElement('li');
  const button=document.createElement('button');
  button.type='button';
  button.textContent=slide.dataset.title || `Slide ${index+1}`;
  button.addEventListener('click',()=>{ showSlide(index);overview?.close(); });
  item.append(button);overview?.querySelector('ol')?.append(item);
});
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(button=>button.addEventListener('click',()=>showSlide(current+(button.dataset.nav==='next'?1:-1))));
translate?.addEventListener('click',()=>{
  const slide=slides[current];
  const language=isChinese()?'en':'zh';
  slide.dataset.currentLanguage=language;
  slide.querySelectorAll<HTMLElement>('[data-language]').forEach(panel=>{panel.hidden=panel.dataset.language!==language;});
  syncTranslation();
});
document.querySelector('[data-overview]')?.addEventListener('click',()=>overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click',()=>overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click',()=>{
  const result=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
  void result.catch(()=>{});
});
bindLessonShortcuts(showSlide,()=>current,slides.length,overview);
initLessonTimer();
initClassNameDraw();

function save() {
  let saved=false;
  try {localStorage.setItem(storageKey,JSON.stringify({fields,checks}));saved=true;} catch { /* Retain the in-memory draft. */ }
  const status=document.querySelector('[data-save-status]');
  if(status) status.textContent=isChinese()
    ? saved?'筆記已儲存於此瀏覽器，並不提交。':'瀏覽器無法儲存，離開前請下載或複製文字。'
    : saved?'Notes saved in this browser. They are not submitted.':'Browser saving is unavailable. Download or copy your writing before leaving.';
}
function countWords() {
  const count=(fields.draft || '').match(/[A-Za-z]+(?:['’\-][A-Za-z]+)*|\d+/g)?.length || 0;
  const output=document.querySelector('[data-word-count]');
  if(output) output.textContent=`${count} ${count===1?'word':'words'} · aim for 80–100${count>=80&&count<=100?' · target reached':''}`;
}
document.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[data-ge-field]').forEach(input=>{
  const key=input.dataset.geField!;
  input.value=fields[key] || '';
  input.addEventListener('input',()=>{fields[key]=input.value;save();countWords();});
});
document.querySelectorAll<HTMLInputElement>('[data-ge-check]').forEach(input=>{
  const key=input.dataset.geCheck!;input.checked=checks[key] || false;
  input.addEventListener('change',()=>{checks[key]=input.checked;save();});
});
countWords();

document.querySelectorAll<HTMLButtonElement>('[data-guess]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-guess]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  const output=document.querySelector('[data-guess-feedback]');
  if(output) output.textContent=button.dataset.guess==='singer'
    ? isChinese()?'歌手最合理。音樂室、巨型喇叭和聽音樂都是線索。':'A singer is the best fit. The music room, giant speaker and listening to music are clues.'
    : isChinese()?'再看看與音樂有關的細節。哪個選項最合適？':'Look again at the music details. Which choice fits best?';
}));

const roomData:Record<string,{name:string;alt:string;example:string}>={
  'gaming-apartment':{name:'A. The gaming apartment / 遊戲公寓',alt:'An imagined gaming apartment with monitors, a sofa and a city view.',example:'The gaming apartment looks modern because it has a large computer setup.'},
  'music-rooftop-home':{name:'B. The music retreat / 音樂小天地',alt:'An imagined music studio opening onto a rooftop garden.',example:'The music retreat looks cosy because it has a soft sofa and warm lighting.'},
  'seaside-cabin':{name:'C. The seaside cabin / 海邊小屋',alt:'An imagined seaside cabin with a sofa and open doors facing the sea.',example:'The seaside cabin looks peaceful because it faces a quiet beach.'},
};
const imageDialog=document.querySelector<HTMLDialogElement>('.ge-image-dialog');
document.querySelectorAll<HTMLButtonElement>('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.enlarge!;
  const source=button.querySelector('img');
  const large=document.querySelector<HTMLImageElement>('[data-large-image]');
  if(!source||!large||!roomData[key])return;
  large.src=source.src;large.alt=roomData[key].alt;
  const caption=document.querySelector('[data-large-caption]');if(caption)caption.textContent=roomData[key].name;
  imageDialog?.showModal();
}));
document.querySelector('[data-close-image]')?.addEventListener('click',()=>imageDialog?.close());
document.querySelectorAll<HTMLButtonElement>('[data-room-switch]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.roomSwitch!;
  const source=document.querySelector<HTMLImageElement>(`[data-enlarge="${key}"] img`);
  const target=document.querySelector<HTMLImageElement>('[data-room-task]');
  if(!source||!target||!roomData[key])return;
  target.src=source.src;target.alt=roomData[key].alt;
  document.querySelectorAll('[data-room-switch]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  const example=document.querySelector('[data-room-example]');if(example)example.textContent=roomData[key].example;
}));

document.querySelector('[data-download]')?.addEventListener('click',()=>{
  const status=document.querySelector('[data-download-status]');
  if(!(fields.draft || '').trim()) {
    if(status) status.textContent=isChinese()?'請先在第12頁寫下描寫文。':'Write your description on slide 12 before saving.';
    return;
  }
  const labels:Record<string,string>={where:'Where',when:'When I visited',age:'Age of the home',special:'Why it is special',who:'Who lives/lived there',what:'What I did'};
  const text=['General English I · Week 9 · Perspectives I · Unit 2E','My secret home','',...Object.entries(labels).map(([key,label])=>`${label}: ${fields[key]||''}`),'','My description',fields.draft,'','My improved sentence',fields.improved||'','One useful adjective',fields.adjective||''].join('\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='general-english-week-9-my-secret-home.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  if(status)status.textContent=isChinese()?'已要求瀏覽器下載文字檔。':'Text download requested.';
});
const hash=Number(location.hash.match(/^#slide-(\d+)$/)?.[1] || 1)-1;
showSlide(hash);
