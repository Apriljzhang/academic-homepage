import excerpts from './dedc02DiscussionExcerpts.json';
import { withBase } from '../utils/paths';

type Copy = { en: string; zh: string };
type Slide = { key: string; title: Copy; part: Copy; body: Copy; spacious?: boolean };
type ExcerptKey = keyof typeof excerpts;
type FunctionNote = [key: string, label: string, explanation: string];
const c = (en: string, zh: string): Copy => ({ en, zh });
const esc = (s: string) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const lead = (s: string) => `<p class="lead">${s}</p>`;
const prose = (s: string) => `<p class="lecture-explanation">${s}</p>`;
const doi = (paper: string) => paper === 'zhang' ? 'https://doi.org/10.1016/j.asw.2021.100586' : 'https://doi.org/10.1080/02602938.2022.2155610';
const source = (key: ExcerptKey, lang: 'en'|'zh') => {
  const entry = excerpts[key];
  return `<p class="example-source">${entry.source === 'zhang' ? 'Zhang &amp; Hyland (2022)' : 'Payne, Ajjawi, &amp; Holloway (2023)'} · ${lang === 'en' ? `accepted manuscript, PDF ${entry.pages.includes('–') ? 'pp.' : 'p.'}` : '接受稿，PDF 第'} ${entry.pages}${lang === 'zh' ? ' 頁' : ''} · <a href="${doi(entry.source)}" target="_blank" rel="noreferrer">${lang === 'en' ? 'Publication details' : '論文資料'}</a></p>`;
};
const context = (paper: 'zhang'|'payne', lang: 'en'|'zh') => `<aside class="study-context"><p>${paper === 'zhang'
  ? lang === 'en' ? '<b>Study context:</b> a Chinese university writing course; one teacher and 33 students; automated writing evaluation (AWE), peer and teacher feedback; analysis of drafts, feedback and retrospective interviews.' : '<b>研究背景：</b>中國一所大學的寫作課；1 名教師及 33 名學生；自動寫作評估（AWE）、同儕及教師反馈；分析草稿、反馈及回溯訪談。'
  : lang === 'en' ? '<b>Study context:</b> interviews with ten higher-education teachers about the knowledge, skills and dispositions they use to make technology-enhanced feedback more relational. Their curriculum responsibilities varied.' : '<b>研究背景：</b>訪談 10 名高等教育教師，了解他們如何運用知識、技能及傾向，使科技輔助反馈更具關係性；受訪教師的課程責任各有不同。'}</p></aside>`;
