// Teaching adaptations and instructor-developed analyses; source links accompany the slides.
export const approaches = [
  {
    "id": "inductive",
    "en": {
      "name": "Inductive · build codes from the data",
      "route": "Data → codes → patterns",
      "question": "What actions or meanings would you label before choosing a theory?",
      "explanation": "Read closely and create provisional labels for relevant meanings. Compare segments and refine the labels as you examine more material.",
      "check": "Which words support each code? What assumptions shape what you notice?"
    },
    "zh": {
      "name": "歸納 · 從資料建立代碼",
      "route": "資料 → 代碼 → 模式",
      "question": "選擇理論之前，你會標記哪些行動或意義？",
      "explanation": "細讀資料，為相關意義建立初步標籤；比較片段，隨著閱讀更多資料修訂標籤。",
      "check": "哪些字句支持各代碼？你的假設如何影響注意焦點？"
    }
  },
  {
    "id": "deductive",
    "en": {
      "name": "Deductive · apply a starting framework",
      "route": "Concepts → code definitions → data",
      "question": "What concepts would you define before coding, and what evidence would count for each?",
      "explanation": "Begin with codes informed by theory, prior research or the research question. Define their boundaries and examine which segments fit. Record material that the framework leaves unexplained.",
      "check": "Can you justify the framework? Have you forced a passage into a code?"
    },
    "zh": {
      "name": "演繹 · 應用起始框架",
      "route": "概念 → 代碼定義 → 資料",
      "question": "編碼前會界定哪些概念？甚麼證據符合各概念？",
      "explanation": "由理論、既有研究或研究問題建立起始代碼，界定其邊界，再檢視哪些片段符合；記錄框架未能解釋的資料。",
      "check": "框架有何依據？有否強行把片段歸入代碼？"
    }
  },
  {
    "id": "abductive",
    "en": {
      "name": "Abductive · explain a surprising finding",
      "route": "Puzzle ↔ possible explanations ↔ further evidence",
      "question": "What surprises you? Which competing explanations could account for it?",
      "explanation": "Move between observations and theoretical ideas to propose a plausible explanation. Compare alternatives and seek evidence that could strengthen, revise or challenge it.",
      "check": "What evidence could separate the alternatives? Keep the explanation provisional."
    },
    "zh": {
      "name": "溯因 · 解釋出乎意料的發現",
      "route": "疑問 ↔ 可能解釋 ↔ 進一步證據",
      "question": "甚麼令你意外？哪些相互競爭的解釋可能說明它？",
      "explanation": "在觀察與理論概念之間往返，提出合理解釋；比較替代解釋，尋找能支持、修訂或挑戰它的證據。",
      "check": "甚麼證據能區分各解釋？保持解釋的暫定性。"
    }
  }
] as const;
export const segments = [
  {
    "id": "R1",
    "en": "Working at home made finishing the working day difficult; the separation from personal time weakened.",
    "zh": "在家工作後，很難結束工作日，工作與私人時間的分界變弱。",
    "codeEn": "Difficulty ending work",
    "codeZh": "難以結束工作",
    "deductiveEn": "Time boundaries: separation of work and personal time",
    "deductiveZh": "時間邊界：工作與私人時間的分隔"
  },
  {
    "id": "R2",
    "en": "Questions that colleagues once answered informally now involved waiting for replies.",
    "zh": "同事過去能隨口回答的問題，現在要等候回覆。",
    "codeEn": "Waiting for colleague responses",
    "codeZh": "等候同事回覆",
    "deductiveEn": "Coordination: getting information to work together",
    "deductiveZh": "協作：取得共同工作所需資訊"
  },
  {
    "id": "R3",
    "en": "Remote meetings made it harder to read reactions and sustain involvement.",
    "zh": "遙距會議令人更難察覺反應，亦較難維持參與。",
    "codeEn": "Losing interaction cues",
    "codeZh": "失去互動線索",
    "deductiveEn": "Coordination: sustaining interaction during joint work",
    "deductiveZh": "協作：維持共同工作中的互動"
  },
  {
    "id": "R4",
    "en": "Living alone intensified the absence of everyday conversations with colleagues.",
    "zh": "獨居令缺少同事日常交談的感受更強烈。",
    "codeEn": "Missing informal company",
    "codeZh": "缺少非正式陪伴",
    "deductiveEn": "Social connection: everyday contact and belonging",
    "deductiveZh": "社會連繫：日常接觸與歸屬感"
  },
  {
    "id": "R5",
    "en": "Flexible arrangements and avoiding travel to the office were still valued.",
    "zh": "仍然重視靈活安排，以及省去往返辦公室的交通。",
    "codeEn": "Valuing flexibility and saved travel",
    "codeZh": "重視靈活安排及節省交通",
    "deductiveEn": "Working conditions: practical benefits and constraints",
    "deductiveZh": "工作條件：實際好處與限制"
  }
] as const;
export const phases = [
  {
    "en": {
      "name": "Familiarise",
      "question": "What tensions do you notice before coding?",
      "output": "Memo: convenience sits alongside difficulty stopping work and reduced everyday contact. Re-read the full source before interpreting isolated lines."
    },
    "zh": {
      "name": "熟悉資料",
      "question": "編碼之前注意到哪些張力？",
      "output": "備忘：便利與難以停止工作、日常接觸減少同時存在。詮釋個別句子前，重讀完整來源。"
    }
  },
  {
    "en": {
      "name": "Generate initial codes",
      "question": "Which phrase or sentence supports your label?",
      "output": "Use R1–R5 to justify provisional codes. The preceding table shows one inductive pass. Revisit boundaries and allow several relevant codes on a segment."
    },
    "zh": {
      "name": "建立初始代碼",
      "question": "哪個片語或句子支持你的標籤？",
      "output": "以R1至R5說明初步代碼的依據。上一頁示範一次歸納編碼；重新檢視邊界，同一片段可有多個相關代碼。"
    }
  },
  {
    "en": {
      "name": "Develop candidate themes",
      "question": "What central meaning could connect the codes?",
      "output": "R1 + R5 → candidate idea: freedom over workplace can coexist with difficulty ending work. R2–R4 → candidate idea: everyday connection requires more deliberate effort."
    },
    "zh": {
      "name": "發展候選主題",
      "question": "甚麼核心意義能連繫各代碼？",
      "output": "R1＋R5 → 候選概念：工作地點的自由可能與難以結束工作並存。R2至R4 → 候選概念：日常連繫需要更刻意的投入。"
    }
  },
  {
    "en": {
      "name": "Review and develop",
      "question": "Where does the candidate idea fit, and where might it fail?",
      "output": "Return to every segment and the fuller dataset. Compare people whose boundaries improved or who welcomed reduced contact. Keep benefits and difficulties visible; revise or split the ideas."
    },
    "zh": {
      "name": "檢視並發展",
      "question": "候選概念在哪裡成立？在哪裡可能不成立？",
      "output": "回到每個片段及更完整資料，比較時間邊界改善或歡迎減少接觸的人。保留好處與困難，修訂或拆分概念。"
    }
  },
  {
    "en": {
      "name": "Define and name",
      "question": "What does the theme explain beyond naming a topic?",
      "output": "Possible name: “A flexible workplace with an unfinished working day”. Define its focus on the relation between spatial flexibility and stopping work. Treat this as a candidate requiring broader evidence."
    },
    "zh": {
      "name": "界定並命名",
      "question": "主題如何超越話題名稱，提出解釋？",
      "output": "可能名稱：「靈活的工作地點，難以結束的工作日」。界定其焦點為地點靈活性與停止工作的關係；仍需更多資料支持。"
    }
  },
  {
    "en": {
      "name": "Write the analytic account",
      "question": "Can a reader trace your interpretation to the text?",
      "output": "Illustrative paragraph: This adapted account pairs saved travel time with difficulty ending work (R1, R5). A possible reading is that flexibility changes where work happens more readily than when it ends. Further accounts are needed to assess that interpretation."
    },
    "zh": {
      "name": "撰寫分析敘述",
      "question": "讀者能否由文本追溯你的詮釋？",
      "output": "示例段落：這個改寫敘述同時呈現節省交通時間及難以結束工作（R1、R5）。一種可能理解是，靈活安排較容易改變工作地點，卻未必能改變工作何時結束。須以更多敘述評估此詮釋。"
    }
  }
] as const;
