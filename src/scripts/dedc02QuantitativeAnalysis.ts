import { initQuantStories } from './quantStories';
import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
import { initQuantGlossary } from './quantGlossary';
import { methods as generalMethods, families as generalFamilies } from '../data/dedc02Quantitative';
import { methods as advancedMethods, families as advancedFamilies } from '../data/doingResearchQuantitative';
const advanced = Boolean(document.querySelector('[data-method-catalogue="advanced"]'));
const methods = advanced ? advancedMethods : generalMethods;
const families = advanced ? advancedFamilies : generalFamilies;
const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
const guided = Boolean(document.querySelector('[data-guided-lesson]'));
const lessonRoute = slides.flatMap((slide,index) => guided && slide.hasAttribute('data-independent-exploration') ? [] : [index]);
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const overviewList = overview?.querySelector('ol');
const translate = document.querySelector<HTMLButtonElement>('[data-global-translate]');
const prefix = advanced ? 'doing-research-advanced-quant-' : 'dedc02-topic8-';
const methodById = new Map(methods.map(m => [m.id,m]));
let current = 0;
const selectorIndex = slides.findIndex(s => s.hasAttribute('data-method-selector-slide'));
const mapIndex = slides.findIndex(s => s.hasAttribute('data-method-map-slide') || s.querySelector('[data-map-search]'));
const notationIndex = slides.findIndex(s => s.hasAttribute('data-notation-slide'));
function routePosition() {
  const position = lessonRoute.indexOf(current);
  return position < 0 ? Math.max(0,lessonRoute.indexOf(mapIndex)) : position;
}
function showLessonStep(position:number) { showSlide(lessonRoute[Math.max(0,Math.min(lessonRoute.length-1,position))]); }
const methodPageIndexes = new Map(slides.flatMap((s,i) => s.dataset.methodPage ? [[s.dataset.methodPage,i] as const] : []));
let mapReturnMethod = '';
let mapReturnScroll = 0;
function read(key: string) { try { return localStorage.getItem(prefix + key); } catch { return null; } }
function write(key: string, value: string) { try { localStorage.setItem(prefix + key,value); } catch { /* Editing and navigation remain available. */ } }
function syncLanguage() {
  const zh = slides[current]?.dataset.language === 'zh';
  slides[current]?.querySelectorAll<HTMLButtonElement>('[data-open-story]').forEach(button=>{button.textContent=zh?'生活故事例子':'Story example';button.setAttribute('aria-controls',`story-${button.dataset.openStory}-${zh?'zh':'en'}`);});
  slides[current]?.querySelectorAll<HTMLButtonElement>('[data-open-spss]').forEach(button=>{button.textContent=zh?'SPSS操作':'SPSS steps';});
  if (translate) { translate.textContent = zh ? 'English' : '中文'; translate.setAttribute('aria-pressed',String(zh)); }
}
function showSlide(index: number) {
  current = Math.max(0,Math.min(slides.length - 1,index));
  slides.forEach((s,i)=> { const active = i===current; s.classList.toggle('is-active',active); s.setAttribute('aria-hidden',String(!active)); });
  const label = document.querySelector<HTMLElement>('[data-current-slide]');
  const position=routePosition();
  if (label) label.textContent = String(position+1);
  const bar = document.querySelector<HTMLElement>('.progress-track span');
  if (bar) bar.style.width = `${100*(position+1)/lessonRoute.length}%`;
  syncLessonNavigation(position,lessonRoute.length); syncLanguage();
  if(guided && slides[current].hasAttribute('data-independent-exploration')) document.querySelector('[data-overview]')?.setAttribute('aria-label',`Independent exploration: ${slides[current].dataset.title}. Open lesson overview`);
  const method = slides[current].dataset.methodPage;
  history.replaceState(null,'',method ? `#method-${method}` : guided && slides[current].hasAttribute('data-independent-exploration') ? `#reference-${slides[current].dataset.referencePage}` : `#slide-${position+1}`);
}
slides.forEach(s=>s.dataset.language='en');
const total = document.querySelector<HTMLElement>('[data-slide-total]');
if (total) total.textContent = String(lessonRoute.length);
translate?.addEventListener('click',()=> {
  const slide = slides[current], zh = slide.dataset.language!=='zh';
  slide.dataset.language = zh?'zh':'en';
  slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==(zh?'zh':'en'));
  syncLanguage();
});
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(b=>b.addEventListener('click',()=>showLessonStep(routePosition()+(b.dataset.nav==='next'?1:-1))));
lessonRoute.forEach(i=> { const s=slides[i],li=document.createElement('li'), b=document.createElement('button'); b.type='button';b.textContent=s.dataset.title||String(i+1);b.addEventListener('click',()=>{overview?.close();showSlide(i);});li.append(b);overviewList?.append(li); });
document.querySelector('[data-overview]')?.addEventListener('click',()=>overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click',()=>overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click',()=> { const p=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();p?.catch(()=>{}); });
initLessonTimer();
initQuantStories();
bindLessonShortcuts(showLessonStep,routePosition,lessonRoute.length,overview);
function indexFromHash() {
  if(location.hash.startsWith('#method-')) return methodPageIndexes.get(location.hash.slice(8)) ?? 0;
  if(guided && location.hash.startsWith('#reference-')) return Math.max(0,slides.findIndex(s=>s.dataset.referencePage===location.hash.slice(11)));
  const n=Number(location.hash.replace('#slide-',''));
  return Number.isInteger(n)&&n>0 ? lessonRoute[Math.min(n-1,lessonRoute.length-1)] : 0;
}
showSlide(indexFromHash());
window.addEventListener('hashchange',()=>{const index=indexFromHash();if(index!==current)showSlide(index);});

