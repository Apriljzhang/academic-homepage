export const workshopTitle = 'AI Empowered Formative Assessment in TESOL: Designing Feedback Reflection and Learner Action';
export const openingExample = {
 goal: 'Support an opinion with a specific relevant example and explain its link.',
 claim: 'Students should have a short reading period every school day.',
 paragraphA: 'Reading every day is good. It is useful and important. Students will become better because reading helps them.',
 paragraphB: 'A short reading period can help students build a reading habit. For example, learners could finish one short article each day and record two unfamiliar words. This regular practice would give them repeated opportunities to meet vocabulary in context.',
};
export const agenda = [
 ['Understand formative assessment / AfL', '理解形成性評估／促進學習的評估', 1],
 ['Experience a language-learning activity', '體驗語言學習活動', 4],
 ['Design and build with Codex or WorkBuddy', '以Codex或WorkBuddy設計與製作', 5],
 ['Test, improve and plan classroom use', '測試、改進與規劃課堂應用', 8],
] as const;
export const demoBrief = `Audience: intermediate English learners who can state opinions but need help supporting them.
Goal: support an opinion with a specific relevant example and explain its link.
Criteria: (1) a specific example is relevant to the claim; (2) an explanation shows how it supports the claim.
Task/evidence: compare paragraphs A and B about daily reading, justify a choice, then write an improved version of A. Inspect the example and explanation.
Paragraph A: Reading every day is good. It is useful and important. Students will become better because reading helps them.
Paragraph B: A short reading period can help students build a reading habit. For example, learners could finish one short article each day and record two unfamiliar words. This regular practice would give them repeated opportunities to meet vocabulary in context.
Feedback/action: after an initial attempt, offer the fixed hints "Can the reader picture your example?" and "Explain how it supports the claim." The learner revises and explains the change.
Fresh recheck: support "Students should sometimes choose what they read" with a new example and explanation.`;
export const prompts = [
 {title:'Review the learning design', text:`Act as a language-teaching design partner. Review my formative-assessment brief before coding. Check that the language goal, two observable criteria, task evidence, feedback, learner action and fresh recheck fit together. Flag the most important mismatch and propose a repair. Consider another explanation for an apparently weak response. Use fictional examples. Return a concise revised brief for my review; do not build yet.\n\nMy brief:\n[Paste your completed brief.]`},
 {title:'Build the activity', text:`Build the approved brief as ONE self-contained index.html in a new empty workshop folder, with embedded CSS and JavaScript. Follow the brief's language goal, criteria, task and response format.\n\nMake the goal and criteria visible. Elicit an initial attempt before revealing teacher-approved hints. Use fixed, criterion-focused hints labelled as local feedback; do not claim they analyse a learner's writing. Preserve the initial response, allow revision and ask what changed and why. Include the fresh recheck from the brief. Do not automatically grade open responses.\n\nKeep it accessible on keyboard and mobile. Provide print/text export of the actual initial response, revision and reflection, and reset with confirmation. Use fictional examples. Run offline with no external dependencies, network requests, APIs, keys, login or recording. Keep responses only in memory until refresh/close; no localStorage, cookies or cross-device collection. Modify only this workshop folder.\n\nExplain how to open index.html and try it. Report only checks actually run.\n\nApproved brief and teacher-approved examples/hints:\n[Paste your reviewed brief and examples.]`},
 {title:'Test and make one repair', text:`Test the activity against my approved brief. Try a strong response, a weak response, blank/whitespace and long text. Check whether the task elicits the intended language evidence, hints support a useful next step, and initial/revised responses are preserved. Check keyboard/mobile use, reset confirmation, actual-response export and offline operation.\n\nReport what you actually tested and any untested checks. Identify the defect that most affects evidence or learner action, repair it within this workshop folder and rerun the affected check. Preserve the brief and its offline/no-automatic-grading requirements.\n\nApproved brief:\n[Paste your brief.]`},
 {title:'Interpret classroom evidence (optional)', text:`Use the fictional response below and my two criteria. State what is visible, a tentative interpretation and one alternative explanation. Suggest a specific teacher/learner action and fresh evidence that could check progress. If the goal is met, consider moving on or extending; if evidence is unclear, suggest a diagnostic follow-up. The teacher makes the decision. Do not infer motivation, assign ability labels or invent results.\n\nUse: We noticed… We will… We will check again by…\n\nGoal, criteria and fictional response:\n[Paste your brief and one case.]`},
];
export const worksheet = [
 ['audience','Audience and context / 對象與情境','Age or level, language context and one classroom constraint'],
 ['goal','One language goal / 一個語言目標','Which aspect of language use do these learners need to develop?'],
 ['criterion1','Observable criterion 1 / 可觀察準則一','What specific evidence would count?'],
 ['criterion2','Observable criterion 2 / 可觀察準則二','What separate evidence would count?'],
 ['difficulty','Anticipated difficulty / 預期難點','What might a response reveal or conceal?'],
 ['evidence','Task and response evidence / 任務與作答證據','What will learners say, write or do that reveals the criteria?'],
 ['interpretation','Interpret the evidence / 詮釋證據','What might the response suggest against the criteria? What alternative would you check?'],
 ['action','Feedback and purposeful action / 回饋與針對性行動','What feedback and enacted follow-up are intended to close the identified gap? Who will do what?'],
 ['recheck','Fresh recheck / 新任務再檢視','How will you find out whether the action helped?'],
] as const;
export const cases = [
 {id:'L01',evidence:'Selects B because it is longer; adds an unrelated anecdote.', interpretation:'May be using length as a proxy for support. The task wording may also have directed attention to length.',action:'Investigate relevance using equally long contrasting examples.',recheck:'Ask for a fresh choice and a justification that explains relevance.'},
 {id:'L02',evidence:'Identifies the example but omits its explanation.',interpretation:'May recognise an example but need support explaining its link; time pressure is another possibility.',action:'Model a because-link between one example and the claim.',recheck:'Ask the learner to explain a new example without the model.'},
 {id:'L03',evidence:'Chooses A because they agree and repeats the claim.',interpretation:'May be treating agreement as support; the distinction may not yet be clear from the instructions.',action:'Contrast agreeing with a claim and giving evidence for it.',recheck:'Request a new specific example and an explanation of how it supports the claim.'},
 {id:'L04',evidence:'Provides a specific relevant example and explains its link.',interpretation:'Both criteria are evident in this response. A familiar topic could have helped.',action:'Offer transfer to a fresh topic or invite the learner to explain the criteria to a peer.',recheck:'Inspect the example and link on a fresh topic or in the peer explanation.'},
];
