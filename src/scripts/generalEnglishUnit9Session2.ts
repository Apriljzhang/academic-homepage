import bank from '../data/generalEnglishUnit9Session2Language.json';
import book from '../data/generalEnglishUnit9Session2Reading.json';
type Kind='phrases'|'viewpoint'|'tone';
type Choice={en:string;zh:string;correct:boolean};
type Question={prompt:string;choices:Choice[];model:string;modelZh:string;followup:string;followupZh:string};
type State={kind:Kind;items:number[];index:number;mode:number;all:boolean;selected:number|null;checked:boolean;attempted:Set<string>;correct:Set<string>;q:Question};
const roots=Array.from(document.querySelectorAll<HTMLElement>('[data-s2-game]'));
const states=new Map<Kind,State>();
const shuffle=<T>(array:T[])=>{const result=[...array];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;};
const replacePrep=(text:string,prep:string)=>text.replace(new RegExp(`\\b${prep}\\b`),'____');
const indexOfItem=(state:State)=>state.items[state.index];
function question(state:State):Question{
 const id=indexOfItem(state);
 if(state.kind==='phrases'){
  const item=bank.phrases[id];
  const pool=state.mode===0?bank.phrases.filter(x=>x.zh!==item.zh&&x.kind===item.kind).map(x=>x.zh):['for','with','from','on','to','in','at','about','of'].filter(x=>x!==item.prep);
  const answer=state.mode===0?item.zh:item.prep;
  const alternatives=shuffle([...new Set(pool)]).slice(0,3);
  return {prompt:state.mode===0?item.phrase:replacePrep(state.mode===1?item.phrase:item.example,item.prep),choices:shuffle([{en:answer,zh:answer,correct:true},...alternatives.map(x=>({en:x,zh:x,correct:false}))]),model:`${item.phrase}\n${item.zh}\n${item.example}`,modelZh:`${item.phrase}\n${item.zh}\n${item.example}`,followup:state.mode===2?'Say a new sentence using the whole chunk and a word from Unit 1, 2, 5 or 9. A partner checks the meaning and pattern.':'Say the complete chunk, then explain or adapt the example. The answer practises this bank’s pattern; another preposition can sometimes express a different meaning.',followupZh:state.mode===2?'用完整詞組及第1、2、5或9單元的一個詞，說一句自己的句子；同伴核對意思及句型。':'說完整詞組，再解釋或改寫例句；本題練習詞庫中的配搭，其他介詞有時可表達不同意思。'};
 }
 const item=book.responses[id];
 if(state.kind==='viewpoint')return {prompt:'',choices:[{en:'Yes',zh:'是',correct:item.position==='yes'},{en:'No',zh:'否',correct:item.position==='no'},{en:'It depends',zh:'視乎情況',correct:item.position==='depends'}],model:item.positionWhy,modelZh:item.positionWhyZh,followup:'Name one reason or experience in the text. Keep this position label separate from the tone.',followupZh:'指出文本中的一個理由或經歷，把立場標籤與語氣分開。'};
 return {prompt:'',choices:shuffle([{en:item.tone,zh:item.toneZh,correct:true},...item.toneDistractors.map(x=>({en:x,zh:x,correct:false}))]),model:`A supported reading: ${item.tone}.\nCue: “${item.cue}”\n${item.toneWhy}`,modelZh:`一個有依據的解讀：${item.toneZh}。\n線索：「${item.cue}」\n${item.toneWhyZh}`,followup:'Suggest another defensible tone label and point to wording that supports it. A critical tone does not automatically make a claim wrong.',followupZh:'可提出另一個合理語氣標籤，並指出支持詞句；批判語氣不代表論點必然錯誤。'};
}
function reset(kind:Kind,all=false,mixed=false):State{
 const items=kind==='phrases'?bank.phrases.flatMap((x,i)=>all||x.core?[i]:[]):book.responses.map((_,i)=>i);
 const state:State={kind,items:mixed?shuffle(items):items,index:0,mode:0,all,selected:null,checked:false,attempted:new Set(),correct:new Set(),q:null!};
 state.q=question(state);states.set(kind,state);return state;
}
function advance(state:State){
 if(state.kind==='phrases'&&state.mode<2)state.mode++;else{state.mode=0;state.index++;}
 state.selected=null;state.checked=false;state.q=question(state);render(state.kind);
}
function render(kind:Kind){
 const state=states.get(kind)!;const id=indexOfItem(state);
 roots.filter(root=>root.dataset.s2Game===kind).forEach(root=>{
  const zh=root.dataset.s2Lang==='zh';
  const progress=root.querySelector('[data-s2-progress]');
  if(progress)progress.textContent=kind==='phrases'?`${state.index+1} / ${state.items.length} · ${state.correct.size} / ${state.attempted.size} ${zh?'已核對答對':'checked correctly'}`:`${zh?'文本':'Text'} ${book.responses[id].id} · ${state.index+1} / ${state.items.length}`;
  const bankSelect=root.querySelector<HTMLSelectElement>('[data-s2-bank]');if(bankSelect)bankSelect.value=state.all?'all':'core';
  const mode=root.querySelector<HTMLSelectElement>('[data-s2-mode]');if(mode)mode.value=String(state.mode);
  const heading=root.querySelector('[data-s2-question]');if(heading)heading.textContent=kind==='phrases'?([zh?'哪個意思最符合？':'Which meaning fits this chunk?',zh?'詞組需要哪個介詞？':'Which preposition completes the chunk?',zh?'用詞庫配搭完成例句，再說自己的句子。':'Complete the example with the bank’s pattern, then make your own sentence.'][state.mode]):kind==='viewpoint'?(zh?'作者對問題的立場是甚麼？先選邊，再指出理由。':'What is the writer’s position? Pick a side, then point to a reason.'):(zh?'哪個語氣描述最有詞句支持？':'Which tone description is best supported by the wording?');
  const prompt=root.querySelector('[data-s2-prompt]');if(prompt)prompt.textContent=state.q.prompt;
  const author=root.querySelector('[data-s2-author]');if(author)author.textContent=`${book.responses[id].id}. ${book.responses[id].name} · ${book.responses[id].job}`;
  const passage=root.querySelector('[data-s2-passage]');if(passage)passage.textContent=book.responses[id].text;
  root.querySelectorAll<HTMLButtonElement>('[data-s2-choice]').forEach((button,i)=>{const choice=state.q.choices[i];button.hidden=!choice;if(!choice)return;button.textContent=zh?choice.zh:choice.en;button.setAttribute('aria-pressed',String(state.selected===i));});
  const check=root.querySelector<HTMLButtonElement>('[data-s2-check]');if(check)check.disabled=state.selected===null;
  const last=state.index===state.items.length-1&&(kind!=='phrases'||state.mode===2);
  const next=root.querySelector<HTMLButtonElement>('[data-s2-next]');if(next){next.disabled=!state.checked||last;next.textContent=last?(zh?'本輪完成，可重新開始':'Round complete; restart to review'):(zh?'下一題':'Next challenge');}
  const feedback=root.querySelector('[data-s2-feedback]');if(feedback)feedback.textContent=state.checked?`${state.q.choices[state.selected!].correct?(zh?'符合本題的配搭／解讀。\n':'That matches the model pattern or reading.\n'):(zh?'比較以下配搭／有依據的解讀。\n':'Compare your choice with the model pattern or supported reading.\n')}${zh?state.q.modelZh:state.q.model}`:'';
  const followup=root.querySelector('[data-s2-followup]');if(followup)followup.textContent=state.checked?(zh?state.q.followupZh:state.q.followup):'';
 });
}
roots.forEach(root=>{
 const kind=root.dataset.s2Game as Kind;if(!states.has(kind))reset(kind);
 root.querySelectorAll<HTMLButtonElement>('[data-s2-choice]').forEach((button,i)=>button.addEventListener('click',()=>{const state=states.get(kind)!;state.selected=i;state.checked=false;render(kind);}));
 root.querySelector('[data-s2-check]')?.addEventListener('click',()=>{const state=states.get(kind)!;if(state.selected===null)return;const key=`${indexOfItem(state)}:${state.mode}`;if(!state.attempted.has(key)){state.attempted.add(key);if(state.q.choices[state.selected].correct)state.correct.add(key);}state.checked=true;render(kind);});
 root.querySelector('[data-s2-next]')?.addEventListener('click',()=>advance(states.get(kind)!));
 root.querySelector('[data-s2-restart]')?.addEventListener('click',()=>{const old=states.get(kind)!;reset(kind,old.all,kind==='phrases');render(kind);});
 root.querySelector<HTMLSelectElement>('[data-s2-bank]')?.addEventListener('change',event=>{reset(kind,(event.target as HTMLSelectElement).value==='all');render(kind);});
 root.querySelector<HTMLSelectElement>('[data-s2-mode]')?.addEventListener('change',event=>{const state=states.get(kind)!;state.mode=Number((event.target as HTMLSelectElement).value);state.selected=null;state.checked=false;state.q=question(state);render(kind);});
});
states.forEach((_,kind)=>render(kind));