type PickerState = {purpose:string; method:string; structure:string; revealed:boolean};
let state: PickerState = {purpose:'',method:'',structure:'',revealed:false};
try {
  const saved=JSON.parse(read('picker')||'null');
  if (saved && methodById.has(saved.method) && ['','independent','repeated','clustered','unknown'].includes(saved.structure)) state={purpose:methodById.get(saved.method)!.family,method:saved.method,structure:saved.structure,revealed:Boolean(saved.revealed)};
} catch { /* Ignore stale saved state. */ }
const pickers=Array.from(document.querySelectorAll<HTMLElement>('[data-picker]'));
function renderPickers() {
  const m=methodById.get(state.method);
  pickers.forEach(root=> {
    const zh=root.dataset.pickerLanguage==='zh';
    const purpose=root.querySelector<HTMLSelectElement>('[data-purpose]')!;
    const scenario=root.querySelector<HTMLSelectElement>('[data-scenario]')!;
    purpose.value=state.purpose;
    scenario.replaceChildren();
    const empty=document.createElement('option');empty.value='';empty.textContent=zh?'選擇具體問題……':'Select a specific question…';scenario.append(empty);
    methods.filter(x=>x.family===state.purpose).forEach(x=> {const o=document.createElement('option');o.value=x.id;o.textContent=zh?x.translated.question:x.question;scenario.append(o);});
    scenario.disabled=!state.purpose;scenario.value=state.method;
    const required=root.querySelector<HTMLElement>('[data-required]')!;
    required.hidden=!m;required.textContent=m?`${zh?'這個問題需要：':'This question needs: '}${zh?m.translated.data:m.data}`:'';
    root.querySelectorAll<HTMLInputElement>('[data-structure]').forEach(r=>r.checked=r.value===state.structure);
    root.querySelector<HTMLButtonElement>('[data-show-method]')!.disabled=!(m&&state.structure);
    const result=root.parentElement!.querySelector<HTMLElement>('[data-picker-result]')!;
    result.hidden=!(state.revealed&&m);
    result.querySelectorAll<HTMLElement>('[data-candidate]').forEach(p=>p.hidden=p.dataset.candidate!==state.method);
    const note=result.querySelector<HTMLElement>('[data-dependence-note]')!;
    note.hidden=!(state.revealed&&m);
    if (state.structure==='unknown') note.textContent=zh?'此候選方法是暫定建議：須先確立觀察結構、分析單位及目標量，才可確認模型。':'This is provisional: establish the observation structure, analysis unit and target quantity before confirming a model.';
    else if (['repeated','clustered'].includes(state.structure)) note.textContent=zh?'你選擇了依賴觀察。須保留配對、序列或群集結構；可能需要相應混合／多層、邊際或其他擴展。此選擇器不會自動把一個模型當作所有依賴問題的答案。':'You selected dependent observations. Preserve pairing, sequence or clustering; the candidate may need an appropriate mixed/multilevel, marginal or other extension. One model does not solve every dependence problem.';
    else note.textContent=zh?'你選擇了獨立觀察。請檢查資料是否實際符合：若研究問題涉及配對、時點、評分者或重複項目，須重新界定觀察結構。':'You selected independent observations. Check this against the actual design: questions involving pairs, occasions, raters or repeated items require an explicit dependence structure.';
    const status=root.querySelector<HTMLElement>('[data-picker-status]')!;
    status.textContent=state.revealed&&m?(zh?`候選方法：${m.zh}。以下顯示資料、計算及解讀。`:`Candidate: ${m.name}. Data, calculation and interpretation follow.`):'';
  });
  write('picker',JSON.stringify(state));
}
pickers.forEach(root=> {
  root.querySelector<HTMLSelectElement>('[data-purpose]')!.addEventListener('change',e=> {state={...state,purpose:(e.target as HTMLSelectElement).value,method:'',revealed:false};renderPickers();});
  root.querySelector<HTMLSelectElement>('[data-scenario]')!.addEventListener('change',e=> {state.method=(e.target as HTMLSelectElement).value;state.revealed=false;renderPickers();});
  root.querySelectorAll<HTMLInputElement>('[data-structure]').forEach(r=>r.addEventListener('change',()=> {state.structure=r.value;state.revealed=false;renderPickers();}));
  root.querySelector<HTMLButtonElement>('[data-show-method]')!.addEventListener('click',()=> {state.revealed=true;renderPickers();root.parentElement!.querySelector<HTMLElement>('[data-picker-result]')!.scrollIntoView({block:'start'});});
});
renderPickers();
document.querySelectorAll<HTMLElement>('[data-open-method]').forEach(b=>b.addEventListener('click',event=> {
  const m=methodById.get(b.dataset.openMethod!);if(!m)return;
  const pageIndex=methodPageIndexes.get(m.id);
  if(pageIndex!==undefined){
    event.preventDefault();
    if(current===mapIndex){mapReturnMethod=m.id;mapReturnScroll=slides[mapIndex].scrollTop;}
    const lang=slides[current].dataset.language||'en',slide=slides[pageIndex];
    slide.dataset.language=lang;slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==lang);
    showSlide(pageIndex);slide.scrollTop=0;
    const heading=slide.querySelector<HTMLElement>(`[data-language="${lang}"] h2`);
    heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});return;
  }
  if(selectorIndex<0){
    const lang=slides[current].dataset.language||'en',slide=slides[mapIndex];
    slide.dataset.language=lang;slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==lang);
    const panel=slide.querySelector<HTMLElement>(`.slide-inner > [data-language="${lang}"]`)!;
    const search=panel.querySelector<HTMLInputElement>('[data-map-search]');if(search){search.value='';search.dispatchEvent(new Event('input'));}
    const method=panel.querySelector<HTMLDetailsElement>(`[data-map-method="${m.id}"]`)!;
    method.closest<HTMLDetailsElement>('[data-map-family]')!.open=true;method.open=true;showSlide(mapIndex);method.scrollIntoView({block:'start'});return;
  }
  const lang=slides[current].dataset.language||'en';state={purpose:m.family,method:m.id,structure:state.structure||'unknown',revealed:true};renderPickers();
  const slide=slides[selectorIndex];slide.dataset.language=lang;slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==lang);showSlide(selectorIndex);slide.scrollTop=0;
}));
document.querySelectorAll('[data-return-selector]').forEach(b=>b.addEventListener('click',()=>{const target=selectorIndex<0?mapIndex:selectorIndex;showSlide(target);slides[target].scrollTop=0;}));
function jumpReference(index:number){
  if(index<0)return;const lang=slides[current].dataset.language||'en',slide=slides[index];
  if(current===mapIndex)mapReturnScroll=slides[mapIndex].scrollTop;
  slide.dataset.language=lang;slide.querySelectorAll<HTMLElement>('[data-language]').forEach(p=>p.hidden=p.dataset.language!==lang);showSlide(index);slide.scrollTop=0;
}
document.querySelectorAll<HTMLButtonElement>('[data-open-spss]').forEach(button=>button.addEventListener('click',()=>{
  const index=slides.findIndex(slide=>slide.dataset.coreStep===`${button.dataset.openSpss}-output`);
  if(index<0)return;
  const lang=slides[current].dataset.language||'en',slide=slides[index];
  slide.dataset.language=lang;
  slide.querySelectorAll<HTMLElement>('[data-language]').forEach(panel=>panel.hidden=panel.dataset.language!==lang);
  showSlide(index);
  const guide=slide.querySelector<HTMLDetailsElement>(`[data-language="${lang}"] [data-spss-guide]`);
  if(!guide)return;
  guide.open=true;
  guide.scrollIntoView({block:'start'});
  const summary=guide.querySelector<HTMLElement>('summary');summary?.focus({preventScroll:true});
}));
const spssGuides=Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-spss-guide]'));
spssGuides.forEach(guide=>guide.addEventListener('toggle',()=>{
  spssGuides.filter(other=>other!==guide&&other.dataset.spssGuide===guide.dataset.spssGuide).forEach(other=>{
    if(other.open!==guide.open)other.open=guide.open;
  });
}));
document.querySelectorAll('[data-open-notation]').forEach(b=>b.addEventListener('click',()=>jumpReference(notationIndex)));
const glossaryGroups=Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-notation-group]'));
glossaryGroups.forEach(group=>group.addEventListener('toggle',()=>{
  glossaryGroups.filter(other=>other!==group&&other.dataset.notationGroup===group.dataset.notationGroup).forEach(other=>{
    if(other.open!==group.open)other.open=group.open;
  });
}));
document.querySelectorAll('[data-glossary-expand]').forEach(b=>b.addEventListener('click',()=>glossaryGroups.forEach(group=>group.open=true)));
document.querySelectorAll('[data-glossary-collapse]').forEach(b=>b.addEventListener('click',()=>glossaryGroups.forEach(group=>group.open=false)));
document.querySelectorAll<HTMLElement>('[data-jump-reference]').forEach(b=>b.addEventListener('click',()=>jumpReference(slides.findIndex(s=>s.dataset.referencePage===b.dataset.jumpReference))));
document.querySelectorAll('[data-return-map]').forEach(b=>b.addEventListener('click',()=>{
  jumpReference(mapIndex);
  const slide=slides[mapIndex];slide.scrollTop=mapReturnScroll;
  const lang=slide.dataset.language||'en';
  slide.querySelector<HTMLElement>(`[data-language="${lang}"] [data-open-method="${mapReturnMethod}"]`)?.focus({preventScroll:true});
}));
document.querySelectorAll<HTMLInputElement>('[data-notation-search]').forEach(input=>input.addEventListener('input',()=>{
  const panel=input.closest<HTMLElement>('[data-language]')!,q=input.value.trim().toLowerCase();let count=0;
  panel.querySelectorAll<HTMLElement>('[data-notation-entry]').forEach(e=>{
    const match=!q||(q.length<=2?e.dataset.notationSymbols!.split('|').some(a=>a.toLowerCase()===q):e.dataset.notationSearchText!.toLowerCase().includes(q));
    e.hidden=!match;if(match)count++;
  });
  panel.querySelectorAll<HTMLElement>('[data-notation-group]').forEach(g=>g.hidden=!Array.from(g.querySelectorAll<HTMLElement>('[data-notation-entry]')).some(e=>!e.hidden));
  panel.querySelector<HTMLElement>('[data-notation-status]')!.textContent=panel.dataset.language==='zh'?`${count}項術語`:`${count} ${count===1?'entry':'entries'}`;
}));

