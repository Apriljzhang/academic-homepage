import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
const accessKey = 'tirf-202610-access';
const slides = Array.from(document.querySelectorAll<HTMLElement>('.tirf-deck .slide'));
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const translate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
if(translate)translate.title='Show Traditional Chinese guidance for this section; English activity text is retained';
let current = 0; let unlocked = false;
function showSlide(index:number) {
 if (!unlocked) return;
 current=Math.max(0,Math.min(slides.length-1,index));
 slides.forEach((slide,i)=>{const active=i===current;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active&&!document.body.classList.contains('tirf-reading')));if(active)slide.scrollTop=0;});
 const label=document.querySelector('[data-current-slide]');if(label)label.textContent=String(current+1);
 const progress=document.querySelector<HTMLElement>('.progress-track span');if(progress)progress.style.width=`${((current+1)/slides.length)*100}%`;
 syncLessonNavigation(current,slides.length);history.replaceState(null,'',`#slide-${current+1}`);syncTranslation();
 if(document.body.classList.contains('tirf-reading'))slides[current].scrollIntoView({block:'start'});
 const h=slides[current].querySelector<HTMLElement>('h1,h2');h?.setAttribute('tabindex','-1');h?.focus({preventScroll:true});
}
function syncTranslation(){const zh=slides[current]?.dataset.currentLanguage==='zh';if(translate){translate.textContent=zh?'English':'中文';translate.setAttribute('aria-pressed',String(zh));}}
function unlock(){if(unlocked)return;unlocked=true;document.querySelector<HTMLElement>('[data-tirf-access]')!.hidden=true;document.querySelector<HTMLElement>('[data-tirf-workshop]')!.hidden=false;try{sessionStorage.setItem(accessKey,'yes');}catch{}bindLessonShortcuts(showSlide,()=>current,slides.length,overview);initLessonTimer();showSlide(Number(location.hash.match(/^#slide-(\d+)$/)?.[1]||1)-1);}
const total=document.querySelector('[data-slide-total]');if(total)total.textContent=String(slides.length);
slides.forEach((slide,index)=>{slide.dataset.currentLanguage='en';const li=document.createElement('li');const b=document.createElement('button');b.type='button';b.textContent=slide.dataset.title||`Section ${index+1}`;b.addEventListener('click',()=>{overview?.close();showSlide(index);});li.append(b);overview?.querySelector('ol')?.append(li);});
document.querySelector('[data-tirf-access-form]')?.addEventListener('submit',e=>{e.preventDefault();const input=document.querySelector<HTMLInputElement>('#tirf-access-code');if(input?.value.trim()==='202610')unlock();else{const feedback=document.querySelector('#tirf-access-feedback');if(feedback)feedback.textContent='That code does not match this workshop. Please check the code provided by your instructor.';input?.setAttribute('aria-invalid','true');input?.focus();}});
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(b=>b.addEventListener('click',()=>showSlide(current+(b.dataset.nav==='next'?1:-1))));
document.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach(b=>b.addEventListener('click',()=>showSlide(Number(b.dataset.jump))));
translate?.addEventListener('click',()=>{const slide=slides[current];const zh=slide.dataset.currentLanguage!=='zh';slide.dataset.currentLanguage=zh?'zh':'en';slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==(zh?'zh':'en'));syncTranslation();});
document.querySelector('[data-overview]')?.addEventListener('click',()=>overview?.showModal());document.querySelector('[data-close-overview]')?.addEventListener('click',()=>overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click',()=>{const result=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();void result.catch(()=>{});});
document.querySelectorAll<HTMLButtonElement>('[data-reading]').forEach(b=>b.addEventListener('click',()=>{const reading=document.body.classList.toggle('tirf-reading');document.querySelectorAll<HTMLButtonElement>('[data-reading]').forEach(button=>{button.textContent=reading?'Switch to presenter view':'Switch to reading view';button.setAttribute('aria-pressed',String(reading));});showSlide(current);}));
async function copy(text:string,status:Element|null){try{await navigator.clipboard.writeText(text);if(status)status.textContent='Copied. Paste into your coding assistant and review before sending.';}catch{if(status)status.textContent='Clipboard unavailable. Select the prompt text and copy it manually.';}}
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(b=>b.addEventListener('click',()=>void copy(document.getElementById(b.dataset.copy||'')?.textContent||'',b.parentElement?.querySelector('[role=status]')||null)));
function brief(){return Array.from(document.querySelectorAll<HTMLTextAreaElement>('[data-brief]')).map(el=>`${el.dataset.brief}\n${el.value||'[blank]'}`).join('\n\n');}
document.querySelector('[data-copy-brief]')?.addEventListener('click',()=>void copy(brief(),document.querySelector('[data-brief-status]')));
function notes(){return 'AI Empowered Formative Assessment in TESOL\nApril Jiawei Zhang · AI4ELE / TIRF · 24 October 2026\nDesign guides: Black & Wiliam (2009) five strategies; goal-centred formative practice (Li & Gu, 2024)\n\nMY DESIGN BRIEF\n'+brief()+'\n\n'+Array.from(document.querySelectorAll<HTMLTextAreaElement>('[data-note]')).map(el=>`${el.dataset.note}\n${el.value||'[blank]'}`).join('\n\n')+'\n\nPEER CHECKLIST\n'+Array.from(document.querySelectorAll<HTMLInputElement>('[data-check]')).map(el=>`[${el.checked?'x':' '}] ${el.dataset.check}`).join('\n');}
document.querySelectorAll('[data-export]').forEach(b=>b.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([notes()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='my-formative-assessment-workshop.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);const status=document.querySelector('[data-export-status]');if(status)status.textContent='Workshop notes downloaded. Export learner writing separately within the lab.';}));
document.querySelector('[data-print]')?.addEventListener('click',()=>{const record=document.querySelector('#workshop-record');if(!record)return;const h=document.createElement('h1');h.textContent='My formative-assessment workshop notes';const pre=document.createElement('pre');pre.textContent=notes();record.replaceChildren(h,pre);document.body.classList.add('tirf-print-record');window.print();});
window.addEventListener('afterprint',()=>document.body.classList.remove('tirf-print-record'));
try{if(sessionStorage.getItem(accessKey)==='yes')unlock();}catch{}

document.querySelectorAll<HTMLButtonElement>('[data-framework]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll<HTMLButtonElement>('[data-framework]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));document.querySelectorAll<HTMLElement>('[data-framework-detail]').forEach(p=>p.hidden=p.dataset.frameworkDetail!==b.dataset.framework);}));
