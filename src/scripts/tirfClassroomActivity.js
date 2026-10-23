/** The same prepared-feedback activity is used inside the deck and its offline copy. */
export function initTirfClassroomActivity(root) {
 (root.closest('.classroom-case') || root.ownerDocument)?.querySelectorAll('[data-inline-help]').forEach(help=>{
  const trigger=help.querySelector('button');
  const reopen=()=>help.classList.remove('is-dismissed');
  help.addEventListener('pointerenter',reopen);
  trigger?.addEventListener('focus',reopen);
  trigger?.addEventListener('click',reopen);
  help.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();help.classList.add('is-dismissed');}
  });
 });
 const button=root.querySelector('[data-case-hint]');
 if(!button)return;
 button.addEventListener('click',()=>{
  const chinese=(root.closest('.slide')?.dataset.currentLanguage||document.documentElement.lang)==='zh'||document.documentElement.lang==='zh-Hant';
  const first=root.querySelector('#case-first');
  const reason=root.querySelector('#case-reason');
  const status=root.querySelector('[data-case-status]');
  if(!first.value.trim()||!reason.value.trim()){
   status.textContent=chinese?'請先說明選擇並寫初稿，再查看回饋。':'Explain your choice and write a first attempt before opening the feedback.';
   (!reason.value.trim()?reason:first).focus();return;
  }
  first.readOnly=true; reason.readOnly=true;
  root.querySelector('[data-case-feedback]').hidden=false;
  button.hidden=true;
  status.textContent=chinese?'已保留初稿。請用回饋或同伴問題修訂，並解釋改動。':'First attempt kept. Use the feedback or partner question to revise and explain a change.';
 });
}
