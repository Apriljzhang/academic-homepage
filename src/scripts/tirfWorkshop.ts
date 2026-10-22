import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
import { workshopTitle, openingExample } from '../data/tirfWorkshop';
import { createTrainingPdf } from './tirfTrainingPdf';
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
function notes(){return 'AI Empowered Formative Assessment in TESOL\nApril Jiawei Zhang · AI4ELE / TIRF · 24 October 2026\nOutcomes: explain formative assessment / AfL; design, test and improve a language-class activity with Codex or WorkBuddy\n\nMY DESIGN BRIEF\n'+brief()+'\n\n'+Array.from(document.querySelectorAll<HTMLTextAreaElement>('[data-note]')).map(el=>`${el.dataset.note}\n${el.value||'[blank]'}`).join('\n\n')+'\n\nPEER CHECKLIST\n'+Array.from(document.querySelectorAll<HTMLInputElement>('[data-check]')).map(el=>`[${el.checked?'x':' '}] ${el.dataset.check}`).join('\n');}
document.querySelectorAll('[data-export]').forEach(b=>b.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([notes()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='my-formative-assessment-workshop.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);const status=document.querySelector('[data-export-status]');if(status)status.textContent='Workshop notes downloaded. Export learner writing separately within the activity.';}));
const pdfDialog=document.querySelector<HTMLDialogElement>('[data-pdf-dialog]');
document.querySelector('[data-pdf-open]')?.addEventListener('click',()=>pdfDialog?.showModal());
document.querySelector('[data-pdf-close]')?.addEventListener('click',()=>pdfDialog?.close());
function addRecordText(parent:Element,tag:string,text:string,className=''){
 const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;parent.append(el);return el;
}
function prepareTrainingRecord(){
 const record=document.querySelector('#workshop-record');if(!record)return;
 record.replaceChildren();
 addRecordText(record,'h1','My TIRF training record / 我的培訓紀錄');
 addRecordText(record,'p',workshopTitle);
 addRecordText(record,'p','April Jiawei Zhang · AI4ELE / TIRF · 24 October 2026');
 addRecordText(record,'h2','Workshop focus');
 addRecordText(record,'p','Understand formative assessment / AfL, then design, test and improve a language-class activity with Codex or WorkBuddy.');
 addRecordText(record,'h2','The classroom example');
 addRecordText(record,'p',`Intermediate English writing. Goal: ${openingExample.goal}`);
 addRecordText(record,'p',`Opinion: ${openingExample.claim}`);
 addRecordText(record,'h3','Paragraph A');addRecordText(record,'p',openingExample.paragraphA);
 addRecordText(record,'h3','Paragraph B');addRecordText(record,'p',openingExample.paragraphB);
 addRecordText(record,'p','Two records of the same answer: “B. Correct. 1/1.” and “B, because it is longer.” What does the reason suggest, and what would you check or teach next?');
 slides.forEach(slide=>{
  const fields=Array.from(slide.querySelectorAll<HTMLTextAreaElement>('textarea[data-note],textarea[data-brief]'));
  const checks=Array.from(slide.querySelectorAll<HTMLInputElement>('input[data-check]'));
  if(!fields.length&&!checks.length)return;
  const section=document.createElement('section');section.className='pdf-section';record.append(section);
  addRecordText(section,'h2',slide.dataset.title||'My responses');
  fields.forEach(field=>{
   const label=field.labels?.[0]?.textContent?.replace(/\s+/g,' ').trim()||field.dataset.note||field.dataset.brief||'Response';
   addRecordText(section,'h3',label);
   addRecordText(section,'p',field.value.trim()?field.value:'Not answered / 未作答','pdf-response');
  });
  checks.forEach(check=>addRecordText(section,'p',`${check.checked?'[x]':'[ ]'} ${check.dataset.check}`));
 });
 addRecordText(record,'p','This record contains responses entered on the workshop slides. Writing in the separate learner activity is exported from that activity.');
}
document.querySelector<HTMLButtonElement>('[data-pdf-download]')?.addEventListener('click',async event=>{
 const button=event.currentTarget as HTMLButtonElement;
 const status=document.querySelector('[data-pdf-status]');
 button.disabled=true;if(status)status.textContent='Creating your PDF… / 正在製作PDF…';
 try{
  prepareTrainingRecord();
  const record=document.querySelector('#workshop-record');if(!record)throw new Error('Training record unavailable.');
  const bytes=await createTrainingPdf(record);
  const url=URL.createObjectURL(new Blob([bytes.slice().buffer],{type:'application/pdf'}));
  const a=document.createElement('a');a.href=url;a.download='my-tirf-training-record.pdf';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  if(status)status.textContent='Training PDF downloaded, including your typed responses. / 已下載包含作答的培訓PDF。';
 }catch(error){if(status)status.textContent=`The PDF could not be created. Your responses are still here; retry or download the text notes. ${error instanceof Error?error.message:''}`;}
 finally{button.disabled=false;}
});
window.addEventListener('afterprint',()=>document.body.classList.remove('tirf-print-record'));
try{if(sessionStorage.getItem(accessKey)==='yes')unlock();}catch{}

document.querySelectorAll<HTMLButtonElement>('[data-framework]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll<HTMLButtonElement>('[data-framework]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));document.querySelectorAll<HTMLElement>('[data-framework-detail]').forEach(p=>p.hidden=p.dataset.frameworkDetail!==b.dataset.framework);}));

// Keep a newly opened model in view when the previous model collapses.
document.querySelectorAll<HTMLDetailsElement>('.framework-section').forEach(section=>section.addEventListener('toggle',()=>{
 if(section.open)section.querySelector('summary')?.scrollIntoView({block:'start',behavior:'instant'});
}));