const excerpt = (key: ExcerptKey, lang: 'en'|'zh', functions: FunctionNote[], blockIndexes?: number[]) => {
  const entry = excerpts[key];
  let paragraphs = '';
  let inList = false;
  const blocks = blockIndexes ? blockIndexes.map(index => entry.blocks[index]) : entry.blocks;
  const available = new Set(blocks.flatMap(block => block.spans.flatMap(span => span.functions)));
  functions = functions.filter(([id]) => available.has(id));
  for (const block of blocks) {
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

const method = (lang: 'en'|'zh', rows: [string,string][]) => `<h3 class="method-heading">${lang === 'en' ? 'How to develop it' : '如何發展'}</h3><ol class="reasoning-method">${rows.map(([title,body]) => `<li><b>${title}</b><span>${body}</span></li>`).join('')}</ol>`;
const table = (heads: string[], rows: string[][]) => `<div class="method-table"><table><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${cell}</th>`:`<td data-label="${esc(heads[i])}">${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const check = (lang:'en'|'zh',text:string) => `<p class="reasoning-check"><b>${lang==='en'?'Check the reasoning':'檢視推理'}:</b> ${text}</p>`;
const functionNotes: Record<ExcerptKey, {en:FunctionNote[];zh:FunctionNote[]}> = {
  'develop': { en: [
      ['interpretation','Interpretation','The highlighted sentences state what the authors make of the findings. The rest of the paragraph develops that interpretation through relevant concepts or supporting evidence.'],
      ['theory','Theory','Behavioural engagement concerns effort and action; affective engagement concerns feelings and attitudes; cognitive engagement concerns evaluating and monitoring. These concepts organise the interpretation.'],
      ['literature','Literature','The authors identify earlier ideas relevant to the interpretation. The citations show which claims in this paragraph are connected to previous scholarship.'],
      ['explanation','Explanation','The authors connect the activities to manageable revision and attention to grammar and content. “We believe” signals their interpretation; the classroom case does not isolate a causal effect.'],
      ['evidence','Evidence','“As illustrated by the students” returns the explanation to students’ reported revision experiences. The reader can see which finding supports the proposed process.'],
      ['problem','Problem','The difficulty of evaluating and revising writing identifies a problem that an explanation of the feedback process needs to address.'],
    ], zh: [
      ['interpretation','詮釋','劃線句子交代作者如何理解研究發現；段落其餘部分運用相關概念或支持證據，發展這項詮釋。'],
      ['theory','概念與理論','行為投入涉及努力與行動；情感投入涉及感受與態度；認知投入涉及評估與監察。概念組織了詮釋。'],
      ['literature','既有研究','作者指出與詮釋相關的既有概念；引文交代本段哪些主張連結至已有學術研究。'],
      ['explanation','可能解釋','作者把活動連結至較易處理的修訂，以及文法與內容的分工。「We believe」表明這是作者詮釋；課堂個案尚未辨識獨立因果效果。'],
      ['evidence','支持證據','「As illustrated by the students」把解釋連回學生報告的修訂經驗，讓讀者知道哪項發現支持所提過程。'],
      ['problem','需要解釋的問題','評估及修訂文章的困難，指出對反馈過程的解釋需要回應甚麼問題。'],
    ] },
  'literature': { en: [
      ['earlier','Earlier framework','The authors identify the specific design dimension they are engaging with and locate it at curriculum and assessment level.'],
      ['finding','Current findings','The participants’ accounts introduce what this study found about the possibilities for dialogic, formative feedback.'],
      ['context','Relevant context','Different levels of curriculum responsibility provide a concrete contextual distinction. It gives the comparison an evidential basis.'],
      ['explanation','Explanation of the difference','“This may explain” explicitly connects the contextual distinction to the difference between studies. “May” retains the explanation’s tentative status.'],
      ['contribution','What the comparison adds','The final sentence states the focus of the design strategies identified here. The comparison makes that focus more precise.'],
    ], zh: [
      ['earlier','既有框架','作者指出所回應的具體設計向度，並交代其關注課程及評核層面。'],
      ['finding','本研究發現','受訪者的報告引入本研究對對話性、形成性反馈的發現。'],
      ['context','相關情境','不同課程責任構成具體情境差異，使比較有證據基礎。'],
      ['explanation','差異的解釋','「This may explain」明確連結情境差異與研究差異；「may」保留解釋的推測性質。'],
      ['contribution','比較增加的理解','結尾交代本研究辨識的設計策略重點；比較使這個重點更精確。'],
    ] },
  'synthesis': { en: [
      ['synthesis','Synthesis','These sentences bring different observations into an account of the writing-and-revision process. The paragraph gives their relationship a meaning.'],
      ['interpretation','Central interpretation','The teacher’s role gives the paragraph a central interpretive point linking the activities together.'],
      ['evidence','Evidence for the connection','The authors refer to the teacher’s actions and students’ comments as evidence for how support operated.'],
      ['explanation','How the process may work','Varied modes, a sense of progress and reflection are used to explain the observed engagement. These mechanisms remain the authors’ interpretation.'],
      ['qualification','Condition on the explanation','The final sentence considers what might happen without teacher feedback. It identifies a proposed condition; the study did not experimentally remove that step.'],
    ], zh: [
      ['synthesis','綜合','相關句子把不同觀察放進寫作與修訂過程，交代其關係的意義。'],
      ['interpretation','中心詮釋','教師的角色構成段落的中心詮釋，把各項活動連起來。'],
      ['evidence','連結的證據','作者援引教師的行動及學生評語，說明支援如何運作。'],
      ['explanation','過程可能如何運作','不同模式、進步感及反思用來解釋投入；這些機制仍屬作者詮釋。'],
      ['qualification','解釋的成立條件','結尾考慮缺少教師反馈時可能如何，指出一項所提條件；研究並未實驗性地移除此步驟。'],
    ] },
  'significance': { en: [
      ['contribution','Contribution','The opening identifies a change in understanding: considering how feedback types are combined. A contribution claim needs this specific addition, supported by the study.'],
      ['literature','Scholarly issue','The next sentence positions that addition in relation to concerns about computer-generated feedback.'],
      ['significance','Why it matters','The claimed benefits explain why the combined approach matters for involvement, motivation and different dimensions of engagement. Here significance concerns importance, not a statistical test.'],
      ['synthesis','How the importance is developed','The paragraph introduces a set of connected benefits and links each to the engagement concepts. The authors develop the importance through those relationships.'],
    ], zh: [
      ['contribution','貢獻','開頭指出理解的改變：考慮不同反馈如何組合。貢獻主張需要這種具體新增理解，並由研究支持。'],
      ['literature','學術議題','下一句把新增理解連結至對電腦產生反馈的疑問。'],
      ['significance','為何重要','所提益處解釋整合方式對參與、動機及不同投入向度有何意義。此處指實質重要性，並非統計顯著性。'],
      ['synthesis','如何發展重要性','段落引入相連益處，並逐項連結至投入概念，透過這些關係發展重要性。'],
    ] },
  'exceptions': { en: [
      ['qualification','Qualification','The authors make their interpretation conditional and acknowledge influences beyond the feedback approach.'],
      ['contrary','Contrasting evidence','Students who failed to engage provide evidence that the approach did not operate in the same way for everyone.'],
      ['explanation','Alternative influences','The paragraph considers motivation, the perceived demands of revision and teacher support. These are possible influences to examine, not isolated causal effects.'],
      ['scope','Scope of the claim','“In this situation at least” explicitly restricts the synthesis to the studied setting.'],
      ['implication','Practical consequence','The challenge in enacting the approach follows directly from the contrasting evidence.'],
    ], zh: [
      ['qualification','限定','作者為詮釋加入條件，承認反馈方式以外的影響。'],
      ['contrary','不同證據','未投入的學生顯示，這種方式並非對所有人以同樣方式運作。'],
      ['explanation','其他可能影響','段落考慮動機、修訂要求的感受及教師支援；這些是有待檢視的可能影響，並非已辨識的獨立因果效果。'],
      ['scope','主張範圍','「In this situation at least」把綜合理解明確限於研究情境。'],
      ['implication','實務後果','推行上的挑戰由不同證據直接推導。'],
    ] },
  'limitations': { en: [
      ['question','Research question','The authors restate the question so readers can judge the intended reach of the study.'],
      ['design','Evidence collected','Interviews establish that the study concerns teachers’ reported literacies.'],
      ['limitation','Limitation and its consequence','Reported practices may differ from actual practices. The limitation concerns what interviews reveal about action.'],
      ['scope','Claim boundaries','The authors identify claims about efficacy, academic performance and generalisability that their study was not intended to make.'],
      ['justification','Design rationale','The final sentence explains the rationale for purposive qualitative sampling. It preserves the design’s purpose while acknowledging its scope.'],
    ], zh: [
      ['question','研究提問','作者重提提問，讓讀者判斷研究原定的主張範圍。'],
      ['design','蒐集的證據','訪談說明研究涉及教師報告的素養。'],
      ['limitation','限制及後果','報告的實務可能與實際實務不同，影響訪談能揭示甚麼行動。'],
      ['scope','主張界線','作者指出研究原本無意建立的成效、學業表現及概括性主張。'],
      ['justification','設計理據','結尾解釋質性目的抽樣的理據，在承認界線時保留設計目的。'],
    ] },
  'implications': { en: [
      ['conditions','Conditions for action','The opening identifies the skills, awareness and learning conditions needed to support engagement.'],
      ['problem','Problem the action addresses','Assessment duties and marking load establish a practical problem for the proposed response.'],
      ['literature','Connection to wider research','The literature places the classroom problem within a broader discussion of assessment workload.'],
      ['evidence','Reason for the recommendation','The observed ability to integrate feedback without major classroom changes provides the argument for exploring the approach elsewhere.'],
      ['recommendation','Proposed implication','The authors propose exploration in other classrooms and a broader possible benefit. These extensions need local adaptation and evaluation; they are not established effects in those settings.'],
      ['significance','Practical importance','The final sentence explains why the suggestion might matter under wider pressures on academics.'],
    ], zh: [
      ['conditions','行動條件','開頭指出支援投入所需的技能、意識及學習條件。'],
      ['problem','回應的問題','評核責任及批改負擔建立了建議方案要回應的實務問題。'],
      ['literature','連結較廣研究','文獻把課堂問題放進較廣的評核工作量討論。'],
      ['evidence','建議理據','能在毋須大幅改變課堂安排下整合反馈，構成到其他地方探索的理據。'],
      ['recommendation','所提啟示','作者建議在其他課堂探索，並提出可能益處；這些延伸需要在地調整及評估，尚非那些情境已建立的效果。'],
      ['significance','實務重要性','結尾解釋在學者面對較廣壓力之下，建議為何可能重要。'],
    ] },
  'conclusion': { en: [
      ['answer','Overall answer','The opening and synthesis state the answer reached through the study. They select the central understanding without repeating each individual finding.'],
      ['contribution','Contribution','The authors identify the connection between research fields and the use of draft changes alongside self-report. This explains the particular addition made by the study.'],
      ['significance','Importance','The opening identifies why the answer merits researchers’ and practitioners’ attention.'],
      ['scope','Scope and uncertainty','The authors retain the classroom setting, limited generalisability and the difficulty of extrapolation. These qualifications make the overall answer accurate.'],
      ['implication','What follows','The authors invite adaptation and exploration in other settings and describe supportive pedagogical possibilities. These implications have grown out of the preceding argument.'],
      ['future','Future research','The suggestion of other methods addresses the remaining difficulty of examining cognitive engagement. A useful next study follows from an identified uncertainty.'],
      ['takeaway','Takeaway within the Conclusion','The final paragraph develops the understanding to retain: engagement is complex, and supportive feedback processes can help turn feedback into learning. The last sentence crystallises that synthesis; its force comes from the paragraphs before it.'],
    ], zh: [
      ['answer','整體答案','開頭及綜合句說明研究形成的答案，選出中心理解，毋須逐項重複發現。'],
      ['contribution','貢獻','作者指出研究領域之間的連結，以及草稿改變與自我報告的結合，交代研究的具體新增部分。'],
      ['significance','重要性','開頭指出答案為何值得研究者及實務工作者關注。'],
      ['scope','範圍與不確定性','作者保留課堂情境、有限概括性及外推困難，使整體答案準確。'],
      ['implication','由此推導甚麼','作者邀請在其他情境調整及探索，並交代有支援的教學可能；啟示由先前論證發展而來。'],
      ['future','後續研究','其他方法的建議回應檢視認知投入的困難；有用的後續研究由已辨識的不確定性推導。'],
      ['takeaway','嵌入結論的核心訊息','最後一段發展讀者應保留的理解：投入是複雜的，有支援的反馈過程有助把反馈轉化為學習。末句凝聚這項綜合，其力量由前面段落建立。'],
    ] },
};
const example = (key:ExcerptKey,lang:'en'|'zh',blockIndexes?:number[]) => `<details class="published-example"><summary>${lang==='en'?'Original example: read and underline the authors’ moves':'原文例子：閱讀並劃出作者的寫作功能'}</summary><div>${context(excerpts[key].source==='zhang'?'zhang':'payne',lang)}${excerpt(key,lang,functionNotes[key][lang],blockIndexes)}</div></details>`;
const stageA = c('1 · Develop an answer','1 · 發展答案');
const stageB = c('2 · Examine and position the answer','2 · 檢視答案並連結文獻');
const stageC = c('3 · Establish what the answer adds','3 · 建立答案的貢獻');
const stageD = c('4 · Bring the answer together','4 · 綜合整體答案');

export const discussionConclusionSlides: Slide[] = [
  {
    key:'opening',part:c('DEDC02 · Advanced Research Method','DEDC02 · 進階教育研究方法'),spacious:true,
    title:c('Discussion<br>and Conclusion','討論與結論'),
    body:c(lead('How to develop an evidence-supported research argument and bring it to a clear close.')+prose('We begin with what the findings mean, examine explanations and their relationship to existing knowledge, then establish the contribution and synthesise the overall answer. Published paragraphs illustrate the methods after they have been explained.'),lead('如何發展有證據支持的研究論證，並清楚完成結論。')+prose('先發展研究發現的意義，再檢視解釋及其與已有知識的關係，進而建立貢獻，綜合整體答案。先學方法，再透過已發表段落觀察如何運用。')),
  },
  {
    key:'learning-aims',part:c('Today’s session','今天的課堂'),title:c('Learning aims','學習目標'),
    body:c(lead('By the end of today’s session, you will be able to:')+'<ol class="learning-aims"><li>Distinguish the purposes and content of the Discussion and Conclusion.</li><li>Develop interpretations and explanations appropriate to the findings and research design.</li><li>Connect findings to theory and prior research, including findings that differ from expectations or earlier studies.</li><li>Justify significance, contribution and implications while explaining the consequences of contradictory evidence and limitations.</li><li>Build a Conclusion that synthesises the overall answer and communicates a supported takeaway.</li></ol>',lead('完成今天的課堂後，你將能夠：')+'<ol class="learning-aims"><li>區分討論與結論的目的及內容。</li><li>按研究發現及設計，發展適當的詮釋與解釋。</li><li>把發現連結至理論及既有研究，包括與預期或既有研究不同的發現。</li><li>論證重要性、貢獻及啟示，並說明矛盾證據與限制的影響。</li><li>建立綜合整體答案、傳達有依據核心訊息的結論。</li></ol>'),
  },
  {
    key:'section-purposes',part:c('One research argument','同一項研究論證'),title:c('What Discussion and Conclusion each do','討論與結論各自完成甚麼工作'),
    body:c(prose('The same research question connects the sections. Results establish the evidence; the Discussion develops and examines its meaning; the Conclusion brings the overall answer into focus.')+table(['Section','Question it answers','How the content works'],[
      ['Results / Findings','What did the study find?','Present the patterns, estimates, themes or cases and the evidence needed to assess them.'],
      ['Discussion','What do these findings mean, why might they have occurred, and what do they add?','Interpret particular findings, develop and test explanations, engage with theory and literature, and justify their significance and implications within the evidence’s limits.'],
      ['Conclusion','What is the study’s overall answer and what should the reader retain?','Synthesise the central answer and contribution, preserve the scope that matters, and bring the takeaway into focus. Select the established ideas needed for that synthesis.'],
    ])+prose('Some reports combine sections. Identify the intellectual work first, then use the structure required for the report. The learning route is the same: develop an answer → examine and position it → establish what it adds → bring the answer together.'),prose('同一項研究提問連起各部分：結果建立證據；討論發展及檢視其意義；結論聚焦整體答案。')+table(['部分','回答的問題','內容如何發揮作用'],[
      ['結果／發現','研究發現了甚麼？','呈現模式、估計、主題或個案，以及讓讀者判斷的證據。'],
      ['討論','發現代表甚麼？為何可能出現？增加了甚麼？','詮釋具體發現，發展及檢視解釋，連結理論與文獻，並在證據範圍內論證重要性及啟示。'],
      ['結論','整體答案是甚麼？讀者應保留甚麼理解？','綜合中心答案及貢獻，保留重要範圍，聚焦核心訊息；選取這項綜合所需、已建立的概念。'],
    ])+prose('部分報告會合併章節。先辨認其思考工作，再按報告要求安排結構。學習路徑一致：發展答案 → 檢視並連結文獻 → 建立新增理解 → 綜合整體答案。')),
  },
  {
    key:'plan-discussion',part:stageA,title:c('How to plan a connected Discussion','如何規劃連貫的討論'),
    body:c(prose('Begin with the research questions and the important findings that answer them. Give each subsection a central interpretive claim, then develop the reasoning that makes it defensible.')+method('en',[
      ['Group findings around the answer they help develop','Select the patterns that matter to each research question. Bring related findings together and give the central findings sufficient space.'],
      ['State what the finding helps us understand','Use that interpretation as the controlling idea of the paragraph or subsection. Recall the specific evidence needed to support it.'],
      ['Develop the reasoning around that idea','Explain possible reasons, use theory and literature to examine the interpretation, and consider contradictory evidence or limitations where they change the claim.'],
      ['Show why the answer matters','Identify what becomes clearer, the contribution to knowledge and the implications that follow. Connect the next subsection to the developing answer.'],
    ])+check('en','Paragraph functions can be combined and reordered. A strong paragraph has a central idea and visible links between evidence, interpretation and explanation; a complex argument may need several paragraphs.'),prose('由研究提問及回答它的重要發現開始。每個小節建立一項中心詮釋，再發展使它有理據的推理。')+method('zh',[
      ['按有助發展的答案組織發現','選出對各研究提問重要的模式，把相關發現放在一起，給核心發現足夠篇幅。'],
      ['指出發現幫助理解甚麼','以此詮釋作為段落或小節的中心意思，重提支持它所需的具體證據。'],
      ['圍繞中心意思發展推理','解釋可能成因，運用理論及文獻檢視詮釋；在矛盾證據或限制改變主張之處處理它們。'],
      ['說明答案為何重要','指出甚麼變得清楚、對知識有何貢獻，以及可推導甚麼啟示，再把下一小節連回逐步形成的答案。'],
    ])+check('zh','各項功能可結合及調整次序。有力段落有中心意思，並清楚連結證據、詮釋及解釋；複雜論證可能需要數段。')),
  },
  {
    key:'interpret-findings',part:stageA,title:c('How to interpret a finding','如何詮釋研究發現'),
    body:c(prose('Interpretation explains what a finding means for the research question. Choose the kind of meaning the evidence can support. Several routes may contribute to the same argument.')+table(['Route','How to develop the interpretation','What to check'],[
      ['Substantive meaning','Translate the observed pattern into an answer about the phenomenon. For numerical results, explain direction, magnitude and uncertainty in the context of the measure.','Does the interpretation retain the outcome, participants and precision of the finding?'],
      ['Explanatory meaning','Identify a process that could account for the pattern. Explain the connection and state whether it is supported or still a possibility.','Which evidence bears on the process? Could other processes produce the same pattern?'],
      ['Theoretical meaning','Relate the finding to a specific concept or proposition. Explain whether it supports, refines or challenges the expected relationship.','Is the concept appropriate, and was the relevant relationship actually examined?'],
      ['Contextual or developmental meaning','Use contrasts across cases, settings or time to explain conditions, experiences or change.','What makes the cases or observations comparable? Where does the interpretation apply?'],
      ['Synthetic meaning','Consider related findings together and state the understanding that their combination makes possible.','Can the findings be connected through linked cases, timing or a justified analytic argument?'],
    ])+check('en','A p value, theme label or quotation needs an explanation of its substantive meaning. Distinguish the observed pattern, participants’ accounts and the researcher’s interpretation.')+example('develop','en',[0]),prose('詮釋說明發現對研究提問有甚麼意義。選擇證據能支持的理解方式；同一論證可結合數種途徑。')+table(['途徑','如何發展詮釋','需要檢視甚麼'],[
      ['實質意義','把觀察模式轉化為關於研究現象的答案；量化結果須按測量情境解釋方向、幅度及不確定性。','有否保留發現所涉及的結果、對象及精確程度？'],
      ['解釋性意義','指出可能產生模式的過程，交代其連結，以及已有支持還是仍屬可能。','甚麼證據涉及此過程？其他過程能否產生相同模式？'],
      ['理論意義','把發現連結至具體概念或命題，解釋它如何支持、修正或挑戰預期關係。','概念是否適切？研究有否實際檢視相關關係？'],
      ['情境或發展意義','利用跨個案、情境或時間的對照，理解條件、經驗或變化。','個案或觀察為何可比較？詮釋適用於何處？'],
      ['綜合意義','把相關發現放在一起，指出結合之後能形成甚麼理解。','能否以相連個案、時序或有理據的分析論證建立連結？'],
    ])+check('zh','p 值、主題標籤或引文，仍需說明實質意義。區分觀察模式、參與者報告及研究者詮釋。')+example('develop','zh',[0])),
  },
  {
    key:'develop-explanations',part:stageA,title:c('How to develop and examine explanations','如何發展及檢視解釋'),
    body:c(prose('Once the meaning is clear, ask why the pattern might have occurred. Develop an explanation through a chain of reasoning and give plausible alternatives a fair examination.')+method('en',[
      ['Formulate a possible process','Draw on theory, prior research, contextual knowledge and participants’ accounts. Explain how the process could produce the finding, including the intermediate steps.'],
      ['Identify evidence that would distinguish explanations','Ask what each explanation would lead you to expect. Examine the relevant observations, case contrasts, estimates, time order or linked sources.'],
      ['Examine credible rivals and contrary evidence','Consider other influences, measurement explanations and cases that do not fit. Judge them using evidence appropriate to the design.'],
      ['State the evidential status','Explain which account is better supported, which remains plausible and which the study cannot distinguish. Identify a focused follow-up if decisive evidence is missing.'],
    ])+check('en','An association establishes a relationship within the design’s assumptions. A participant’s reported reason is an account to interpret. A causal explanation needs a design and evidence that address alternative causes.')+example('develop','en',[1]),prose('意義清楚之後，再追問模式為何可能出現。以推理鏈發展解釋，並公平檢視合理的其他解釋。')+method('zh',[
      ['提出可能過程','運用理論、既有研究、情境理解及參與者報告，解釋過程如何產生發現，包括中間步驟。'],
      ['辨認能區分解釋的證據','各種解釋預期看見甚麼？檢視相關觀察、個案對照、估計、時間先後或相連來源。'],
      ['檢視可信的其他解釋及相反證據','考慮其他影響、測量解釋及不符合的個案，按設計適用的證據作判斷。'],
      ['交代證據狀態','指出哪項解釋較有支持、哪項仍屬可能，以及研究無法區分甚麼。若缺少關鍵證據，提出聚焦的後續研究。'],
    ])+check('zh','關聯在設計假設下建立變項關係；參與者報告的原因仍需詮釋；因果解釋需要能處理其他原因的設計與證據。')+example('develop','zh',[1])),
  },
  {
    key:'theory-synthesis',part:stageA,title:c('How to build a coherent account','如何建立連貫的解釋'),
    body:c(prose('An explanation becomes more useful when it connects the findings. Use theory or a conceptual account to clarify those connections, then show what the evidence does to that account. Inductive and descriptive studies can develop a grounded account without testing a named theory.')+method('en',[
      ['Connect the relevant findings','Identify the shared question and explain how the findings complement, qualify or contradict each other. In mixed methods, show what the combination adds beyond the separate findings.'],
      ['Specify the conceptual relationship','Name the concept or proposition that explains the connection in plain language. State what pattern it would lead you to expect.'],
      ['Examine the relationship against the evidence','Explain whether the evidence supports the account, identifies a condition, challenges an assumption or suggests a new relationship to investigate.'],
      ['State the integrated understanding','Bring the findings into a substantive answer and retain differences that materially change it. Explain how the account reaches beyond the individual observations.'],
    ])+check('en','A theory citation supplies a source; the argument must explain the link. Consistency with a theory supports a bounded interpretation, while stronger claims require stronger tests.')+example('synthesis','en'),prose('解釋能連起不同發現時，會更有理解力。以理論或概念解釋釐清連結，再說明證據如何支持或改變它。歸納性及描述性研究可以建立有資料根據的解釋，毋須一律檢驗具名理論。')+method('zh',[
      ['連結相關發現','辨認共同提問，說明發現如何互相補充、限定或矛盾；混合方法須交代結合後比各自報告增加了甚麼。'],
      ['指出概念關係','用清楚語言交代能解釋連結的概念或命題，以及按它預期看見甚麼。'],
      ['以證據檢視關係','解釋證據支持了甚麼、辨識了哪些條件、挑戰了哪項假設，或提出甚麼有待探究的新關係。'],
      ['交代整合理解','把發現綜合成實質答案，保留會改變它的差異，說明整體解釋如何超越逐項觀察。'],
    ])+check('zh','理論引文提供來源；論證仍須解釋連結。與理論一致支持有範圍的詮釋，更強的主張需要更有力的檢驗。')+example('synthesis','zh')),
  },
  {
    key:'engage-literature',part:stageB,title:c('How to engage with existing literature','如何回應既有文獻'),
    body:c(prose('The developing answer now enters the scholarly conversation. Choose the specific earlier claim relevant to your finding, establish what is comparable, and explain how the relationship changes the interpretation.')+table(['Relationship','How to develop the comparison','What the reader should learn'],[
      ['Supports','Identify the shared pattern and show that the constructs, outcomes and conditions are sufficiently comparable.','How the present evidence strengthens confidence in a particular understanding.'],
      ['Extends','State what earlier work established, then identify the additional process, setting, period or outcome examined here.','What becomes clearer beyond the earlier account and why that addition matters.'],
      ['Qualifies','Identify the condition or distinction that changes when or for whom the earlier claim holds.','A more precise account of the relationship and its boundaries.'],
      ['Challenges','Establish the actual discrepancy, examine its robustness and compare plausible methodological or substantive explanations.','Which claim needs reconsideration and what remains unresolved.'],
    ])+method('en',[
      ['Build the comparison around an idea','State the earlier claim, relate the current finding to it, and explain the meaning of that relationship. Use citations to support each step.'],
      ['Check the basis for comparison','Inspect the relevant methods and results. Distinguish differences in concepts, measures, populations, tasks, settings and timing from differences in the substantive phenomenon.'],
    ])+check('en','The explanation of the relationship carries the argument. Agreement alone needs a reason to matter; disagreement needs investigation before a stronger conclusion follows.'),prose('逐步形成的答案現在進入學術對話。選出與發現相關的具體既有主張，建立比較基礎，再解釋兩者關係如何改變詮釋。')+table(['關係','如何發展比較','讀者應多理解甚麼'],[
      ['支持','指出共同模式，核對構念、結果及條件是否足夠可比。','本研究證據如何加強對某項理解的信心。'],
      ['延伸','交代先前工作已建立甚麼，再指出新增檢視的過程、情境、時段或結果。','比既有解釋多釐清了甚麼，以及為何重要。'],
      ['限定','辨認使既有主張的適用時間或對象有所改變的條件或區別。','對關係及其界線更精確的理解。'],
      ['挑戰','建立實際差異，檢視穩健性，並比較合理的方法或實質解釋。','哪項主張需要重新考慮，以及甚麼仍未解決。'],
    ])+method('zh',[
      ['圍繞概念建立比較','交代既有主張，把目前發現連結至它，再解釋此關係的意義，以引文支持各步。'],
      ['核對比較基礎','檢視相關方法及結果，區分概念、測量、對象、任務、情境及時間差異，以及現象本身的差異。'],
    ])+check('zh','解釋關係才能推進論證。一致仍須說明為何重要；不同則需要先探究，才可形成更強結論。')),
  },
  {
    key:'different-findings',part:stageB,title:c('When findings differ from earlier research','發現與既有研究不同時，怎樣處理？'),
    body:c(prose('A difference is a question to investigate. Work out what differs, examine why, and let the available evidence determine how far the explanation can go.')+method('en',[
      ['Establish the discrepancy precisely','Identify the difference in direction, magnitude, experience, process or condition. Check estimates and uncertainty. A significant result in one study and a nonsignificant result in another do not by themselves establish a difference between the studies.'],
      ['Check whether the studies address the same question','Compare the construct, outcome, measure, participants, task, setting, design and time period. Different questions can produce different findings without directly contradicting each other.'],
      ['Develop and weigh possible explanations','Separate methodological possibilities from substantive conditions. Use evidence from the studies to explain how each difference could produce the observed contrast.'],
      ['Reach a proportionate interpretation','If a contextual explanation is supported, specify the condition it reveals. If the studies cannot distinguish explanations, state the unresolved discrepancy and the evidence needed to resolve it.'],
    ])+check('en','Label an untested explanation as a possibility. A new setting becomes a contribution when the comparison shows what that setting changes in the understanding.')+example('literature','en'),prose('差異是一項需要探究的問題。先弄清楚不同之處，再檢視可能原因，按證據決定解釋可推進多遠。')+method('zh',[
      ['準確建立差異','指出方向、幅度、經驗、過程或條件有何不同，檢視估計及不確定性。一項研究顯著、另一項未達顯著，本身尚未建立研究之間有差異。'],
      ['核對是否回答同一問題','比較構念、結果、測量、對象、任務、情境、設計及時段；不同提問可能產生不同發現，兩者未必直接矛盾。'],
      ['發展及衡量可能解釋','區分方法上的可能性與實質條件，以研究中的證據解釋各種差異如何可能產生所見對照。'],
      ['形成與證據相稱的詮釋','若有證據支持情境解釋，指出它揭示的條件；若無法區分解釋，交代未解決差異，以及需要甚麼證據才可釐清。'],
    ])+check('zh','尚未檢驗的解釋須標示為可能。比較能顯示新情境改變了甚麼理解時，這個情境才形成具體貢獻。')+example('literature','zh')),
  },
  {
    key:'qualify-claims',part:stageB,title:c('How to handle exceptions and limitations','如何處理例外證據與研究限制'),
    body:c(prose('The same scrutiny applies within the study. Contrary evidence tests the explanation; a limitation affects a particular inference. Work through their consequences so the reader can judge the answer’s reach.')+table(['What needs attention','How to reason through it','How the claim may change'],[
      ['A case or finding that does not fit','Check its credibility and context, compare it with the broader evidence, and examine whether it reveals a condition or another process.','Refine the explanation, restrict its reach or reconsider it if the contrary evidence undermines the central claim.'],
      ['A design, data or analysis limitation','Name the affected inference and explain how the constraint changes confidence in the claim. Specify what the evidence still supports.','Qualify the causal, measurement, process or transfer claim that is affected; preserve the supported understanding.'],
    ])+method('en',[
      ['Make the consequence explicit','Connect the evidence or constraint to the specific claim. Explain why it matters to the main argument and how consequential it is.'],
      ['Link any follow-up to the uncertainty','Propose the observation, comparison, measure or design that would address the remaining question. Keep the proposal proportionate to what is unresolved.'],
    ])+check('en','A list of limitations leaves their effect unclear. Explain the affected inference and its consequence at the relevant point in the argument.')+example('exceptions','en')+example('limitations','en'),prose('同樣的檢視亦適用於研究內部。相反證據檢驗解釋，限制影響具體推論。說清楚後果，讀者才能判斷答案的適用範圍。')+table(['需要關注甚麼','如何推理','主張可能如何改變'],[
      ['不符合的個案或發現','核對可信程度與背景，與整體證據比較，檢視它是否揭示條件或另一過程。','修正解釋、收窄範圍；若相反證據動搖核心主張，則重新考慮。'],
      ['設計、資料或分析限制','指出受影響推論，解釋限制如何改變主張的可信程度，交代證據仍支持甚麼。','限定受影響的因果、測量、過程或轉用主張，保留有支持的理解。'],
    ])+method('zh',[
      ['清楚交代後果','把證據或限制連結至具體主張，解釋它為何影響主要論證，以及影響有多重要。'],
      ['把後續研究連結至不確定性','提出能回應餘下問題的觀察、比較、測量或設計，使建議與未解決之處相稱。'],
    ])+check('zh','只列限制仍未交代影響；須在相關論證處說明受影響推論及其後果。')+example('exceptions','zh')+example('limitations','zh')),
  },
  {
    key:'significance-contribution',part:stageC,title:c('How to develop significance and contribution','如何發展重要性與研究貢獻'),
    body:c(prose('Once the answer has been examined, establish what it adds. Contribution identifies the particular addition to knowledge; significance explains why that addition matters for a problem, concept or decision.')+method('en',[
      ['Return to the established problem','Use the Introduction and relevant literature to state what was understood before and what remained uncertain.'],
      ['Identify the addition the findings support','Specify the new pattern, more credible estimate, process, distinction, condition, theoretical refinement or methodological insight. Connect it to the actual evidence.'],
      ['Explain the change in understanding','Show how the addition makes the previous account more complete, precise or appropriately bounded. This is how the contribution advances the argument.'],
      ['Explain why the change matters','Identify the scholarly question or practical decision affected and explain the consequence. Keep the importance proportional to the design and evidence.'],
    ])+check('en','A new location or a claim to “fill a gap” needs an explanation of what becomes clearer. Substantive significance concerns importance; statistical significance concerns a statistical test.')+example('significance','en'),prose('答案經過檢視之後，再建立它增加了甚麼。貢獻指出對知識的具體新增部分；重要性解釋新增理解對問題、概念或決策為何重要。')+method('zh',[
      ['回到已建立的問題','運用引言及相關文獻，交代先前已理解甚麼、仍有甚麼不確定。'],
      ['指出發現支持的新增部分','具體交代新模式、更可信的估計、過程、區別、條件、理論修正或方法理解，連結實際證據。'],
      ['解釋理解如何改變','說明新增部分如何使原有解釋更完整、精確或界線更恰當，藉此展示貢獻如何推進論證。'],
      ['解釋改變為何重要','指出受影響的學術提問或實務決策，說明後果，使重要性與設計及證據相稱。'],
    ])+check('zh','新地點或「填補空白」的說法，仍須解釋甚麼變得更清楚。實質重要性關注意義；統計顯著性涉及統計檢驗。')+example('significance','zh')),
  },
  {
    key:'derive-implications',part:stageC,title:c('How to derive justified implications','如何推導有理據的啟示'),
    body:c(prose('Implications develop what follows from the answer. Trace each recommendation to a finding and explain why the proposed response is warranted.')+method('en',[
      ['Identify the finding and its consequence','State the problem or possibility made visible by the evidence and explain the reasoning connecting it to a response.'],
      ['Name the actor and action','For practice, specify who could do what. For research, specify the unresolved question and the study that could address it.'],
      ['State the conditions','Explain the setting, resources, support or assumptions needed for the response to make sense. Consider who or what falls outside its scope.'],
      ['Propose an appropriate level of action and evaluation','An untested suggestion can be piloted and assessed. Stronger recommendations require evidence of effectiveness and applicability. Explain what evidence would show whether the proposed action helps.'],
    ])+check('en','The action should address the problem identified by the findings. “More research is needed” becomes useful when it names the uncertainty and a way to investigate it.')+example('implications','en'),prose('啟示發展由答案可推導甚麼。把每項建議追溯至發現，解釋所提回應為何有理據。')+method('zh',[
      ['辨認發現及其後果','指出證據揭示的問題或可能性，解釋它與建議回應之間的推理。'],
      ['指出行動者及行動','實務方面說明誰可做甚麼；研究方面指出未解決提問，以及可回應它的研究。'],
      ['交代成立條件','解釋所需情境、資源、支援或假設，考慮哪些人或情況超出範圍。'],
      ['提出適當程度的行動及評估','尚未檢驗的建議可先試行及評估；更強建議需要成效及適用性證據，並交代如何判斷建議行動是否有幫助。'],
    ])+check('zh','行動應回應發現辨識的問題。「需要更多研究」要指出不確定性及探究方式，才有具體用途。')+example('implications','zh')),
  },
  {
    key:'build-conclusion',part:stageD,title:c('How to construct the Conclusion','如何建立結論'),
    body:c(prose('The Discussion has developed the answer in detail. The Conclusion now brings the established reasoning together at the level of the whole study. Select the ideas needed to communicate what is now understood and why it matters.')+table(['Function','How to develop it','How it differs from the Discussion'],[
      ['Overall answer','Return to the central research question and combine the main findings into a direct, substantive answer.','Select the understanding reached after the detailed interpretations have been examined.'],
      ['Contribution and importance','State the particular addition to knowledge and why that addition matters.','Foreground the central contribution already justified in the Discussion.'],
      ['Necessary scope','Retain the condition or uncertainty that materially affects the overall answer.','Carry forward the key qualification while keeping the detailed evaluation in the Discussion.'],
      ['Warranted consequence','Briefly state the key implication or focused next question if it is needed to understand the answer’s significance.','Use consequences that have already been developed and justified.'],
      ['Embedded takeaway','Connect these ideas into the central understanding the reader should retain.','Bring the argument to a clear close through synthesis.'],
    ])+check('en','Adapt these functions to the study’s needs. Read the Conclusion against the Introduction and final Discussion claims: the answer, contribution and scope should align.'),prose('討論已詳細發展答案；結論現在在整項研究的層面，綜合已建立的推理。選出能傳達現在理解甚麼、以及為何重要的概念。')+table(['功能','如何發展','與討論的不同工作'],[
      ['整體答案','回到核心研究提問，把主要發現結合為直接、實質的答案。','選出經過詳細詮釋及檢視後形成的理解。'],
      ['貢獻及重要性','說明具體新增知識，以及它為何重要。','突出討論中已有理據的中心貢獻。'],
      ['必要範圍','保留實質影響整體答案的條件或不確定性。','帶出關鍵限定，把詳細評估留在討論。'],
      ['有依據的後續意義','若有助理解答案的重要性，簡要提出關鍵啟示或聚焦的後續問題。','運用先前已發展及論證的後果。'],
      ['嵌入的核心訊息','把以上概念連成讀者應保留的中心理解。','透過綜合清楚完成論證。'],
    ])+check('zh','按研究需要組合各項功能。把結論與引言及討論的最終主張核對：答案、貢獻及範圍應相互配合。')),
  },
  {
    key:'takeaway',part:stageD,title:c('How the Conclusion delivers its takeaway','結論如何形成核心訊息'),
    body:c(prose('A takeaway is the central understanding the reader should retain after the details. A summary selects the main points; synthesis explains what they amount to together. The takeaway is embedded in that synthesis and can develop across the ending paragraph.')+method('en',[
      ['Choose the central understanding','Identify the answer that connects the important findings to the original problem.'],
      ['Keep the relationship that makes it informative','State the process, distinction or condition that the study has clarified and why it matters. This gives the ending substantive content.'],
      ['Retain the scope that keeps it accurate','Keep a necessary qualification within the synthesis. Make every part traceable to the evidence and reasoning already developed.'],
      ['Let the ending crystallise the answer','Read the Conclusion as a connected whole. Its final statement should make the established understanding clear to a reader who will not retain every detail.'],
    ])+check('en','If the ending needs a new result, causal claim or undeveloped recommendation to work, revise the claim or develop the missing argument earlier. In the example, read all three paragraphs together before selecting “Takeaway”.')+example('conclusion','en'),prose('核心訊息是細節之後，讀者應保留的中心理解。摘要選取重點；綜合解釋這些重點放在一起代表甚麼。核心訊息嵌入這項綜合，可以在結尾段落中逐步發展。')+method('zh',[
      ['選出中心理解','辨認能把重要發現連回原始問題的答案。'],
      ['保留使答案有內容的關係','交代研究釐清的過程、區別或條件，以及為何重要，使結尾具實質內容。'],
      ['保留使答案準確的範圍','把必要限定納入綜合，使各部分可追溯至先前已發展的證據及推理。'],
      ['讓結尾凝聚答案','把結論讀成相連整體，讓最後陳述向未必記得全部細節的讀者清楚傳達已建立的理解。'],
    ])+check('zh','若結尾需要新結果、新因果主張或尚未發展的建議才成立，應修正主張或在前文補足論證。閱讀例子時，先把三段連起來看，再點選核心訊息。')+example('conclusion','zh')),
  },
  {
    key:'thank-you',part:c('Discussion and Conclusion','討論與結論'),title:c('Thank you','謝謝'),spacious:true,
    body:c(`<div class="export-actions"><a class="lesson-pdf-link" href="${withBase('/teaching/courses/dedc02/discussion-conclusion-en.pdf')}" download>Download lesson PDF (English)</a><a class="lesson-pdf-link" href="${withBase('/teaching/courses/dedc02/discussion-conclusion-zh.pdf')}" download>Download lesson PDF (中文)</a></div>`+'<div class="export-actions"><button type="button" data-print>Print this lesson</button><button type="button" data-export data-previous-responses hidden>Download previously saved responses</button></div><p data-export-status role="status"></p>',`<div class="export-actions"><a class="lesson-pdf-link" href="${withBase('/teaching/courses/dedc02/discussion-conclusion-en.pdf')}" download>下載課堂 PDF（英文）</a><a class="lesson-pdf-link" href="${withBase('/teaching/courses/dedc02/discussion-conclusion-zh.pdf')}" download>下載課堂 PDF（中文）</a></div>`+'<div class="export-actions"><button type="button" data-print>列印本課</button><button type="button" data-export data-previous-responses hidden>下載先前保存的回應</button></div><p data-export-status role="status"></p>'),
  },
];
