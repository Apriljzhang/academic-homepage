import { openingExample } from './tirfWorkshop.ts';
import { bilingual as b, escapeHtml as e } from './tirfMarkup.ts';
const response = (id:string,en:string,zh:string,rows=3) => `<label for="${id}">${b(en,zh)}</label><textarea id="${id}" data-note="${e(en)}" rows="${rows}"></textarea>`;
export const classroomCaseHtml = `<div class="classroom-case">
<p class="role-note">${b('Workshop role: you are the teacher designing this lesson. The English writing below is for your students.','工作坊角色：你是設計本課堂的教師。以下英語寫作是給你的學生做的。')}</p>
<div class="case-context"><h3>${b('The students and the teaching problem','學生與教學問題')}</h3><p>${b('Imagine an intermediate English class. Students can state an opinion, but often use vague examples or do not explain why an example supports the opinion. You want to help them develop that explanation.','設想一個中級英語班。學生能表達觀點，但例子常不夠具體，或沒有解釋例子為何支持觀點。你希望幫助他們把解釋寫清楚。')}</p></div>
<div class="learning-target"><h3>${b('What students are learning to do','學生要學會做甚麼')}</h3><p>${b(openingExample.goal,openingExample.goalZh)}</p></div>
<h3 class="look-for-heading">${b('What the teacher and students will look for','教師與學生會看甚麼')}<span class="inline-help" data-inline-help><button type="button" class="inline-help-trigger" aria-describedby="case-look-for-help"><span aria-hidden="true">i</span><span class="visually-hidden">${b('About look for','關於「看甚麼」')}</span></button><span class="inline-help-text" id="case-look-for-help" role="tooltip">${b('These questions show students what good work looks like. They give the teacher and students the same focus when discussing feedback and revisions.','這兩條問題讓學生知道作品要做到甚麼，也讓教師與學生在討論回饋及修訂時看同樣的重點。')}</span></span></h3><ul><li>${b('Is the example specific and relevant to the opinion?','例子是否具體，並與觀點相關？')}</li><li>${b('Does the writer explain how it supports the opinion?','作者有否解釋例子如何支持觀點？')}</li></ul>
<h3>${b('The task you give students','你給學生的任務')}</h3><p>${b('“Which paragraph supports the opinion more clearly? Explain why. Then improve A in your own words.”','「哪一段更清楚地支持觀點？請解釋原因，再用自己的話改寫A。」')}</p>
<p><strong>${b('Opinion: ','觀點：')}</strong><span lang="en" data-classroom-text>${e(openingExample.claim)}</span></p>
<div class="two case-paragraphs"><article><h4>${b('Paragraph A','段落A')}</h4><p lang="en" data-classroom-text>${e(openingExample.paragraphA)}</p></article><article><h4>${b('Paragraph B','段落B')}</h4><p lang="en" data-classroom-text>${e(openingExample.paragraphB)}</p></article></div>
<h3>${b('How the lesson continues','課堂如何繼續')}</h3><ol class="case-sequence"><li>${b('Read every student’s reason and first draft to see what needs attention.','看每位學生的理由及初稿，了解哪裏需要協助。')}</li><li>${b('Give a focused hint. A partner asks how the example supports the opinion.','提供針對性提示，同伴提問例子如何支持觀點。')}</li><li>${b('Students revise, check their own work and explain one change.','學生修訂、自查，並解釋一項改動。')}</li><li>${b('Use their responses to decide what to teach next. Later ask them to support a new opinion with less help.','依作答決定接下來教甚麼，稍後讓學生在較少協助下支持一個新觀點。')}</li></ol>
<details class="student-view"><summary>${b('Inspect the student activity here','在本頁查看學生活動')}</summary><div data-classroom-activity>
<p class="role-note">${b('This is the student view of the lesson above. As a workshop teacher, you may inspect it or type a sample response to see how revision works.','這是上述課堂的學生畫面。你作為工作坊教師，可直接檢視，或輸入模擬作答，觀察修訂如何進行。')}</p>
${response('case-reason','Which paragraph would you choose, and why?','你選哪一段？為甚麼？')}
${response('case-first','Improve A in your own words: first attempt','用自己的話改寫A：初稿',4)}
<button type="button" data-case-hint>${b('Keep my first attempt and show a prepared hint','保留初稿並查看預設提示')}</button><p class="status" data-case-status role="status"></p>
<div data-case-feedback hidden><h4>${b('Prepared hint','預先準備的提示')}</h4><p>${b('Ask yourself: what could students practise by reading an article each morning? Use the answer to explain why the example supports daily reading.','問自己：學生每天早上讀文章，可以練習甚麼？用答案解釋這個例子為何支持每天閱讀。')}</p><p class="source-note">${b('The same hint appears for everyone. It has not analysed your writing.','每人會看到同一提示；它並沒有分析你的寫作。')}</p>
${response('case-peer','Partner: ask one question about the example or its explanation','同伴：就例子或其解釋提出一條問題',2)}
${response('case-revision','Revise your paragraph after the hint or partner question','依提示或同伴問題修訂段落',4)}
${response('case-reflection','What did you change, and why?','你改了甚麼？為甚麼？',2)}
<p><strong>${b('Later task, with less help: ','稍後在較少協助下完成的任務：')}</strong><span lang="en" data-classroom-text>${e(openingExample.freshClaim)}</span></p>
${response('case-fresh','Write a new example and explain how it supports this opinion','寫一個新例子，解釋它如何支持這個觀點',4)}
<p>${b('Self-check: can you point to a relevant example and the words explaining its connection? The teacher reads this new response to decide whether further support is needed.','自查：你能否指出相關例子，以及解釋聯繫的文字？教師閱讀這份新作答，再決定是否需要進一步協助。')}</p></div>
</div></details></div>`;
