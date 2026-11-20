import {syncLessonNavigation,bindLessonShortcuts} from './lessonDeck';
import {initLessonTimer} from './lessonTimer';

const slides=Array.from(document.querySelectorAll<HTMLElement>('.presentation-deck .slide'));
const overview=document.querySelector<HTMLDialogElement>('.overview-dialog');
const languageButton=document.querySelector<HTMLButtonElement>('[data-global-translate]');
const storageKey='doing-research-presentation-responses-v1';
let current=0;
let responses:Record<string,string>={};
let storageAvailable=true;
try { const saved=JSON.parse(localStorage.getItem(storageKey)||'{}'); if(saved && typeof saved==='object' && !Array.isArray(saved)) for(const [key,value] of Object.entries(saved)) if(typeof value==='string') responses[key]=value; } catch { storageAvailable=false; }

function syncLanguage(){
 const zh=slides[current].dataset.language==='zh';
 if(languageButton){languageButton.textContent=zh?'English':'中文';languageButton.setAttribute('aria-pressed',String(zh));}
 document.documentElement.lang=zh?'zh-Hant':'en-GB';
 overview?.querySelectorAll<HTMLButtonElement>('li button').forEach((button,i)=>button.textContent=(zh?slides[i].dataset.titleZh:slides[i].dataset.title)||'');
}
function showSlide(index:number){
 current=Math.max(0,Math.min(slides.length-1,index));
 slides.forEach((slide,i)=>{const active=i===current;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active));slide.inert=!active;});
 document.querySelector('[data-current-slide]')!.textContent=String(current+1);
 const progress=document.querySelector<HTMLElement>('.progress-track span'); if(progress)progress.style.width=`${100*(current+1)/slides.length}%`;
 syncLessonNavigation(current,slides.length);syncLanguage();
 history.replaceState(null,'',`#${slides[current].id}`);
}
slides.forEach((slide,index)=>{
 slide.dataset.language='en';
 const item=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=slide.dataset.title||slide.id;
 button.addEventListener('click',()=>{overview?.close();showSlide(index);});item.append(button);overview?.querySelector('ol')?.append(item);
});
document.querySelector('[data-slide-total]')!.textContent=String(slides.length);
languageButton?.addEventListener('click',()=>{const slide=slides[current],lang=slide.dataset.language==='zh'?'en':'zh';slide.dataset.language=lang;slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==lang);syncLanguage();});
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(button=>button.addEventListener('click',()=>showSlide(current+(button.dataset.nav==='next'?1:-1))));
document.querySelector('[data-overview]')?.addEventListener('click',()=>overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click',()=>overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click',()=>{const result=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();result.catch(()=>{});});
bindLessonShortcuts(showSlide,()=>current,slides.length,overview);
const hashIndex=()=>Math.max(0,slides.findIndex(s=>s.id===location.hash.slice(1)));
showSlide(hashIndex());window.addEventListener('hashchange',()=>showSlide(hashIndex()));initLessonTimer();

function showStorageStatus(){if(!storageAvailable)document.querySelectorAll<HTMLElement>('[data-save-status]').forEach(el=>el.textContent=el.closest('[data-language]')?.getAttribute('data-language')==='zh'?'本機儲存不可用。關閉頁面前，請下載計劃以保留回答。':'Local saving is unavailable. Download your plan before closing this page to keep your responses.');}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(responses));}catch{storageAvailable=false;showStorageStatus();}}
const fields=Array.from(document.querySelectorAll<HTMLTextAreaElement>('[data-response]'));
fields.forEach(field=>{
 field.value=responses[field.dataset.response!]||'';
 const print=document.createElement('span');print.className='print-response';print.textContent=field.value;field.after(print);
 field.addEventListener('input',()=>{const key=field.dataset.response!;responses[key]=field.value;fields.filter(f=>f.dataset.response===key).forEach(f=>{f.value=field.value;const p=f.nextElementSibling;if(p)p.textContent=field.value;});save();});
});showStorageStatus();

