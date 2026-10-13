// Interview transcript supplied by the user; classroom analyses and source links accompany the slides.
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
export const interview = {
  "en": {
    "question": "Can you tell me about your experiences with remote work during the COVID-19 pandemic?",
    "paragraphs": [
      "Sure. So, when the pandemic hit, our company quickly transitioned to remote work, and it was quite a significant shift for me. At first, I was excited about the idea of working from home, but it quickly became challenging. One of the biggest issues I faced was the lack of separation between work and personal life. When I was in the office, I had a clear boundary between work and home, but now that I was working from home, it felt like I was always on the clock. It was hard to disconnect and relax.",
      "Additionally, I found communication to be much more difficult. In the office, I could easily walk over to a coworker's desk to ask a question or have a quick chat, but with everyone working remotely, it was harder to get timely responses. Meetings also became a lot less productive. Without the face-to-face interaction, it was challenging to gauge people's reactions and keep everyone engaged.",
      "Another issue was the lack of social interaction. I missed the casual conversations and camaraderie that came with being in the office. It felt isolating at times, especially since I live alone. Overall, while there were some benefits to remote work, such as the flexibility and lack of commute, I found it to be a challenging adjustment."
    ]
  },
  "zh": {
    "question": "你可以談談在COVID-19疫情期間遙距工作的經驗嗎？",
    "paragraphs": [
      "可以。疫情爆發時，我們公司很快轉為遙距工作，對我來說是相當大的轉變。起初，我對在家工作感到興奮，但很快便遇到困難。其中一個最大的問題是工作與私人生活缺少分隔。在辦公室時，工作與家庭之間有清楚的界線；但在家工作後，感覺自己一直處於工作狀態，很難抽離工作並放鬆。",
      "此外，我發現溝通困難得多。在辦公室時，我可以輕易走到同事的桌旁提問或聊幾句；但當所有人都遙距工作時，就更難得到及時回覆。會議的效率也降低了。沒有面對面的互動，很難判斷別人的反應，亦難以讓所有人保持投入。",
      "另一個問題是缺少社交互動。我懷念在辦公室時的隨意交談與同事情誼。有時感到孤立，尤其是因為我獨居。整體而言，雖然遙距工作有一些好處，例如靈活安排及無須通勤，但我覺得這是一個很難適應的轉變。"
    ]
  }
} as const;
export const segments = [
  {
    "en": "it felt like I was always on the clock",
    "zh": "感覺自己一直處於工作狀態",
    "codeEn": "Difficulty ending work",
    "codeZh": "難以結束工作",
    "deductiveEn": "Time boundaries: separation of work and personal time",
    "deductiveZh": "時間邊界：工作與私人時間的分隔"
  },
  {
    "en": "it was harder to get timely responses",
    "zh": "更難得到及時回覆",
    "codeEn": "Waiting for colleague responses",
    "codeZh": "等候同事回覆",
    "deductiveEn": "Coordination: getting information to work together",
    "deductiveZh": "協作：取得共同工作所需資訊"
  },
  {
    "en": "it was challenging to gauge people's reactions and keep everyone engaged",
    "zh": "很難判斷別人的反應，亦難以讓所有人保持投入",
    "codeEn": "Losing interaction cues",
    "codeZh": "失去互動線索",
    "deductiveEn": "Coordination: sustaining interaction during joint work",
    "deductiveZh": "協作：維持共同工作中的互動"
  },
  {
    "en": "It felt isolating at times, especially since I live alone.",
    "zh": "有時感到孤立，尤其是因為我獨居。",
    "codeEn": "Missing informal company",
    "codeZh": "缺少非正式陪伴",
    "deductiveEn": "Social connection: everyday contact and belonging",
    "deductiveZh": "社會連繫：日常接觸與歸屬感"
  },
  {
    "en": "the flexibility and lack of commute",
    "zh": "靈活安排及無須通勤",
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
      "output": "Use the participant’s phrases and sentences to justify provisional codes. The preceding table shows one inductive pass. Revisit boundaries and allow several relevant codes on a segment."
    },
    "zh": {
      "name": "建立初始代碼",
      "question": "哪個片語或句子支持你的標籤？",
      "output": "以參與者的片語及句子說明初步代碼的依據。上一頁示範一次歸納編碼；重新檢視邊界，同一片段可有多個相關代碼。"
    }
  },
  {
    "en": {
      "name": "Develop candidate themes",
      "question": "What central meaning could connect the codes?",
      "output": "Flexibility + feeling always on the clock → candidate idea: freedom over workplace can coexist with difficulty ending work. Delayed replies + lost interaction cues + isolation → candidate idea: everyday connection requires more deliberate effort."
    },
    "zh": {
      "name": "發展候選主題",
      "question": "甚麼核心意義能連繫各代碼？",
      "output": "靈活安排＋一直處於工作狀態 → 候選概念：工作地點的自由可能與難以結束工作並存。回覆延誤＋互動線索減少＋孤立感 → 候選概念：日常連繫需要更刻意的投入。"
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
      "output": "Illustrative paragraph: The participant values “the flexibility and lack of commute” while feeling “always on the clock”. A possible reading is that flexibility changes where work happens more readily than when it ends. Further accounts are needed to assess that interpretation."
    },
    "zh": {
      "name": "撰寫分析敘述",
      "question": "讀者能否由文本追溯你的詮釋？",
      "output": "示例段落：參與者重視「靈活安排及無須通勤」，同時感到「一直處於工作狀態」。一種可能理解是，靈活安排較容易改變工作地點，卻未必能改變工作何時結束。須以更多敘述評估此詮釋。"
    }
  }
] as const;
