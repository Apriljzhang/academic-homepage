import bank from '../data/generalEnglishUnit9Session2Language.json';
import book from '../data/generalEnglishUnit9Session2Reading.json';
import {prepositionGroups,meaningGroups,viewpointGroups,toneGroups,phraseMeaningGroups,type BoardKind,type BoardGroup} from '../data/generalEnglishUnit9Session2Board';
type State={all:boolean;mode:string;hide:boolean;models:boolean;checked:boolean;selected:string|null;placements:Record<string,Record<string,string>>};
const roots=Array.from(document.querySelectorAll<HTMLElement>('[data-s2-game]'));
const states=new Map<BoardKind,State>();
const storageKey='ge-u9-s2-grouping-v1';
let saved:Record<string,State>={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}');}catch{/* Private browsing may disable storage. */}
const groups=(kind:BoardKind,s:State):BoardGroup[]=>kind==='phrases'?(s.mode==='meaning'?meaningGroups:prepositionGroups):kind==='viewpoint'?viewpointGroups:toneGroups;
const items=(kind:BoardKind,s:State)=>kind==='phrases'?bank.phrases.flatMap((x,i)=>s.all||x.core?[String(i)]:[]):book.responses.map((_,i)=>String(i));
const label=(kind:BoardKind,id:string)=>kind==='phrases'?bank.phrases[Number(id)].phrase:book.responses[Number(id)].name;
const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(Object.fromEntries(states)));}catch{/* Sorting remains available without storage. */}};
const placement=(s:State)=>s.placements[s.mode]??(s.placements[s.mode]={});
const toneModels=['critical','warm','qualified','confident','qualified','abrupt'];
const modelGroup=(kind:BoardKind,id:string,s:State)=>kind==='phrases'?(s.mode==='meaning'?phraseMeaningGroups[Number(id)]:bank.phrases[Number(id)].prep):kind==='viewpoint'?book.responses[Number(id)].position:toneModels[Number(id)];
const interpretive=(kind:BoardKind,s:State)=>kind==='tone'||(kind==='phrases'&&s.mode==='meaning');
function notes(kind:BoardKind,id:string,s:State,zh:boolean){
 const i=Number(id);if(kind==='phrases'){
  const item=bank.phrases[i];const group=meaningGroups.find(x=>x.id===phraseMeaningGroups[i])!;
  return `${item.phrase}\n${item.zh}\n${item.example}\n${s.mode==='meaning'?(zh?`一種分法：${group.zh}；如能解釋意思，也可放在其他組。`:`One possible group: ${group.en}. Explain another placement if its meaning fits.`):''}`;
 }
 const item=book.responses[i];return kind==='viewpoint'?(zh?item.positionWhyZh:item.positionWhy):(zh?`${item.toneZh}；線索：「${item.cue}」。${item.toneWhyZh}`:`${item.tone}. Cue: “${item.cue}”. ${item.toneWhy}`);
}
function render(kind:BoardKind){
 const s=states.get(kind)!;const ids=items(kind,s);const assigned=placement(s);const categories=groups(kind,s);const valid=new Set(['pool',...categories.map(x=>x.id)]);
 ids.forEach(id=>{if(!valid.has(assigned[id]))assigned[id]='pool';});
 roots.filter(root=>root.dataset.s2Game===kind).forEach(root=>{
  const zh=root.dataset.s2Lang==='zh';const groupLabel=(id:string)=>id==='pool'?(zh?'未分組':'Unsorted'):(categories.find(x=>x.id===id)?.[zh?'zh':'en']||id);
  const bankSelect=root.querySelector<HTMLSelectElement>('[data-s2-bank]');if(bankSelect)bankSelect.value=s.all?'all':'core';
  const mode=root.querySelector<HTMLSelectElement>('[data-s2-mode]');if(mode)mode.value=s.mode;
  const hide=root.querySelector<HTMLInputElement>('[data-s2-hide]');if(hide)hide.checked=s.hide;
  const reveal=root.querySelector<HTMLButtonElement>('[data-s2-model]')!;reveal.setAttribute('aria-pressed',String(s.models));reveal.textContent=s.models?(zh?'隱藏討論提示':'Hide discussion notes'):(zh?'顯示討論提示':'Show discussion notes');
  const progress=root.querySelector('[data-s2-progress]')!;const count=ids.filter(id=>assigned[id]!=='pool').length;progress.textContent=zh?`${count} / ${ids.length} 張已分組`:`${count} / ${ids.length} cards grouped`;
  const summary=root.querySelector<HTMLElement>('[data-s2-check-summary]')!;summary.hidden=!s.checked;
  if(s.checked){const matches=ids.filter(id=>assigned[id]===modelGroup(kind,id,s)).length;const review=count-matches;const unplaced=ids.length-count;summary.textContent=zh?`${matches} 張${interpretive(kind,s)?'符合示範':'正確'}；${review} 張${interpretive(kind,s)?'需討論理由':'需再檢查'}；${unplaced} 張未分組。${interpretive(kind,s)?'其他分法如有詞句或意思支持，也可接受。':(matches===ids.length?'所有卡片均已正確分組。':'根據卡片上的提示調整，再核對。')}`:`${matches} ${interpretive(kind,s)?'match the model':'correct'}; ${review} ${interpretive(kind,s)?'to discuss':'to review'}; ${unplaced} unsorted. ${interpretive(kind,s)?'Other groupings can be supported by wording or meaning.':(matches===ids.length?'All cards are in the correct groups.':'Use the feedback on each card, then check again.')}`;}
  root.querySelector('[data-s2-selected]')!.textContent=s.selected!==null?(zh?`已選取：${label(kind,s.selected)}。選擇組別。`:`Selected: ${label(kind,s.selected)}. Choose a group.`):(zh?'先選取卡片，再選組別；也可拖曳到組別按鈕。':'Select a card, then choose a group; or drag onto a group button.');
  const targets=root.querySelector<HTMLElement>('[data-s2-targets]')!;targets.replaceChildren();
  [{id:'pool',en:'Unsorted',zh:'未分組'},...categories].forEach(group=>{const button=document.createElement('button');button.type='button';button.dataset.s2Destination=group.id;button.textContent=`${zh?group.zh:group.en} (${ids.filter(id=>assigned[id]===group.id).length})`;button.setAttribute('aria-label',zh?`移到${group.zh}`:`Move to ${group.en}`);targets.append(button);});
  const groupRoot=root.querySelector<HTMLElement>('[data-s2-groups]')!;
  // Keep card nodes (and their open language notes) while rebuilding category shells.
  const cards=Array.from(root.querySelectorAll<HTMLElement>('[data-s2-card]'));
  groupRoot.replaceChildren();categories.forEach(group=>{const section=document.createElement('section');section.className='s2-group';section.dataset.s2Zone=group.id;section.setAttribute('aria-label',groupLabel(group.id));const heading=document.createElement('h3');heading.textContent=`${groupLabel(group.id)} (${ids.filter(id=>assigned[id]===group.id).length})`;const list=document.createElement('div');list.dataset.s2Cards='';const hint=document.createElement('p');hint.className='s2-empty';hint.textContent=zh?'把卡片拖到這裏。':'Drag cards here.';hint.hidden=ids.some(id=>assigned[id]===group.id);section.append(heading,list,hint);groupRoot.append(section);});
  cards.forEach(card=>{const id=card.dataset.s2Card!;const visible=ids.includes(id);card.hidden=!visible;card.classList.toggle('is-selected',s.selected===id);card.querySelector('[data-s2-select]')!.setAttribute('aria-pressed',String(s.selected===id));if(kind==='phrases')card.querySelector('[data-s2-card-title]')!.textContent=s.hide?bank.phrases[Number(id)].phrase.replace(new RegExp(`\\b${bank.phrases[Number(id)].prep}\\b`),'____'):bank.phrases[Number(id)].phrase;
   const note=card.querySelector<HTMLElement>('[data-s2-card-model]')!;note.hidden=!s.models;note.textContent=notes(kind,id,s,zh);
   const feedback=card.querySelector<HTMLElement>('[data-s2-card-check]')!;feedback.hidden=!s.checked;const expected=modelGroup(kind,id,s);const matches=assigned[id]===expected;card.classList.toggle('needs-review',s.checked&&!matches);
   feedback.textContent=assigned[id]==='pool'?(zh?'未分組：先把卡片放入一組。':'Unsorted: place this card in a group first.'):matches?(zh?`${interpretive(kind,s)?'符合示範':'正確'}：${groupLabel(expected)}。`:`${interpretive(kind,s)?'Matches model':'Correct'}: ${groupLabel(expected)}.`):interpretive(kind,s)?(zh?`討論此分法。示範組別：${groupLabel(expected)}；請用詞句或意思支持你的另一種解讀。`:`Discuss this placement. Model group: ${groupLabel(expected)}. Support your alternative with wording or meaning.`):(zh?`再檢查。示範組別：${groupLabel(expected)}。`:`Check again. Model group: ${groupLabel(expected)}.`);
   const destination=visible?assigned[id]:'pool';root.querySelector(`[data-s2-zone="${destination}"] [data-s2-cards]`)!.append(card);
  });
  const ungrouped=ids.length-count;root.querySelector('[data-s2-pool-count]')!.textContent=`(${ungrouped})`;root.querySelector<HTMLElement>('.s2-pool > [data-s2-empty]')!.hidden=ungrouped>0;
 });
 save();
}
function move(kind:BoardKind,id:string,destination:string){
 const s=states.get(kind)!;if(!items(kind,s).includes(id)||!['pool',...groups(kind,s).map(x=>x.id)].includes(destination))return;
 placement(s)[id]=destination;s.selected=null;s.checked=false;render(kind);
 roots.filter(root=>root.dataset.s2Game===kind).forEach(root=>{const zh=root.dataset.s2Lang==='zh';const group=groups(kind,s).find(x=>x.id===destination);root.querySelector<HTMLButtonElement>(`[data-s2-destination="${destination}"]`)?.focus({preventScroll:true});root.querySelector('[data-s2-status]')!.textContent=zh?`已將 ${label(kind,id)} 移到${group?.zh||'未分組'}。`:`Moved ${label(kind,id)} to ${group?.en||'Unsorted'}.`;});
}
roots.forEach(root=>{
 const kind=root.dataset.s2Game as BoardKind;
 if(!states.has(kind)){
  const old=saved[kind];states.set(kind,{all:old?.all===true,mode:kind==='phrases'&&old?.mode==='meaning'?'meaning':kind==='phrases'?'preposition':kind,hide:old?.hide===true,models:false,checked:false,selected:null,placements:old?.placements&&typeof old.placements==='object'?old.placements:{}});
 }
 root.addEventListener('click',event=>{const target=(event.target as Element).closest<HTMLElement>('button');if(!target)return;const s=states.get(kind)!;
  if(target.matches('[data-s2-select]')){const card=target.closest<HTMLElement>('[data-s2-card]')!;s.selected=s.selected===card.dataset.s2Card?null:card.dataset.s2Card!;render(kind);card.querySelector<HTMLButtonElement>('[data-s2-select]')?.focus({preventScroll:true});}
  if(target.matches('[data-s2-destination]')){if(s.selected!==null)move(kind,s.selected,target.dataset.s2Destination!);else root.querySelector('[data-s2-status]')!.textContent=root.dataset.s2Lang==='zh'?'先選取卡片，或直接拖曳卡片。':'Select a card first, or drag a card onto this group.';}
  if(target.matches('[data-s2-model]')){s.models=!s.models;render(kind);}
  if(target.matches('[data-s2-check]')){s.checked=true;s.selected=null;render(kind);}
  if(target.matches('[data-s2-sort]')){items(kind,s).forEach(id=>placement(s)[id]=modelGroup(kind,id,s));s.selected=null;s.checked=false;render(kind);roots.filter(x=>x.dataset.s2Game===kind).forEach(x=>{x.querySelector('[data-s2-status]')!.textContent=x.dataset.s2Lang==='zh'?'卡片已按示範答案分組。':'Cards sorted into model groups.';});}
  if(target.matches('[data-s2-reset]')){items(kind,s).forEach(id=>placement(s)[id]='pool');s.selected=null;s.models=false;s.checked=false;render(kind);root.querySelector('[data-s2-status]')!.textContent=root.dataset.s2Lang==='zh'?'卡片已放回未分組區。':'Cards returned to Unsorted.';}
 });
 root.querySelector<HTMLSelectElement>('[data-s2-bank]')?.addEventListener('change',event=>{const s=states.get(kind)!;s.all=(event.target as HTMLSelectElement).value==='all';s.selected=null;s.checked=false;render(kind);});
 root.querySelector<HTMLSelectElement>('[data-s2-mode]')?.addEventListener('change',event=>{const s=states.get(kind)!;s.mode=(event.target as HTMLSelectElement).value;s.selected=null;s.checked=false;render(kind);});
 root.querySelector<HTMLInputElement>('[data-s2-hide]')?.addEventListener('change',event=>{states.get(kind)!.hide=(event.target as HTMLInputElement).checked;render(kind);});
 // Pointer dragging works with a mouse and with a touch on the Select handle.
 let gesture:{id:string;pointer:number;x:number;y:number;active:boolean;ghost:HTMLElement|null}|null=null;
 let suppressClick=false;
 root.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false;}},true);
 const clearDrag=()=>{gesture?.ghost?.remove();root.querySelectorAll('.s2-drop-active,.is-dragging').forEach(x=>x.classList.remove('s2-drop-active','is-dragging'));gesture=null;};
 root.addEventListener('pointerdown',event=>{
  const target=event.target as Element;const card=target.closest<HTMLElement>('[data-s2-card]');
  if(!card||event.button!==0||target.closest('summary,details,a,input,textarea,select')||(event.pointerType==='touch'&&!target.closest('[data-s2-select]')))return;
  gesture={id:card.dataset.s2Card!,pointer:event.pointerId,x:event.clientX,y:event.clientY,active:false,ghost:null};
 });
 root.addEventListener('pointermove',event=>{
  if(!gesture||gesture.pointer!==event.pointerId)return;
  if(!gesture.active&&Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)<8)return;
  event.preventDefault();
  if(!gesture.active){gesture.active=true;root.setPointerCapture(event.pointerId);const ghost=document.createElement('div');ghost.className='s2-drag-ghost';ghost.textContent=label(kind,gesture.id);ghost.setAttribute('aria-hidden','true');document.body.append(ghost);gesture.ghost=ghost;root.querySelector(`[data-s2-card="${gesture.id}"]`)?.classList.add('is-dragging');}
  gesture.ghost!.style.left=`${Math.min(event.clientX+12,window.innerWidth-180)}px`;gesture.ghost!.style.top=`${event.clientY+12}px`;
  root.querySelectorAll('.s2-drop-active').forEach(x=>x.classList.remove('s2-drop-active'));
  const zone=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-s2-destination],[data-s2-zone]');
  if(zone&&root.contains(zone))zone.classList.add('s2-drop-active');
 });
 root.addEventListener('pointerup',event=>{
  if(!gesture||gesture.pointer!==event.pointerId)return;
  const id=gesture.id;const active=gesture.active;
  const zone=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-s2-destination],[data-s2-zone]');
  clearDrag();if(root.hasPointerCapture(event.pointerId))root.releasePointerCapture(event.pointerId);
  if(active){suppressClick=true;setTimeout(()=>{suppressClick=false;},0);if(zone&&root.contains(zone))move(kind,id,zone.dataset.s2Destination||zone.dataset.s2Zone!);}
 });
 root.addEventListener('pointercancel',clearDrag);
});
states.forEach((_,kind)=>render(kind));
