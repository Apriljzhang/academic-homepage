import { initTirfResourceLinks } from './tirfResourceLinks.js';
import { createCustomSitePrompt } from './tirfCustomSitePrompt.js';
import { buildEn, buildZh } from '../data/tirfSite';
import { initTirfScenarioChoices } from './tirfScenarioChoices.js';
import { frameworkAiRequests } from '../data/tirfFrameworkPrompts';
import { activityBuildBrief, frameworkBuildRoles } from '../data/tirfActivityDesign';
import { syncLessonNavigation, bindLessonShortcuts } from './lessonDeck';
import { initLessonTimer } from './lessonTimer';
import { initTirfClassroomActivity } from './tirfClassroomActivity.js';
import { workshopTitle, caseContext, caseContextZh, feedbackPrompt, workedPlan, worksheet, planningGroups, prompts } from '../data/tirfWorkshop';
import { tirfStrategies } from '../data/tirfStrategies';
import { createTrainingPdf } from './tirfTrainingPdf';
const accessKey='tirf-202610-access';
const slides=Array.from(document.querySelectorAll<HTMLElement>('.tirf-deck .slide'));
const overview=document.querySelector<HTMLDialogElement>('.overview-dialog');
const translate=document.querySelector<HTMLButtonElement>('[data-global-translate]');
let current=0, unlocked=false, useWorkedPlan=false;
const zh=()=>slides[current]?.dataset.currentLanguage==='zh';
const say=(en:string,chinese:string)=>zh()?chinese:en;
function applyLanguage(root:ParentNode,chinese:boolean){
 root.querySelectorAll<HTMLElement>('[data-language]').forEach(element=>element.hidden=element.dataset.language!==(chinese?'zh':'en'));
 root.querySelectorAll<HTMLTextAreaElement>('[data-placeholder-en]').forEach(field=>field.placeholder=chinese?field.dataset.placeholderZh||'':field.dataset.placeholderEn||'');
}
const timerWords=[['Start','開始'],['Pause','暫停'],['Resume','繼續'],['Time is up.','時間到。'],['Paused.','已暫停。'],['Enter a time between 0 and 999 minutes.','請輸入大於0且不超過999分鐘的時間。'],['Timer running. A ding will sound when time is up.','計時中，時間到會響鈴。']];
function localiseTimer(){
 for(const selector of ['[data-timer-start]','[data-timer-status]']){
  const element=document.querySelector<HTMLElement>(selector);if(!element)continue;
  const pair=timerWords.find(values=>values.includes(element.textContent||''));
  if(pair){const next=pair[zh()?1:0];if(element.textContent!==next)element.textContent=next;}
 }
 const minutes=document.querySelector<HTMLInputElement>('[data-timer-minutes]');if(minutes){minutes.placeholder=say('min','分鐘');minutes.setAttribute('aria-label',say('Timer minutes','計時分鐘'));}
 document.querySelector('[data-timer-reset]')?.setAttribute('aria-label',say('Reset timer','重設計時'));
}
function syncTranslation(){
 applyLanguage(slides[current],zh());
 document.querySelectorAll('dialog').forEach(dialog=>applyLanguage(dialog,zh()));
 if(translate){translate.textContent=zh()?'English':'中文';translate.setAttribute('aria-pressed',String(zh()));translate.title=say('Show Traditional Chinese','顯示英語');}
 overview?.querySelectorAll<HTMLButtonElement>('ol button').forEach((button,i)=>button.textContent=(zh()?slides[i].dataset.titleZh:slides[i].dataset.title)||'');
 const overviewTitle=document.querySelector('#lesson-overview-title');if(overviewTitle)overviewTitle.textContent=say('Designing formative assessment with generative AI','用生成式AI設計形成性評估');
 const help=overview?.querySelector(':scope > p');if(help)help.textContent=say('Use ← → or Page Up / Page Down to navigate. O opens the overview. F enters full screen.','以← →或Page Up／Page Down換頁，O開啟目錄，F全螢幕。');
 document.querySelector('[data-nav="previous"]')?.setAttribute('aria-label',say('Previous slide','上一頁'));
 document.querySelector('[data-nav="next"]')?.setAttribute('aria-label',say('Next slide','下一頁'));
 document.querySelector('[data-overview]')?.setAttribute('aria-label',say(`Slide ${current+1} of ${slides.length}. Open slide overview`,`第${current+1}頁，共${slides.length}頁。開啟目錄`));
 for(const [selector,en,chinese] of [
  ['[data-nav="previous"]','Previous slide','上一頁'],['[data-nav="next"]','Next slide','下一頁'],
  ['[data-overview]','Slide overview','頁面目錄'],['[data-close-overview]','Close overview','關閉目錄'],
  ['[data-fullscreen]','Full screen','全螢幕'],['.lesson-home','Back to training materials','返回培訓材料'],
  ['[data-timer-reset]','Reset timer','重設計時']
 ]){const element=document.querySelector(selector);if(element){element.setAttribute('title',say(en,chinese));if(selector!=='[data-overview]')element.setAttribute('aria-label',say(en,chinese));}}
 localiseTimer();renderPlanSummary();updatePlanSource();
 document.querySelectorAll<HTMLElement>('.status:not([data-case-status]),[data-pdf-status]').forEach(status=>status.textContent='');
 document.querySelectorAll<HTMLElement>('[data-case-status]').forEach(status=>{if(status.textContent)status.textContent=say('Use the feedback or partner question to revise after keeping your first attempt.','先保留初稿，再依回饋或同伴問題修訂。');});
}
function showSlide(index:number){
 if(!unlocked)return;
 current=Math.max(0,Math.min(slides.length-1,index));
 slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===current);slide.setAttribute('aria-hidden',String(i!==current));if(i===current)slide.scrollTop=0;});
 const counter=document.querySelector('[data-current-slide]');if(counter)counter.textContent=String(current+1);
 const progress=document.querySelector<HTMLElement>('.progress-track span');if(progress)progress.style.width=`${(current+1)/slides.length*100}%`;
 syncLessonNavigation(current,slides.length);history.replaceState(null,'',`#slide-${current+1}`);syncTranslation();
 const heading=slides[current].querySelector<HTMLElement>('h1,h2');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});
}
function unlock(){
 if(unlocked)return;unlocked=true;
 document.querySelector<HTMLElement>('[data-tirf-access]')!.hidden=true;document.querySelector<HTMLElement>('[data-tirf-workshop]')!.hidden=false;
 try{sessionStorage.setItem(accessKey,'yes');}catch{}
 bindLessonShortcuts(showSlide,()=>current,slides.length,overview);initLessonTimer();
 document.querySelectorAll<HTMLElement>('[data-timer-start],[data-timer-status]').forEach(element=>new MutationObserver(localiseTimer).observe(element,{childList:true,characterData:true,subtree:true}));
 showSlide(Number(location.hash.match(/^#slide-(\d+)$/)?.[1]||1)-1);
}
const total=document.querySelector('[data-slide-total]');if(total)total.textContent=String(slides.length);
slides.forEach((slide,i)=>{slide.dataset.currentLanguage='en';const item=document.createElement('li');const button=document.createElement('button');button.type='button';button.textContent=slide.dataset.title||'';button.addEventListener('click',()=>{overview?.close();showSlide(i);});item.append(button);overview?.querySelector('ol')?.append(item);});
document.querySelector('[data-tirf-access-form]')?.addEventListener('submit',event=>{event.preventDefault();const field=document.querySelector<HTMLInputElement>('#tirf-access-code');if(field?.value.trim()==='202610')unlock();else{const status=document.querySelector('#tirf-access-feedback');if(status)status.textContent='Please check the workshop code. / 請核對工作坊進入碼。';field?.setAttribute('aria-invalid','true');field?.focus();}});
document.querySelectorAll<HTMLButtonElement>('[data-nav]').forEach(button=>button.addEventListener('click',()=>showSlide(current+(button.dataset.nav==='next'?1:-1))));
document.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach(button=>button.addEventListener('click',()=>showSlide(Number(button.dataset.jump))));
translate?.addEventListener('click',()=>{slides[current].dataset.currentLanguage=zh()?'en':'zh';syncTranslation();});
document.querySelector('[data-overview]')?.addEventListener('click',()=>overview?.showModal());document.querySelector('[data-close-overview]')?.addEventListener('click',()=>overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click',()=>{void(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()).catch(()=>{});});
initTirfScenarioChoices(document);
initTirfResourceLinks(document);
document.querySelectorAll('[data-classroom-activity]').forEach(root=>initTirfClassroomActivity(root));
document.querySelectorAll<HTMLDetailsElement>('.framework-section').forEach(section=>section.addEventListener('toggle',()=>{if(section.open)section.querySelector('summary')?.scrollIntoView({block:'start',behavior:'instant'});}));
document.querySelectorAll<HTMLButtonElement>('[data-framework]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-framework]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));document.querySelectorAll<HTMLElement>('[data-framework-detail]').forEach(panel=>panel.hidden=panel.dataset.frameworkDetail!==button.dataset.framework);}));
function planValue(id:string){return document.querySelector<HTMLTextAreaElement>(`#brief-${id}`)?.value||'';}
function ownPlan(chinese=zh()){return worksheet.map(field=>`${chinese?field.labelZh:field.label}\n${planValue(field.id)|| (chinese?'［尚未填寫］':'[not yet completed]')}`).join('\n\n');}
function workedPlanText(chinese=zh()){return (chinese?caseContextZh:caseContext)+'\n\n'+activityBuildBrief(chinese)+'\n\n'+workedPlan.map(row=>`${chinese?row.stageZh:row.stage}\n${chinese?row.designZh:row.design}\n${chinese?row.frameworkZh:row.framework}`).join('\n\n');}
function hasOwnPlan(){return worksheet.some(field=>planValue(field.id).trim());}
function currentPlan(){return useWorkedPlan?workedPlanText():ownPlan();}
function updatePlanSource(){const indicator=document.querySelector('[data-plan-source]');if(indicator)indicator.textContent=useWorkedPlan?say('Using the worked classroom case copied on the previous page.','使用上一頁複製的完整課堂案例。'):hasOwnPlan()?say('The copy buttons below include your current classroom plan.','下方複製按鈕會同時包含你目前的課堂計劃。'):say('Complete your own plan first, or copy the complete worked plan from the previous page.','請先完成自己的計劃，或從上一頁複製完整示範計劃。');}
async function copy(text:string,status:Element|null,destination:'agent'|'chatbot'='agent'){try{await navigator.clipboard.writeText(text);if(status)status.textContent=destination==='chatbot'?say('Copied. Paste into your chatbot.','已複製，請貼入你的聊天機器人。'):say('Copied. Paste into WorkBuddy or Codex.','已複製，請貼入WorkBuddy或Codex。');}catch{if(status){status.textContent=say('Select and copy the prompt below.','請選取下方指令並複製。');const field=document.createElement('textarea');field.readOnly=true;field.value=text;field.rows=6;field.setAttribute('aria-label',say('AI prompt to copy','可複製的AI指令'));status.append(field);field.focus();field.select();}}}
document.querySelectorAll<HTMLButtonElement>('[data-framework-copy]').forEach(button=>button.addEventListener('click',()=>{const request=frameworkAiRequests.find(r=>r.key===button.dataset.frameworkCopy);if(request)void copy(zh()?request.zh:request.en,button.parentElement?.querySelector('[role=status]')||null,request.key.startsWith('site-')?'agent':'chatbot');}));
document.querySelector('[data-copy-feedback]')?.addEventListener('click',event=>void copy(zh()?feedbackPrompt.zh:feedbackPrompt.en,(event.currentTarget as Element).parentElement?.querySelector('[role=status]')||null));
document.querySelectorAll<HTMLButtonElement>('[data-strategy-copy]').forEach(button=>button.addEventListener('click',()=>{const strategy=tirfStrategies.find(row=>row.key===button.dataset.strategyCopy);if(strategy)void copy((zh()?caseContextZh:caseContext)+'\n\n'+(zh()?strategy.aiZh:strategy.ai),button.parentElement?.querySelector('[role=status]')||null);}));
document.querySelector('[data-copy-worked]')?.addEventListener('click',()=>{useWorkedPlan=true;void copy(workedPlanText(),document.querySelector('[data-worked-status]'));updatePlanSource();});
document.querySelector('[data-copy-brief]')?.addEventListener('click',()=>{useWorkedPlan=false;void copy(createCustomSitePrompt(worksheet,Object.fromEntries(worksheet.map(field=>[field.id,planValue(field.id)])),{en:buildEn,zh:buildZh},zh()),document.querySelector('[data-brief-status]'));updatePlanSource();});
document.querySelectorAll<HTMLButtonElement>('[data-copy-prompt]').forEach(button=>button.addEventListener('click',()=>{
 const status=button.parentElement?.querySelector('[role=status]')||null;
 if(!hasOwnPlan()&&!useWorkedPlan){if(status)status.textContent=say('First complete your classroom plan, or copy the worked plan on the previous page.','請先完成自己的課堂計劃，或複製上一頁的示範計劃。');return;}
 const prompt=prompts[Number(button.dataset.copyPrompt)];
 const request=(zh()?prompt.textZh:prompt.text).replace(zh()?/［貼上[^］]+］/g:/\[Paste[^\]]+\]/g,()=>currentPlan());
 void copy(request,status);
}));
document.querySelectorAll<HTMLTextAreaElement>('[data-brief]').forEach(field=>field.addEventListener('input',()=>{useWorkedPlan=false;updatePlanSource();}));
function renderPlanSummary(){
 const root=document.querySelector('[data-plan-summary]');if(!root)return;root.replaceChildren();
 if(!hasOwnPlan()){const paragraph=document.createElement('p');paragraph.textContent=say('Your plan will appear here after you complete “Design formative assessment for your class”.','完成「為自己的班級設計形成性評估」後，你的計劃會顯示在這裏。');root.append(paragraph);return;}
 planningGroups.forEach((group,index)=>{const heading=document.createElement('h3');heading.textContent=zh()?group.titleZh:group.title;root.append(heading);const list=document.createElement('dl');worksheet.filter(field=>field.group===index).forEach(field=>{const term=document.createElement('dt');term.textContent=zh()?field.labelZh:field.label;const definition=document.createElement('dd');definition.textContent=planValue(field.id)||say('Not yet completed','尚未填寫');list.append(term,definition);});root.append(list);});
}
function addRecordText(parent:Element,tag:string,text:string){const element=document.createElement(tag);element.textContent=text;parent.append(element);return element;}
function prepareTrainingRecord(){
 const record=document.querySelector('#workshop-record');if(!record)return;record.replaceChildren();
 addRecordText(record,'h1',say('My formative assessment plan','我的形成性評估計劃'));
 addRecordText(record,'p',workshopTitle);addRecordText(record,'p','April Jiawei Zhang · AI4ELE / TIRF · 24 October 2026');
 addRecordText(record,'h2',say('The three frameworks','三個框架'));
 addRecordText(record,'p',say('Black & Wiliam (2009): target, evidence, feedback, peer support and student ownership. Hattie & Timperley (2007): feedback questions and levels. Gu (2021): target, evidence, interpretation, feedback and action.','Black與Wiliam（2009）：目標、證據、回饋、同伴與自主學習。Hattie與Timperley（2007）：回饋問題及層面。Gu（2021）：目標、證據、詮釋、回饋與行動。'));
 frameworkBuildRoles.forEach(role=>addRecordText(record,'p',role.name+': '+(zh()?role.designZh:role.design)));
 addRecordText(record,'h2',say('My formative assessment plan','我的形成性評估計劃'));
 worksheet.forEach(field=>{addRecordText(record,'h3',zh()?field.labelZh:field.label);addRecordText(record,'p',planValue(field.id)||say('Not yet completed','尚未填寫'));});
 slides.forEach(slide=>{
  const fields=Array.from(slide.querySelectorAll<HTMLTextAreaElement>('textarea[data-note]'));
  const checks=Array.from(slide.querySelectorAll<HTMLInputElement>('input[data-check]'));
  if(!fields.length&&!checks.length)return;
  addRecordText(record,'h2',(zh()?slide.dataset.titleZh:slide.dataset.title)||'');
  fields.forEach(field=>{const label=field.labels?.[0];const text=Array.from(label?.querySelectorAll<HTMLElement>('[data-language]')||[]).find(span=>span.dataset.language===(zh()?'zh':'en'))?.textContent||field.dataset.note||'';addRecordText(record,'h3',text);addRecordText(record,'p',field.value||say('Not answered','未作答'));});
  checks.forEach(check=>addRecordText(record,'p',`[${check.checked?'x':' '}] ${zh()?check.dataset.checkZh:check.dataset.check}`));
 });
}
const pdfDialog=document.querySelector<HTMLDialogElement>('[data-pdf-dialog]');
document.querySelector('[data-pdf-open]')?.addEventListener('click',()=>{applyLanguage(pdfDialog!,zh());pdfDialog?.showModal();});document.querySelector('[data-pdf-close]')?.addEventListener('click',()=>pdfDialog?.close());
document.querySelector<HTMLButtonElement>('[data-pdf-download]')?.addEventListener('click',async event=>{
 const button=event.currentTarget as HTMLButtonElement;const status=document.querySelector('[data-pdf-status]');button.disabled=true;if(status)status.textContent=say('Creating your PDF…','正在製作PDF…');
 try{prepareTrainingRecord();const record=document.querySelector('#workshop-record');if(!record)throw new Error('No record');const bytes=await createTrainingPdf(record);const url=URL.createObjectURL(new Blob([bytes.slice().buffer],{type:'application/pdf'}));const link=document.createElement('a');link.href=url;link.download='my-tirf-classroom-plan.pdf';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);if(status)status.textContent=say('Downloaded, including your typed responses.','已下載，包含你輸入的作答。');}
 catch{if(status)status.textContent=say('The PDF could not be created. Your writing is still here. Please retry.','未能製作PDF，你的文字仍保留在此，請再試。');}finally{button.disabled=false;}
});
try{if(sessionStorage.getItem(accessKey)==='yes')unlock();}catch{}
