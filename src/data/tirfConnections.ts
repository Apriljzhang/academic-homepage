import { bilingual as b } from './tirfMarkup.ts';
export const frameworkConnectionsHtml = `<details class="framework-connections" open><summary>${b('How the frameworks connect','框架如何互相連結')}</summary>
<div class="connected-assessment-model" aria-label="Connected formative assessment model / 形成性評估連結模型">
 <div class="connection-target"><h3>${b('Learning target','學習目標')}</h3><p>${b('Black & Wiliam · Strategy 1','Black與Wiliam · 第一項策略')}</p><p>${b('Hattie & Timperley · Where am I going?','Hattie與Timperley · 我要達到甚麼？')}</p></div>
 <div class="connection-target-line"><span>${b('Gu: the target guides every step','Gu：每一步均以目標為參照')}</span></div>
 <div class="connection-cycle">
  <article><h4>${b('Collect responses','蒐集作答')}</h4><p>${b('Black & Wiliam · Strategy 2','Black與Wiliam · 第二項策略')}</p><p>${b('Students show their thinking.','學生呈現思考。')}</p></article>
  <article><h4>${b('Interpret evidence','詮釋證據')}</h4><p>${b('Hattie & Timperley · How am I going?','Hattie與Timperley · 我目前的表現如何？')}</p><p>${b('Compare the response with the target.','依目標理解作答。')}</p></article>
  <article><h4>${b('Give feedback','給予回饋')}</h4><p>${b('Black & Wiliam · Strategy 3','Black與Wiliam · 第三項策略')}</p><p>${b('Hattie & Timperley · Where to next?','Hattie與Timperley · 下一步做甚麼？')}</p><p>${b('Choose the feedback focus that helps.','選擇有助學生的回饋焦點。')}</p></article>
  <article><h4>${b('Act on the feedback','運用回饋採取行動')}</h4><p>${b('Gu · Student/teacher action','Gu · 學生／教師行動')}</p><p>${b('Students revise; the teacher checks and follows up.','學生修訂，教師檢視並跟進。')}</p></article>
 </div>
 <div class="connection-return"><span aria-hidden="true">↶</span><p>${b('Read the revised response against the same target','依同一目標檢視修訂後的作答')}</p></div>
 <div class="connection-participation"><p><strong>${b('Strategy 4 · Peers','第四項策略 · 同伴')}</strong> ${b('Ask questions and help interpret the work.','提問，協助理解作品。')}</p><p><strong>${b('Strategy 5 · Learners','第五項策略 · 學習者')}</strong> ${b('Check, choose a change and explain it.','自查、選擇修改並說明原因。')}</p></div>
</div>
<p class="source-note"><a href="https://doi.org/10.1007/s11092-008-9068-5">Black &amp; Wiliam (2009)</a> · <a href="https://doi.org/10.3102/003465430298487">Hattie &amp; Timperley (2007)</a> · <a href="https://doi.org/10.3389/feduc.2021.605999">Gu (2021)</a></p>
</details>`;
