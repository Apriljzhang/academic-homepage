import bank from '../data/generalEnglishUnit9Session2Language.json';
import {makePhraseQuestion,shuffled,type PhraseMode,type PhraseQuestion} from '../data/generalEnglishUnit9PhraseQuestions';
const roots=Array.from(document.querySelectorAll<HTMLElement>('[data-phrase-game-lang]'));
let mode:PhraseMode='meaning',all=false,deck:number[]=[],index=0,selected:number|null=null,checked=false,correct=0;
let question:PhraseQuestion;
function begin(mix=false){deck=bank.phrases.flatMap((p,i)=>all||p.core?[i]:[]);if(mix)deck=shuffled(deck);index=0;selected=null;checked=false;correct=0;question=makePhraseQuestion(deck[index],mode);render();}
function render(){roots.forEach(root=>{const zh=root.dataset.phraseGameLang==='zh';
 root.querySelector<HTMLSelectElement>('[data-pg-bank]')!.value=all?'all':'core';root.querySelector<HTMLSelectElement>('[data-pg-mode]')!.value=mode;
 root.querySelector('[data-pg-progress]')!.textContent=zh?`${index+1}/${deck.length} 題 · 答對 ${correct} 題`:`${index+1}/${deck.length} · ${correct} correct`;
 root.querySelector('[data-pg-instruction]')!.textContent=mode==='meaning'?(zh?'選出正確的中文意思。':'Choose the correct Chinese meaning.'):mode==='preposition'?(zh?'用詞庫的配搭，選出缺少的介詞。':'Choose the missing preposition from the phrase bank.'):(zh?'用詞庫的配搭，選出完成句子的介詞。':'Choose the preposition that completes this sentence.');
 root.querySelector('[data-pg-question]')!.textContent=question.prompt;
 root.querySelectorAll<HTMLInputElement>('[data-pg-choice]').forEach((radio,i)=>{radio.checked=selected===i;radio.disabled=checked;root.querySelector(`[data-pg-option="${i}"] [data-pg-choice-text]`)!.textContent=question.choices[i];const option=root.querySelector<HTMLElement>(`[data-pg-option="${i}"]`)!;option.classList.toggle('pg-correct',checked&&question.choices[i]===question.answer);option.classList.toggle('pg-incorrect',checked&&selected===i&&question.choices[i]!==question.answer);});
 root.querySelector<HTMLButtonElement>('[data-pg-check]')!.disabled=selected===null||checked;
 const next=root.querySelector<HTMLButtonElement>('[data-pg-next]')!;next.hidden=!checked;next.textContent=index===deck.length-1?(zh?'再玩一次':'Play again'):(zh?'下一題':'Next question');
 root.querySelector<HTMLElement>('[data-pg-feedback]')!.hidden=!checked;
 root.querySelector('[data-pg-result]')!.textContent=selected!==null&&question.choices[selected]===question.answer?(zh?'答對了。':'Correct.'):(zh?`正確答案：${question.answer}`:`Correct answer: ${question.answer}`);
 root.querySelector('[data-pg-model]')!.textContent=question.phrase;root.querySelector('[data-pg-meaning]')!.textContent=question.meaning;root.querySelector('[data-pg-example]')!.textContent=question.example;
 });}
roots.forEach(root=>{
 root.querySelectorAll<HTMLInputElement>('[data-pg-choice]').forEach((radio,i)=>radio.addEventListener('change',()=>{if(checked)return;selected=i;render();}));
 root.querySelector('[data-pg-check]')?.addEventListener('click',()=>{if(selected===null||checked)return;checked=true;if(question.choices[selected]===question.answer)correct++;render();});
 root.querySelector('[data-pg-next]')?.addEventListener('click',()=>{if(!checked)return;if(index===deck.length-1)begin(true);else{index++;selected=null;checked=false;question=makePhraseQuestion(deck[index],mode);render();}root.querySelector<HTMLElement>('[data-pg-question]')?.focus({preventScroll:true});});
 root.querySelector<HTMLSelectElement>('[data-pg-bank]')?.addEventListener('change',event=>{all=(event.target as HTMLSelectElement).value==='all';begin();});
 root.querySelector<HTMLSelectElement>('[data-pg-mode]')?.addEventListener('change',event=>{mode=(event.target as HTMLSelectElement).value as PhraseMode;begin();});
});
if(roots.length)begin();
