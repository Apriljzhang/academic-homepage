import book from '../data/generalEnglishUnit9Session2Reading.json';
import {viewpointGroups,toneGroups,type BoardKind,type BoardGroup} from '../data/generalEnglishUnit9Session2Board';
type State={mode:BoardKind;checked:boolean;selected:string|null;customTone:string;placements:Record<string,Record<string,string>>};
const roots=Array.from(document.querySelectorAll<HTMLElement>('[data-s2-game]'));
const states=new Map<BoardKind,State>();
const storageKey='ge-u9-s2-grouping-v1';
let saved:Record<string,State>={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};}catch{}
const groups=(kind:BoardKind):BoardGroup[]=>kind==='viewpoint'?viewpointGroups:toneGroups;
const ids=book.responses.map((_,i)=>String(i));
const label=(id:string)=>book.responses[Number(id)].name;
const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify({...saved,...Object.fromEntries(states)}));}catch{}};
const placement=(s:State)=>s.placements[s.mode]??(s.placements[s.mode]={});
const toneModels=['critical','warm','qualified','confident','qualified','abrupt'];
const modelGroup=(kind:BoardKind,id:string)=>kind==='viewpoint'?book.responses[Number(id)].position:toneModels[Number(id)];
const groupLabel=(kind:BoardKind,id:string,zh:boolean)=>id==='pool'?(zh?'未分組':'Unsorted'):id==='another'&&states.get(kind)!.customTone?states.get(kind)!.customTone:groups(kind).find(x=>x.id===id)?.[zh?'zh':'en']||id;
function explanation(kind:BoardKind,id:string,zh:boolean){const p=book.responses[Number(id)];return kind==='viewpoint'?(zh?p.positionWhyZh:p.positionWhy):(zh?`${p.toneZh}；「${p.cue}」。${p.toneWhyZh}`:`${p.tone}. “${p.cue}”. ${p.toneWhy}`);}
function render(kind:BoardKind){
 const s=states.get(kind)!,assigned=placement(s),categories=groups(kind),valid=new Set(['pool',...categories.map(x=>x.id)]);
 ids.forEach(id=>{if(!valid.has(assigned[id]))assigned[id]='pool';});
 const count=ids.filter(id=>assigned[id]!=='pool').length,matches=ids.filter(id=>assigned[id]===modelGroup(kind,id)).length;
 roots.filter(root=>root.dataset.s2Game===kind).forEach(root=>{
  const zh=root.dataset.s2Lang==='zh';
  root.querySelector('[data-s2-progress]')!.textContent=zh?`${count}/6 張已分組`:`${count}/6 grouped`;
  root.querySelector<HTMLButtonElement>('[data-s2-reset]')!.hidden=count===0&&!s.checked;
  root.querySelector<HTMLButtonElement>('[data-s2-sort]')!.disabled=matches===6;
  const summary=root.querySelector<HTMLElement>('[data-s2-check-summary]')!;summary.hidden=!s.checked;
  summary.textContent=zh?`${matches} 張${kind==='tone'?'符合示範':'正確'}；${count-matches} 張${kind==='tone'?'需討論':'需再檢查'}；${6-count} 張未分組。`:`${matches} ${kind==='tone'?'match the model':'correct'}; ${count-matches} ${kind==='tone'?'to discuss':'to review'}; ${6-count} unsorted.`;
  root.querySelector('[data-s2-selected]')!.textContent=s.selected!==null?(zh?`移動 ${label(s.selected)} 到哪一組？`:`Move ${label(s.selected)} to which group?`):(zh?'拖曳到組別；或先選卡片的「移動」。':'Drop here, or choose Move on a card first.');
  const targets=root.querySelector<HTMLElement>('[data-s2-targets]')!;targets.replaceChildren();
  [{id:'pool',en:'Unsorted',zh:'未分組'},...categories].forEach(group=>{const el=document.createElement(s.selected===null?'div':'button');if(el instanceof HTMLButtonElement)el.type='button';el.dataset.s2Destination=group.id;el.textContent=`${groupLabel(kind,group.id,zh)} (${ids.filter(id=>assigned[id]===group.id).length})`;if(s.selected!==null)el.setAttribute('aria-label',zh?`移到${groupLabel(kind,group.id,zh)}`:`Move to ${groupLabel(kind,group.id,zh)}`);targets.append(el);});
  const cards=Array.from(root.querySelectorAll<HTMLElement>('[data-s2-card]'));const groupRoot=root.querySelector<HTMLElement>('[data-s2-groups]')!;groupRoot.replaceChildren();
  categories.forEach(group=>{const section=document.createElement('section');section.className='s2-group';section.dataset.s2Zone=group.id;section.setAttribute('aria-label',groupLabel(kind,group.id,zh));const h=document.createElement('h3');h.textContent=`${groupLabel(kind,group.id,zh)} (${ids.filter(id=>assigned[id]===group.id).length})`;const list=document.createElement('div');list.dataset.s2Cards='';section.append(h,list);groupRoot.append(section);});
  cards.forEach(card=>{const id=card.dataset.s2Card!,selected=s.selected===id,match=assigned[id]===modelGroup(kind,id);card.classList.toggle('is-selected',selected);const move=card.querySelector<HTMLButtonElement>('[data-s2-select]')!;move.setAttribute('aria-pressed',String(selected));move.setAttribute('aria-label',zh?`${selected?'取消移動':'移動'} ${label(id)}`:`${selected?'Cancel moving':'Move'} ${label(id)}`);move.textContent=selected?(zh?'取消':'Cancel'):(zh?'移動':'Move');
   const feedback=card.querySelector<HTMLElement>('[data-s2-card-check]')!;feedback.hidden=!s.checked;card.classList.toggle('needs-review',s.checked&&!match);feedback.textContent=assigned[id]==='pool'?(zh?'未分組。':'Not grouped yet.'):`${match?(zh?(kind==='tone'?'符合示範。':'正確。'):(kind==='tone'?'Matches model. ':'Correct. ')):(zh?(kind==='tone'?'請用詞句支持你的另一種分法。':'再檢查。'):(kind==='tone'?'Support your alternative with wording. ':'Check again. '))}${explanation(kind,id,zh)}`;
   root.querySelector(`[data-s2-zone="${assigned[id]}"] [data-s2-cards]`)!.append(card);
  });
  root.querySelector('[data-s2-pool-count]')!.textContent=`(${6-count})`;root.querySelector<HTMLElement>('.s2-pool>[data-s2-empty]')!.hidden=count!==6;
  const name=root.querySelector<HTMLInputElement>('[data-s2-tone-name]');if(name&&name.value!==s.customTone)name.value=s.customTone;const toneLabel=root.querySelector<HTMLElement>('.s2-tone-label');if(toneLabel)toneLabel.hidden=!s.customTone&&!ids.some(id=>assigned[id]==='another');
 });save();
}
function move(kind:BoardKind,id:string,destination:string,keyboard=false){
 const s=states.get(kind)!;if(!ids.includes(id)||!['pool',...groups(kind).map(x=>x.id)].includes(destination))return;
 placement(s)[id]=destination;s.selected=null;s.checked=false;render(kind);
 roots.filter(x=>x.dataset.s2Game===kind).forEach(root=>{const zh=root.dataset.s2Lang==='zh';if(keyboard&&!root.closest('[hidden]'))root.querySelector<HTMLButtonElement>(`[data-s2-card="${id}"] [data-s2-select]`)?.focus();root.querySelector('[data-s2-status]')!.textContent=zh?`${label(id)} → ${groupLabel(kind,destination,zh)}`:`${label(id)} → ${groupLabel(kind,destination,zh)}`;});
}
roots.forEach(root=>{
 const kind=root.dataset.s2Game as BoardKind;
 if(!states.has(kind)){const old=saved[kind];states.set(kind,{mode:kind,checked:false,selected:null,customTone:typeof old?.customTone==='string'?old.customTone:'',placements:old?.placements&&typeof old.placements==='object'?old.placements:{}});}
 root.addEventListener('click',event=>{const target=(event.target as Element).closest<HTMLElement>('button');if(!target)return;const s=states.get(kind)!;
  if(target.matches('[data-s2-select]')){const card=target.closest<HTMLElement>('[data-s2-card]')!;s.selected=s.selected===card.dataset.s2Card?null:card.dataset.s2Card!;render(kind);card.querySelector<HTMLButtonElement>('[data-s2-select]')?.focus({preventScroll:true});}
  if(target.matches('[data-s2-destination]')&&s.selected!==null)move(kind,s.selected,target.dataset.s2Destination!,event.detail===0);
  if(target.matches('[data-s2-check]')){s.checked=true;s.selected=null;render(kind);}
  if(target.matches('[data-s2-sort]')){ids.forEach(id=>placement(s)[id]=modelGroup(kind,id));s.selected=null;s.checked=false;render(kind);root.querySelector('[data-s2-status]')!.textContent=root.dataset.s2Lang==='zh'?'已按示範分組。':'Model groups shown.';}
  if(target.matches('[data-s2-reset]')){ids.forEach(id=>placement(s)[id]='pool');s.selected=null;s.checked=false;render(kind);root.querySelector('[data-s2-status]')!.textContent=root.dataset.s2Lang==='zh'?'已重設。':'Board reset.';}
 });
 root.querySelector<HTMLInputElement>('[data-s2-tone-name]')?.addEventListener('input',event=>{states.get(kind)!.customTone=(event.target as HTMLInputElement).value;render(kind);});
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
  if(!gesture.active){gesture.active=true;root.setPointerCapture(event.pointerId);const ghost=document.createElement('div');ghost.className='s2-drag-ghost';ghost.textContent=label(gesture.id);ghost.setAttribute('aria-hidden','true');document.body.append(ghost);gesture.ghost=ghost;root.querySelector(`[data-s2-card="${gesture.id}"]`)?.classList.add('is-dragging');}
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
