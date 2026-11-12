import bank from '../data/generalEnglishUnit9Session2Language.json';
type Phase='ready'|'playing'|'paused'|'score'|'finished';
const roots=Array.from(document.querySelectorAll<HTMLElement>('[data-relay-lang]'));
const contexts=[
 {en:'A nervous first-year student joins an international club.',zh:'一位緊張的大一學生加入國際社團。'},
 {en:'Your team is preparing a campus event with a small budget.',zh:'你的團隊正用有限經費籌辦校園活動。'},
 {en:'Classmates design a more walkable campus using sustainable materials.',zh:'同學用可持續材料，設計更適合步行的校園。'},
 {en:'You and a friend prepare to apply for a summer job close to home.',zh:'你與朋友準備申請一份離家近的暑期工作。'},
 {en:'Your group has a disagreement before a presentation.',zh:'你的小組在匯報前出現分歧。'},
 {en:'A classmate gets lost on the way to new accommodation.',zh:'一位同學在前往新住處途中迷路。'},
];
const shuffle=<T>(values:T[])=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
let phase:Phase='ready',all=false,turn=0,remaining=60,deadline=0;
let scores=[0,0],points=Array<boolean>(7).fill(false),cards:number[]=[],deck:number[]=[],situations:number[]=[],context=0,last:{team:number;points:number}|null=null;
let timer:ReturnType<typeof setInterval>|undefined;
const stop=()=>{if(timer!==undefined){clearInterval(timer);timer=undefined;}};
const draw=()=>{cards=deck.splice(0,3);context=situations[turn];points.fill(false);remaining=60;};
function newGame(){stop();phase='ready';turn=0;scores=[0,0];last=null;deck=shuffle(bank.phrases.flatMap((p,i)=>all||p.core?[i]:[]));situations=shuffle(contexts.map((_,i)=>i));draw();render();}
function render(){
 roots.forEach(root=>{const zh=root.dataset.relayLang==='zh';
  root.querySelector('[data-relay-turn]')!.textContent=phase==='finished'?(zh?'遊戲完成':'Game complete'):(zh?`第${Math.floor(turn/2)+1}輪 · ${turn%2===0?'A':'B'}對`:`Round ${Math.floor(turn/2)+1} · Pair ${turn%2===0?'A':'B'}`);
  root.querySelector('[data-relay-clock]')!.textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;
  root.querySelector('[data-relay-scores]')!.textContent=`A: ${scores[0]} · B: ${scores[1]}`;
  root.querySelector('[data-relay-context]')!.textContent=contexts[context][zh?'zh':'en'];
  cards.forEach((id,i)=>{const p=bank.phrases[id];root.querySelector(`[data-relay-phrase="${i}"]`)!.textContent=p.phrase;root.querySelector(`[data-relay-meaning="${i}"]`)!.textContent=p.zh;root.querySelector(`[data-relay-example="${i}"]`)!.textContent=p.example;});
  root.querySelector<HTMLElement>('[data-relay-scoring]')!.hidden=phase!=='score';
  root.querySelectorAll<HTMLInputElement>('[data-relay-point]').forEach(x=>{x.checked=points[Number(x.dataset.relayPoint)];});
  root.querySelector('[data-relay-points]')!.textContent=`${points.filter(Boolean).length} / 7 ${zh?'分':'points'}`;
  root.querySelector('[data-relay-action]')!.textContent=phase==='ready'?(zh?'開始60秒':'Start 60-second turn'):phase==='playing'?(zh?'暫停':'Pause'):phase==='paused'?(zh?'繼續':'Resume'):phase==='score'?(turn===3?(zh?'儲存最後得分':'Save final score'):(zh?'儲存並換對':'Save score and switch pairs')):(zh?'再玩一次':'Play again');
  root.querySelector<HTMLElement>('[data-relay-finish]')!.hidden=phase!=='playing'&&phase!=='paused';
  const selector=root.querySelector<HTMLSelectElement>('[data-relay-bank]')!;selector.value=all?'all':'core';selector.disabled=phase!=='finished'&&(phase!=='ready'||turn!==0);
  root.querySelector<HTMLButtonElement>('[data-relay-reset]')!.hidden=phase==='ready'&&turn===0;
  root.querySelector('[data-relay-message]')!.textContent=phase==='finished'?(scores[0]===scores[1]?(zh?'平手！':'A tie!'):(zh?`${scores[0]>scores[1]?'A':'B'}對勝出！`:`Pair ${scores[0]>scores[1]?'A':'B'} wins!`)):phase==='score'?(zh?'另一對評分；如有錯誤，先一起改正句子。':'The other pair awards points. Correct any errors together.'):phase==='playing'?(zh?'輪流說下一句，讓故事連得起來。':'Alternate speakers and connect each sentence to the story.'):phase==='paused'?(zh?'已暫停。':'Paused.'):last?(zh?`上一回合：${last.team===0?'A':'B'}對得${last.points}分；換對。`:`Last turn: Pair ${last.team===0?'A':'B'} earned ${last.points}. Switch pairs.`):(zh?'先選第一位說話者，再開始。':'Choose your first speaker, then start.');
 });
}
function start(){deadline=Date.now()+remaining*1000;phase='playing';stop();timer=setInterval(()=>{remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));if(remaining===0){stop();phase='score';}render();},250);render();}
function finish(){stop();phase='score';render();}
roots.forEach(root=>{
 root.querySelector('[data-relay-action]')?.addEventListener('click',()=>{
  if(phase==='ready'||phase==='paused')start();else if(phase==='playing'){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));stop();phase='paused';render();}
  else if(phase==='score'){const amount=points.filter(Boolean).length;const team=turn%2;scores[team]+=amount;last={team,points:amount};turn++;if(turn===4){phase='finished';render();}else{phase='ready';draw();render();}}
  else newGame();
 });
 root.querySelector('[data-relay-finish]')?.addEventListener('click',finish);
 root.querySelector('[data-relay-reset]')?.addEventListener('click',newGame);
 root.querySelector<HTMLSelectElement>('[data-relay-bank]')?.addEventListener('change',event=>{all=(event.target as HTMLSelectElement).value==='all';newGame();});
 root.querySelectorAll<HTMLInputElement>('[data-relay-point]').forEach(x=>x.addEventListener('change',()=>{if(phase!=='score')return;points[Number(x.dataset.relayPoint)]=x.checked;render();}));
});
if(roots.length)newGame();
