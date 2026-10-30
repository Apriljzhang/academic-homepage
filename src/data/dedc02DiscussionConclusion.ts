type Copy = { en: string; zh: string };
type Slide = { key: string; title: Copy; part: Copy; body: Copy; spacious?: boolean };
const c = (en: string, zh: string): Copy => ({ en, zh });
const esc = (s: string) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const lead = (s: string) => `<p class="lead">${s}</p>`;
const takeaway = (s: string) => `<p class="takeaway">${s}</p>`;
const reveal = (label: string, body: string) => `<details><summary>${label}</summary><div>${body}</div></details>`;
const columns = (a: string, b: string) => `<div class="dc-columns"><div>${a}</div><div>${b}</div></div>`;
const list = (...items: string[]) => `<ul>${items.map(s => `<li>${s}</li>`).join('')}</ul>`;
const table = (heads: string[], rows: string[][]) => `<div class="table-wrap"><table><thead><tr>${heads.map(s => `<th scope="col">${s}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((s, i) => i === 0 ? `<th scope="row">${s}</th>` : `<td>${s}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const source = (en: string, zh: string, html: string) => c(reveal(en, html), reveal(zh, html));
const sources = {
  creswell: source('Textbook basis', '教材依據', '<p>Creswell (2015), <i>Educational research</i>, 5th ed., ch. 6, pp. 196–198; ch. 8, pp. 256–258; ch. 9, pp. 273–275.</p>'),
  miles: source('Textbook basis', '教材依據', '<p>Miles, Huberman, &amp; Saldaña (2014), <i>Qualitative data analysis</i>, 3rd ed., ch. 11: “Drawing and verifying conclusions”. The analytical tactics come from qualitative research; adapt the checks to the study’s design and epistemology.</p>'),
  dornyei: source('Textbook basis', '教材依據', '<p>Dörnyei (2007), <i>Research methods in applied linguistics</i>, §§12.3.4–12.3.5, pp. 284–286; §13.1.2, pp. 297–298.</p>'),
  mixed: source('Textbook basis', '教材依據', '<p>Creswell &amp; Plano Clark (2018), <i>Designing and conducting mixed methods research</i>, 3rd ed., chs. 7–8: interpretation, meta-inferences and design-specific reporting.</p>'),
  bryman: source('Textbook basis', '教材依據', '<p>Clark, Foster, Sloan, &amp; Bryman (2021), <i>Bryman’s social research methods</i>, 6th ed., ch. 25: writing up research, Discussion and Conclusion.</p>'),
};
const field = (id: string, label: string, lang: 'en' | 'zh', placeholder = '', rows = 3) => `<label class="response-field" for="${id}-${lang}"><span>${label}</span><textarea id="${id}-${lang}" data-response="${id}" data-label="${esc(label)}" rows="${rows}" placeholder="${esc(placeholder)}"></textarea></label>`;
const save = (lang: 'en' | 'zh') => `<p class="save-status" data-save-status aria-live="polite">${lang === 'zh' ? '輸入會保存在此瀏覽器；切換語言會保留原文。' : 'Entries stay in this browser. Switching language keeps your original wording.'}</p>`;
const quiz = (id: string, prompt: string, options: { label: string; why: string; fits?: boolean }[], lang: 'en' | 'zh') => `<div class="dc-quiz" data-quiz="${id}" data-quiz-language="${lang}"><p class="question">${prompt}</p><div class="choices" role="group" aria-label="${esc(prompt)}">${options.map((o, i) => `<button type="button" data-choice="${i}" data-option-label="${esc(o.label)}" data-fits="${Boolean(o.fits)}" aria-pressed="false"><span>${o.label}</span><span data-explanation hidden>${o.why}</span></button>`).join('')}</div><div class="activity-actions"><button type="button" data-check>${lang === 'zh' ? '檢視理由' : 'Examine the reasoning'}</button><button type="button" data-retry>${lang === 'zh' ? '重新選擇' : 'Try again'}</button></div><p class="quiz-feedback" data-feedback role="status">${lang === 'zh' ? '先作判斷並說明理由，再查看回應。' : 'Make a judgement and explain why before checking.'}</p></div>`;
const discussion = c('Discussion', '討論');
const conclusion = c('Conclusion', '結論');
const results = c('Results', '結果');

export const discussionConclusionSlides: Slide[] = [
  {
    key: 'opening', part: c('DEDC02 · Advanced Research Method', 'DEDC02 · 進階教育研究方法'), spacious: true,
    title: c('Discussion<br>and Conclusion', '討論與結論'),
    body: c(lead('Interpret findings, develop explanations and show what the study adds to knowledge.') + '<p class="opening-question">What makes a discussion persuasive enough to withstand methodological scrutiny?</p>', lead('詮釋研究發現、發展解釋，並說明研究如何增進理解。') + '<p class="opening-question">一段討論需要甚麼，才能經得起研究方法上的檢視？</p>'),
  },
  {
    key: 'route', part: c('The research task', '研究任務'), title: c('From findings to a research argument', '從研究發現到研究論證'),
    body: c(table(['Teaching time', 'Focus', 'What you will produce'], [
      ['20 minutes', 'Results: answer the research questions', 'A finding and its scope'],
      ['100 minutes', 'Discussion: interpret, explain, compare and evaluate', 'A developed discussion argument'],
      ['20 minutes', 'Conclusion: synthesise the whole study', 'A conclusion and a methodological defence'],
    ]) + takeaway('Keep one finding from your own project in view. If data are unavailable, use the constructed study supplied here.'), table(['教學時間', '重點', '完成的成果'], [
      ['20 分鐘', '結果：回答研究提問', '一項發現及其適用範圍'],
      ['100 分鐘', '討論：詮釋、解釋、比較及評估', '一個充分發展的討論論證'],
      ['20 分鐘', '結論：綜合整項研究', '結論及研究方法答辯'],
    ]) + takeaway('全課持續處理自己專案的一項發現；尚無資料時，可使用本課的虛構研究。')),
  },
  {
    key: 'section-jobs', part: results, title: c('What work does each section do?', '各部分完成甚麼工作？'),
    body: c(table(['Results / Findings', 'Discussion', 'Conclusion'], [['Establish the patterns that answer the questions.', 'Develop their meaning, explanations and significance.', 'State the study’s overall answer and contribution.']]) + quiz('section-job', '“The pattern suggests that opportunities to use feedback help explain differences in revision.” What work is this sentence doing?', [
      { label: 'Reporting a finding', why: 'The sentence proposes meaning and an explanation; the underlying observed pattern still needs to be shown.' },
      { label: 'Developing an interpretation', why: 'It moves from a pattern to a possible explanation. Ask what evidence supports the link.', fits: true },
      { label: 'Providing a complete conclusion', why: 'It could appear in a conclusion, but by itself it does not synthesise the study’s overall answer or contribution.' },
    ], 'en') + reveal('Section labels vary', '<p>Qualitative findings may already include substantial interpretation. Results and Discussion can be combined. Identify the intellectual work, then choose a structure appropriate to the design and publication.</p>') + sources.dornyei.en,
    table(['結果／發現', '討論', '結論'], [['呈現回答研究提問的模式。', '發展其意義、解釋及重要性。', '說明整項研究的答案及貢獻。']]) + quiz('section-job', '「此模式顯示，運用回饋的機會可能有助解釋修訂表現的差異。」這句話完成甚麼工作？', [
      { label: '報告研究發現', why: '此句提出意義及解釋；仍須交代它所根據的觀察模式。' },
      { label: '發展詮釋', why: '由模式推進至可能的解釋，須追問支持此連結的證據。', fits: true },
      { label: '提供完整結論', why: '此句可出現在結論，但本身未綜合整項研究的答案及貢獻。' },
    ], 'zh') + reveal('部分名稱可以不同', '<p>質性發現可以包含充分詮釋；結果與討論亦可合併。先辨識其思考工作，再按設計及出版要求安排結構。</p>') + sources.dornyei.zh),
  },
  {
    key: 'running-study', part: results, title: c('Our constructed feedback study', '本課的虛構回饋研究'),
    body: c(lead('How do learners use teacher feedback, and how does that use relate to revision?') + columns('<h3>Evidence available</h3>' + list('First and revised essays from 120 EFL learners in one programme.', 'Argument development scored on a 0–4 rubric.', '48 learners gained at least one point; 72 gained less.', 'Twelve consenting interviewees: six from each gain pattern.'), '<h3>Conditions to retain</h3>' + list('No randomly assigned comparison condition.', 'Interviews are retrospective reports.', 'Selected draft comparisons can show what changed.', 'The one-point split is an illustrative sampling decision.')) + takeaway('All numbers and example learner statements in this running study are constructed for teaching. They are not published findings.'),
    lead('學生如何運用教師回饋？這種運用與修訂有何關係？') + columns('<h3>可用證據</h3>' + list('同一課程 120 名英語學習者的初稿及修訂稿。', '以 0–4 分規準評估論證發展。', '48 人進步至少 1 分；72 人進步不足 1 分。', '從兩種模式各選取 6 名同意參與的學生訪談。'), '<h3>必須保留的條件</h3>' + list('沒有隨機分派的比較組。', '訪談提供回溯性報告。', '選定的草稿比較可展示具體改變。', '以 1 分劃分只是示例抽樣決策。')) + takeaway('本課貫穿研究的數字及學生示例話語均為教學而虛構，並非已發表的發現。')),
  },
  {
    key: 'results-answer', part: results, title: c('Report an answer, with its evidence', '以證據支持研究答案'),
    body: c(table(['Analytical material', 'Substantive finding', 'Keep visible'], [
      ['Scores and their distribution', 'Revision gains differed across learners.', 'Magnitude, variation and uncertainty; identify the cohort.'],
      ['Codes, excerpts and draft changes', 'Some learners described difficulty translating comments into revisions.', 'Source, context, variation and contrary cases.'],
      ['Linked score and interview patterns', 'Reported feedback use differed across the selected gain groups.', 'Which cases are linked; how the subset was chosen.'],
    ]) + takeaway('Results establish the pattern. Discussion develops what it means and why it may have occurred.') + sources.creswell.en,
    table(['分析材料', '實質發現', '保留甚麼'], [
      ['分數及其分布', '學生的修訂進步有所不同。', '幅度、差異、不確定性，以及研究群體。'],
      ['編碼、節錄及草稿改變', '部分學生描述把評語轉化為修訂時的困難。', '來源、語境、差異及相反個案。'],
      ['相連的分數及訪談模式', '所選不同進步組別報告的回饋運用有所不同。', '哪些個案相連，以及如何選取子樣本。'],
    ]) + takeaway('結果建立模式；討論發展其意義及可能成因。') + sources.creswell.zh),
  },
  {
    key: 'discussion-map', part: discussion, title: c('Six tasks in a developed discussion', '充分發展討論的六項任務'),
    body: c('<div class="discussion-map">' + [
      ['Interpret', 'Explain the substantive meaning of a specific finding.'], ['Explain', 'Develop and examine possible reasons for the pattern.'], ['Connect to theory', 'Identify the proposition or concept the evidence bears on.'], ['Compare', 'Use previous studies to clarify agreement, differences and conditions.'], ['Integrate', 'Bring findings together, including contradictions and exceptions.'], ['Establish significance', 'Specify the contribution, implications and limits.'],
    ].map(([h, p]) => reveal(h, `<p>${p}</p>`)).join('') + '</div>' + takeaway('Organise around research questions or substantive claims. Use these tasks where the evidence calls for them; they are not six compulsory paragraphs.') + sources.bryman.en,
    '<div class="discussion-map">' + [
      ['詮釋', '說明一項具體發現的實質意義。'], ['解釋', '發展並檢視模式的可能成因。'], ['連結理論', '指出證據涉及哪項命題或概念。'], ['比較', '透過既有研究釐清一致、差異及成立條件。'], ['整合', '綜合不同發現，包括矛盾及例外。'], ['建立重要性', '說明貢獻、啟示及限制。'],
    ].map(([h, p]) => reveal(h, `<p>${p}</p>`)).join('') + '</div>' + takeaway('按研究提問或實質主張組織。依證據需要運用這些任務，無須寫成固定六段。') + sources.bryman.zh),
  },
  {
    key: 'interpret', part: discussion, title: c('Interpretation changes the level of the claim', '詮釋改變主張的層次'),
    body: c('<ol class="inference-steps"><li><b>Observed pattern</b><span>Revision gains differ; some learners report difficulty acting on comments.</span></li><li><b>Substantive interpretation</b><span>Access to comments and using comments productively are distinct issues.</span></li><li><b>Possible explanation</b><span>Learners may need opportunities and support to translate comments into action.</span></li><li><b>Scope</b><span>This evidence concerns this programme and these observed revisions.</span></li></ol>' + takeaway('Each step adds an inference. Identify the evidence or reasoning that permits it.') + sources.creswell.en,
    '<ol class="inference-steps"><li><b>觀察模式</b><span>修訂進步不同；部分學生報告難以採取行動。</span></li><li><b>實質詮釋</b><span>取得評語與有效運用評語，是可區分的問題。</span></li><li><b>可能解釋</b><span>學生可能需要機會及支援，才可把評語轉化為行動。</span></li><li><b>適用範圍</b><span>證據涉及此課程及所觀察的修訂。</span></li></ol>' + takeaway('每一步都加入推論。指出容許這一步的證據或理據。') + sources.creswell.zh),
  },
  {
    key: 'claim-lab', part: discussion, title: c('Which claim can the design support?', '設計支持哪項主張？'),
    body: c(quiz('claim-scope', 'Use the constructed study: one programme, draft scores, selected interviews and no comparison condition.', [
      { label: 'Teacher feedback caused the improvement.', why: 'Drafts improved, but this design does not isolate feedback from practice, teaching or other influences.' },
      { label: 'Learners’ reports and draft evidence suggest that translating comments into revision was uneven.', why: 'This connects the available sources while retaining their scope. Check that the linked cases actually support the interpretation.', fits: true },
      { label: 'Feedback has no effect because most learners gained less than one point.', why: 'The one-point threshold does not establish absence of an effect. There is no counterfactual comparison, and smaller changes may still matter.' },
    ], 'en') + field('claim', 'Your defensible claim', 'en', 'State the finding, the interpretation and its scope.') + save('en'),
    quiz('claim-scope', '使用虛構研究：單一課程、草稿評分、選定訪談，且沒有比較組。', [
      { label: '教師回饋導致了進步。', why: '草稿雖有進步，但此設計無法把回饋與練習、教學等其他影響分開。' },
      { label: '學生報告及草稿證據顯示，把評語轉化為修訂的情況並不一致。', why: '連結可用來源，並保留其範圍；仍須核對相連個案是否支持此詮釋。', fits: true },
      { label: '多數學生進步不足 1 分，所以回饋沒有效果。', why: '1 分界線不能確立沒有效果；研究缺少反事實比較，較小改變亦可能重要。' },
    ], 'zh') + field('claim', '你能論證的主張', 'zh', '交代發現、詮釋及其範圍。') + save('zh')),
  },
  {
    key: 'paragraph-moves', part: discussion, title: c('Make the reasoning in a paragraph visible', '讓段落的推理清晰可見'),
    body: c(lead('Constructed paragraph. Select a function to locate its work.') + '<div class="annotation-tools" role="group" aria-label="Discussion functions">' + [['claim', 'Interpretation'], ['evidence', 'Evidence'], ['explanation', 'Explanation'], ['boundary', 'Boundary'], ['significance', 'Significance']].map(([key, label]) => `<button type="button" data-annotation="${key}" aria-pressed="false">${label}</button>`).join('') + '</div><div class="annotated-paragraph"><p><span data-move="claim">The findings suggest a gap between receiving feedback and being able to use it.</span> <span data-move="evidence">Gains varied, and selected interviewees described difficulty deciding how to revise.</span> <span data-move="explanation">One interpretation is that comments required action-oriented support beyond access alone.</span> <span data-move="boundary">The evidence does not isolate that support as a cause of improvement.</span> <span data-move="significance">It identifies a distinction that a subsequent intervention could examine.</span></p></div>' + takeaway('The paragraph is developed through connected reasoning. Its shape and length should follow the argument.'),
    lead('虛構段落：選擇功能，找出相應的論證工作。') + '<div class="annotation-tools" role="group" aria-label="討論功能">' + [['claim', '詮釋'], ['evidence', '證據'], ['explanation', '解釋'], ['boundary', '範圍'], ['significance', '重要性']].map(([key, label]) => `<button type="button" data-annotation="${key}" aria-pressed="false">${label}</button>`).join('') + '</div><div class="annotated-paragraph"><p><span data-move="claim">研究發現顯示，收到回饋與能運用回饋之間存在差距。</span><span data-move="evidence">學生的進步不同，部分受訪者描述難以決定如何修訂。</span><span data-move="explanation">一種詮釋是：除了取得評語，學生還需要把評語轉化為行動的支援。</span><span data-move="boundary">證據尚未把此支援辨識為進步的原因。</span><span data-move="significance">此研究辨識了一個可由後續介入檢視的區別。</span></p></div>' + takeaway('段落透過相連推理發展；形狀及長度應由論證需要決定。')),
  },
  {
    key: 'theory', part: discussion, title: c('What does the finding do to the theory?', '發現對理論有何作用？'),
    body: c(table(['Relationship', 'Reasoning to develop'], [
      ['Support', 'Which expected pattern appeared, and how directly was it examined?'],
      ['Refinement', 'Which condition or distinction makes the explanation more precise?'],
      ['Challenge', 'Which assumption is difficult to reconcile with the evidence?'],
      ['Development', 'What new relationship is proposed, and what evidence would test it?'],
    ]) + takeaway('Name the proposition and explain the relationship. Adding a theory citation does not perform this work.') + sources.dornyei.en,
    table(['關係', '需要發展的推理'], [
      ['支持', '出現了哪個預期模式？研究有多直接地檢視它？'],
      ['修正', '哪個條件或區別，使解釋更精確？'],
      ['挑戰', '哪項假設難以與證據相容？'],
      ['發展', '提出甚麼新關係？甚麼證據可檢視它？'],
    ]) + takeaway('指出命題並解釋其關係；加入理論引文本身，尚未完成這項工作。') + sources.dornyei.zh),
  },
  {
    key: 'conceptual-coherence', part: discussion, title: c('From a local pattern to a conceptual explanation', '從具體模式到概念性解釋'),
    body: c(lead('A textbook example from Miles, Huberman and Saldaña’s school-improvement research.') + '<div class="evidence-chain"><div><b>Observed pattern</b><p>Some staff invested great effort and made strong claims about benefits; outcome evidence offered little support.</p></div><div><b>Conceptual interpretation</b><p>The authors connected the pattern to effort justification within cognitive dissonance theory.</p></div><div><b>Analytical check</b><p>Contrasts across sites helped them see different combinations of effort, claims and evidence.</p></div></div>' + reveal('Discuss the theoretical move', '<p>Which observations need explaining? How does effort justification connect them? What evidence could favour a different explanation? An available theoretical label is not proof of the mechanism.</p>') + sources.miles.en,
    lead('Miles、Huberman 及 Saldaña 在學校改進研究中的教材例子。') + '<div class="evidence-chain"><div><b>觀察模式</b><p>部分教職員投入很大心力，並強調成效；成果證據卻支持有限。</p></div><div><b>概念性詮釋</b><p>作者把此模式連結至認知失調理論中的「努力合理化」。</p></div><div><b>分析檢查</b><p>跨研究地點的比較，使努力、成效主張與證據的不同組合清晰可見。</p></div></div>' + reveal('討論這個理論推進', '<p>哪些觀察需要解釋？努力合理化如何連結它們？甚麼證據可能支持另一解釋？找到可用的理論標籤，尚未證實其機制。</p>') + sources.miles.zh),
  },
  {
    key: 'literature', part: discussion, title: c('Explain agreement and disagreement', '解釋研究之間的一致與差異'),
    body: c(table(['Before comparing findings', 'Ask'], [
      ['Construct and measure', 'Did both studies investigate the same phenomenon in comparable ways?'],
      ['Population and setting', 'Could participants, institutional conditions or tasks matter?'],
      ['Design and time', 'Are we comparing an association, a short-term intervention or a longitudinal process?'],
      ['Outcome and estimate', 'Do effects differ in direction, magnitude or uncertainty?'],
    ]) + reveal('A weak comparison', '<p>“Our finding agrees with Study A and disagrees with Study B.”</p>') + reveal('A developed comparison', '<p>“The studies may differ because one assessed immediate supported performance and the other assessed independent performance. The distinction changes what each result indicates about learning.”</p><p>This is a constructed example. Check the actual methods before using such an explanation.</p>') + sources.creswell.en,
    table(['比較發現之前', '追問'], [
      ['構念與測量', '兩項研究是否以可比較方式探究相同現象？'],
      ['對象與情境', '參與者、制度條件或任務差異是否重要？'],
      ['設計與時間', '比較的是關聯、短期介入，還是長期過程？'],
      ['結果與估計', '效果的方向、幅度或不確定性是否不同？'],
    ]) + reveal('較薄弱的比較', '<p>「我們的發現與研究 A 一致，但與研究 B 不同。」</p>') + reveal('充分發展的比較', '<p>「兩項研究可能因結果測量不同而有差異：一項測量即時受支援表現，另一項測量獨立表現。這個區別改變了結果對學習的意義。」</p><p>此為虛構寫作例子；使用這種解釋前，必須核對實際方法。</p>') + sources.creswell.zh),
  },
  {
    key: 'deslauriers', part: discussion, title: c('Two measures can tell different stories', '兩種測量可以呈現不同模式'),
    body: c(lead('Deslauriers et al. (2019): active learning and the feeling of learning in introductory physics.') + columns('<h3>Measured learning</h3><p>Students in the active condition performed better on the learning tests.</p>', '<h3>Feeling of learning</h3><p>They reported feeling that they learned less.</p>') + quiz('perception-learning', 'What is the strongest interpretation of the contrast?', [
      { label: 'Students cannot judge anything about their learning.', why: 'This exceeds the measures, setting and comparison investigated.' },
      { label: 'The two measures are interchangeable indicators of effectiveness.', why: 'The contrasting results make the distinction between perceived and tested learning consequential.' },
      { label: 'Perceived learning and test performance can diverge under these instructional conditions.', why: 'This retains both findings and their setting. Explain the contrast and examine what each measure captures.', fits: true },
    ], 'en') + reveal('Read the empirical study', '<p>Deslauriers, McCarty, Miller, Callaghan, &amp; Kestin (2019). <a href="https://doi.org/10.1073/pnas.1821936116" target="_blank" rel="noopener noreferrer">Measuring actual learning versus feeling of learning</a>. <i>PNAS, 116</i>, 19251–19257.</p>'),
    lead('Deslauriers 等人（2019）：基礎物理課的主動學習與學習感受。') + columns('<h3>測得的學習表現</h3><p>主動學習條件的學生，在學習測驗表現較好。</p>', '<h3>學習感受</h3><p>他們卻報告覺得自己學得較少。</p>') + quiz('perception-learning', '對此差異，哪種詮釋最有理據？', [
      { label: '學生完全無法判斷自己的學習。', why: '此主張超越了研究的測量、情境及比較。' },
      { label: '兩項測量是可互換的成效指標。', why: '兩種結果的差異，使「感知學習」與「測得學習」的區別很重要。' },
      { label: '在這些教學條件下，學習感受與測驗表現可能不一致。', why: '同時保留兩項發現及其情境；須解釋差異，不能只選方便的測量。', fits: true },
    ], 'zh') + reveal('閱讀實證研究', '<p>Deslauriers, McCarty, Miller, Callaghan, &amp; Kestin (2019). <a href="https://doi.org/10.1073/pnas.1821936116" target="_blank" rel="noopener noreferrer">Measuring actual learning versus feeling of learning</a>. <i>PNAS, 116</i>, 19251–19257.</p>')),
  },
  {
    key: 'rival-explanations', part: discussion, title: c('Make explanations compete on evidence', '以證據比較不同解釋'),
    body: c(lead('Constructed study: some learners gained little despite receiving comments.') + table(['Possible explanation', 'Discriminating evidence to seek'], [
      ['Comments were difficult to understand.', 'A learner’s explanation of the comment, linked to the actual comment and attempted revision.'],
      ['There was little opportunity to act.', 'Assessment timing, revision opportunities and accounts of when comments became available.'],
      ['The scoring missed relevant changes.', 'Rubric coverage and examples of changes outside the scored dimension.'],
    ]) + field('rival', 'Choose two explanations. What evidence would favour one over the other?', 'en') + reveal('Methodological debrief', '<p>List what each explanation predicts, what supports it and what challenges it. If the study cannot distinguish alternatives, retain that uncertainty in Discussion. New analyses or data collection require a justified plan.</p>') + sources.miles.en + save('en'),
    lead('虛構研究：部分學生雖收到評語，進步仍有限。') + table(['可能解釋', '可區分解釋的證據'], [
      ['評語難以理解。', '學生如何解釋評語，並連結實際評語及嘗試修訂的內容。'],
      ['採取行動的機會有限。', '評核時序、修訂機會，以及評語何時可用的報告。'],
      ['評分未涵蓋相關改變。', '規準涵蓋範圍，以及評分向度以外的改變例子。'],
    ]) + field('rival', '選兩種解釋：甚麼證據較支持其中一種？', 'zh') + reveal('研究方法討論', '<p>列出各解釋的預期、支持及挑戰證據。若研究無法區分，就在討論保留此不確定性。新分析或新資料蒐集，須有合理計劃。</p>') + sources.miles.zh + save('zh')),
  },
  {
    key: 'negative-cases', part: discussion, title: c('Let contrasting cases refine the interpretation', '讓不同個案修正詮釋'),
    body: c(lead('Carless (2020) followed four undergraduates’ feedback experiences over five years, using repeated interviews and documentary evidence.') + columns('<h3>What the design contributes</h3><p>It makes individual trajectories and changes in experiences visible.</p><p>The researcher also describes his academic-adviser relationship with participants.</p>', '<h3>What to examine</h3><p>Which interpretations accommodate variation across cases and time?</p><p>How might the researcher’s position shape what is said and interpreted?</p>') + field('negative-case', 'Constructed exercise: one learner understands comments but cannot use them before the next assessment. How does this qualify “understanding feedback is sufficient for uptake”?', 'en') + reveal('A possible revision', '<p>Understanding may be relevant to uptake, while timing and opportunities to act also need examination. A counterexample can refine a sufficiency claim; it does not show that understanding is irrelevant.</p>') + reveal('Read the empirical study', '<p>Carless (2020). <a href="https://doi.org/10.1080/07294360.2019.1684455" target="_blank" rel="noopener noreferrer">Longitudinal perspectives on students’ experiences of feedback</a>. <i>Higher Education Research &amp; Development, 39</i>, 425–438.</p><p>The exercise above is constructed, not a quotation or reported case from the article.</p>') + save('en'),
    lead('Carless（2020）透過重複訪談及文件證據，追蹤四名本科生五年的回饋經驗。') + columns('<h3>設計的貢獻</h3><p>呈現個人的發展軌跡及經驗改變。</p><p>研究者亦交代自己作為參與者學業顧問的關係。</p>', '<h3>需要檢視</h3><p>哪些詮釋能涵蓋跨個案及跨時間的差異？</p><p>研究者的位置如何影響受訪者表達及研究詮釋？</p>') + field('negative-case', '虛構練習：一名學生理解評語，卻無法在下一次評核前運用。這如何修正「理解回饋足以促成運用」？', 'zh') + reveal('一種可能修正', '<p>理解可能與運用有關，但時序及行動機會亦需檢視。反例可以修正充分條件的主張，卻不表示理解毫不相關。</p>') + reveal('閱讀實證研究', '<p>Carless (2020). <a href="https://doi.org/10.1080/07294360.2019.1684455" target="_blank" rel="noopener noreferrer">Longitudinal perspectives on students’ experiences of feedback</a>. <i>Higher Education Research &amp; Development, 39</i>, 425–438.</p><p>上述練習為虛構，並非文章引文或已報告個案。</p>') + save('zh')),
  },
  {
    key: 'synthesis', part: discussion, title: c('Bring the findings into one explanation', '把發現綜合成解釋'),
    body: c(columns('<h3>Three separate statements</h3>' + list('Gains varied.', 'Some learners reported understanding comments.', 'Some still described difficulty revising.'), '<h3>A synthetic interpretation</h3><p>In this constructed study, understanding a comment may leave further work: deciding what to change and having an opportunity to do so.</p><p>The interpretation connects the findings and identifies an unresolved process.</p>') + takeaway('Ask what becomes visible when findings are considered together. Retain contradictions that change the explanation.') + sources.dornyei.en,
    columns('<h3>三個分開的陳述</h3>' + list('進步有所不同。', '部分學生報告理解評語。', '部分學生仍描述修訂困難。'), '<h3>綜合詮釋</h3><p>在此虛構研究中，理解評語之後，可能仍須決定如何改變，以及取得行動機會。</p><p>此詮釋連結不同發現，並指出尚未釐清的過程。</p>') + takeaway('追問：把發現放在一起後，看見了甚麼？保留會改變解釋的矛盾。') + sources.dornyei.zh),
  },
  {
    key: 'integration', part: discussion, title: c('What does combining the strands add?', '結合兩部分，增加甚麼理解？'),
    body: c(table(['Scores in the constructed study', 'Selected interview accounts', 'Integrated interpretation'], [
      ['Larger gains: 48 learners', 'Some describe turning comments into specific changes.', 'A possible process to inspect in linked drafts.'],
      ['Limited gains: 72 learners', 'Some describe uncertainty or limited opportunity to revise.', 'Different constraints may produce similar score patterns.'],
    ]) + quiz('integration', 'What remains necessary before claiming that interview accounts explain score differences?', [
      { label: 'Treat every interview as confirmation of the score pattern.', why: 'Interviews can qualify or contradict the interpretation. Their selection and retrospective nature also matter.' },
      { label: 'Check linked cases, variation and contrary evidence; identify what integration adds.', why: 'This examines whether the combined interpretation is supported. Six interviewees per pattern do not represent every learner in that group.', fits: true },
      { label: 'Repeat both sets of findings in the Conclusion.', why: 'Repetition does not establish an integrated explanation or answer the mixed-methods question.' },
    ], 'en') + sources.mixed.en,
    table(['虛構研究的分數', '選定訪談的報告', '整合詮釋'], [
      ['較大進步：48 人', '部分學生描述把評語轉化為具體改變。', '可於相連草稿中檢視的可能過程。'],
      ['進步有限：72 人', '部分學生描述不確定如何修訂，或行動機會有限。', '不同限制可能產生相似分數模式。'],
    ]) + quiz('integration', '若要主張訪談能解釋分數差異，還需要甚麼？', [
      { label: '把所有訪談都視為確認分數模式。', why: '訪談可能修正或反駁詮釋；選取方式及回溯性質亦很重要。' },
      { label: '檢查相連個案、差異及相反證據，指出整合增加的理解。', why: '這可檢視整合詮釋有否依據；每組 6 名受訪者不能代表該組全部學生。', fits: true },
      { label: '在結論重複兩部分的發現。', why: '重複尚未建立整合解釋，亦未回答混合方法提問。' },
    ], 'zh') + sources.mixed.zh),
  },
  {
    key: 'replication', part: discussion, title: c('Discuss what held up, and what changed', '討論哪些發現得到重現，哪些改變了'),
    body: c(lead('Mueller & Oppenheimer (2014), Study 1, and Urry et al.’s (2021) preregistered replication.') + table(['Finding', 'Original Study 1', 'Replication'], [
      ['Laptop notes: more words and verbatim overlap', 'Observed', 'Observed again'],
      ['Longhand advantage on conceptual quiz items', 'Reported', 'Small, nonsignificant quiz differences'],
    ]) + field('replication', 'What should a Discussion retain, revise and leave unresolved?', 'en') + reveal('Reasoning to retain', '<p>Separate the note characteristics from the learning outcome. Examine estimates and uncertainty. A nonsignificant difference alone does not establish equivalence. The replication concerns Study 1 and immediate testing; it does not settle every note-taking question.</p>') + reveal('Empirical sources', '<p><a href="https://doi.org/10.1177/0956797614524581" target="_blank" rel="noopener noreferrer">Mueller &amp; Oppenheimer (2014)</a>; <a href="https://doi.org/10.1177/0956797620965541" target="_blank" rel="noopener noreferrer">Urry et al. (2021)</a>, <i>Psychological Science</i>.</p>') + save('en'),
    lead('Mueller 與 Oppenheimer（2014）的研究一，以及 Urry 等人（2021）的預先註冊重複研究。') + table(['發現', '原研究一', '重複研究'], [
      ['電腦筆記：較多字數及逐字重疊', '觀察到', '再次觀察到'],
      ['手寫筆記在概念測驗題的優勢', '有報告', '測驗差異小且未達顯著'],
    ]) + field('replication', '討論應保留、修正哪些主張？哪些問題仍未解決？', 'zh') + reveal('應保留的推理', '<p>區分筆記特徵與學習結果，檢視估計及不確定性。未達顯著本身不能確立等效。此重複研究涉及研究一及即時測驗，無法解決所有筆記問題。</p>') + reveal('實證來源', '<p><a href="https://doi.org/10.1177/0956797614524581" target="_blank" rel="noopener noreferrer">Mueller &amp; Oppenheimer (2014)</a>；<a href="https://doi.org/10.1177/0956797620965541" target="_blank" rel="noopener noreferrer">Urry et al. (2021)</a>，<i>Psychological Science</i>。</p>') + save('zh')),
  },
  {
    key: 'scope', part: discussion, title: c('A limitation changes a particular inference', '限制影響具體推論'),
    body: c(table(['Constraint', 'Affected inference', 'Consequence'], [
      ['One programme', 'Transfer to other settings', 'Identify which contextual features may matter.'],
      ['No comparison condition', 'Attributing change to feedback', 'Other influences on revision remain possible.'],
      ['Retrospective interviews', 'Reconstructing the process', 'Reported reasons may differ from event-time processes.'],
      ['A narrow scoring dimension', 'Overall writing development', 'Changes outside that dimension may be missed.'],
    ]) + takeaway('Specify what becomes less certain, why, and how much it matters to the main argument.') + sources.creswell.en,
    table(['限制', '受影響推論', '後果'], [
      ['單一課程', '轉用至其他情境', '指出可能重要的情境特徵。'],
      ['沒有比較組', '把改變歸因於回饋', '其他修訂影響仍然可能存在。'],
      ['回溯訪談', '重構過程', '報告的原因可能與當時過程不同。'],
      ['評分向度較窄', '整體寫作發展', '向度以外的改變可能被遺漏。'],
    ]) + takeaway('說明甚麼變得較不確定、為甚麼，以及對主要論證有多重要。') + sources.creswell.zh),
  },
  {
    key: 'limitation-lab', part: discussion, title: c('Make future research address the uncertainty', '讓後續研究回應不確定性'),
    body: c(quiz('limitation-repair', 'A one-time survey cannot establish whether confidence precedes feedback engagement. Which follow-up most directly addresses this problem?', [
      { label: 'Repeat the same one-time survey with more respondents.', why: 'This may improve precision or coverage, but it does not establish temporal ordering.' },
      { label: 'Measure both constructs over time, with a design and model suited to the proposed relationship.', why: 'Repeated observations can examine ordering and reciprocal patterns. They still require assumptions and do not automatically remove confounding.', fits: true },
      { label: 'Add more citations about confidence.', why: 'Literature can develop the rationale, but citations cannot supply the missing temporal evidence.' },
    ], 'en') + field('limitation', 'Your limitation → affected claim → uncertainty → appropriate follow-up', 'en') + save('en'),
    quiz('limitation-repair', '單次問卷無法確立信心是否先於回饋投入。哪種後續研究最直接回應此問題？', [
      { label: '以更多受訪者重做相同單次問卷。', why: '這可能改善精確度或涵蓋範圍，卻不能確立時間先後。' },
      { label: '在多個時點測量兩項構念，使用適合所提關係的設計及模型。', why: '重複觀察可檢視先後及相互關係，但仍依賴假設，亦不會自動消除混淆。', fits: true },
      { label: '增加關於信心的引文。', why: '文獻可發展理據，但無法補上缺失的時間證據。' },
    ], 'zh') + field('limitation', '你的限制 → 受影響主張 → 不確定性 → 適當後續研究', 'zh') + save('zh')),
  },
  {
    key: 'contribution', part: discussion, title: c('What has become clearer because of this study?', '這項研究讓甚麼變得更清楚？'),
    body: c(table(['Possible contribution', 'What must be demonstrated'], [
      ['Empirical', 'A new or more credible pattern, estimate, distinction or documented experience.'],
      ['Theoretical', 'A proposition, explanation or condition that is supported, refined or challenged.'],
      ['Methodological', 'Evidence about what a procedure reveals, misses or enables.'],
    ]) + reveal('Novel context is a starting point', '<p>“This is the first study in this city” identifies location novelty. Explain what investigating that context changes in our understanding.</p>') + field('contribution', 'Before this study, we understood… This evidence now clarifies…', 'en') + sources.bryman.en + save('en'),
    table(['可能貢獻', '需要展示'], [
      ['實證', '新的或更可信的模式、估計、區別，或被記錄的經驗。'],
      ['理論', '獲支持、修正或挑戰的命題、解釋或成立條件。'],
      ['方法', '某程序能揭示、遺漏或促成甚麼的證據。'],
    ]) + reveal('新情境是起點', '<p>「這是本市首項研究」指出地點的新穎性；仍須說明探究此情境如何改變理解。</p>') + field('contribution', '研究之前，我們理解的是……這些證據現在釐清……', 'zh') + sources.bryman.zh + save('zh')),
  },
  {
    key: 'implications', part: discussion, title: c('Connect implications to findings and conditions', '把啟示連結至發現及條件'),
    body: c('<div class="implication-flow"><div><b>Finding</b><p>Some learners report difficulty acting on comments.</p></div><div><b>Proposed action</b><p>Trial a structured opportunity to interpret and use feedback.</p></div><div><b>Conditions and evaluation</b><p>Provide revision time and examine actual uptake and independent performance.</p></div></div>' + columns('<h3>Research implication</h3><p>Examine whether action-oriented support explains or changes the observed pattern.</p>', '<h3>Practical implication</h3><p>Teachers could pilot that support and evaluate it. This study has not established its effectiveness.</p>') + takeaway('Name the actor, action, evidential basis and conditions. A recommendation may be a proposal to evaluate, not an established intervention.') + sources.creswell.en,
    '<div class="implication-flow"><div><b>發現</b><p>部分學生報告難以運用評語。</p></div><div><b>建議行動</b><p>試行有結構的機會，讓學生理解及運用回饋。</p></div><div><b>條件及評估</b><p>提供修訂時間，檢視實際運用及獨立表現。</p></div></div>' + columns('<h3>研究啟示</h3><p>檢視行動導向支援能否解釋或改變所觀察模式。</p>', '<h3>實務啟示</h3><p>教師可試行並評估此支援；本研究尚未確立其成效。</p>') + takeaway('指出行動者、行動、證據基礎及條件。建議可以是待評估方案，未必是已證實有效的介入。') + sources.creswell.zh),
  },
  {
    key: 'discussion-clinic', part: discussion, title: c('Develop the discussion, then test the argument', '先發展討論，再檢視論證'),
    body: c('<div class="writing-example"><h3>Constructed draft</h3><p>“Most learners improved little. This proves that teacher feedback is ineffective. Our study fills a gap. Teachers should give more detailed comments.”</p></div>' + field('discussion-revision', 'Repair the interpretation, explanation, contribution and implication', 'en') + reveal('One defensible development', '<p>The uneven gains suggest that receiving comments did not consistently translate into stronger argument development in this cohort. Selected interview accounts point to difficulties deciding how to act, an interpretation to examine against linked draft changes and contrary cases. The study distinguishes access to comments from their use in revision; it does not establish whether more detail would improve outcomes. A follow-up could evaluate support for interpreting and acting on feedback.</p>') + reveal('Why the revision is stronger', '<p>It anchors the interpretation in a specific pattern, develops a possible process, specifies the knowledge added and derives a study that could examine the unresolved explanation. It also retains the design’s scope.</p>') + save('en'),
    '<div class="writing-example"><h3>虛構初稿</h3><p>「多數學生進步有限，證明教師回饋無效。我們的研究填補空白。教師應提供更詳細的評語。」</p></div>' + field('discussion-revision', '修正詮釋、解釋、貢獻及啟示', 'zh') + reveal('一種可論證的發展', '<p>不一致的進步顯示，收到評語未能在此群體中穩定地轉化為更強的論證發展。選定訪談指向決定如何行動的困難；此詮釋仍須與相連草稿改變及相反個案核對。研究區分取得評語與修訂時運用評語，卻未確立更多細節能否改善結果。後續研究可評估理解及運用回饋的支援。</p>') + reveal('修訂為何較充分', '<p>以具體模式為詮釋根據，發展可能過程，指出增加的理解，並提出可檢視未決解釋的研究，同時保留設計範圍。</p>') + save('zh')),
  },
  {
    key: 'discussion-studio', part: discussion, title: c('Develop your discussion argument', '發展你的討論論證'),
    body: c(lead('Use your project or the constructed study. Develop the reasoning before polishing the language.') + '<div class="response-grid">' + field('studio-finding', 'Finding and answer to the question', 'en') + field('studio-interpretation', 'Substantive meaning and possible explanation', 'en') + field('studio-evidence', 'Supporting evidence, rivals and contrary cases', 'en') + field('studio-theory', 'Relationship to a specific theory or previous finding', 'en') + field('studio-significance', 'Contribution and warranted implication', 'en') + field('studio-boundary', 'Important limitation and unresolved question', 'en') + '</div>' + save('en'),
    lead('使用自己專案或本課虛構研究。先發展推理，再潤飾語言。') + '<div class="response-grid">' + field('studio-finding', '發現及對研究提問的答案', 'zh') + field('studio-interpretation', '實質意義及可能解釋', 'zh') + field('studio-evidence', '支持證據、其他解釋及相反個案', 'zh') + field('studio-theory', '與具體理論或既有發現的關係', 'zh') + field('studio-significance', '貢獻及有理據的啟示', 'zh') + field('studio-boundary', '重要限制及未決問題', 'zh') + '</div>' + save('zh')),
  },
  {
    key: 'peer-review', part: discussion, title: c('Defend the links in the argument', '論證各個推理連結'),
    body: c(lead('Exchange arguments. The reviewer chooses the link that needs the most work.') + '<div class="review-checks">' + ['Can I locate the finding behind the interpretation?', 'Is the proposed explanation evidenced, plausible or still unexamined?', 'Does the literature comparison clarify the interpretation?', 'Does a contrary case change the claim?', 'Do the contribution and implication follow from the evidence?'].map((s, i) => `<label><input type="checkbox" data-review="${i}"> <span>${s}</span></label>`).join('') + '</div>' + field('peer-revision', 'Reviewer’s challenge and your resulting revision', 'en') + takeaway('A tick records that you reviewed the issue. It is not a validity score or an automated judgement.') + save('en'),
    lead('交換論證。評閱者選出最需要發展的一個連結。') + '<div class="review-checks">' + ['能否找到詮釋所根據的發現？', '解釋已有證據、僅屬合理，還是尚未檢視？', '文獻比較是否釐清詮釋？', '相反個案會否改變主張？', '貢獻及啟示是否由證據推導？'].map((s, i) => `<label><input type="checkbox" data-review="${i}"> <span>${s}</span></label>`).join('') + '</div>' + field('peer-revision', '評閱者的挑戰及你的修訂', 'zh') + takeaway('勾選只記錄已檢視此問題，並非效度分數或自動判斷。') + save('zh')),
  },
  {
    key: 'conclusion-job', part: conclusion, title: c('Close the whole argument', '完成整項研究的論證'),
    body: c(columns('<h3>Discussion</h3><p>Develops the meaning, explanations and significance of particular findings.</p><p>Examines literature relationships, alternatives and limitations.</p>', '<h3>Conclusion</h3><p>Brings the study’s overall answer and contribution into focus.</p><p>Shows what the reader can carry forward, within the evidence’s scope.</p>') + takeaway('A separate Conclusion is not universal. When included, its synthesis should be proportionate to the Discussion already developed.') + sources.bryman.en + sources.dornyei.en,
    columns('<h3>討論</h3><p>發展具體發現的意義、解釋及重要性。</p><p>檢視文獻關係、其他解釋及限制。</p>', '<h3>結論</h3><p>聚焦整項研究的答案及貢獻。</p><p>說明讀者可在證據範圍內帶走甚麼理解。</p>') + takeaway('並非所有文章均有獨立結論。設有結論時，綜合的篇幅應配合先前討論。') + sources.bryman.zh + sources.dornyei.zh),
  },
  {
    key: 'closing-synthesis', part: conclusion, title: c('Return to the problem with a fuller answer', '帶著更完整的答案回到研究問題'),
    body: c('<div class="evidence-chain"><div><b>Original problem</b><p>Why can access to feedback coexist with limited revision?</p></div><div><b>What the study clarifies</b><p>Access, interpretation and opportunities for action need to be distinguished.</p></div><div><b>What follows</b><p>Examine how those processes interact, using linked evidence and an appropriate follow-up design.</p></div></div>' + takeaway('This is a constructed synthesis. A real conclusion must be earned by the study’s actual findings and Discussion.') + reveal('Check the ending', '<p>Does it answer the original question? Does it state what understanding changed? Does it preserve the main uncertainty? Remove a new causal claim, new evidence or a recommendation that has not been developed.</p>') + sources.bryman.en,
    '<div class="evidence-chain"><div><b>原始問題</b><p>為何取得回饋，仍可能只有有限修訂？</p></div><div><b>研究釐清了甚麼</b><p>取得、詮釋及行動機會需要區分。</p></div><div><b>由此推進</b><p>以相連證據及適當後續設計，檢視這些過程如何互相作用。</p></div></div>' + takeaway('這是虛構的綜合示例；真實結論必須由實際發現及討論支持。') + reveal('檢查結尾', '<p>有否回答原始提問？說明理解如何改變？保留主要不確定性？刪去尚未發展的新因果主張、新證據或建議。</p>') + sources.bryman.zh),
  },
  {
    key: 'conclusion-clinic', part: conclusion, title: c('Choose a defensible closing claim', '選擇可論證的結論主張'),
    body: c(quiz('conclusion-choice', 'Which ending follows from the constructed feedback study?', [
      { label: 'The study proves that detailed feedback raises achievement in all universities.', why: 'It adds an untested cause, changes the outcome and extends far beyond the setting.' },
      { label: 'We used scores and interviews. More research is needed.', why: 'This lists methods and a generic next step, leaving the substantive answer and contribution unstated.' },
      { label: 'The study distinguishes receiving comments from using them in revision and identifies processes for further investigation in this programme.', why: 'It states the knowledge added and retains its scope. The final wording still needs to match the actual evidence developed in Discussion.', fits: true },
    ], 'en') + reveal('Strength is not certainty', '<p>A strong conclusion states the most consequential answer the evidence supports. Adding stronger verbs cannot supply missing evidence.</p>'),
    quiz('conclusion-choice', '哪個結尾可由虛構回饋研究推導？', [
      { label: '研究證明詳細回饋能提升所有大學的學業成就。', why: '加入未檢視的原因、改換結果變項，並大幅超出情境。' },
      { label: '我們使用分數及訪談，需要更多研究。', why: '只列方法及籠統下一步，尚未交代實質答案及貢獻。' },
      { label: '研究區分收到評語與修訂時運用評語，並辨識此課程中值得進一步探究的過程。', why: '說明增加的理解，並保留其範圍；最終用語仍須符合討論所發展的實際證據。', fits: true },
    ], 'zh') + reveal('有力不等於確定', '<p>有力的結論說明證據所支持、最具意義的答案；更強烈的動詞無法補上缺失證據。</p>')),
  },
  {
    key: 'conclusion-studio', part: conclusion, title: c('Write the conclusion your study has earned', '寫出研究證據支持的結論'),
    body: c(lead('Bring the answer, contribution and warranted consequence together. Let the study determine the paragraph’s shape.') + field('conclusion', 'Your conclusion', 'en', 'What do we now understand, why does it matter, and within what scope?', 7) + field('conclusion-check', 'Which sentence is most vulnerable, and what supports it?', 'en') + reveal('If your project is still a protocol', '<p>Describe the knowledge the planned study aims to generate and the claims the design could support. Keep anticipated findings clearly hypothetical.</p>') + save('en'),
    lead('綜合答案、貢獻及有依據的後續意義；段落形狀由研究需要決定。') + field('conclusion', '你的結論', 'zh', '我們現在理解了甚麼？為何重要？適用於甚麼範圍？', 7) + field('conclusion-check', '哪一句最容易受質疑？支持它的證據是甚麼？', 'zh') + reveal('專案仍是研究方案時', '<p>說明計劃產生的理解，以及設計可支持的主張；清楚標示預期發現仍屬假設。</p>') + save('zh')),
  },
  {
    key: 'take-forward', part: c('Your research argument', '你的研究論證'), title: c('Take your reasoning into the manuscript', '把推理帶進文稿'),
    body: c(field('next-edit', 'The most important revision I will make, and why', 'en', 'Name a claim or inferential link, not just a section to expand.') + '<div class="export-actions"><button type="button" data-export>Download my responses</button><button type="button" data-print>Print this lesson</button></div><p data-export-status role="status"></p>' + takeaway('Discussion develops the explanation. Conclusion synthesises the answer. Both depend on evidence and methodological judgement.') + save('en'),
    field('next-edit', '我最需要作出的修訂，以及原因', 'zh', '指出主張或推理連結，超越「擴充某部分」。') + '<div class="export-actions"><button type="button" data-export>下載我的回應</button><button type="button" data-print>列印本課</button></div><p data-export-status role="status"></p>' + takeaway('討論發展解釋；結論綜合答案。兩者均依賴證據及研究方法判斷。') + save('zh')),
  },
  {
    key: 'textbooks', part: c('References', '參考資料'), title: c('Methodology foundations', '研究方法基礎'),
    body: c('<div class="references"><p>Creswell, J. W. (2015). <i>Educational research: Planning, conducting, and evaluating quantitative and qualitative research</i> (5th ed.). Pearson. Chapters 6, 8–9.</p><p>Dörnyei, Z. (2007). <i>Research methods in applied linguistics: Quantitative, qualitative, and mixed methodologies</i>. Oxford University Press. §§12.3.4–12.3.5; §13.1.2.</p><p>Miles, M. B., Huberman, A. M., &amp; Saldaña, J. (2014). <i>Qualitative data analysis: A methods sourcebook</i> (3rd ed.). SAGE. Chapter 11.</p><p>Clark, T., Foster, L., Sloan, L., &amp; Bryman, A. (2021). <i>Bryman’s social research methods</i> (6th ed.). Oxford University Press. Chapter 25.</p><p>Creswell, J. W., &amp; Plano Clark, V. L. (2018). <i>Designing and conducting mixed methods research</i> (3rd ed.). SAGE. Chapters 7–8.</p></div>',
    '<div class="references"><p>Creswell, J. W. (2015). <i>Educational research: Planning, conducting, and evaluating quantitative and qualitative research</i> (5th ed.). Pearson。第 6、8–9 章。</p><p>Dörnyei, Z. (2007). <i>Research methods in applied linguistics: Quantitative, qualitative, and mixed methodologies</i>. Oxford University Press。§§12.3.4–12.3.5；§13.1.2。</p><p>Miles, M. B., Huberman, A. M., &amp; Saldaña, J. (2014). <i>Qualitative data analysis: A methods sourcebook</i> (3rd ed.). SAGE。第 11 章。</p><p>Clark, T., Foster, L., Sloan, L., &amp; Bryman, A. (2021). <i>Bryman’s social research methods</i> (6th ed.). Oxford University Press。第 25 章。</p><p>Creswell, J. W., &amp; Plano Clark, V. L. (2018). <i>Designing and conducting mixed methods research</i> (3rd ed.). SAGE。第 7–8 章。</p></div>'),
  },
  {
    key: 'readings', part: c('References', '參考資料'), title: c('Empirical readings and discussion guides', '實證閱讀及討論指引'),
    body: c('<div class="references"><p>Deslauriers et al. (2019). <a href="https://doi.org/10.1073/pnas.1821936116" target="_blank" rel="noopener noreferrer">Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom</a>. <i>PNAS, 116</i>, 19251–19257.</p><p>Carless (2020). <a href="https://doi.org/10.1080/07294360.2019.1684455" target="_blank" rel="noopener noreferrer">Longitudinal perspectives on students’ experiences of feedback: A need for teacher–student partnerships</a>. <i>Higher Education Research &amp; Development, 39</i>, 425–438.</p><p>Mueller &amp; Oppenheimer (2014). <a href="https://doi.org/10.1177/0956797614524581" target="_blank" rel="noopener noreferrer">The pen is mightier than the keyboard</a>. <i>Psychological Science, 25</i>, 1159–1168.</p><p>Urry et al. (2021). <a href="https://doi.org/10.1177/0956797620965541" target="_blank" rel="noopener noreferrer">Don’t ditch the laptop just yet</a>. <i>Psychological Science, 32</i>, 326–339.</p><p><a href="https://apastyle.apa.org/instructional-aids/discussion-phrases-guide.pdf" target="_blank" rel="noopener noreferrer">APA Discussion Phrases Guide</a> · <a href="https://libguides.usc.edu/writingguide/discussion" target="_blank" rel="noopener noreferrer">USC Discussion guide</a> · <a href="https://library.sacredheart.edu/c.php?g=29803&amp;p=185933" target="_blank" rel="noopener noreferrer">Sacred Heart Discussion guide</a></p></div>',
    '<div class="references"><p>Deslauriers 等人（2019）。<a href="https://doi.org/10.1073/pnas.1821936116" target="_blank" rel="noopener noreferrer">Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom</a>。<i>PNAS, 116</i>, 19251–19257。</p><p>Carless（2020）。<a href="https://doi.org/10.1080/07294360.2019.1684455" target="_blank" rel="noopener noreferrer">Longitudinal perspectives on students’ experiences of feedback: A need for teacher–student partnerships</a>。<i>Higher Education Research &amp; Development, 39</i>, 425–438。</p><p>Mueller 與 Oppenheimer（2014）。<a href="https://doi.org/10.1177/0956797614524581" target="_blank" rel="noopener noreferrer">The pen is mightier than the keyboard</a>。<i>Psychological Science, 25</i>, 1159–1168。</p><p>Urry 等人（2021）。<a href="https://doi.org/10.1177/0956797620965541" target="_blank" rel="noopener noreferrer">Don’t ditch the laptop just yet</a>。<i>Psychological Science, 32</i>, 326–339。</p><p><a href="https://apastyle.apa.org/instructional-aids/discussion-phrases-guide.pdf" target="_blank" rel="noopener noreferrer">APA 討論語句指引</a> · <a href="https://libguides.usc.edu/writingguide/discussion" target="_blank" rel="noopener noreferrer">USC 討論指引</a> · <a href="https://library.sacredheart.edu/c.php?g=29803&amp;p=185933" target="_blank" rel="noopener noreferrer">Sacred Heart 討論指引</a></p></div>'),
  },
];