const budgets=Array.from(document.querySelectorAll<HTMLElement>('[data-budget]'));
function calculateBudget(box:HTMLElement){
 const zh=box.closest('[data-language]')?.getAttribute('data-language')==='zh';
 const slot=Number(box.querySelector<HTMLInputElement>('[data-slot]')!.value),qa=Number(box.querySelector<HTMLInputElement>('[data-qa]')!.value);
 const result=box.querySelector<HTMLElement>('[data-budget-result]')!;result.replaceChildren();
 if(!Number.isFinite(slot)||!Number.isFinite(qa)||slot<1||slot>120||qa<0||qa>=slot){const error=document.createElement('p');error.className='budget-error';error.textContent=zh?'總時段須為1至120分鐘；問答時間須大於或等於0，並小於總時段。':'Use a total slot of 1–120 minutes and a non-negative Q&A time shorter than the slot.';result.append(error);return;}
 const seconds=Math.round((slot-qa)*60),weights=[.10,.15,.15,.35,.15,.10];let allocated=0;
 const labels=zh?['開場與問題','研究提問與必要背景','方法','主要證據','詮釋與意涵','結尾']:['Opening and problem','Question and essential context','Approach','Main evidence','Interpretation and implications','Closing'];
 const title=document.createElement('strong');title.textContent=zh?`可用報告時間：${slot-qa}分鐘`:`Speaking time available: ${slot-qa} minutes`;result.append(title);
 const table=document.createElement('table'),body=document.createElement('tbody');const header=document.createElement('tr');
 for(const label of zh?['部分','建議時間']:['Part','Suggested time']){const th=document.createElement('th');th.scope='col';th.textContent=label;header.append(th);}const head=document.createElement('thead');head.append(header);table.append(head);
 const rows:string[]=[];
 labels.forEach((label,i)=>{const sec=i===labels.length-1?seconds-allocated:Math.round(seconds*weights[i]);allocated+=sec;const time=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;const row=document.createElement('tr');for(const text of [label,time]){const cell=document.createElement('td');cell.textContent=text;row.append(cell);}body.append(row);rows.push(`${label}: ${time}`);});
 table.append(body);result.append(table);return {slot,qa,summary:`Total slot: ${slot} min; Q&A: ${qa} min; speaking: ${slot-qa} min\n${rows.join('\n')}`};
}
budgets.forEach(box=>{const slot=box.querySelector<HTMLInputElement>('[data-slot]')!,qa=box.querySelector<HTMLInputElement>('[data-qa]')!;slot.value=responses.slot||'15';qa.value=responses.qa||'3';calculateBudget(box);box.querySelector('[data-budget-calculate]')?.addEventListener('click',()=>{const plan=calculateBudget(box);if(!plan)return;responses.slot=String(plan.slot);responses.qa=String(plan.qa);responses.timing=plan.summary;budgets.filter(b=>b!==box).forEach(b=>{b.querySelector<HTMLInputElement>('[data-slot]')!.value=slot.value;b.querySelector<HTMLInputElement>('[data-qa]')!.value=qa.value;calculateBudget(b);});save();});});

document.querySelectorAll('[data-export-plan]').forEach(button=>button.addEventListener('click',()=>{
 const zh=button.closest('[data-language]')?.getAttribute('data-language')==='zh';
 const lines=[zh?'學術報告規劃 · Doing Research · 第三課':'Academic presentation plan · Doing Research · Session 3',''];
 const seen=new Set<string>();fields.filter(f=>f.closest('[data-language]')?.getAttribute('data-language')===(zh?'zh':'en')).forEach(f=>{const key=f.dataset.response!;if(seen.has(key))return;seen.add(key);const label=Array.from(f.parentElement!.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim();lines.push(label,responses[key]||'—','');});
 if(responses.timing)lines.push(zh?'時間規劃':'Timing plan',responses.timing,'');
 const blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='Academic-Presentation-Plan.txt';document.body.append(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 const status=button.closest('.presentation-content')?.querySelector('[data-export-status]');if(status)status.textContent=zh?'已準備下載計劃。請確認檔案已儲存。':'Your plan is ready to download. Check that the file has saved.';
}));
let printDetails:boolean[]=[];
window.addEventListener('beforeprint',()=>{const language=slides[current].dataset.language;slides.forEach(slide=>{slide.inert=false;slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==language);});fields.forEach(f=>f.parentElement?.classList.toggle('empty-response',!f.value.trim()));printDetails=Array.from(document.querySelectorAll<HTMLDetailsElement>('.presentation-deck details')).map(d=>{const wasOpen=d.open;d.open=true;return wasOpen;});});
window.addEventListener('afterprint',()=>{slides.forEach((slide,i)=>{slide.inert=i!==current;slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==slide.dataset.language);});document.querySelectorAll<HTMLDetailsElement>('.presentation-deck details').forEach((d,i)=>d.open=printDetails[i]);});
document.querySelectorAll('[data-print-work]').forEach(button=>button.addEventListener('click',()=>window.print()));
