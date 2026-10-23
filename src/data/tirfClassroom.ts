import { openingExample } from './tirfWorkshop.ts';
import { bilingual as b, escapeHtml as e } from './tirfMarkup.ts';
const response = (id:string,en:string,zh:string,rows=3) => `<label for="${id}">${b(en,zh)}</label><textarea id="${id}" data-note="${e(en)}" rows="${rows}"></textarea>`;
export const classroomCaseHtml = `<div class="classroom-case">
<p class="role-note">${b('Workshop role: you are the teacher designing this lesson. The English writing below is for your students.','工作坊角色：你是設計本課堂的教師。以下英語寫作是給你的學生做的。')}</p>
<div class="case-context"><h3>${b('The students and the teaching problem','學生與教學問題')}</h3><p>${b('A first-year general college English class in China. Students read short texts with help and need support to explain a reason in English. Explain the task in Chinese; allow Chinese or mixed-language reasons before a short English revision. Provide key words and the sentence opening “This helps us ... because ...”.','中國高校非英語專業一年級大學英語班。學生需要協助閱讀短文及用英語解釋理由。任務用中文解說，先接受中文或中英夾雜的理由，再用簡短英語修訂。提供關鍵詞及句首“This helps us ... because ...”。')}</p></div>
<div class="learning-target"><h3>${b('What students are learning to do','學生要學會做甚麼')}</h3><p>${b(openingExample.goal,openingExample.goalZh)}</p></div>
<h3 class="look-for-heading">${b('What the teacher and students will look for','教師與學生會看甚麼')}<span class="inline-help" data-inline-help><button type="button" class="inline-help-trigger" aria-describedby="case-look-for-help"><span aria-hidden="true">i</span><span class="visually-hidden">${b('About look for','關於「看甚麼」')}</span></button><span class="inline-help-text" id="case-look-for-help" role="tooltip">${b('These questions show students what good work looks like. They give the teacher and students the same focus when discussing feedback and revisions.','這兩條問題讓學生知道作品要做到甚麼，也讓教師與學生在討論回饋及修訂時看同樣的重點。')}</span></span></h3><ul><li>${b('Is the example specific and relevant to the opinion?','例子是否具體，並與觀點相關？')}</li><li>${b('Does the writer explain how it supports the opinion?','作者有否解釋例子如何支持觀點？')}</li></ul>
<h3>${b('The task you give students','你給學生的任務')}</h3><p>${b('“Which paragraph supports the opinion more clearly? Explain why. Then improve A in your own words.”','「哪一段更清楚地支持觀點？請解釋原因，再用自己的話改寫A。」')}</p>
<p><strong>${b('Opinion: ','觀點：')}</strong><span lang="en" data-classroom-text>${e(openingExample.claim)}</span></p>
<div class="two case-paragraphs"><article><h4>${b('Paragraph A','段落A')}</h4><p lang="en" data-classroom-text>${e(openingExample.paragraphA)}</p></article><article><h4>${b('Paragraph B','段落B')}</h4><p lang="en" data-classroom-text>${e(openingExample.paragraphB)}</p></article></div>
<h3>${b('Sample student response to assess','供評估的學生模擬作答')}</h3><p>${b('Choice and reason: “B, because it is longer.”','選擇及理由：「B，因為它較長。」')}</p><blockquote class="student-draft" lang="en">${e(openingExample.draft)}</blockquote><p>${b('Teacher check: ask which words explain why daily reading helps. The choice and draft suggest what to check; use the response to choose feedback and ask for a revision.','教師檢視：請學生指出哪些詞句解釋了每天閱讀的作用。選擇與初稿提供核對的線索；依作答選擇回饋，再讓學生修訂。')}</p>
<h3>${b('How the lesson continues','課堂如何繼續')}</h3><ol class="case-sequence"><li>${b('Read every student’s reason and first draft to see what needs attention.','看每位學生的理由及初稿，了解哪裏需要協助。')}</li><li>${b('Give a focused hint. A partner asks how the example supports the opinion.','提供針對性提示，同伴提問例子如何支持觀點。')}</li><li>${b('Students revise, check their own work and explain one change.','學生修訂、自查，並解釋一項改動。')}</li><li>${b('Read the revision to decide whether to ask a follow-up question or explain the connection again.','依修訂決定是否需要追問，或再次說明例子與觀點的聯繫。')}</li></ol>
<details class="student-view"><summary>${b('Inspect the student activity here','在本頁查看學生活動')}</summary><div data-classroom-activity>
<p class="role-note">${b('College scenario: try a sample response to see how the site keeps the first attempt, shows feedback and supports revision.','大學情境：輸入模擬作答，查看網站如何保留初稿、顯示回饋及支持修訂。')}</p>
${response('case-reason','Which paragraph would you choose, and why? You may explain in Chinese.','你選哪一段？為甚麼？可用中文解釋。')}
${response('case-first','Improve A in your own words: first attempt','用自己的話改寫A：初稿',4)}
<button type="button" data-case-hint>${b('Keep my first attempt and show feedback','保留初稿並查看回饋')}</button><p class="status" data-case-status role="status"></p>
<div data-case-feedback hidden><h4>${b('Feedback','回饋')}</h4><p>${b('Ask yourself: what could students practise by reading an article each morning? Use the answer to explain why the example supports daily reading.','問自己：學生每天早上讀文章，可以練習甚麼？用答案解釋這個例子為何支持每天閱讀。')}</p><p class="source-note">${b('This demonstration shows the same prepared feedback to everyone. The teacher reads the response and decides whether to use it.','本示範為每人顯示同一預設回饋，由教師閱讀作答後決定是否適用。')}</p>
${response('case-peer','Partner: ask one question about the example or its explanation','同伴：就例子或其解釋提出一條問題',2)}
${response('case-revision','Revise your paragraph after the feedback or partner question','依提示或同伴問題修訂段落',4)}
${response('case-reflection','What did you change, and why?','你改了甚麼？為甚麼？',2)}
</div>
</div></details></div>`;

const activityStart = classroomCaseHtml.indexOf('<details class="student-view">');
const sequenceStart = classroomCaseHtml.indexOf('<h3>'+b('How the lesson continues','課堂如何繼續'));
export const classroomContextHtml = classroomCaseHtml.slice(0,sequenceStart).replace(/<p class="role-note">[\s\S]*?<\/p>/,'')+'</div>';
export const classroomActivityHtml = classroomCaseHtml.slice(activityStart,-6);
