import excerpts from './dedc02DiscussionExcerpts.json';

type Copy = { en: string; zh: string };
type Slide = { key: string; title: Copy; part: Copy; body: Copy; spacious?: boolean };
type ExcerptKey = keyof typeof excerpts;
type FunctionNote = [key: string, label: string, explanation: string];
const c = (en: string, zh: string): Copy => ({ en, zh });
const esc = (s: string) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const lead = (s: string) => `<p class="lead">${s}</p>`;
const prose = (s: string) => `<p class="lecture-explanation">${s}</p>`;
const discussion = c('Developing the Discussion', '發展討論');
const conclusion = c('Bringing the argument to a close', '完成整體論證');
const doi = (paper: string) => paper === 'zhang' ? 'https://doi.org/10.1016/j.asw.2021.100586' : 'https://doi.org/10.1080/02602938.2022.2155610';
const source = (key: ExcerptKey, lang: 'en'|'zh') => {
  const entry = excerpts[key];
  return `<p class="example-source">${entry.source === 'zhang' ? 'Zhang &amp; Hyland (2022)' : 'Payne, Ajjawi, &amp; Holloway (2023)'} · ${lang === 'en' ? 'accepted manuscript, PDF pp.' : '接受稿，PDF 第'} ${entry.pages}${lang === 'zh' ? ' 頁' : ''} · <a href="${doi(entry.source)}" target="_blank" rel="noreferrer">${lang === 'en' ? 'Publication details' : '論文資料'}</a></p>`;
};
const context = (paper: 'zhang'|'payne', lang: 'en'|'zh') => `<aside class="study-context"><p>${paper === 'zhang'
  ? lang === 'en' ? '<b>Study context:</b> a Chinese university writing course; one teacher and 33 students; automated writing evaluation (AWE), peer and teacher feedback; analysis of drafts, feedback and retrospective interviews.' : '<b>研究背景：</b>中國一所大學的寫作課；1 名教師及 33 名學生；自動寫作評估（AWE）、同儕及教師回饋；分析草稿、回饋及回溯訪談。'
  : lang === 'en' ? '<b>Study context:</b> interviews with ten higher-education teachers about the knowledge, skills and dispositions they use to make technology-enhanced feedback more relational. Their curriculum responsibilities varied.' : '<b>研究背景：</b>訪談 10 名高等教育教師，了解他們如何運用知識、技能及傾向，使科技輔助回饋更具關係性；受訪教師的課程責任各有不同。'}</p></aside>`;
const excerpt = (key: ExcerptKey, lang: 'en'|'zh', functions: FunctionNote[]) => {
  const entry = excerpts[key];
  let paragraphs = '';
  let inList = false;
  for (const block of entry.blocks) {
    const text = block.spans.map(span => `<span data-move="${span.functions.join(' ')}">${esc(span.text)}</span>`).join('');
    if (block.kind === 'li') {
      if (!inList) { paragraphs += '<ol>'; inList = true; }
      paragraphs += `<li>${text}</li>`;
    } else {
      if (inList) { paragraphs += '</ol>'; inList = false; }
      paragraphs += `<p>${text}</p>`;
    }
  }
  if (inList) paragraphs += '</ol>';
  const clear = lang === 'en' ? 'Clear' : '清除底線';
  const instruction = lang === 'en' ? 'Original English excerpt. Select a function to underline its words in the passage; the explanation appears below.' : '以下保留英文原文。點選功能，便會在段落內為相關字句加底線，下方顯示解說。';
  return `<div class="annotation-example" data-excerpt="${key}">${source(key,lang)}<div class="annotation-tools" role="group" aria-label="${lang === 'en' ? 'Functions in the excerpt' : '節錄中的功能'}">${functions.map(([id,label,note]) => `<button type="button" data-annotation="${id}" data-annotation-help="${esc(note)}" aria-pressed="false">${label}</button>`).join('')}<button type="button" data-annotation="clear" data-annotation-help="${esc(instruction)}" aria-pressed="true">${clear}</button></div><p class="annotation-help" data-annotation-note role="status">${lang === 'en' ? 'Select a function to underline its words in the original passage.' : '點選功能，在原文中為相關字句加底線。'}</p><blockquote class="original-excerpt" lang="en-GB" cite="${doi(entry.source)}">${paragraphs}</blockquote></div>`;
};

