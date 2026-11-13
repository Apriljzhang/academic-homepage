import bank from './generalEnglishUnit9Session2Language.json';
export type PhraseMode='meaning'|'preposition'|'context';
export type PhraseQuestion={prompt:string;choices:string[];answer:string;phrase:string;meaning:string;example:string};
export const shuffled=<T>(values:T[])=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
// Avoid common alternative patterns in the distractors; practise this bank's wording.
const alternatives:Record<string,string[]>={
 'agree on':['to'],'agree to':['on'],'talk to':['with'],'talk about':['of'],
 'think about':['of'],'think of':['about'],'compare one':['to'],
 'different from':['to'],'an opportunity':['to'],'experience of':['in'],
 'good at':['for'],'not yet good':['for'],
};
export function makePhraseQuestion(index:number,mode:PhraseMode):PhraseQuestion{
 const p=bank.phrases[index];
 const excluded=new Set(Object.entries(alternatives).filter(([start])=>p.phrase.startsWith(start)).flatMap(([,values])=>values));
 const pool=mode==='meaning'?bank.phrases.filter(x=>x.kind===p.kind&&x.zh!==p.zh).map(x=>x.zh):['for','with','from','on','to','in','at','about','of'].filter(x=>x!==p.prep&&!excluded.has(x));
 const answer=mode==='meaning'?p.zh:p.prep;
 const prompt=mode==='meaning'?p.phrase:(mode==='preposition'?p.phrase:p.example).replace(new RegExp(`\\b${p.prep}\\b`),'____');
 return{prompt,choices:shuffled([answer,...shuffled([...new Set(pool)]).slice(0,3)]),answer,phrase:p.phrase,meaning:p.zh,example:p.example};
}
