export const workshopTitle = 'AI Empowered Formative Assessment in TESOL: Designing Feedback Reflection and Learner Action';
export const openingExample = {
 goal: 'Students can support an opinion with a specific, relevant example and explain how it supports their point.',
 goalZh: '學生能以具體相關的例子支持觀點，並解釋例子如何支持自己的看法。',
 claim: 'Students should have a short reading period every school day.',
 paragraphA: 'Reading every day is good. It is useful and important. Students will become better because reading helps them.',
 paragraphB: 'Reading a little English every day can help us learn words. For example, we can read one short text every morning. We see the same words again, so we can remember them better.',
 draft: 'Students should read every day. For example, our class could read a short English article each morning. It would be good for us.',
 freshClaim: 'Students should sometimes choose what they read.',
};
export const caseContext = `Classroom: a first-year general college English class for non-English majors in China. Students can read short sentences with support, but many need help expressing a reason in English. Use Chinese for task explanations and allow Chinese or mixed-language reasons when checking understanding. Provide a small word bank and the optional sentence opening “This helps us ... because ...”. Students then write a short explanation in English. Judge the relevance and connection separately from spelling or fluency.
Learning target: ${openingExample.goal}
What to look for: a specific example relevant to the opinion; an explanation of how the example supports the opinion.
Opinion: ${openingExample.claim}
Paragraph A: ${openingExample.paragraphA}
Paragraph B: ${openingExample.paragraphB}
Student task: compare A and B and explain a choice, then improve A in the student's own words. Students use feedback to revise and explain their change.`;
export const caseContextZh = `課堂情境：中國高校非英語專業一年級大學英語班。學生能在協助下閱讀短句，但不少學生仍難以用英語表達理由。任務以中文解說，檢視理解時可接受中文或中英夾雜的理由。提供少量詞彙及可選句首“This helps us ... because ...”，再讓學生用簡短英語補上解釋。例子是否相關、聯繫是否清楚，須與拼寫或流利程度分開判斷。
學習目標：${openingExample.goalZh}
教師及學生要看甚麼：例子是否具體且與觀點相關；是否解釋例子如何支持觀點。
英語觀點：${openingExample.claim}
段落A：${openingExample.paragraphA}
段落B：${openingExample.paragraphB}
學生任務：比較A、B並解釋選擇，再用自己的話改寫A。學生運用回饋修訂並解釋改動。教師依修訂決定是否需要追問或進一步說明。`;
export const agenda = [
 ['The classroom case and formative assessment', '課堂案例與形成性評估', 1],
 ['Three frameworks for designing formative assessment', '以三個框架設計形成性評估', 3],
 ['Build a formative assessment activity with an AI agent', '用AI代理製作形成性評估活動', 5],
 ['Design, build and review your own activity', '設計、製作並檢視自己的活動', 6],
] as const;
export const prompts = [
 {title:'Plan formative assessment with the frameworks',titleZh:'依框架規劃形成性評估',text:`Help me design a formative assessment activity for the language class described below. Use plain language. Identify the learning target to check, the evidence students will produce, how we will interpret it, and the teaching or learning decisions it will inform.
The framework from Black and Wiliam (2009) guides the activity features and participation: show how students understand the learning target, how every student reveals understanding, how feedback helps, how peers help, and how students check their own work.
Hattie and Timperley’s (2007) model guides feedback: connect feedback to the target, current work and a next step. Choose task, process or self-regulation feedback to suit the response. Explain the choice; avoid person-only praise.
Gu (2021) guides the whole activity: connect the learning target to evidence, interpretation, feedback and student/teacher action. Check the revision against the same learning target.
Return a screen-by-screen plan for an HTML formative assessment activity and teacher notes. For each screen, identify the student response it captures, a possible interpretation and a teacher or student next step. Include an evidence-selection or highlighting interaction, peer discussion, revision and teacher follow-up. Let me review this plan before creating the file.

My formative assessment plan:
[Paste my completed plan.]`,textZh:`請用淺白語言，為以下語言班級設計形成性評估活動。交代要檢視的學習目標、學生會產生的證據、如何詮釋，以及證據會支持哪些教或學的決定。
Black與Wiliam（2009）引導活動功能及參與方式：交代學生如何理解學習目標、每人如何呈現理解、回饋如何幫助學習、同伴如何協助，以及學生如何自查。
Hattie與Timperley（2007）引導回饋：回饋須連結學習目標、目前作品及下一步。按作答選擇任務、過程或自我調節層面的回饋，並解釋選擇；避免只讚賞個人。
Gu（2021）引導整體活動：以學習目標連結證據、詮釋、回饋及學生／教師行動。依同一學習目標檢視修訂。
請提供HTML形成性評估活動的逐頁計劃及教師備註，每頁交代學生會留下甚麼作答、可能的詮釋，以及教師或學生的下一步。加入選擇證據或標記文字的互動、同伴討論、修訂及教師跟進。先讓我檢視計劃，再製作檔案。

我的形成性評估計劃：
［貼上我完成的計劃。］`},
 {title:'Build the formative assessment activity in HTML',titleZh:'用HTML製作形成性評估活動',text:`Create a formative assessment activity for my language class as one self-contained index.html from the plan I have reviewed below. Put it in this workshop folder only.
Use HTML slides or activity screens to elicit evidence and support action during the language lesson. Make navigation clear. For each interaction, specify what it reveals and how the teacher or student will use that information. Use Black and Wiliam to organise the features: a target with contrasting examples, an evidence-selection or text-highlighting interaction that requires a reason, feedback, peer support and self-check. Make the learning target and what to look for clear. Include the student instructions and examples. Let each student make an initial attempt, use teacher-approved feedback, revise and explain a change. Include a partner question, a self-check and a teacher follow-up based on the revision.
Use the feedback I have approved exactly as written. Following Hattie and Timperley, show the target, what needs attention and a next step; use the chosen task, process or self-regulation focus. Identify prepared hints clearly. Open writing will be reviewed by the teacher. Do not automatically grade open writing or supply a finished answer before the student tries.
Following Gu, add teacher notes for each response: what evidence it provides, possible interpretations, a follow-up question and teacher/student action. Use the response patterns in the reviewed plan. For the shared writing case, check with equally long examples if a student chooses by length, and offer a process hint if an explanation is missing. Keep the first attempt and the revision visible. Provide download/print of the student's actual work. Make controls work on keyboard and phone. Keep the file offline, with responses retained on the student’s device until they choose to export. Give the teacher a practical way to review those response records. A teacher will review the writing.
Create the file, open a preview using available tools, try the student interactions, fix problems and repeat the relevant checks. Explain how I can open the file and report checks actually completed; give manual steps for any checks you could not run.

Reviewed classroom plan and feedback:
[Paste my revised plan and the feedback I chose.]`,textZh:`請依以下已由我檢視的計劃，為我的語言班級製作形成性評估活動，儲存為一個獨立的index.html，只儲存在本工作坊資料夾。
以HTML投影片或活動畫面，在語言課堂中蒐集證據並支持後續行動。清楚安排導覽，每項互動均須交代呈現甚麼，以及教師或學生如何運用資訊。依Black與Wiliam安排功能：目標與對比例文、要求說明理由的證據選擇或文字標記、回饋、同伴協助及自查。清楚展示學習目標及要看甚麼，加入學生指示與例文。讓每位學生先作答，再使用教師確認的回饋、修訂並解釋改動。加入一條同伴提問、自查，以及依修訂安排的教師跟進。
請原文使用我確認的回饋。依Hattie與Timperley交代目標、需要改進之處及下一步，使用已選定的任務、過程或自我調節焦點。清楚標示為預先準備的提示，開放寫作由教師檢視。不要自動為開放寫作評分，也不要在學生嘗試前提供完整答案。
依Gu為各項作答加入教師備註：提供甚麼證據、可能的詮釋、追問，以及教師／學生行動。使用已檢視計劃中的作答情況。以共同寫作案例為例：若學生以長度選擇，安排長度相同的例子作核對；若欠缺解釋，提供過程提示。同時保留初稿及修訂，讓學生下載／列印自己的實際作答。支援鍵盤及手機；檔案離線運作，作答保留在學生裝置，待學生選擇匯出；提供教師可實際檢視作答記錄的方法。寫作由教師檢視。
製作檔案後，使用可用工具開啟預覽、試用學生互動、修正問題並重做相關檢查。解釋如何開啟檔案，只報告實際完成的測試；未能執行的檢查則提供人工試用步驟。

我已檢視的課堂計劃及回饋：
［貼上修改後的計劃及我選定的回饋。］`},
 {title:'Review and improve the activity',titleZh:'檢視並改進活動',text:`Review this formative assessment activity against my classroom plan and the three frameworks. Black and Wiliam: inspect participation and activity features. Hattie and Timperley: inspect the feedback and the revision they support. Gu: trace each response through interpretation to a teacher/student action and the revised response.
Try a choice justified by length, a response that meets the learning target, one with a relevant example but no explanation, and a blank response. For the choice based on length, check that the teacher notes propose a comparison with equally long examples. For each response, identify the evidence, a possible interpretation and a different next step where needed. Check how the teacher will access and use the response record.
Check that feedback addresses the work or learning strategy, and that students can act on it through revision, peer discussion or self-check. Check that the teacher has a follow-up and a way to check the revised response. Check keyboard use, phone layout and export of actual writing.
Identify the most important problem, explain which part of the learning design it affects, repair it and repeat the relevant check. Report what you actually tested.

My reviewed plan:
[Paste my plan.]`,textZh:`請依我的課堂計劃及三個框架檢視本形成性評估活動。Black與Wiliam：檢查參與方式及活動功能。Hattie與Timperley：檢查回饋及它支持的修訂。Gu：從每項作答追蹤至詮釋、教師／學生行動，以及修訂後的作答。
試用以長度作理由的選擇、達到目標的作答、有相關例子但沒有解釋的作答，以及空白作答。針對以長度選擇的情況，檢查教師備註有否提出長度相同的例子作比較。為每項作答指出證據、可能的詮釋，以及按需要安排的不同下一步；檢查教師如何取得並運用作答記錄。
檢查回饋是否針對作品或學習方法，學生能否透過修訂、同伴討論或自查採取行動；教師是否有後續教學，以及檢視修訂作答的方法。同時檢查鍵盤、手機排版及實際寫作的匯出。
找出最重要的問題，解釋它影響哪部分學習設計，修正並重做相關檢查。只報告實際完成的測試。

我已檢視的計劃：
［貼上我的計劃。］`},
];
export const feedbackPrompt = {
 en:`${caseContext}\n\nFictional student draft: ${openingExample.draft}\n\nHelp me prepare feedback using Hattie and Timperley (2007). Give three short alternatives: one focused on the task, one on the writing process, and one on the student's self-regulation. For each, show which question it answers: Where am I going? How am I going? Where to next? Prepare these feedback options for a formative assessment activity in the language class. State the learning target; each comment should show what needs attention and an action the student can take. Write feedback to the student in simple English. Do not rewrite the paragraph or praise the person. Explain to me what each comment may help the student do and what I should check before using it.`,
 zh:`${caseContextZh}\n\n虛構學生初稿：${openingExample.draft}\n\n請依Hattie與Timperley（2007）協助準備回饋，提供三個簡短選項，分別針對任務、寫作過程及學生的自我調節。每個選項標明回應哪個問題：我要達到甚麼？目前表現如何？下一步做甚麼？這些回饋用於語言課堂的形成性評估活動。先交代學習目標，每則回饋說明需要改進之處及學生可採取的行動。給學生的回饋用簡單英語，給教師的解釋用繁體中文。不要代寫段落或只讚賞個人。說明每則回饋可能幫助學生做甚麼，以及教師使用前應核對甚麼。`,
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
 {stage:'Check the revision',stageZh:'檢視修訂',design:'Compare the revision with the same learning target. Ask why the student made the change and decide whether more support is needed.',designZh:'依同一目標檢視修訂，問學生為何修改，再決定是否仍需協助。',framework:'Gu: evidence, interpretation, feedback and action.',frameworkZh:'Gu：由回饋帶來行動；修訂作答的證據有助檢視效果。'},
];
export const worksheet = [
 {id:'audience',group:0,label:'Which class are you designing for?',labelZh:'你為哪個班級設計？',help:'Example: intermediate English learners who can state an opinion but struggle to explain it.',helpZh:'例如：能表達觀點，但解釋尚不充分的中級英語學生。'},
 {id:'format',group:0,label:'Which format will you use for the formative assessment activity?',labelZh:'你會用甚麼形式呈現形成性評估活動？',help:'HTML slides with choice-and-reason checks, a reading evidence check or a dialogue decision task. Specify how you will use the responses.',helpZh:'設有選擇及理由題的HTML投影片、閱讀證據檢查，或對話判斷任務，並交代如何運用作答。'},
 {id:'goal',group:0,label:'What should students learn to do?',labelZh:'學生要學會做甚麼？',help:'Write one learning target, such as supporting an opinion with an example and an explanation.',helpZh:'寫一個學習目標，例如以例子支持觀點，並解釋聯繫。'},
 {id:'criterion1',group:0,label:'What will you look for in their work? First point',labelZh:'你會在作品中看甚麼？第一點',help:'Example: a specific example relevant to the opinion.',helpZh:'例如：具體且與觀點相關的例子。'},
 {id:'criterion2',group:0,label:'What else will you look for? Second point, if needed',labelZh:'還要看甚麼？第二點（如適用）',help:'Example: a sentence explaining how the example supports the opinion.',helpZh:'例如：有一句解釋例子如何支持觀點。'},
 {id:'evidence',group:1,label:'What will every student say, write or do?',labelZh:'每位學生會說、寫或做甚麼？',help:'Example: choose A or B, explain the choice, then improve A.',helpZh:'例如：選A或B，解釋選擇，再改寫A。'},
 {id:'interpretation',group:1,label:'What might the response tell you? What would you check?',labelZh:'作答可能透露甚麼？你還會核對甚麼？',help:'Example: “B is longer” may show a focus on length. Compare two equally long examples to check.',helpZh:'例如：「B較長」可能反映學生只看長度，可比較兩個長度相同的例子來核對。'},
 {id:'feedback',group:1,label:'What feedback will the student receive?',labelZh:'學生會收到甚麼回饋？',help:'Ask AI to help draft feedback. Paste the comment you choose and explain how it helps with the learning target.',helpZh:'請AI協助擬寫回饋，貼上你選定的評語，解釋它如何幫助學生達到目標。'},
 {id:'peers',group:2,label:'How will a partner help?',labelZh:'同伴如何協助？',help:'Example: underline the example and ask how it supports the opinion.',helpZh:'例如：畫出例子，提問它如何支持觀點。'},
 {id:'ownership',group:2,label:'What will students revise or decide for themselves?',labelZh:'學生會自行修訂或決定甚麼？',help:'Example: check the example and explanation, revise and explain one change.',helpZh:'例如：自查例子及解釋、修訂，並說明一項改動。'},
 {id:'action',group:2,label:'What will you do as the teacher after reading the responses?',labelZh:'看過作答後，你作為教師會做甚麼？',help:'Example: show another worked example to students who still need help; extend the task for others.',helpZh:'例如：為仍需協助的學生再示範一個例子，為其他學生延伸任務。'},
 {id:'recheck',group:2,label:'How will you check the revised response?',labelZh:'你會如何檢視修訂後的作答？',help:'Compare the revision with the target and ask why the student made a change.',helpZh:'依目標檢視修訂，再問學生為何修改。'},
] as const;
export const planningGroups = [
 {title:'Make the learning target clear',titleZh:'讓學習目標清晰',link:'Black & Wiliam: clarify the target · Gu: keep the target central',linkZh:'Black與Wiliam：釐清目標；Gu：以目標為中心'},
 {title:'Find out what students understand and prepare feedback',titleZh:'了解學生理解，準備回饋',link:'Black & Wiliam: evidence and feedback · Hattie & Timperley: feedback questions and levels · Gu: interpretation',linkZh:'Black與Wiliam：證據與回饋；Hattie與Timperley：回饋問題與層面；Gu：詮釋'},
 {title:'Plan what students and the teacher will do next',titleZh:'規劃學生與教師的下一步',link:'Black & Wiliam: peers and ownership · Gu: action and the revised response',linkZh:'Black與Wiliam：同伴與自主學習；Gu：行動及修訂作答的證據'},
];
