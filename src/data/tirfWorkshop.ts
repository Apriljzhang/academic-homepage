export const workshopTitle = 'AI Empowered Formative Assessment in TESOL: Designing Feedback Reflection and Learner Action';
export const openingExample = {
 goal: 'Students can support an opinion with a specific, relevant example and explain how it supports their point.',
 goalZh: '學生能以具體相關的例子支持觀點，並解釋例子如何支持自己的看法。',
 claim: 'Students should have a short reading period every school day.',
 paragraphA: 'Reading every day is good. It is useful and important. Students will become better because reading helps them.',
 paragraphB: 'A short reading period can help students build a reading habit. For example, learners could finish one short article each day and record two unfamiliar words. This regular practice would give them repeated opportunities to meet vocabulary in context.',
 draft: 'Students should read every day. For example, our class could read a short English article each morning. It would be good for us.',
 freshClaim: 'Students should sometimes choose what they read.',
};
export const caseContext = `Classroom: an intermediate English class. Students can state an opinion, but often give vague examples or leave the connection unexplained.
Learning target: ${openingExample.goal}
What to look for: a specific example relevant to the opinion; an explanation of how the example supports the opinion.
Opinion: ${openingExample.claim}
Paragraph A: ${openingExample.paragraphA}
Paragraph B: ${openingExample.paragraphB}
Student task: compare A and B and explain a choice, then improve A in the student's own words. Students use feedback to revise and explain their change. Later they write about a new opinion: ${openingExample.freshClaim}`;
export const caseContextZh = `課堂情境：中級英語班。學生能表達觀點，但例子常不夠具體，或未解釋例子與觀點的聯繫。
學習目標：${openingExample.goalZh}
教師及學生要看甚麼：例子是否具體且與觀點相關；是否解釋例子如何支持觀點。
英語觀點：${openingExample.claim}
段落A：${openingExample.paragraphA}
段落B：${openingExample.paragraphB}
學生任務：比較A、B並解釋選擇，再用自己的話改寫A。學生運用回饋修訂並解釋改動，稍後就新觀點寫作：${openingExample.freshClaim}`;
export const agenda = [
 ['The classroom case and formative assessment', '課堂案例與形成性評估', 1],
 ['Three frameworks for designing the lesson', '以三個框架設計課堂', 3],
 ['A worked example with generative AI', '生成式AI的完整設計示範', 4],
 ['Design, build and review your own activity', '設計、製作並檢視自己的活動', 6],
] as const;
export const prompts = [
 {title:'Plan the lesson with the frameworks',titleZh:'依框架規劃課堂',text:`Help me develop the classroom plan below. Use plain language.
Black and Wiliam (2009): show how students understand the learning target, how every student reveals understanding, how feedback helps, how peers help, and how students check their own work.
Hattie and Timperley (2007): connect feedback to the target, current work and a next step. Choose task, process or self-regulation feedback to suit the response. Explain the choice; avoid person-only praise.
Gu (2021): connect the learning target to evidence, interpretation, feedback and student/teacher action. Include a later task to check what students can do with less help.
Return a student activity and teacher notes. Identify what the teacher must check. Do not build a webpage yet.

My classroom plan:
[Paste my completed plan.]`,textZh:`請用淺白語言協助完善以下課堂計劃。
Black與Wiliam（2009）：交代學生如何理解學習目標、每人如何呈現理解、回饋如何幫助學習、同伴如何協助，以及學生如何自查。
Hattie與Timperley（2007）：回饋須連結學習目標、目前作品及下一步。按作答選擇任務、過程或自我調節層面的回饋，並解釋選擇；避免只讚賞個人。
Gu（2021）：以學習目標連結證據、詮釋、回饋及學生／教師行動。安排稍後的新任務，檢視學生在較少協助下的表現。
請提供學生活動及教師備註，指出教師需要核對甚麼。暫時不要製作網頁。

我的課堂計劃：
［貼上我完成的計劃。］`},
 {title:'Make the classroom materials',titleZh:'製作課堂材料',text:`Create one self-contained index.html from the classroom plan I have reviewed below. Put it in this workshop folder only.
Make the learning target and what to look for clear. Include the student instructions and examples. Let each student make an initial attempt, use teacher-approved feedback, revise and explain a change. Include a partner question, a self-check and a later task with a new example or topic.
Use the agreed feedback exactly. Label it as a prepared hint, not AI analysis of the student's response. Do not automatically grade open writing or supply a finished answer before the student tries.
Keep the first attempt and the revision visible. Provide download/print of the student's actual work. Make controls work on keyboard and phone. Keep the file offline with no APIs, external services or collection of student data. A teacher will review the writing.
Explain how I can open the file and try it. Tell me which checks you actually ran.

Reviewed classroom plan and feedback:
[Paste my revised plan and the feedback I chose.]`,textZh:`請依據以下已由我檢視的課堂計劃，製作一個獨立的index.html，只儲存在本工作坊資料夾。
清楚展示學習目標及要看甚麼，加入學生指示與例文。讓每位學生先作答，再使用教師確認的回饋、修訂並解釋改動。加入一條同伴提問、自查，以及稍後使用新例子或新主題的任務。
請原文使用我確認的回饋，標明為預先準備的提示，不要聲稱AI分析了學生作答。不要自動為開放寫作評分，也不要在學生嘗試前提供完整答案。
同時保留初稿及修訂，讓學生下載／列印自己的實際作答。支援鍵盤及手機；檔案離線運作，不使用API、外部服務或收集學生資料。寫作由教師檢視。
解釋如何開啟檔案及試用，說明實際完成了哪些檢查。

我已檢視的課堂計劃及回饋：
［貼上修改後的計劃及我選定的回饋。］`},
 {title:'Review and improve the activity',titleZh:'檢視並改進活動',text:`Review this activity against my classroom plan and the three frameworks.
Try a response that meets the learning target, one with a relevant example but no explanation, and a blank response. Check whether each reveals enough for the teacher to decide what to do next.
Check that feedback addresses the work or learning strategy, and that students can act on it through revision, peer discussion or self-check. Check that the teacher has a follow-up and a later task to examine learning. Check keyboard use, phone layout and export of actual writing.
Identify the most important problem, explain which part of the learning design it affects, repair it and repeat the relevant check. Report what you actually tested.

My reviewed plan:
[Paste my plan.]`,textZh:`請依我的課堂計劃及三個框架檢視本活動。
試用達到目標的作答、有相關例子但沒有解釋的作答，以及空白作答。檢查這些作答能否提供足夠資訊，讓教師決定下一步。
檢查回饋是否針對作品或學習方法，學生能否透過修訂、同伴討論或自查採取行動；教師是否有後續教學，以及稍後檢視學習的新任務。同時檢查鍵盤、手機排版及實際寫作的匯出。
找出最重要的問題，解釋它影響哪部分學習設計，修正並重做相關檢查。只報告實際完成的測試。

我已檢視的計劃：
［貼上我的計劃。］`},
];
export const feedbackPrompt = {
 en:`${caseContext}\n\nFictional student draft: ${openingExample.draft}\n\nHelp me prepare feedback using Hattie and Timperley (2007). Give three short alternatives: one focused on the task, one on the writing process, and one on the student's self-regulation. For each, show which question it answers: Where am I going? How am I going? Where to next? Write feedback to the student in simple English. Do not rewrite the paragraph or praise the person. Explain to me what each comment may help the student do and what I should check before using it.`,
 zh:`${caseContextZh}\n\n虛構學生初稿：${openingExample.draft}\n\n請依Hattie與Timperley（2007）協助準備回饋，提供三個簡短選項，分別針對任務、寫作過程及學生的自我調節。每個選項標明回應哪個問題：我要達到甚麼？目前表現如何？下一步做甚麼？給學生的回饋用簡單英語，給教師的解釋用繁體中文。不要代寫段落或只讚賞個人。說明每則回饋可能幫助學生做甚麼，以及教師使用前應核對甚麼。`,
};
export const workedFeedback = [
 {title:'Task feedback',titleZh:'任務層面的回饋',comment:'Your morning-reading example is specific. “It would be good” does not yet explain how reading helps. Add that connection.',commentZh:'你早上閱讀的例子很具體。「這對我們有好處」仍未解釋閱讀如何幫助學習。請補上聯繫。',why:'Points to what is present and what is missing, then gives a next step.',whyZh:'指出已有及欠缺的內容，然後提出下一步。'},
 {title:'Process feedback',titleZh:'過程層面的回饋',comment:'Ask yourself: what could students practise by reading an article each morning? Use the answer to explain why your example supports daily reading.',commentZh:'問自己：學生每天早上讀文章，可以練習甚麼？用答案解釋例子為何支持每天閱讀。',why:'Offers a way to build an explanation, so the student still does the thinking.',whyZh:'提供構思解釋的方法，思考仍由學生完成。'},
 {title:'Self-regulation feedback',titleZh:'自我調節層面的回饋',comment:'Underline your example and circle the words explaining its connection. Which part needs work? Choose a change and check it again.',commentZh:'畫出你的例子，圈出解釋聯繫的文字。哪部分需要改進？選擇一項改動，再自行檢查。',why:'Prompts the student to inspect the work and decide how to improve it.',whyZh:'引導學生檢視作品，自行決定如何改進。'},
];
export const workedPlan = [
 {stage:'Learning target',stageZh:'學習目標',design:'Support an opinion with a relevant example and explain the connection. Compare A and B to show what this means.',designZh:'以相關例子支持觀點並解釋聯繫；比較A、B，讓學生明白目標的意思。',framework:'Black & Wiliam: clarify the target; Gu: the target guides every step.',frameworkZh:'Black與Wiliam：釐清目標；Gu：每一步均依目標而定。'},
 {stage:'Student response and teacher interpretation',stageZh:'學生作答與教師詮釋',design:'Every student chooses a paragraph, explains why and improves A. The teacher checks whether the example is relevant and the connection is explained.',designZh:'每位學生選段落、解釋原因並改寫A。教師檢視例子是否相關，以及是否解釋聯繫。',framework:'Black & Wiliam: reveal understanding; Gu: evidence and interpretation.',frameworkZh:'Black與Wiliam：呈現理解；Gu：證據與詮釋。'},
 {stage:'Feedback and student action',stageZh:'回饋與學生行動',design:'Use a process hint: “Ask what students could practise by reading an article each morning.” Students revise and explain the change; partners ask how the example supports the opinion.',designZh:'使用過程提示：「問自己，學生每天早上讀文章可以練習甚麼？」學生修訂並解釋改動，同伴提問例子如何支持觀點。',framework:'Hattie & Timperley: process feedback and next step; Black & Wiliam: feedback, peers and ownership.',frameworkZh:'Hattie與Timperley：過程回饋及下一步；Black與Wiliam：回饋、同伴與自主學習。'},
 {stage:'Teacher follow-up and a new task',stageZh:'教師跟進與新任務',design:'If the link is still missing, model one with a different example. Later ask students to support the opinion about choosing their own reading, with less help.',designZh:'若仍欠聯繫，用另一個例子示範。稍後讓學生就「自行選擇閱讀內容」寫作，並減少協助。',framework:'Gu: feedback leads to action; later evidence helps examine the effect.',frameworkZh:'Gu：由回饋帶來行動；稍後的證據有助檢視效果。'},
];
export const worksheet = [
 {id:'audience',group:0,label:'Which class are you designing for?',labelZh:'你為哪個班級設計？',help:'Example: intermediate English learners who can state an opinion but struggle to explain it.',helpZh:'例如：能表達觀點，但解釋尚不充分的中級英語學生。'},
 {id:'goal',group:0,label:'What should students learn to do?',labelZh:'學生要學會做甚麼？',help:'Write one learning target, such as supporting an opinion with an example and an explanation.',helpZh:'寫一個學習目標，例如以例子支持觀點，並解釋聯繫。'},
 {id:'criterion1',group:0,label:'What will you look for in their work? First point',labelZh:'你會在作品中看甚麼？第一點',help:'Example: a specific example relevant to the opinion.',helpZh:'例如：具體且與觀點相關的例子。'},
 {id:'criterion2',group:0,label:'What else will you look for? Second point, if needed',labelZh:'還要看甚麼？第二點（如適用）',help:'Example: a sentence explaining how the example supports the opinion.',helpZh:'例如：有一句解釋例子如何支持觀點。'},
 {id:'evidence',group:1,label:'What will every student say, write or do?',labelZh:'每位學生會說、寫或做甚麼？',help:'Example: choose A or B, explain the choice, then improve A.',helpZh:'例如：選A或B，解釋選擇，再改寫A。'},
 {id:'interpretation',group:1,label:'What might the response tell you? What would you check?',labelZh:'作答可能透露甚麼？你還會核對甚麼？',help:'Example: “B is longer” may show a focus on length. Compare two equally long examples to check.',helpZh:'例如：「B較長」可能反映學生只看長度，可比較兩個長度相同的例子來核對。'},
 {id:'feedback',group:1,label:'What feedback will the student receive?',labelZh:'學生會收到甚麼回饋？',help:'Ask AI to help draft feedback. Paste the comment you choose and explain how it helps with the learning target.',helpZh:'請AI協助擬寫回饋，貼上你選定的評語，解釋它如何幫助學生達到目標。'},
 {id:'peers',group:2,label:'How will a partner help?',labelZh:'同伴如何協助？',help:'Example: underline the example and ask how it supports the opinion.',helpZh:'例如：畫出例子，提問它如何支持觀點。'},
 {id:'ownership',group:2,label:'What will students revise or decide for themselves?',labelZh:'學生會自行修訂或決定甚麼？',help:'Example: check the example and explanation, revise and explain one change.',helpZh:'例如：自查例子及解釋、修訂，並說明一項改動。'},
 {id:'action',group:2,label:'What will you do as the teacher after reading the responses?',labelZh:'看過作答後，你作為教師會做甚麼？',help:'Example: show another worked example to students who still need help; extend the task for others.',helpZh:'例如：為仍需協助的學生再示範一個例子，為其他學生延伸任務。'},
 {id:'recheck',group:2,label:'What later task will show what students can do with less help?',labelZh:'稍後用甚麼任務檢視學生在較少協助下的表現？',help:'Example: a new opinion requiring a different example and explanation.',helpZh:'例如：以新觀點要求不同的例子及解釋。'},
] as const;
export const planningGroups = [
 {title:'Make the learning target clear',titleZh:'讓學習目標清晰',link:'Black & Wiliam: clarify the target · Gu: keep the target central',linkZh:'Black與Wiliam：釐清目標；Gu：以目標為中心'},
 {title:'Find out what students understand and prepare feedback',titleZh:'了解學生理解，準備回饋',link:'Black & Wiliam: evidence and feedback · Hattie & Timperley: feedback questions and levels · Gu: interpretation',linkZh:'Black與Wiliam：證據與回饋；Hattie與Timperley：回饋問題與層面；Gu：詮釋'},
 {title:'Plan what students and the teacher will do next',titleZh:'規劃學生與教師的下一步',link:'Black & Wiliam: peers and ownership · Gu: action and later evidence',linkZh:'Black與Wiliam：同伴與自主學習；Gu：行動及稍後的證據'},
];