document.querySelectorAll<HTMLInputElement>('[data-map-search]').forEach(input=>input.addEventListener('input',()=> {
  const panel=input.closest<HTMLElement>('[data-language]')!,q=input.value.trim().toLowerCase();let n=0;
  panel.querySelectorAll<HTMLElement>('[data-map-entry]').forEach(e=>{e.hidden=!e.dataset.search!.toLowerCase().includes(q);if(!e.hidden)n++;});
  panel.querySelectorAll<HTMLDetailsElement>('[data-map-family]').forEach(d=>{d.hidden=!Array.from(d.querySelectorAll<HTMLElement>('[data-map-entry]')).some(e=>!e.hidden);if(q&&!d.hidden)d.open=true;});
  panel.querySelectorAll<HTMLElement>('.qm-map-group').forEach(g=>g.hidden=!Array.from(g.querySelectorAll<HTMLElement>('[data-map-family]')).some(f=>!f.hidden));
  const status=panel.querySelector<HTMLElement>('[data-map-status]')!;status.textContent=panel.dataset.language==='zh'?`${n}項方法`:`${n} ${n===1?'method':'methods'}`;
}));

document.querySelectorAll<HTMLElement>('[data-mediation]').forEach(box=> {
 const update=()=>{const val=(k:string)=>Number(box.querySelector<HTMLInputElement>(`[data-med="${k}"]`)!.value);const a=val('a'),b=val('b'),c=val('direct');box.querySelectorAll<HTMLOutputElement>('[data-med-value]').forEach(o=>o.value=val(o.dataset.medValue!).toFixed(2));box.querySelector<HTMLElement>('[data-med-result]')!.textContent=`ab = ${a.toFixed(2)} × ${b.toFixed(2)} = ${(a*b).toFixed(3)}; c′ + ab = ${c.toFixed(2)} + ${(a*b).toFixed(3)} = ${(c+a*b).toFixed(3)}`;};
 box.querySelectorAll('input').forEach(i=>i.addEventListener('input',update));update();
});
document.querySelectorAll<HTMLElement>('[data-moderation]').forEach(box=> {
 const input=box.querySelector<HTMLInputElement>('[data-w]')!;
 const update=()=>{const w=Number(input.value);box.querySelector<HTMLOutputElement>('[data-w-value]')!.value=w.toFixed(1);box.querySelector<HTMLElement>('[data-slope-result]')!.textContent=`slope(X) = 0.4 + 0.2 × (${w.toFixed(1)}) = ${(0.4+0.2*w).toFixed(2)}`;};input.addEventListener('input',update);update();
});
document.querySelectorAll<HTMLElement>('[data-quant-quiz]').forEach(quiz=> {
 const select=quiz.querySelector<HTMLSelectElement>('[data-quiz-choice]')!,feedback=quiz.querySelector<HTMLElement>('[data-feedback]')!;
 quiz.querySelector('[data-check-quiz]')?.addEventListener('click',()=> {const zh=Boolean(quiz.closest('[data-language="zh"]'));if(select.value===''){feedback.textContent=zh?'請先選擇。':'Choose an interpretation first.';return;}const good=select.value===quiz.dataset.answer;feedback.textContent=`${zh?(good?'有根據。':'請修訂。'):(good?'Defensible. ':'Revise this interpretation. ')}${quiz.dataset.why}`;});
 select.addEventListener('change',()=>feedback.textContent='');
});
function syncJars() {
 const ticks=new Set(jarsKeys.filter(k=>read('jars-'+k)==='true'));
 document.querySelectorAll<HTMLInputElement>('[data-jars]').forEach(i=>i.checked=ticks.has(i.dataset.jars!));
 document.querySelectorAll<HTMLElement>('[data-jars-status]').forEach(o=>o.textContent=o.closest('[data-language="zh"]')?`${ticks.size} / ${jarsKeys.length}項已標記有報告位置。`:`${ticks.size} of ${jarsKeys.length} prompts marked with a report location.`);
}
const jarsKeys=Array.from(new Set(Array.from(document.querySelectorAll<HTMLInputElement>('[data-jars]')).map(i=>i.dataset.jars!)));
document.querySelectorAll<HTMLInputElement>('[data-jars]').forEach(i=>i.addEventListener('change',()=>{write('jars-'+i.dataset.jars,String(i.checked));syncJars();}));syncJars();
const fields=Array.from(document.querySelectorAll<HTMLTextAreaElement>('textarea[data-save]'));
fields.forEach(f=> {f.value=read('plan-'+f.dataset.save)||'';f.addEventListener('input',()=>{write('plan-'+f.dataset.save,f.value);fields.filter(x=>x.dataset.save===f.dataset.save&&x!==f).forEach(x=>x.value=f.value);});});
const detailStates=new Map<HTMLDetailsElement,boolean>();
const atlasHiddenStates=new Map<HTMLElement,boolean>();
const printLanguageStates=new Map<HTMLElement,boolean>();
window.addEventListener('beforeprint',()=> {
 document.querySelectorAll<HTMLElement>('.slide-inner > [data-language]').forEach(panel=>{printLanguageStates.set(panel,panel.hidden);panel.hidden=panel.dataset.language!=='en';});
 document.querySelectorAll<HTMLDetailsElement>('.qm-deck details').forEach(d=>{detailStates.set(d,d.open);d.open=true;});
 document.querySelectorAll<HTMLElement>('[data-map-entry],[data-map-family],[data-notation-entry],[data-notation-group]').forEach(e=>{atlasHiddenStates.set(e,e.hidden);e.hidden=false;});
 fields.forEach(f=>{const p=document.createElement('p');p.className='qm-print-response';p.style.whiteSpace='pre-wrap';p.textContent=f.value||'—';f.after(p);f.style.display='none';});
});
window.addEventListener('afterprint',()=> {printLanguageStates.forEach((hidden,panel)=>panel.hidden=hidden);printLanguageStates.clear();detailStates.forEach((value,d)=>d.open=value);detailStates.clear();atlasHiddenStates.forEach((hidden,e)=>e.hidden=hidden);atlasHiddenStates.clear();document.querySelectorAll('.qm-print-response').forEach(p=>p.remove());fields.forEach(f=>f.style.display='');});
document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
if(!advanced) initQuantGlossary();
