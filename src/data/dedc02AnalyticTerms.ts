export const workingText = [
  { id: 'T1', en: 'The workshop showed the buttons, but I did not try it until Mei sat beside me and showed me her class example.', zh: '工作坊示範了按鈕，但直到美坐在我旁邊，用她班上的例子教我，我才真正試用。' },
  { id: 'T2', en: 'I watched the recording twice. I still asked a colleague whether my feedback sounded right.', zh: '我看了兩次錄影，仍然問同事我的回饋是否恰當。' },
  { id: 'T3', en: 'The training gave me a usable routine. I tried it that afternoon and adjusted it after students responded.', zh: '培訓給了我可用的步驟。我當天下午就試用，並根據學生的反應作出調整。' },
];

export const analyticTerms = [
  { id: 'excerpt', en: 'Data excerpt', zh: '資料片段', definition: 'The participant’s or document’s words selected for analysis; keep their context and source ID.', definitionZh: '從參與者或文件選出的原文；保留其語境及來源編號。', example: '“I still asked a colleague whether my feedback sounded right.”', exampleZh: '「仍然問同事我的回饋是否恰當。」', trace: 'These are T2’s exact words, selected from the full account above.', traceZh: '這是從上方T2完整敘述選出的原話。' },
  { id: 'code', en: 'Code', zh: '代碼', definition: 'A concise analytic label attached to a meaningful segment.', definitionZh: '賦予有意義資料片段的簡短分析標籤。', example: 'Seeking peer reassurance', exampleZh: '尋求同儕確認', trace: 'This label interprets T2’s action of asking whether the feedback sounded right.', traceZh: '這個標籤詮釋T2請同事確認回饋是否恰當的行動。' },
  { id: 'category', en: 'Category', zh: '類別', definition: 'A grouping of related codes used to organise material.', definitionZh: '將相關代碼組合起來，以整理資料。', example: 'Sources of support', exampleZh: '支援來源', trace: 'Groups learning through peer modelling (T1), seeking peer reassurance (T2) and using a training routine (T3).', traceZh: '組合「透過同儕示範學習」（T1）、「尋求同儕確認」（T2）及「運用培訓步驟」（T3）等代碼。' },
  { id: 'topic', en: 'Topic', zh: '話題', definition: 'The subject the material discusses; it can serve as a descriptive heading.', definitionZh: '資料談及的議題，可用作描述性標題。', example: 'Teacher training', exampleZh: '教師培訓', trace: 'Names the subject discussed through the workshop (T1), recording (T2) and training routine (T3).', traceZh: '概括工作坊（T1）、錄影（T2）及培訓步驟（T3）所涉及的議題。' },
  { id: 'theme', en: 'Theme', zh: '主題', definition: 'In interpretive thematic analysis, a patterned meaning organised around a central idea that answers the research question.', definitionZh: '在詮釋性主題分析中，由核心概念統整、能回答研究問題的意義模式。', example: 'When formal guidance leaves uncertainty, teachers turn to peers to make the tool usable.', exampleZh: '正式指引仍留下不確定時，教師透過同儕協助把工具轉化為可用的實踐。', trace: 'A provisional interpretation of T1 and T2. T3 shows that training can also support use directly; explore the pattern and its limits with fuller data.', traceZh: '這是對T1與T2的暫定詮釋。T3顯示培訓也可直接支持試用；須以更完整資料檢視此模式及其適用範圍。' },
];

export const termMatches = ['topic', 'code', 'excerpt', 'theme', 'category'].map((id) => analyticTerms.find((term) => term.id === id)!);
