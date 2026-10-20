/** Native modal stories keep slide navigation and focus on the originating method. */
export function initQuantStories() {
  document.querySelectorAll<HTMLDialogElement>('[data-story-dialog]').forEach(dialog => {
    const tabs=Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-story-tab]'));
    const panels=Array.from(dialog.querySelectorAll<HTMLElement>('[data-story-panel]'));
    const previous=dialog.querySelector<HTMLButtonElement>('[data-story-prev]')!;
    const next=dialog.querySelector<HTMLButtonElement>('[data-story-next]')!;
    const done=dialog.querySelector<HTMLButtonElement>('[data-story-done]')!;
    let step=0;
    const show=(index:number,focusTab=false)=>{
      step=Math.max(0,Math.min(tabs.length-1,index));dialog.dataset.storyStage=String(step);
      tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===step));tab.tabIndex=i===step?0:-1;});
      panels.forEach((panel,i)=>panel.hidden=i!==step);
      previous.disabled=step===0;next.hidden=step===tabs.length-1;done.hidden=step!==tabs.length-1;
      dialog.querySelector<HTMLElement>('[data-story-progress]')!.textContent=`${step+1} / ${tabs.length}`;
      if(focusTab)tabs[step].focus();
    };
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>show(i));
      tab.addEventListener('keydown',event=>{
        const index=event.key==='ArrowRight'?(i+1)%tabs.length:event.key==='ArrowLeft'?(i+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:-1;
        if(index>=0){event.preventDefault();show(index,true);}
      });
    });
    previous.addEventListener('click',()=>show(step-1,true));
    next.addEventListener('click',()=>show(step+1,true));
    dialog.querySelector('[data-close-story]')!.addEventListener('click',()=>dialog.close());
    done.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>show(0));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-open-story]').forEach(button=>button.addEventListener('click',()=>{
    const slide=button.closest<HTMLElement>('.slide')!;
    const language=slide.dataset.language||'en';
    const dialog=document.getElementById(`story-${button.dataset.openStory}-${language}`) as HTMLDialogElement|null;
    if(dialog){dialog.showModal();dialog.scrollTop=0;dialog.addEventListener('close',()=>button.focus({preventScroll:true}),{once:true});}
  }));
}