export const discussionConclusionSlides: Slide[] = [
  {
    key:'opening',part:c('DEDC02 · Advanced Research Method','DEDC02 · 進階教育研究方法'),spacious:true,
    title:c('Discussion<br>and Conclusion','討論與結論'),
    body:c(lead('How researchers turn findings into an argument—and bring that argument to a meaningful close.') + prose('Read complete passages from published studies. Use the function buttons to see how the authors connect evidence, explanation and the understanding they want readers to retain.'),lead('研究者如何把發現發展成論證，並以有意義的結論收束。') + prose('透過已發表研究的完整段落，觀察作者如何連結證據、解釋，以及希望讀者帶走的理解。點選功能按鈕，可在原文中追蹤這些連結。')),
  },
  {
    key:'research-argument',part:c('The learning storyline','本課的學習脈絡'),
    title:c('How the research argument develops','研究論證如何發展'),
    body:c(prose('<b>Results establish what the study found.</b> They give the reader the observations, estimates or accounts needed to assess the evidence. The Discussion takes those findings as its starting point and develops an answer: what the pattern means, why it might have occurred, and how it changes the existing understanding.') + prose('<b>The Discussion develops this reasoning as a connected argument.</b> Theory and earlier studies help interpret the findings; contradictory evidence and limitations shape how far the interpretation can go. Significance, contribution and implications explain why that understanding matters, what the study adds, and what follows from it.') + prose('<b>The Conclusion brings the argument together.</b> It gives the overall answer and contribution within their proper scope. Its takeaway is the central understanding the reader should retain after the detailed reasoning. Repeating each result leaves that synthesis unfinished.') + '<p class="takeaway">Our route: develop an interpretation → place it in the scholarly conversation → establish its importance and limits → synthesise the answer.</p>',prose('<b>結果先建立研究發現了甚麼。</b>呈現讀者判斷證據所需的觀察、估計或報告。討論以這些發現為起點，發展答案：模式代表甚麼、為何可能出現，以及它如何改變原有理解。') + prose('<b>討論把這些推理連成論證。</b>理論及既有研究幫助詮釋發現；矛盾證據與限制決定詮釋可推進多遠。重要性、貢獻及啟示說明理解為何重要、研究增加了甚麼，以及由此可推導甚麼。') + prose('<b>結論綜合整體論證。</b>在適當範圍內交代整體答案與貢獻。核心訊息是讀者在詳細推理之後應保留的中心理解，逐項重複結果仍未完成這項綜合。') + '<p class="takeaway">學習路徑：發展詮釋 → 進入學術對話 → 建立重要性及界線 → 綜合答案。</p>'),
  },
  {
    key:'develop-discussion',part:discussion,
    title:c('Developing a Discussion','把詮釋發展成解釋'),
    body:c(prose('Begin with what the findings mean, then explain how that meaning is supported. Here, the first paragraph uses a three-dimensional understanding of engagement to interpret the study. The next paragraph connects that interpretation to a possible process, earlier feedback research and the students’ accounts. The argument develops across the two paragraphs.') + context('zhang','en') + excerpt('develop','en',[
      ['interpretation','Interpretation','The authors interpret the findings through the complexity of engagement, then propose the combined feedback process as an explanation. These are authorial interpretations, not additional results.'],
      ['theory','Theory','Behavioural engagement concerns effort and action; affective engagement concerns feelings and attitudes; cognitive engagement concerns evaluating and monitoring. These concepts organise the interpretation.'],
      ['literature','Literature','The citations position the interpretation within earlier scholarship and explain what automated and peer feedback might contribute. The authors specify the relevant ideas.'],
      ['explanation','Explanation','The authors connect the activities to manageable revision and attention to grammar and content. “We believe” signals their interpretation; the classroom case does not isolate a causal effect.'],
      ['evidence','Evidence','“As illustrated by the students” returns the explanation to students’ reported revision experiences. The reader can see which finding supports the proposed process.'],
      ['problem','Problem','The difficulty of evaluating and revising writing prepares the reader for the next paragraph’s account of how the activities might help.'],
    ]),prose('先交代發現的意義，再解釋這項理解如何得到支持。第一段運用投入的三個向度詮釋研究；下一段把這項詮釋連結至可能過程、既有回饋研究及學生的報告。論證在兩段之間逐步發展。') + context('zhang','zh') + excerpt('develop','zh',[
      ['interpretation','詮釋','作者從投入的複雜性理解發現，再以整合回饋過程提出解釋。這些是作者的詮釋，並非新增結果。'],
      ['theory','概念與理論','行為投入涉及努力與行動；情感投入涉及感受與態度；認知投入涉及評估與監察。概念組織了詮釋。'],
      ['literature','既有研究','引文把詮釋放進既有學術理解，並指出自動及同儕回饋可能提供甚麼。作者交代了相關概念。'],
      ['explanation','可能解釋','作者把活動連結至較易處理的修訂，以及文法與內容的分工。「We believe」表明這是作者詮釋；課堂個案尚未辨識獨立因果效果。'],
      ['evidence','支持證據','「As illustrated by the students」把解釋連回學生報告的修訂經驗，讓讀者知道哪項發現支持所提過程。'],
      ['problem','需要解釋的問題','評估及修訂文章的困難，為下一段說明活動如何可能提供協助鋪路。'],
    ])),
  },
  {
    key:'literature-comparison',part:discussion,
    title:c('Linking to the literature','運用文獻深化論證'),
    body:c(prose('A literature comparison develops the argument when it explains a relationship. Identify the earlier idea, show how your findings relate to it, then examine why the relationship matters. Check differences in concepts, participants, responsibilities, measures and timing before proposing an explanation. This paragraph uses teachers’ curriculum responsibilities to explain a difference from an earlier framework.') + context('payne','en') + excerpt('literature','en',[
      ['earlier','Earlier framework','The authors identify the specific design dimension they are engaging with and locate it at curriculum and assessment level.'],
      ['finding','Current findings','The participants’ accounts introduce what this study found about the possibilities for dialogic, formative feedback.'],
      ['context','Relevant context','Different levels of curriculum responsibility provide a concrete contextual distinction. It gives the comparison an evidential basis.'],
      ['explanation','Explanation of the difference','“This may explain” explicitly connects the contextual distinction to the difference between studies. “May” retains the explanation’s tentative status.'],
      ['contribution','What the comparison adds','The final sentence states the focus of the design strategies identified here. The comparison makes that focus more precise.'],
    ]),prose('文獻比較透過解釋關係來發展論證：指出既有概念，交代本研究發現與它的關係，再檢視這個關係為何重要。提出解釋前，須核對概念、對象、責任、測量及時間等差異。本段以教師的課程責任，解釋研究與既有框架的差異。') + context('payne','zh') + excerpt('literature','zh',[
      ['earlier','既有框架','作者指出所回應的具體設計向度，並交代其關注課程及評核層面。'],
      ['finding','本研究發現','受訪者的報告引入本研究對對話性、形成性回饋的發現。'],
      ['context','相關情境','不同課程責任構成具體情境差異，使比較有證據基礎。'],
      ['explanation','差異的解釋','「This may explain」明確連結情境差異與研究差異；「may」保留解釋的推測性質。'],
      ['contribution','比較增加的理解','結尾交代本研究辨識的設計策略重點；比較使這個重點更精確。'],
    ])),
  },
  {
    key:'synthesis',part:discussion,
    title:c('Synthesising the findings','把不同發現綜合成解釋'),
    body:c(prose('Synthesis explains what becomes visible when findings are considered together. Connect related observations through a shared process, show the evidence for that connection, and identify conditions that could change it. Here, the authors bring together attention to different aspects of writing, varied feedback sources and the teacher’s involvement. They use that combination to explain students’ engagement.') + context('zhang','en') + excerpt('synthesis','en',[
      ['synthesis','Synthesis','These sentences bring different observations into an account of the writing-and-revision process. The paragraph gives their relationship a meaning.'],
      ['interpretation','Central interpretation','The teacher’s role gives the paragraph a central interpretive point linking the activities together.'],
      ['evidence','Evidence for the connection','The authors refer to the teacher’s actions and students’ comments as evidence for how support operated.'],
      ['explanation','How the process may work','Varied modes, a sense of progress and reflection are used to explain the observed engagement. These mechanisms remain the authors’ interpretation.'],
      ['qualification','Condition on the explanation','The final sentence considers what might happen without teacher feedback. It identifies a proposed condition; the study did not experimentally remove that step.'],
    ]),prose('綜合要解釋把發現放在一起後，多理解了甚麼。以共同過程連結相關觀察，展示支持連結的證據，並指出哪些條件可能改變它。作者在此把不同寫作層面的關注、多種回饋來源及教師參與連在一起，解釋學生的投入。') + context('zhang','zh') + excerpt('synthesis','zh',[
      ['synthesis','綜合','相關句子把不同觀察放進寫作與修訂過程，交代其關係的意義。'],
      ['interpretation','中心詮釋','教師的角色構成段落的中心詮釋，把各項活動連起來。'],
      ['evidence','連結的證據','作者援引教師的行動及學生評語，說明支援如何運作。'],
      ['explanation','過程可能如何運作','不同模式、進步感及反思用來解釋投入；這些機制仍屬作者詮釋。'],
      ['qualification','解釋的成立條件','結尾考慮缺少教師回饋時可能如何，指出一項所提條件；研究並未實驗性地移除此步驟。'],
    ])),
  },
  {
    key:'significance-contribution',part:discussion,
    title:c('Contribution and significance','說明研究增加甚麼，以及為何重要'),
    body:c(prose('A contribution identifies the addition to knowledge; significance explains why that addition matters. Develop both by returning to the issue that motivated the research, showing what the findings clarify, and explaining the consequence. Here, the authors move the question from the best single feedback type to how feedback types work together. The list then spells out why that change in focus matters for engagement.') + context('zhang','en') + excerpt('significance','en',[
      ['contribution','Contribution','The opening identifies a change in understanding: considering how feedback types are combined. A contribution claim needs this specific addition, supported by the study.'],
      ['literature','Scholarly issue','The next sentence positions that addition in relation to concerns about computer-generated feedback.'],
      ['significance','Why it matters','The claimed benefits explain why the combined approach matters for involvement, motivation and different dimensions of engagement. Here significance concerns importance, not a statistical test.'],
      ['synthesis','How the importance is developed','The paragraph introduces a set of connected benefits and links each to the engagement concepts. The authors develop the importance through those relationships.'],
    ]),prose('貢獻指出新增的知識；重要性解釋新增理解為何值得關注。回到研究起初關注的問題，展示發現釐清了甚麼，再解釋由此產生的意義。作者把問題從最佳單一回饋類型，推進至不同類型如何配合；隨後列表具體說明這種關注轉變對投入有何意義。') + context('zhang','zh') + excerpt('significance','zh',[
      ['contribution','貢獻','開頭指出理解的改變：考慮不同回饋如何組合。貢獻主張需要這種具體新增理解，並由研究支持。'],
      ['literature','學術議題','下一句把新增理解連結至對電腦產生回饋的疑問。'],
      ['significance','為何重要','所提益處解釋整合方式對參與、動機及不同投入向度有何意義。此處指實質重要性，並非統計顯著性。'],
      ['synthesis','如何發展重要性','段落引入相連益處，並逐項連結至投入概念，透過這些關係發展重要性。'],
    ])),
  },
  {
    key:'boundaries',part:discussion,
    title:c('Qualifying the argument','讓證據決定主張可推進多遠'),
    body:c(prose('A defensible Discussion works through evidence that qualifies its interpretation. A contrasting case can reveal a condition or a competing explanation; a design limitation can leave a particular inference uncertain. Explain what changes in the claim and what remains supported. The first passage qualifies an explanation through disengaged students; the second connects interview evidence to the limits of what can be claimed.') + context('zhang','en') + excerpt('exceptions','en',[
      ['qualification','Qualification','The authors make their interpretation conditional and acknowledge influences beyond the feedback approach.'],
      ['contrary','Contrasting evidence','Students who failed to engage provide evidence that the approach did not operate in the same way for everyone.'],
      ['explanation','Alternative influences','The paragraph considers motivation, the perceived demands of revision and teacher support. These are possible influences to examine, not isolated causal effects.'],
      ['scope','Scope of the claim','“In this situation at least” explicitly restricts the synthesis to the studied setting.'],
      ['implication','Practical consequence','The challenge in enacting the approach follows directly from the contrasting evidence.'],
    ]) + context('payne','en') + excerpt('limitations','en',[
      ['question','Research question','The authors restate the question so readers can judge the intended reach of the study.'],
      ['design','Evidence collected','Interviews establish that the study concerns teachers’ reported literacies.'],
      ['limitation','Limitation and its consequence','Reported practices may differ from actual practices. The limitation concerns what interviews reveal about action.'],
      ['scope','Claim boundaries','The authors identify claims about efficacy, academic performance and generalisability that their study was not intended to make.'],
      ['justification','Design rationale','The final sentence explains the rationale for purposive qualitative sampling. It preserves the design’s purpose while acknowledging its scope.'],
    ]),prose('有根據的討論會處理限定詮釋的證據。不同個案可能指出條件或其他解釋；設計限制可能使某項推論仍不確定。須解釋主張如何改變，以及甚麼仍獲支持。第一段透過未投入的學生限定解釋；第二段把訪談證據連結至主張的界線。') + context('zhang','zh') + excerpt('exceptions','zh',[
      ['qualification','限定','作者為詮釋加入條件，承認回饋方式以外的影響。'],
      ['contrary','不同證據','未投入的學生顯示，這種方式並非對所有人以同樣方式運作。'],
      ['explanation','其他可能影響','段落考慮動機、修訂要求的感受及教師支援；這些是有待檢視的可能影響，並非已辨識的獨立因果效果。'],
      ['scope','主張範圍','「In this situation at least」把綜合理解明確限於研究情境。'],
      ['implication','實務後果','推行上的挑戰由不同證據直接推導。'],
    ]) + context('payne','zh') + excerpt('limitations','zh',[
      ['question','研究提問','作者重提提問，讓讀者判斷研究原定的主張範圍。'],
      ['design','蒐集的證據','訪談說明研究涉及教師報告的素養。'],
      ['limitation','限制及後果','報告的實務可能與實際實務不同，影響訪談能揭示甚麼行動。'],
      ['scope','主張界線','作者指出研究原本無意建立的成效、學業表現及概括性主張。'],
      ['justification','設計理據','結尾解釋質性目的抽樣的理據，在承認界線時保留設計目的。'],
    ])),
  },
  {
    key:'implications',part:discussion,
    title:c('Developing implications','由論證推導啟示'),
    body:c(prose('An implication explains what follows from the understanding developed so far. Link the recommendation to a finding or problem, name who could act, and explain the conditions that make the action plausible. Here, the authors move from the demands on teachers to the feasibility of the classroom approach and its possible use elsewhere. The breadth of the recommendation still needs to be judged against the study’s evidence.') + context('zhang','en') + excerpt('implications','en',[
      ['conditions','Conditions for action','The opening identifies the skills, awareness and learning conditions needed to support engagement.'],
      ['problem','Problem the action addresses','Assessment duties and marking load establish a practical problem for the proposed response.'],
      ['literature','Connection to wider research','The literature places the classroom problem within a broader discussion of assessment workload.'],
      ['evidence','Reason for the recommendation','The observed ability to integrate feedback without major classroom changes provides the argument for exploring the approach elsewhere.'],
      ['recommendation','Proposed implication','The authors propose exploration in other classrooms and a broader possible benefit. These extensions need local adaptation and evaluation; they are not established effects in those settings.'],
      ['significance','Practical importance','The final sentence explains why the suggestion might matter under wider pressures on academics.'],
    ]),prose('啟示說明前述理解可推導甚麼。把建議連結至發現或問題，指出誰可行動，並交代使行動合理的條件。作者由教師面對的要求，推進至課堂方式的可行性，以及在其他地方探索的可能。建議的廣度仍須按研究證據判斷。') + context('zhang','zh') + excerpt('implications','zh',[
      ['conditions','行動條件','開頭指出支援投入所需的技能、意識及學習條件。'],
      ['problem','回應的問題','評核責任及批改負擔建立了建議方案要回應的實務問題。'],
      ['literature','連結較廣研究','文獻把課堂問題放進較廣的評核工作量討論。'],
      ['evidence','建議理據','能在毋須大幅改變課堂安排下整合回饋，構成到其他地方探索的理據。'],
      ['recommendation','所提啟示','作者建議在其他課堂探索，並提出可能益處；這些延伸需要在地調整及評估，尚非那些情境已建立的效果。'],
      ['significance','實務重要性','結尾解釋在學者面對較廣壓力之下，建議為何可能重要。'],
    ])),
  },
  {
    key:'conclusion',part:conclusion,
    title:c('Discussion and Conclusion','把結論讀成相連的整體結尾'),
    body:c(prose('The Discussion has developed and examined the reasoning. The Conclusion now draws that work into an overall answer: what the study helps us understand, what it contributes, and within what scope. Read these three original paragraphs together. The first foregrounds the answer and contribution, the second retains the necessary limits and next questions, and the final paragraph develops the takeaway. The takeaway is the central understanding embedded in this synthesis; it gains meaning from the argument that precedes it.') + context('zhang','en') + excerpt('conclusion','en',[
      ['answer','Overall answer','The opening and synthesis state the answer reached through the study. They select the central understanding without repeating each individual finding.'],
      ['contribution','Contribution','The authors identify the connection between research fields and the use of draft changes alongside self-report. This explains the particular addition made by the study.'],
      ['significance','Importance','The opening identifies why the answer merits researchers’ and practitioners’ attention.'],
      ['scope','Scope and uncertainty','The authors retain the classroom setting, limited generalisability and the difficulty of extrapolation. These qualifications make the overall answer accurate.'],
      ['implication','What follows','The authors invite adaptation and exploration in other settings and describe supportive pedagogical possibilities. These implications have grown out of the preceding argument.'],
      ['future','Future research','The suggestion of other methods addresses the remaining difficulty of examining cognitive engagement. A useful next study follows from an identified uncertainty.'],
      ['takeaway','Takeaway within the Conclusion','The final paragraph develops the understanding to retain: engagement is complex, and supportive feedback processes can help turn feedback into learning. The last sentence crystallises that synthesis; its force comes from the paragraphs before it.'],
    ]) + '<div class="export-actions"><button type="button" data-print>Print this lesson</button><button type="button" data-export data-previous-responses hidden>Download previously saved responses</button></div><p data-export-status role="status"></p>',prose('討論已發展及檢視推理；結論現在把這些工作綜合成整體答案：研究幫助理解甚麼、增加了甚麼，以及適用於甚麼範圍。把以下三段原文連起來閱讀：第一段突出答案與貢獻，第二段保留必要限制及後續問題，最後一段發展核心訊息。核心訊息嵌入這項綜合，其意義由前述論證建立。') + context('zhang','zh') + excerpt('conclusion','zh',[
      ['answer','整體答案','開頭及綜合句說明研究形成的答案，選出中心理解，毋須逐項重複發現。'],
      ['contribution','貢獻','作者指出研究領域之間的連結，以及草稿改變與自我報告的結合，交代研究的具體新增部分。'],
      ['significance','重要性','開頭指出答案為何值得研究者及實務工作者關注。'],
      ['scope','範圍與不確定性','作者保留課堂情境、有限概括性及外推困難，使整體答案準確。'],
      ['implication','由此推導甚麼','作者邀請在其他情境調整及探索，並交代有支援的教學可能；啟示由先前論證發展而來。'],
      ['future','後續研究','其他方法的建議回應檢視認知投入的困難；有用的後續研究由已辨識的不確定性推導。'],
      ['takeaway','嵌入結論的核心訊息','最後一段發展讀者應保留的理解：投入是複雜的，有支援的回饋過程有助把回饋轉化為學習。末句凝聚這項綜合，其力量由前面段落建立。'],
    ]) + '<div class="export-actions"><button type="button" data-print>列印本課</button><button type="button" data-export data-previous-responses hidden>下載先前保存的回應</button></div><p data-export-status role="status"></p>'),
  },
];
