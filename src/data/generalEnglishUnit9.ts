import type { UnitSlide, Text } from './generalEnglishUnit5';
export type Unit9Field = { key: string; label: Text; hint: string; rows: number };
export type Unit9Slide = UnitSlide & { id: string; fields?: Unit9Field[]; timeline?: Text[]; teacher?: Text; export?: boolean; mat?: 'jobs' | 'timeline'; game?: 'phrases' | 'viewpoint' | 'tone'; quotePairs?: { title: Text; quotes: { speaker: string; quote: string; cue: string; note: Text }[] }[] };
export type Unit9Session = { number: number; slug: string; title: Text; sections: string; pages: string; outcome: Text; slides: Unit9Slide[] };
export const unit9Sessions: Unit9Session[] = [
  {
    "number": 1,
    "slug": "skills-and-opportunities",
    "title": {
      "en": "Jobs, skills and my life story",
      "zh": "職業、技能與我的人生故事"
    },
    "sections": "9A",
    "pages": "104–107",
    "outcome": {
      "en": "Explain a job and its skills, identify work priorities, and share a five-event story using the past perfect.",
      "zh": "說明職業及技能、辨認工作取向，並用過去完成式分享五事件故事。"
    },
    "slides": [
      {
        "minutes": 3,
        "title": {
          "en": "Jobs, skills and my life story",
          "zh": "職業、技能與我的人生故事"
        },
        "lead": {
          "en": "Two hands-on tasks. Two things each person will share.",
          "zh": "兩項操作活動，每人分享兩項個人成果。"
        },
        "cover": true,
        "columns": [
          {
            "title": {
              "en": "Task 1: explain a job",
              "zh": "活動一：說明職業"
            },
            "lines": [
              {
                "en": "Build a job spider with your group. Explain one job, two useful skills and your own work preference.",
                "zh": "與小組製作職業蜘蛛圖，說明一個職業、兩項技能及個人工作取向。"
              }
            ]
          },
          {
            "title": {
              "en": "Task 2: tell your story",
              "zh": "活動二：講述故事"
            },
            "lines": [
              {
                "en": "Build your own five-event timeline. Connect earlier and later events in a short story.",
                "zh": "製作自己的五事件時間線，用簡短故事連起先後事件。"
              }
            ]
          }
        ],
        "handoutCue": {
          "en": "Keep the four-page handout open. Use the spider mat, a personal timeline and the cut-out cards.",
          "zh": "保持四頁講義打開，使用蜘蛛圖、個人時間線及剪裁卡。"
        },
        "links": [
          {
            "label": {
              "en": "Student handout: four pages",
              "zh": "學生講義：四頁"
            },
            "href": "/teaching/courses/general-english/unit-9/session-1/student-handout.pdf",
            "download": true
          },
          {
            "label": {
              "en": "Mats and cut-out cards",
              "zh": "操作墊及剪裁卡"
            },
            "href": "/teaching/courses/general-english/unit-9/session-1/group-mats-and-cards.pdf",
            "download": true
          }
        ],
        "id": "s1-task-1"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Collect words you can use",
          "zh": "累積能直接使用的詞句"
        },
        "lead": {
          "en": "Read the word bank, then try the sentence patterns with a partner.",
          "zh": "先讀詞庫，再與同伴練習句型。"
        },
        "ref": "9A · pp. 105–106; recycled vocabulary from Units 1, 2 and 5",
        "handoutCue": {
          "en": "Handout p.1: word bank → sentence frames → three guided items.",
          "zh": "講義第1頁：詞庫 → 句型 → 三項引導練習。"
        },
        "columns": [
          {
            "title": {
              "en": "Units 1 and 2",
              "zh": "第一、二單元"
            },
            "lines": [
              {
                "en": "calm · helpful · confident · honest · hard-working",
                "zh": "calm 冷靜 · helpful 樂於助人 · confident 自信 · honest 誠實 · hard-working 勤奮"
              },
              {
                "en": "communication · imagination · location · urban · rural",
                "zh": "communication 溝通 · imagination 想像力 · location 位置 · urban 城市 · rural 鄉郊"
              }
            ]
          },
          {
            "title": {
              "en": "Units 5 and 9",
              "zh": "第五、九單元"
            },
            "lines": [
              {
                "en": "teammate · partner · classmate · neighbour · family",
                "zh": "teammate 隊友 · partner 伙伴 · classmate 同學 · neighbour 鄰居 · family 家人"
              },
              {
                "en": "nurse · architect · chef · reporter · be part of a team",
                "zh": "nurse 護士 · architect 建築師 · chef 廚師 · reporter 記者 · be part of a team 成為團隊一員"
              }
            ]
          }
        ],
        "example": "A nurse needs to be calm.\nA reporter needs to communicate clearly.\nAn architect needs imagination.",
        "practice": [
          {
            "number": 1,
            "prompt": "A nurse needs to ___ calm. (be / have)",
            "answer": "be"
          },
          {
            "number": 2,
            "prompt": "A reporter needs to ___ clearly. (communicate / communication)",
            "answer": "communicate"
          },
          {
            "number": 3,
            "prompt": "A shop manager needs good ___ skills. (communicate / communication)",
            "answer": "communication"
          }
        ],
        "steps": [
          {
            "en": "Say one new example with a partner. Keep needs to be + adjective, needs to + verb and needs + noun distinct.",
            "zh": "與同伴說一個新例子，分清 needs to be + 形容詞、needs to + 動詞及 needs + 名詞。"
          }
        ],
        "id": "s1-task-2"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Hear the job and the priority",
          "zh": "聽出職業與取向"
        },
        "lead": {
          "en": "Listen to the teacher’s four worker clues twice.",
          "zh": "聽老師讀四個工作者線索兩次。"
        },
        "handoutCue": {
          "en": "Handout p.2: choose any two speakers. Record the job, what matters and words you heard.",
          "zh": "講義第2頁：選其中兩位，記下職業、取向及聽到的詞。"
        },
        "example": "doing something I enjoy · making money\nworking close to home · being part of a team",
        "steps": [
          {
            "en": "First listen: identify the job. Second listen: notice the priority and evidence. Compare notes with a partner.",
            "zh": "第一次聽辨認職業，第二次聽取向及證據，再與同伴核對。"
          }
        ],
        "fields": [
          {
            "key": "job-listening",
            "label": {
              "en": "Two speakers: job / priority / evidence",
              "zh": "兩位說話者：職業／取向／證據"
            },
            "hint": "",
            "rows": 4
          }
        ],
        "reveal": {
          "title": {
            "en": "Check after listening",
            "zh": "聽後核對"
          },
          "lines": [
            {
              "en": "1 chef: enjoying work. 2 software developer: making money.",
              "zh": "1 廚師：喜歡自己的工作。2 軟件開發員：賺錢。"
            },
            {
              "en": "3 nurse: working close to home. 4 architect: being part of a team.",
              "zh": "3 護士：在家附近工作。4 建築師：成為團隊一員。"
            }
          ]
        },
        "teacher": {
          "en": "Read the original worker clues in teaching-notes.pdf, p.2. This task replaces Audio 53 in the revised Session 1.",
          "zh": "朗讀教學筆記PDF第2頁的原創工作者線索，本活動取代修訂後第一節的音訊53。"
        },
        "id": "s1-task-3"
      },
      {
        "minutes": 10,
        "title": {
          "en": "Build your job spider",
          "zh": "製作職業蜘蛛圖"
        },
        "lead": {
          "en": "Read the cards together. Choose four jobs and place two useful skills or qualities beside each.",
          "zh": "一起讀卡片，選四個職業，為每個配兩項有用技能或特質。"
        },
        "handoutCue": {
          "en": "Handout p.2, steps 1–3 + spider mat. Each person explains at least one match.",
          "zh": "講義第2頁步驟1–3及蜘蛛圖，每人至少解釋一項配對。"
        },
        "mat": "jobs",
        "steps": [
          {
            "en": "Put one job card in each job slot. Put two skill cards in its connected slots.",
            "zh": "每個職業框放一張職業卡，相關技能框各放一張技能卡。"
          },
          {
            "en": "Choose a quality and an action where useful. Write a repeated or new skill on a blank card.",
            "zh": "適合時，可各選一項特質及行動，用空白卡重複或新增技能。"
          },
          {
            "en": "Ask why the skill matters. More than one job can use the same skill.",
            "zh": "問這項技能為何重要，同一技能可用於多個職業。"
          }
        ],
        "id": "s1-task-4"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Turn a match into an explanation",
          "zh": "把配對變成說明"
        },
        "lead": {
          "en": "Point to the cards and explain the connection.",
          "zh": "指著卡片，說明兩者關係。"
        },
        "handoutCue": {
          "en": "Handout p.1 model and p.2 question prompts. Keep these visible.",
          "zh": "參考講義第1頁示範及第2頁提問提示，持續保留作支援。"
        },
        "example": "A reporter talks to people and writes news.\nReporters need to be honest and communicate clearly because other people rely on their information.\nI would like this job because I enjoy meeting people.",
        "steps": [
          {
            "en": "Each student asks: Why does this job need that skill? Could another job need it too?",
            "zh": "每人問：這個職業為何需要這項技能？另一職業也會需要嗎？"
          },
          {
            "en": "Check one match that your group disagreed about. Revise the reason or change the card.",
            "zh": "核對一項有分歧的配對，修改原因或更換卡片。"
          }
        ],
        "id": "s1-task-5"
      },
      {
        "minutes": 7,
        "title": {
          "en": "My job explanation",
          "zh": "我的職業說明"
        },
        "lead": {
          "en": "Prepare for two minutes. Then everyone shares for 45–60 seconds.",
          "zh": "準備兩分鐘，再由每人分享45–60秒。"
        },
        "handoutCue": {
          "en": "Handout p.2: My explanation. Use four short points, then speak from the cards or keywords.",
          "zh": "講義第2頁「My explanation」，準備四個短重點，再指卡片或用關鍵詞說明。"
        },
        "steps": [
          {
            "en": "Name the job and say what the person does. Justify two skills or qualities.",
            "zh": "說職業及工作內容，解釋兩項技能或特質。"
          },
          {
            "en": "State your work preference and a reason. A listener asks one follow-up question.",
            "zh": "表達個人取向及原因，聆聽者追問一題。"
          },
          {
            "en": "Keep one phrase you improved after feedback.",
            "zh": "保留一個收到回饋後改善的表達。"
          }
        ],
        "fields": [
          {
            "key": "job-report",
            "label": {
              "en": "My job, two skills, reasons and work preference",
              "zh": "我的職業、兩項技能、原因及工作取向"
            },
            "hint": "",
            "rows": 6
          }
        ],
        "id": "s1-task-6"
      },
      {
        "minutes": 7,
        "title": {
          "en": "Look back from a past moment",
          "zh": "從過去某一刻回望"
        },
        "lead": {
          "en": "Use the timeline to show two events, not just two verb forms.",
          "zh": "用時間線顯示兩件事的先後，不只改動詞形式。"
        },
        "ref": "9A · pp. 106–107 · Past perfect",
        "handoutCue": {
          "en": "Handout p.3: examples and verb table. Point to the earlier event before you choose the verb.",
          "zh": "講義第3頁例子及動詞表，選動詞形式前先指出較早事件。"
        },
        "timeline": [
          {
            "en": "2020 · met my best friend",
            "zh": "2020年 · 認識最好的朋友"
          },
          {
            "en": "2026 · started university",
            "zh": "2026年 · 開始大學生活"
          },
          {
            "en": "Now · telling the story",
            "zh": "現在 · 講述故事"
          }
        ],
        "example": "By the time I started university, I had already met my best friend.",
        "columns": [
          {
            "title": {
              "en": "Earlier event",
              "zh": "較早事件"
            },
            "lines": [
              {
                "en": "had + past participle: had met",
                "zh": "had + 過去分詞：had met"
              }
            ]
          },
          {
            "title": {
              "en": "Later past point",
              "zh": "較後的過去時間點"
            },
            "lines": [
              {
                "en": "past simple: started",
                "zh": "一般過去式：started"
              }
            ]
          }
        ],
        "takeaway": {
          "en": "Both events are before now. The past perfect looks back from the later past point.",
          "zh": "兩件事都在現在之前，過去完成式從較後的過去時間點回望。"
        },
        "id": "s1-task-7"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Rehearse the language first",
          "zh": "先練習所需語言"
        },
        "lead": {
          "en": "Complete the three guided items. Explain which event was earlier.",
          "zh": "完成三項引導練習，說明哪件事較早發生。"
        },
        "handoutCue": {
          "en": "Handout p.3: Try it aloud. Use the verb table and practise with a partner.",
          "zh": "講義第3頁「Try it aloud」，參考動詞表，與同伴練習。"
        },
        "practice": [
          {
            "number": 1,
            "prompt": "By the time I started university, I ___ already ___ my best friend. (meet)",
            "answer": "had / met"
          },
          {
            "number": 2,
            "prompt": "When I gave my first presentation, I ___ never ___ in front of a large group. (speak)",
            "answer": "had / spoken"
          },
          {
            "number": 3,
            "prompt": "After I moved to a new home, I ___ a neighbour. (help)",
            "answer": "helped — helping happened after moving."
          }
        ],
        "example": "By the time I ___, I had already ___.\nWhen I ___, I had ___.",
        "takeaway": {
          "en": "With before/after, past simple can also make order clear. Do not put every event in the past perfect.",
          "zh": "before／after 也可配一般過去式把先後說清楚，不必把每項事件都寫成過去完成式。"
        },
        "id": "s1-task-8"
      },
      {
        "minutes": 8,
        "title": {
          "en": "Build your five-event timeline",
          "zh": "製作五事件時間線"
        },
        "lead": {
          "en": "Choose real or imagined past events. Add ages or dates of your own.",
          "zh": "選真實或虛構的過去事件，填上自己的年齡或日期。"
        },
        "handoutCue": {
          "en": "Handout p.4, steps 1–2 + your timeline mat + event cards.",
          "zh": "講義第4頁步驟1–2、個人時間線及事件卡。"
        },
        "mat": "timeline",
        "steps": [
          {
            "en": "Choose five cards and place them before NOW, from earlier to later. Use blanks to repeat or add an event.",
            "zh": "選五張卡，按先後放在 NOW 之前；用空白卡重複或新增事件。"
          },
          {
            "en": "Make the order fit your story. Check which events happened before university or another later event.",
            "zh": "讓次序符合自己的故事，核對哪些事在大學或另一較後事件之前。"
          }
        ],
        "fields": [
          {
            "key": "timeline-events",
            "label": {
              "en": "My five events with ages or dates",
              "zh": "我的五件事及年齡或日期"
            },
            "hint": "",
            "rows": 5
          }
        ],
        "id": "s1-task-9"
      },
      {
        "minutes": 7,
        "title": {
          "en": "Find the person, place and feeling",
          "zh": "找出人物、地方及感受"
        },
        "lead": {
          "en": "Each group member answers questions about their own timeline.",
          "zh": "每位組員回答有關自己時間線的問題。"
        },
        "handoutCue": {
          "en": "Use the question bank on p.4 and the people / places / feelings bank on p.3.",
          "zh": "使用講義第4頁問題庫，以及第3頁人物、地方及感受詞庫。"
        },
        "example": "Who was with you? My best friend / a teammate / my family.\nWhere were you? In a new home / an urban area / a rural area.\nHow did you feel? I felt nervous / excited / more confident.",
        "steps": [
          {
            "en": "Point to two pairs of events. Ask what had already happened by the later event.",
            "zh": "指出兩組事件，問較後事件發生時，甚麼已經發生。"
          },
          {
            "en": "Check that your partner can identify the earlier event from your sentence.",
            "zh": "核對同伴能否從你的句子辨認較早事件。"
          }
        ],
        "id": "s1-task-10"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Prepare my life-event story",
          "zh": "準備我的人生事件故事"
        },
        "lead": {
          "en": "Use the five sentence frames, then check two time connections with a partner.",
          "zh": "使用五個句型提示，再與同伴核對兩項時間關係。"
        },
        "handoutCue": {
          "en": "Handout p.4: My five-event story. Refer to p.3 for forms; write keywords if you are ready.",
          "zh": "講義第4頁「My five-event story」，參考第3頁動詞形式；準備好時可只寫關鍵詞。"
        },
        "fields": [
          {
            "key": "timeline-story",
            "label": {
              "en": "My five-event story",
              "zh": "我的五事件故事"
            },
            "hint": "Include two past-perfect connections, a person, a place and a feeling.",
            "rows": 8
          }
        ],
        "steps": [
          {
            "en": "Choose one sentence to improve before sharing. Keep your timeline ready to point to.",
            "zh": "分享前選一句改善，準備指著時間線說明。"
          }
        ],
        "id": "s1-task-11"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Everyone tells a story",
          "zh": "每人講述故事"
        },
        "lead": {
          "en": "Take turns: 45–60 seconds each, with the timeline as your prompt.",
          "zh": "輪流分享，每人45–60秒，以時間線作提示。"
        },
        "handoutCue": {
          "en": "Handout p.4 checklist. Listeners identify the earlier event in one pair and suggest one improvement.",
          "zh": "使用講義第4頁檢查表，聆聽者指出一組事件中較早的一項，並提一項改善。"
        },
        "steps": [
          {
            "en": "Share five past events, with two earlier/later connections. Include a person, place and feeling.",
            "zh": "分享五項過去事件及兩項先後關係，加入人物、地方及感受。"
          },
          {
            "en": "Respond to feedback by saying one improved sentence aloud.",
            "zh": "按回饋，口頭說一次改善後的句子。"
          }
        ],
        "id": "s1-task-12"
      },
      {
        "minutes": 2,
        "title": {
          "en": "Keep the language you built",
          "zh": "保留你累積的語言"
        },
        "lead": {
          "en": "Finish the last two lines of your handout. Keep both individual outputs.",
          "zh": "完成講義最後兩行，保留兩項個人成果。"
        },
        "handoutCue": {
          "en": "Handout p.4: useful phrase + improved sentence. Your handout is your language record.",
          "zh": "講義第4頁：有用表達及改善後句子，講義就是你的語言記錄。"
        },
        "fields": [
          {
            "key": "session1-reflection",
            "label": {
              "en": "A useful phrase and my improved sentence",
              "zh": "一個有用表達及我的改善句子"
            },
            "hint": "",
            "rows": 4
          }
        ],
        "links": [
          {
            "label": {
              "en": "Student handout: four pages",
              "zh": "學生講義：四頁"
            },
            "href": "/teaching/courses/general-english/unit-9/session-1/student-handout.pdf",
            "download": true
          },
          {
            "label": {
              "en": "Mats and cut-out cards",
              "zh": "操作墊及剪裁卡"
            },
            "href": "/teaching/courses/general-english/unit-9/session-1/group-mats-and-cards.pdf",
            "download": true
          },
          {
            "label": {
              "en": "Teacher print and lesson notes",
              "zh": "教師列印及教學筆記"
            },
            "href": "/teaching/courses/general-english/unit-9/session-1/teaching-notes.pdf",
            "download": true
          }
        ],
        "export": true,
        "id": "s1-task-13"
      }
    ]
  },
  {
    "number": 2,
    "slug": "learning-beyond-subjects",
    "title": {
      "en": "Prepositions, tone and persuasion",
      "zh": "介詞、語氣與說服"
    },
    "sections": "9B",
    "pages": "108–109",
    "outcome": {
      "en": "Use dependent-preposition chunks, distinguish tone from viewpoint, and defend a claim with reasons and concrete support.",
      "zh": "運用依賴介詞詞組，區分語氣與立場，並用理由及具體支持論證。"
    },
    "slides": [
      {
        "minutes": 4,
        "title": {
          "en": "Prepositions, tone and persuasion",
          "zh": "介詞、語氣與說服"
        },
        "lead": {
          "en": "Does school prepare you for the world of work? Build language, read voices and make a supported claim.",
          "zh": "學校能讓你準備好進入職場嗎？累積語言、辨認聲音，再提出有支持的論點。"
        },
        "cover": true,
        "columns": [
          {
            "title": {
              "en": "Two comments, one position",
              "zh": "兩個留言，同一立場"
            },
            "lines": [
              {
                "en": "School can prepare students for teamwork when tasks require shared responsibility.",
                "zh": "當任務需要共同負責時，學校能讓學生準備好團隊合作。"
              },
              {
                "en": "Of course school prepares you. Only lazy people disagree.",
                "zh": "學校當然能讓你準備好，只有懶惰的人才不同意。"
              }
            ]
          },
          {
            "title": {
              "en": "Compare the effect",
              "zh": "比較效果"
            },
            "lines": [
              {
                "en": "Both say yes. Which wording helps you consider the claim? What support is missing?",
                "zh": "兩句都答是。哪種措辭有助你思考論點？缺少甚麼支持？"
              },
              {
                "en": "Position is the answer. Tone is the attitude expressed through wording.",
                "zh": "立場是回答；語氣是措辭表達的態度。"
              }
            ]
          }
        ],
        "handoutCue": {
          "en": "Keep the printed phrase bank and one-page handout open. The book responses are inside the games.",
          "zh": "打開列印詞庫及單頁講義；課本回應已放在遊戲內。"
        },
        "links": [
          {
            "label": {
              "en": "60-phrase print bank",
              "zh": "60個詞組列印詞庫"
            },
            "href": "/teaching/courses/general-english/unit-9/session-2/language-bank.pdf",
            "download": true
          },
          {
            "label": {
              "en": "Student handout and debate planner",
              "zh": "學生講義及辯論準備紙"
            },
            "href": "/teaching/courses/general-english/unit-9/session-2/student-handout.pdf",
            "download": true
          },
          {
            "label": {
              "en": "English–Chinese matching cards",
              "zh": "英中配對卡"
            },
            "href": "/teaching/courses/general-english/unit-9/session-2/phrase-meaning-cards.pdf",
            "download": true
          }
        ],
        "id": "s2-redesign-1"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Learn the word and its preposition together",
          "zh": "把詞與介詞一起學"
        },
        "lead": {
          "en": "Use the whole chunk, then change one detail for your own life.",
          "zh": "使用完整詞組，再改一項細節，變成自己的生活例子。"
        },
        "ref": "9B · p.108 · Dependent prepositions; review Units 1, 2, 5 and 9",
        "handoutCue": {
          "en": "Language bank p.1: the 12 starred core chunks. Handout p.1: section 1.",
          "zh": "詞庫第1頁：12個星號核心詞組；講義第1頁第1部分。"
        },
        "wordBank": [
          {
            "word": "agree with",
            "meaning": {
              "en": "agree with a classmate",
              "zh": "同意同學的看法"
            }
          },
          {
            "word": "depend on",
            "meaning": {
              "en": "depend on the job",
              "zh": "取決於職業"
            }
          },
          {
            "word": "prepare for",
            "meaning": {
              "en": "prepare for an interview",
              "zh": "準備面試"
            }
          },
          {
            "word": "learn from",
            "meaning": {
              "en": "learn from a mistake",
              "zh": "從錯誤中學習"
            }
          },
          {
            "word": "focus on",
            "meaning": {
              "en": "focus on communication",
              "zh": "專注於溝通"
            }
          },
          {
            "word": "benefit from",
            "meaning": {
              "en": "benefit from feedback",
              "zh": "從回饋中獲益"
            }
          }
        ],
        "example": "I agree with my classmate that education can develop communication skills.\nA nervous student can ask a helpful classmate for help.",
        "takeaway": {
          "en": "After a preposition: a noun, a pronoun or an -ing form. Interested in design / interested in it / interested in designing.",
          "zh": "介詞後可接名詞、代名詞或-ing形式：interested in design／interested in it／interested in designing。"
        },
        "id": "s2-redesign-2"
      },
      {
        "minutes": 8,
        "title": {
          "en": "Complete, repair and personalise",
          "zh": "填空、修正及個人化"
        },
        "lead": {
          "en": "Choose the preposition, say the whole chunk, then make a sentence.",
          "zh": "選介詞，說完整詞組，再造句。"
        },
        "handoutCue": {
          "en": "Handout p.1: eight gaps and two repairs. Use the bank, then cover it and try again.",
          "zh": "講義第1頁：八個填空及兩項修正；先用詞庫，再遮住重試。"
        },
        "practice": [
          {
            "number": 1,
            "prompt": "apply ___ a job / agree ___ a classmate",
            "answer": "for / with"
          },
          {
            "number": 2,
            "prompt": "graduate ___ school / depend ___ the job",
            "answer": "from / on"
          },
          {
            "number": 3,
            "prompt": "introduce me ___ a teammate / decide ___ a career",
            "answer": "to / on"
          },
          {
            "number": 4,
            "prompt": "prepare ___ work / learn ___ a mistake",
            "answer": "for / from"
          },
          {
            "number": 5,
            "prompt": "Repair: I agree to my classmate.",
            "answer": "I agree with my classmate."
          },
          {
            "number": 6,
            "prompt": "Repair: I am interested in learn about jobs.",
            "answer": "I am interested in learning about jobs."
          }
        ],
        "fields": [
          {
            "key": "phrase",
            "label": {
              "en": "Two personal sentences using different chunks and recycled unit words",
              "zh": "用不同詞組及複習詞彙，寫兩句自己的句子"
            },
            "hint": "",
            "rows": 4
          }
        ],
        "takeaway": {
          "en": "Agree with a person; agree on a plan; agree to a proposal. The complement helps choose the pattern.",
          "zh": "agree with a person；agree on a plan；agree to a proposal。後面的內容有助選擇配搭。"
        },
        "id": "s2-redesign-3"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Choose the correct answer",
          "zh": "選擇正確答案"
        },
        "lead": {
          "en": "Meaning, missing preposition, or use in a sentence.",
          "zh": "選擇題型：意思、缺少的介詞，或句中運用。"
        },
        "game": "phrases",
        "id": "s2-redesign-4"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Four different reading questions",
          "zh": "四個不同的閱讀問題"
        },
        "lead": {
          "en": "A position label does not explain the reason or identify the tone.",
          "zh": "立場標籤不會自動說明理由，也不等於語氣。"
        },
        "handoutCue": {
          "en": "Handout section 2: use these four questions to fill the reading grid.",
          "zh": "講義第2部分：用這四個問題填寫閱讀表。"
        },
        "table": {
          "headers": [
            {
              "en": "Look for",
              "zh": "辨認內容"
            },
            {
              "en": "Ask",
              "zh": "提問"
            }
          ],
          "rows": [
            [
              {
                "en": "Viewpoint / position",
                "zh": "觀點／立場"
              },
              {
                "en": "What is the answer: yes, no or depends?",
                "zh": "回答是：是、否，還是視乎情況？"
              }
            ],
            [
              {
                "en": "Reason",
                "zh": "理由"
              },
              {
                "en": "Why does the writer think this?",
                "zh": "作者為何這樣想？"
              }
            ],
            [
              {
                "en": "Example / experience",
                "zh": "例子／經歷"
              },
              {
                "en": "What specific case is described?",
                "zh": "描述了甚麼具體情況？"
              }
            ],
            [
              {
                "en": "Tone",
                "zh": "語氣"
              },
              {
                "en": "What attitude does the wording express? Which words show it?",
                "zh": "措辭表達甚麼態度？哪些詞顯示出來？"
              }
            ]
          ]
        },
        "example": "The position is ____. The reason is ____.\nThe tone sounds ____; the words “____” suggest ____.",
        "id": "s2-redesign-5"
      },
      {
        "minutes": 11,
        "title": {
          "en": "Group the writers’ viewpoints",
          "zh": "把作者的立場分組"
        },
        "lead": {
          "en": "Group the writers by viewpoint. Each person explains a reason for one placement.",
          "zh": "按立場分組，每人解釋一張卡片的分組理由。"
        },
        "ref": "9B · p.109 · Does school prepare you for the world of work?",
        "game": "viewpoint",
        "fields": [
          {
            "key": "expert-reading",
            "label": {
              "en": "Writers’ positions and concrete support",
              "zh": "作者立場及具體支持"
            },
            "hint": "A: … B: … C: … D: … E: … F: …",
            "rows": 6
          }
        ],
        "id": "s2-redesign-6"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Same position, different tone",
          "zh": "同一立場，不同語氣"
        },
        "lead": {
          "en": "Compare the highlighted words. Same position; different voices.",
          "zh": "比較標示的詞句：立場相同，語氣不同。"
        },
        "takeaway": {
          "en": "Point to the words that create each tone.",
          "zh": "指出形成每種語氣的詞句。"
        },
        "id": "s2-redesign-7",
        "quotePairs": [
          {
            "title": {
              "en": "Both say no",
              "zh": "都答否"
            },
            "quotes": [
              {
                "speaker": "Lydia",
                "quote": "Learning facts about Ancient Rome and Ancient China was interesting, but I haven't used them in my job.",
                "cue": "but I haven't used them",
                "note": {
                  "en": "Critical, measured",
                  "zh": "批判、平穩"
                }
              },
              {
                "speaker": "Aslan",
                "quote": "Does a firefighter learn to fight fires at school? Never!",
                "cue": "Never!",
                "note": {
                  "en": "Abrupt, dismissive",
                  "zh": "直截、不以為然"
                }
              }
            ]
          },
          {
            "title": {
              "en": "Both say yes",
              "zh": "都答是"
            },
            "quotes": [
              {
                "speaker": "Sophia",
                "quote": "By the time I graduated from high school, I had definitely learned to think. My grandmother was right!",
                "cue": "My grandmother was right!",
                "note": {
                  "en": "Warm, affirming",
                  "zh": "親切、肯定"
                }
              },
              {
                "speaker": "Paul",
                "quote": "Playing sports at school definitely provided me with a lot of teamwork skills.",
                "cue": "definitely",
                "note": {
                  "en": "Confident, emphatic",
                  "zh": "自信、強調"
                }
              }
            ]
          }
        ],
        "source": {
          "en": "Extracts: Perspectives Pre-Intermediate, Unit 9B, p.109.",
          "zh": "節錄：Perspectives Pre-Intermediate，第9B課，第109頁。"
        }
      },
      {
        "minutes": 5,
        "title": {
          "en": "Group tones, defend your reading",
          "zh": "把語氣分組，解釋你的解讀"
        },
        "lead": {
          "en": "Group by tone. Quote the words that support your choices.",
          "zh": "按語氣分組，引用支持判斷的詞句。"
        },
        "game": "tone",
        "fields": [
          {
            "key": "tone-evidence",
            "label": {
              "en": "Two tone judgements with exact wording",
              "zh": "兩項語氣判斷及確切措辭"
            },
            "hint": "The tone sounds …; the words “…” suggest …",
            "rows": 4
          }
        ],
        "id": "s2-redesign-8"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Make a claim worth supporting",
          "zh": "提出值得支持的論點"
        },
        "lead": {
          "en": "A strong claim is precise and supportable. Identify what you are actually arguing.",
          "zh": "強論點要清楚、有合理範圍，並能獲支持；先說明真正要論證甚麼。"
        },
        "handoutCue": {
          "en": "Handout section 3: plan your own argument.",
          "zh": "講義第3部分：準備自己的論證。"
        },
        "example": "School prepares students for teamwork, although job-specific training is still needed.",
        "steps": [
          {
            "en": "Say whether school means education before university or formal education more broadly. Label the level in your examples.",
            "zh": "說明 school 指大學前教育還是更廣義的正規教育，例子須註明階段。"
          },
          {
            "en": "Choose a qualified yes, no or depends. Identify the part another pair could challenge.",
            "zh": "可選有條件的是、否或視乎情況，指出另一組可以質疑哪部分。"
          }
        ],
        "id": "s2-redesign-9"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Explain why the example matters",
          "zh": "解釋例子為何重要"
        },
        "lead": {
          "en": "Connect claim → reason → concrete support → explanation → response.",
          "zh": "連起論點 → 理由 → 具體支持 → 解釋 → 回應。"
        },
        "table": {
          "headers": [
            {
              "en": "Part",
              "zh": "部分"
            },
            {
              "en": "Example",
              "zh": "示範"
            }
          ],
          "rows": [
            [
              {
                "en": "Reason",
                "zh": "理由"
              },
              {
                "en": "Many jobs depend on communication with other people.",
                "zh": "許多工作依靠與別人溝通。"
              }
            ],
            [
              {
                "en": "Reading support",
                "zh": "閱讀支持"
              },
              {
                "en": "Paul says school football developed his teamwork skills.",
                "zh": "Paul 說學校足球活動培養了團隊技能。"
              }
            ],
            [
              {
                "en": "Link",
                "zh": "關聯"
              },
              {
                "en": "Shared activities can practise coordination used in many workplaces.",
                "zh": "共同活動可練習許多職場所需的協調。"
              }
            ],
            [
              {
                "en": "Response",
                "zh": "回應"
              },
              {
                "en": "Some groups are badly organised. Clear roles can help each classmate contribute.",
                "zh": "有些小組安排欠佳，清楚分工可讓每位同學作貢獻。"
              }
            ]
          ]
        },
        "takeaway": {
          "en": "The six responses are personal views. Use them to illustrate ideas; they do not prove what all schools do.",
          "zh": "六篇回應是個人觀點，可用作說明想法，不足以證明所有學校的情況。"
        },
        "id": "s2-redesign-10"
      },
      {
        "minutes": 7,
        "title": {
          "en": "Prepare your own case",
          "zh": "準備自己的論證"
        },
        "lead": {
          "en": "Write individually, then ask a partner to test the connection between your example and claim.",
          "zh": "先獨立寫，再請同伴檢查例子與論點的關係。"
        },
        "handoutCue": {
          "en": "Handout section 3: individual argument. Handout section 3: debate roles and sentence frames.",
          "zh": "講義第3部分個人論證；第3頁辯論角色及句型。"
        },
        "steps": [
          {
            "en": "Use one named reading idea and one specific personal experience or clearly labelled imagined example.",
            "zh": "用一個註明作者的閱讀觀點，以及一個具體個人經驗或清楚註明的虛構例子。"
          },
          {
            "en": "Use at least three preposition chunks. Recycle qualities, places, people and jobs from Units 1, 2, 5 and 9.",
            "zh": "至少用三個介詞詞組，重用第1、2、5、9單元的特質、地方、人物及職業詞。"
          },
          {
            "en": "Prepare a likely objection and a response.",
            "zh": "準備一項可能異議及回應。"
          }
        ],
        "fields": [
          {
            "key": "debate-plan",
            "label": {
              "en": "Claim / reason / reading support / example / link / response",
              "zh": "論點／理由／閱讀支持／例子／關聯／回應"
            },
            "hint": "",
            "rows": 8
          }
        ],
        "id": "s2-redesign-11"
      },
      {
        "minutes": 9,
        "title": {
          "en": "Debate: convince a listener",
          "zh": "辯論：說服聆聽者"
        },
        "lead": {
          "en": "Groups of four. Two pairs defend contrasting claims. Every student opens and responds.",
          "zh": "四人一組，兩對提出不同論點；每人都開場及回應。"
        },
        "handoutCue": {
          "en": "45 seconds each. Swap roles in round 2; finish with feedback.",
          "zh": "每人45秒，第二輪交換角色，最後給回饋。"
        },
        "steps": [
          {
            "en": "Round 1: A1 and B1 open; A2 and B2 respond. Each turn is 45 seconds.",
            "zh": "第一輪：A1、B1開場，A2、B2回應，每次45秒。"
          },
          {
            "en": "Plan for one minute. Round 2: swap the opening and response roles.",
            "zh": "準備一分鐘；第二輪交換開場及回應角色。"
          },
          {
            "en": "Name the most convincing support you heard and explain why it worked.",
            "zh": "指出聽到的最有說服力支持，解釋其作用。"
          }
        ],
        "example": "I argue that … because …\nI agree with you that … . However, …\nCould you give a specific example? How does that support your claim?",
        "id": "s2-redesign-12"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Keep a stronger argument and useful language",
          "zh": "保留更好的論證及有用語言"
        },
        "lead": {
          "en": "Revise after listening. Keep the full phrase bank for later review.",
          "zh": "聆聽後修訂，保留完整詞庫供日後複習。"
        },
        "handoutCue": {
          "en": "Keep your revised claim and one useful phrase in your notebook.",
          "zh": "在筆記本保留修訂論點及一個有用詞組。"
        },
        "fields": [
          {
            "key": "exit",
            "label": {
              "en": "My revised claim and support; a useful chunk; one tone choice",
              "zh": "我的修訂論點及支持、有用詞組及語氣選擇"
            },
            "hint": "",
            "rows": 6
          }
        ],
        "links": [
          {
            "label": {
              "en": "60-phrase print bank",
              "zh": "60個詞組列印詞庫"
            },
            "href": "/teaching/courses/general-english/unit-9/session-2/language-bank.pdf",
            "download": true
          },
          {
            "label": {
              "en": "Student handout and debate planner",
              "zh": "學生講義及辯論準備紙"
            },
            "href": "/teaching/courses/general-english/unit-9/session-2/student-handout.pdf",
            "download": true
          },
          {
            "label": {
              "en": "Teaching notes and answer guide",
              "zh": "教學筆記及答案指引"
            },
            "href": "/teaching/courses/general-english/unit-9/session-2/teaching-notes.pdf",
            "download": true
          }
        ],
        "export": true,
        "id": "s2-redesign-13"
      }
    ]
  },
  {
    "number": 3,
    "slug": "messages-and-meaning",
    "title": {
      "en": "Did she actually say that?",
      "zh": "她真的這樣說嗎？"
    },
    "sections": "9C + 9D; question intonation from 9E",
    "pages": "110–114",
    "outcome": {
      "en": "Ask clear questions, report classmates’ answers accurately, and explain a listening idea about finite resources.",
      "zh": "清楚提問、準確轉述同學答案，並說明關於有限資源的聆聽觀點。"
    },
    "slides": [
      {
        "minutes": 4,
        "title": {
          "en": "Did she actually say that?",
          "zh": "她真的這樣說嗎？"
        },
        "lead": {
          "en": "Campus gossip: Maya is leaving university to become a full-time influencer!",
          "zh": "校園傳聞：Maya 要退學，當全職網紅！"
        },
        "id": "s3-1",
        "cover": true,
        "example": "Fictional group-chat message: “Maya has become a full-time influencer. She is leaving university!”",
        "steps": [
          {
            "en": "In pairs, decide: what would you ask before passing this message on?",
            "zh": "兩人討論：轉發前，你會先問甚麼？"
          }
        ],
        "reveal": {
          "title": {
            "en": "Read Maya’s original message",
            "zh": "查看 Maya 的原話"
          },
          "lines": [
            {
              "en": "“I might try making study videos this summer if I have enough time. I have not decided yet.”",
              "zh": "「如果有足夠時間，我今年暑假可能試拍學習影片。我還未決定。」"
            },
            {
              "en": "What changed: might became certain; trying videos became a full-time career; leaving university was invented.",
              "zh": "改動：可能變成確定；試拍影片變成全職事業；退學是添加的內容。"
            }
          ]
        },
        "handoutCue": {
          "en": "One sheet, two sides. Keep the question bank and change table beside you.",
          "zh": "一張紙，雙面。把問句庫及變化表放在旁邊。"
        },
        "takeaway": {
          "en": "Today: ask clearly → listen → report accurately → check with the speaker.",
          "zh": "今天：清楚提問 → 聆聽 → 準確轉述 → 跟說話者核對。"
        },
        "links": [
          {
            "label": {
              "en": "Student handout",
              "zh": "學生講義"
            },
            "href": "/teaching/courses/general-english/unit-9/session-3/student-handout.pdf",
            "download": true
          }
        ]
      },
      {
        "minutes": 3,
        "title": {
          "en": "Keep the possibility",
          "zh": "保留可能性"
        },
        "lead": {
          "en": "Repair the gossip before it travels further.",
          "zh": "先修正傳聞，再傳給別人。"
        },
        "id": "s3-2",
        "quiz": [
          {
            "prompt": {
              "en": "Which report keeps Maya’s meaning?",
              "zh": "哪個轉述保留 Maya 的原意？"
            },
            "choices": [
              {
                "en": "Maya said she would leave university.",
                "zh": "Maya said she would leave university."
              },
              {
                "en": "Maya said she might try making study videos that summer if she had enough time.",
                "zh": "Maya said she might try making study videos that summer if she had enough time."
              },
              {
                "en": "Maya said she had already become a full-time influencer.",
                "zh": "Maya said she had already become a full-time influencer."
              }
            ],
            "correct": 1,
            "feedback": {
              "en": "Keep might, the time condition and the fact that she has not decided.",
              "zh": "保留 might、時間條件及尚未決定的資訊。"
            }
          }
        ],
        "fields": [
          {
            "key": "message-repair",
            "label": {
              "en": "My accurate version",
              "zh": "我的準確版本"
            },
            "hint": "Maya said she might … if …",
            "rows": 3
          }
        ]
      },
      {
        "minutes": 3,
        "title": {
          "en": "From a dream to a job",
          "zh": "從夢想到工作"
        },
        "lead": {
          "en": "Read Carmen’s words. Find the event, age and change in her working life.",
          "zh": "讀 Carmen 的原話，找出事件、年齡及工作上的改變。"
        },
        "id": "s3-3",
        "ref": "9C · p. 110 · Photo quote; Ex. 1, 3–4",
        "example": "“I entered my first go-kart race at the age of 12 … I continued with my studies and university until I was 19. I started driving full time at age 20.”",
        "steps": [
          {
            "en": "Which age marks her first race? Which marks full-time driving?",
            "zh": "她幾歲首次參賽？幾歲開始全職駕駛？"
          },
          {
            "en": "Complete: Carmen said she had entered her first race at __ and had started driving full time at __.",
            "zh": "完成：Carmen said she had entered her first race at __ and had started driving full time at __。"
          }
        ],
        "reveal": {
          "title": {
            "en": "Check the two events",
            "zh": "核對兩件事"
          },
          "lines": [
            {
              "en": "Her first race: 12. Full-time driving: 20. The earlier past actions become had entered / had started after said.",
              "zh": "首次參賽：12歲。全職駕駛：20歲。said 後，較早的過去動作變成 had entered／had started。"
            }
          ]
        },
        "source": {
          "en": "Perspectives I · Unit 9C · p.110 · Short extract from the supplied page.",
          "zh": "Perspectives I，第9C節，第110頁；節錄自所提供課本頁。"
        }
      },
      {
        "minutes": 3,
        "title": {
          "en": "Build something worth saying",
          "zh": "準備有內容的答案"
        },
        "lead": {
          "en": "Choose two or three chunks from the handout. Use them in your interview.",
          "zh": "從講義選兩至三個詞組，在訪談中使用。"
        },
        "id": "s3-4",
        "ref": "Review: Units 1, 2, 5 and 9",
        "example": "“I want to improve my communication skills.”\n“I have not decided on a topic yet.”",
        "handoutCue": {
          "en": "Front: vocabulary and worked examples. Back: questions, roles and notes.",
          "zh": "正面：詞庫及例子；背面：問題、角色及筆記。"
        },
        "wordBank": [
          {
            "word": "confident",
            "meaning": {
              "en": "believing in your ability",
              "zh": "自信的"
            }
          },
          {
            "word": "honest",
            "meaning": {
              "en": "telling the truth",
              "zh": "誠實的"
            }
          },
          {
            "word": "communication skills",
            "meaning": {
              "en": "expressing ideas and listening",
              "zh": "溝通技巧"
            }
          },
          {
            "word": "classmate",
            "meaning": {
              "en": "someone in your class",
              "zh": "同學"
            }
          },
          {
            "word": "professional",
            "meaning": {
              "en": "working with skill and care",
              "zh": "專業的"
            }
          },
          {
            "word": "focus on",
            "meaning": {
              "en": "give attention to",
              "zh": "專注於"
            }
          },
          {
            "word": "decide on",
            "meaning": {
              "en": "choose",
              "zh": "決定"
            }
          },
          {
            "word": "do something you enjoy",
            "meaning": {
              "en": "do an activity you like",
              "zh": "做喜歡的事"
            }
          }
        ]
      },
      {
        "minutes": 3,
        "title": {
          "en": "Hear it, then pass it on",
          "zh": "先聽，再轉述"
        },
        "lead": {
          "en": "Read the short conversation. The reporters pass on the answers.",
          "zh": "讀簡短對話，報道員轉述答案。"
        },
        "id": "s3-5",
        "example": "A: What do you enjoy doing?\nB: I enjoy making videos.\nA: What have you tried before?\nB: I have helped my classmate film an event.\nC: B said they enjoyed making videos.\nD: B said they had helped a classmate film an event.",
        "steps": [
          {
            "en": "Point to one change in each report. Keep the questions as direct questions.",
            "zh": "指出每句轉述的一項變化，提問仍用直接問句。"
          }
        ],
        "takeaway": {
          "en": "Ask a question. Report the answer. Name the speaker.",
          "zh": "提出問題，轉述答案，指出誰說的。"
        }
      },
      {
        "minutes": 5,
        "title": {
          "en": "Notice what changes",
          "zh": "留意改變的部分"
        },
        "lead": {
          "en": "Compare direct statements with reports of what someone said earlier.",
          "zh": "比較直接引語與轉述別人較早說過的話。"
        },
        "ref": "9C · p. 110 · Grammar box and Ex. 2",
        "table": {
          "headers": [
            {
              "en": "Direct statement",
              "zh": "直接引語"
            },
            {
              "en": "Reported statement",
              "zh": "間接引語"
            }
          ],
          "rows": [
            [
              {
                "en": "“I enjoy organising events.”",
                "zh": "「我喜歡統籌活動。」"
              },
              {
                "en": "She said she enjoyed organising events.",
                "zh": "她說她喜歡統籌活動。"
              }
            ],
            [
              {
                "en": "“I can edit videos.”",
                "zh": "「我會剪輯影片。」"
              },
              {
                "en": "He said he could edit videos.",
                "zh": "他說他會剪輯影片。"
              }
            ],
            [
              {
                "en": "“I helped at an event.”",
                "zh": "「我曾在活動幫忙。」"
              },
              {
                "en": "She said she had helped at an event.",
                "zh": "她說她曾在活動幫忙。"
              }
            ],
            [
              {
                "en": "“I have used this app.”",
                "zh": "「我用過這個程式。」"
              },
              {
                "en": "He said he had used that app.",
                "zh": "他說他用過那個程式。"
              }
            ],
            [
              {
                "en": "“I will join the team.”",
                "zh": "「我會加入團隊。」"
              },
              {
                "en": "She said she would join the team.",
                "zh": "她說她會加入團隊。"
              }
            ]
          ]
        },
        "takeaway": {
          "en": "After said/told: present → past; past/present perfect → past perfect; can → could; will → would. Had + past participle stays the same.",
          "zh": "said／told 後：現在式 → 過去式；過去式／現在完成式 → 過去完成式；can → could；will → would。had＋過去分詞維持不變。"
        },
        "id": "s3-6"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Who is speaking to whom?",
          "zh": "誰向誰說話？"
        },
        "lead": {
          "en": "Pronouns depend on the people involved. Said and told use different patterns.",
          "zh": "代名詞取決於相關人物，said 和 told 的句型也不同。"
        },
        "example": "Mei to Alex: “I can help you.”\nAlex reports: Mei said she could help me.\nMei told me she could help me.",
        "practice": [
          {
            "number": 1,
            "prompt": "Correct: He said me that he was available.",
            "answer": "He told me that he was available. / He said that he was available."
          },
          {
            "number": 2,
            "prompt": "Alex says to you: “I have finished my part.” Report it to a third person.",
            "answer": "Alex said he had finished his part. (Use the speaker’s appropriate pronoun.)"
          },
          {
            "number": 3,
            "prompt": "“We might join if it is free.” Complete: They said they ___ join if it ___ free.",
            "answer": "might / was — preserve the possibility and condition."
          }
        ],
        "teacher": {
          "en": "A present tense may remain for information that is still true. In this task, ask questions directly and report the answers.",
          "zh": "仍然屬實的資訊可保留現在式。本活動直接提問，再轉述答案。"
        },
        "id": "s3-7"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Try, check, explain",
          "zh": "練習、核對、解釋"
        },
        "lead": {
          "en": "Change only what the reporting situation requires.",
          "zh": "只改動轉述情境需要改變的部分。"
        },
        "practice": [
          {
            "number": 1,
            "prompt": "Yesterday, Lin said: “I am busy today.” Report it now, the following day.",
            "answer": "Lin said she was busy that day."
          },
          {
            "number": 2,
            "prompt": "Yesterday, Sam said: “I will help tomorrow.” Report it today.",
            "answer": "Sam said he would help today."
          },
          {
            "number": 3,
            "prompt": "“I started learning design last year.” Report it after said.",
            "answer": "She/He said she/he had started learning design the previous year."
          },
          {
            "number": 4,
            "prompt": "“I should practise asking questions.” Report it.",
            "answer": "She/He said she/he should practise asking questions. Should normally stays should."
          }
        ],
        "steps": [
          {
            "en": "Complete two selected items from p. 110, Ex. 3–4. Explain a pronoun or tense change.",
            "zh": "選做第110頁第3–4題中的兩項，解釋一項代名詞或時態改變。"
          }
        ],
        "id": "s3-8"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Let your question sound clear",
          "zh": "讓問句聽得清楚"
        },
        "lead": {
          "en": "Listen to Audio 60. Mark the direction at the end of each question.",
          "zh": "聽音訊60，標記各問句結尾的語調方向。"
        },
        "ref": "9E · p. 114 · Ex. 4 · Audio 60",
        "example": "Is it a computing job? ↗\nWhat skills do designers need? ↘",
        "steps": [
          {
            "en": "Practise each question twice with a partner. Keep the key words clear.",
            "zh": "與同伴每題練習兩次，讓關鍵詞清楚。"
          },
          {
            "en": "Stress the key words: WHAT do you ENJOY doing? ↘ CAN you HELP on FRIDAY? ↗",
            "zh": "重讀關鍵詞：WHAT do you ENJOY doing? ↘ CAN you HELP on FRIDAY? ↗"
          }
        ],
        "takeaway": {
          "en": "Yes/no questions often rise; wh-questions often fall. Natural intonation varies with purpose.",
          "zh": "是非問句常上揚，wh 問句常下降；自然語調會按目的改變。"
        },
        "id": "s3-9"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Ask for something worth knowing",
          "zh": "提出有用問題"
        },
        "lead": {
          "en": "Choose four questions for a campus opportunity.",
          "zh": "為一項校園機會選四個問題。"
        },
        "example": "What do you enjoy doing?\nWhat have you tried before?\nWhat would you like to learn?\nWhen are you available?\nWhat support would you need?",
        "steps": [
          {
            "en": "Take turns asking. Add a follow-up: “Can you give an example?”",
            "zh": "輪流提問，再追問：「Can you give an example?」"
          }
        ],
        "id": "s3-10",
        "handoutCue": {
          "en": "Handout: choose three different question words and one yes/no question. Prepare your own answer keywords.",
          "zh": "講義：選三個不同疑問詞，再加一條是非問句，先準備自己的答案關鍵詞。"
        }
      },
      {
        "minutes": 2,
        "title": {
          "en": "Your group’s campus scoop",
          "zh": "小組校園新消息"
        },
        "lead": {
          "en": "Groups of three or four. Two people talk; the other member or members report.",
          "zh": "三至四人一組。兩人對話，其他組員轉述。"
        },
        "id": "s3-11",
        "table": {
          "headers": [
            {
              "en": "Group",
              "zh": "組別"
            },
            {
              "en": "Interview pair",
              "zh": "訪談二人"
            },
            {
              "en": "Reporters",
              "zh": "報道員"
            }
          ],
          "rows": [
            [
              {
                "en": "Four people",
                "zh": "四人"
              },
              {
                "en": "A asks B four questions.",
                "zh": "A 問 B 四條問題。"
              },
              {
                "en": "C reports answers 1–2; D reports 3–4.",
                "zh": "C 轉述答案1–2；D 轉述3–4。"
              }
            ],
            [
              {
                "en": "Three people",
                "zh": "三人"
              },
              {
                "en": "A asks B four questions.",
                "zh": "A 問 B 四條問題。"
              },
              {
                "en": "C reports three answers.",
                "zh": "C 轉述三個答案。"
              }
            ]
          ]
        },
        "steps": [
          {
            "en": "Choose a topic: becoming an influencer, a hidden talent or a campus project. Use your own information or an invented profile.",
            "zh": "選題：成為網紅、隱藏才藝或校園計劃。可用自己的資料或虛構人物。"
          },
          {
            "en": "Prepare your own answer keywords first. The handout shows every role rotation.",
            "zh": "先各自準備答案關鍵詞，講義列出每輪角色。"
          }
        ],
        "fields": [
          {
            "key": "interview-plan",
            "label": {
              "en": "My topic, questions and answer keywords",
              "zh": "我的主題、問題及答案關鍵詞"
            },
            "hint": "What / Who / Where / When / Why / How …",
            "rows": 3
          }
        ]
      },
      {
        "minutes": 12,
        "title": {
          "en": "Interview, report, rotate",
          "zh": "訪談、轉述、換角色"
        },
        "lead": {
          "en": "Use the role table on the back of the handout. Everyone interviews, answers and reports.",
          "zh": "使用講義背面的角色表。每人都要提問、回答及轉述。"
        },
        "id": "s3-12",
        "ref": "9C · p. 111 · Ex. 8–9, adapted for a group interview",
        "columns": [
          {
            "title": {
              "en": "Four people: four 3-minute rounds",
              "zh": "四人：每輪3分鐘，共四輪"
            },
            "lines": [
              {
                "en": "Interview: 75 seconds. The two reporters pass on two answers each: 45 seconds in total.",
                "zh": "訪談75秒；兩位報道員各轉述兩個答案，共45秒。"
              },
              {
                "en": "The guest checks the meaning; correct and rotate: 60 seconds.",
                "zh": "受訪者核對原意；修正及換角色，共60秒。"
              }
            ]
          },
          {
            "title": {
              "en": "Three people: three 4-minute rounds",
              "zh": "三人：每輪4分鐘，共三輪"
            },
            "lines": [
              {
                "en": "Interview: 90 seconds. The reporter passes on three answers: 60 seconds.",
                "zh": "訪談90秒；報道員轉述三個答案，共60秒。"
              },
              {
                "en": "Check, correct, prepare and rotate: 90 seconds.",
                "zh": "核對、修正、準備及換角色，共90秒。"
              }
            ]
          }
        ],
        "steps": [
          {
            "en": "Ask four questions: three different question words + one yes/no question. Listen for a useful follow-up.",
            "zh": "問四題：三個不同疑問詞＋一條是非問句。留意可追問的內容。"
          },
          {
            "en": "Reporters listen without interrupting. Note keywords, then report the answers using said / told me or told us.",
            "zh": "報道員先聽，不打斷對話。記關鍵詞，再用 said／told me 或 told us 轉述答案。"
          },
          {
            "en": "The guest checks: person, event, time, possibility and condition. Then move to the next row of the role table.",
            "zh": "受訪者核對人物、事件、時間、可能性及條件，再按角色表進入下一輪。"
          }
        ],
        "fields": [
          {
            "key": "interview-notes",
            "label": {
              "en": "Keywords I heard",
              "zh": "我聽到的關鍵詞"
            },
            "hint": "Speaker / answer / time or condition",
            "rows": 4
          }
        ]
      },
      {
        "minutes": 4,
        "title": {
          "en": "Share a verified scoop",
          "zh": "分享核對過的新消息"
        },
        "lead": {
          "en": "Prepare two accurate reported statements. Each person shares for about 30 seconds.",
          "zh": "準備兩句準確轉述，每人分享約30秒。"
        },
        "id": "s3-13",
        "example": "“Kai said they were interested in communication. They told us they might apply for a media role if training was available.”",
        "steps": [
          {
            "en": "Choose two answers from your notes. Include a tense change and keep any might / if detail.",
            "zh": "從筆記選兩個答案，使用一項時態變化，保留 might／if 等細節。"
          },
          {
            "en": "The original speaker responds: “That is right” or “I said …”. Repair your report.",
            "zh": "原說話者回應：「That is right」或「I said …」，再修正轉述。"
          }
        ],
        "fields": [
          {
            "key": "reported-answers",
            "label": {
              "en": "My two reported statements",
              "zh": "我的兩句轉述"
            },
            "hint": "[Name] said … / [Name] told us …",
            "rows": 3
          },
          {
            "key": "verified-report",
            "label": {
              "en": "My correction, checked by the speaker",
              "zh": "原說話者核對後的修正"
            },
            "hint": "Keep the original meaning.",
            "rows": 2
          }
        ]
      },
      {
        "minutes": 4,
        "title": {
          "en": "Listen for the small words",
          "zh": "留意輕讀的小詞"
        },
        "lead": {
          "en": "Use textbook p.112. Listen to Audio 56 and notice weak forms.",
          "zh": "使用課本第112頁，聽音訊56，留意弱讀。"
        },
        "id": "s3-14",
        "ref": "9D · p. 112 · Weak forms · Audio 56–57",
        "wordBank": [
          {
            "word": "tough",
            "meaning": {
              "en": "difficult",
              "zh": "困難的"
            }
          },
          {
            "word": "finite",
            "meaning": {
              "en": "limited; not endless",
              "zh": "有限的"
            }
          },
          {
            "word": "use up",
            "meaning": {
              "en": "use all of something",
              "zh": "用盡"
            }
          },
          {
            "word": "focus on",
            "meaning": {
              "en": "give attention to",
              "zh": "專注於"
            }
          },
          {
            "word": "curiosity",
            "meaning": {
              "en": "a wish to learn more",
              "zh": "好奇心"
            }
          },
          {
            "word": "materials",
            "meaning": {
              "en": "what things are made from",
              "zh": "材料"
            }
          }
        ],
        "example": "I WANT to be PART of a TEAM.\nto /tə/ · of /əv/ · a /ə/ · and /ən(d)/",
        "steps": [
          {
            "en": "Tap the stressed words, then repeat the sentence.",
            "zh": "輕拍重讀詞，再跟讀句子。"
          }
        ],
        "handoutCue": {
          "en": "Use textbook pp.112–113 directly for the 9D listening tasks.",
          "zh": "9D 聆聽活動直接使用課本第112–113頁。"
        }
      },
      {
        "minutes": 5,
        "title": {
          "en": "What could she take with her?",
          "zh": "她能帶甚麼上船？"
        },
        "lead": {
          "en": "Use textbook p.112 with Video 9.2. Compare your answers with a partner.",
          "zh": "配合影片9.2，使用課本第112頁，與同伴核對答案。"
        },
        "id": "s3-15",
        "ref": "9D · p. 112 · Video 9.2 · Ex. 4–5, selected extract",
        "steps": [
          {
            "en": "What was tough? What was amazing? Use an example from the video.",
            "zh": "甚麼很困難？甚麼令人驚嘆？用影片中的例子說明。"
          }
        ]
      },
      {
        "minutes": 5,
        "title": {
          "en": "What did the experience change?",
          "zh": "這個經驗改變了甚麼？"
        },
        "lead": {
          "en": "Use textbook p.113 for the finite-materials and reuse sections of Videos 9.3–9.4.",
          "zh": "配合影片9.3–9.4的有限材料與再用段落，使用課本第113頁。"
        },
        "id": "s3-16",
        "ref": "9D · p. 113 · Videos 9.3–9.4 · Ex. 6–7, selected extracts",
        "steps": [
          {
            "en": "Compare the boat and the world: what is limited?",
            "zh": "比較船與世界：甚麼是有限的？"
          },
          {
            "en": "Report one idea to a partner: “Ellen explained that …”.",
            "zh": "向同伴轉述一個觀點：「Ellen explained that …」。"
          }
        ]
      },
      {
        "minutes": 5,
        "title": {
          "en": "Your own accurate report",
          "zh": "寫出自己的準確轉述"
        },
        "lead": {
          "en": "Work alone. Report Alex’s message today and explain one change.",
          "zh": "獨立完成：今天轉述 Alex 的訊息，再解釋一項改動。"
        },
        "id": "s3-16-exit",
        "example": "Yesterday, Alex told you: “I am free tomorrow, but I can only stay for an hour.”\nReport the message today.",
        "fields": [
          {
            "key": "exit",
            "label": {
              "en": "My report and one change",
              "zh": "我的轉述及一項改動"
            },
            "hint": "Alex said …\nI changed … because …",
            "rows": 3
          }
        ],
        "reveal": {
          "title": {
            "en": "Check before sharing",
            "zh": "分享前核對"
          },
          "lines": [
            {
              "en": "Alex said he was free today, but he could only stay for an hour.",
              "zh": "Alex said he was free today, but he could only stay for an hour。"
            },
            {
              "en": "Tomorrow becomes today because you report on the following day. Keep the one-hour condition. Underline one word you changed.",
              "zh": "翌日轉述時 tomorrow 變成 today，保留一小時的限制，畫出一個改動的詞。"
            }
          ]
        },
        "takeaway": {
          "en": "I can ask clearly, report an answer and check its meaning against the source.",
          "zh": "我能清楚提問、轉述答案，並跟來源核對意思。"
        }
      },
      {
        "minutes": 2,
        "title": {
          "en": "Keep a useful idea moving",
          "zh": "把有用的點子傳下去"
        },
        "lead": {
          "en": "Before Session 4, photograph or describe something that could be repaired, borrowed, shared or reused.",
          "zh": "第四節前，拍攝或描述一件可維修、借用、共享或再用的物品。"
        },
        "id": "s3-17",
        "steps": [
          {
            "en": "A book, bag, cable or decoration is enough. Explain one possible next use. About 10 minutes after class.",
            "zh": "書、袋、電線或裝飾都可以，說明一種下一步用途；課後約10分鐘。"
          }
        ],
        "export": true,
        "links": [
          {
            "label": {
              "en": "Student handout",
              "zh": "學生講義"
            },
            "href": "/teaching/courses/general-english/unit-9/session-3/student-handout.pdf",
            "download": true
          },
          {
            "label": {
              "en": "Teaching notes",
              "zh": "教學筆記"
            },
            "href": "/teaching/courses/general-english/unit-9/session-3/teaching-notes.pdf",
            "download": true
          },
          {
            "label": {
              "en": "Ellen MacArthur’s TED Talk",
              "zh": "Ellen MacArthur 的 TED 演講"
            },
            "href": "https://www.ted.com/talks/dame_ellen_macarthur_the_surprising_thing_i_learned_sailing_solo_around_the_world"
          }
        ],
        "source": {
          "en": "9C: pp.110–111. 9D: pp.112–113. Question intonation: 9E p.114. Video is played from the textbook or TED.",
          "zh": "9C：第110–111頁；9D：第112–113頁；問句語調：9E第114頁。影片使用課本或 TED 播放。"
        }
      }
    ]
  },
  {
    "number": 4,
    "slug": "better-campus-life",
    "title": {
      "en": "A better idea for campus life",
      "zh": "改善校園生活的點子"
    },
    "sections": "9D + 9E writing",
    "pages": "112–115",
    "outcome": {
      "en": "Use listening evidence, propose a practical change and write a clear enquiry email.",
      "zh": "運用聆聽證據、提出可行改變，並寫清楚的查詢電郵。"
    },
    "slides": [
      {
        "minutes": 3,
        "title": {
          "en": "What could we use again?",
          "zh": "甚麼可以再用？"
        },
        "lead": {
          "en": "Look at an everyday object. What happens when its first user no longer needs it?",
          "zh": "看看一件日常物品，第一位使用者不再需要後會怎樣？"
        },
        "cover": true,
        "takeaway": {
          "en": "Today: listen for an idea → improve a campus routine → ask for useful information.",
          "zh": "今天：聽出觀點 → 改善校園日常安排 → 查詢有用資訊。"
        },
        "id": "s4-1"
      },
      {
        "minutes": 4,
        "title": {
          "en": "An object with another life",
          "zh": "物品的下一段用途"
        },
        "lead": {
          "en": "Share the object you brought or choose a book, bag or charger.",
          "zh": "分享帶來的物品，或選書、袋、充電器。"
        },
        "steps": [
          {
            "en": "Explain its current use and a possible next use. Your partner asks one practical question.",
            "zh": "說明現有用途及下一種用途，同伴問一個實際問題。"
          },
          {
            "en": "Who would keep it, repair it or pass it on?",
            "zh": "誰負責保管、維修或轉交？"
          }
        ],
        "fields": [
          {
            "key": "object",
            "label": {
              "en": "My object and its possible next use",
              "zh": "我的物品及下一種用途"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s4-2"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Before the talk",
          "zh": "演講前準備"
        },
        "lead": {
          "en": "Ellen MacArthur connects a sailing experience with the idea of limited resources.",
          "zh": "Ellen MacArthur 把航海經歷與資源有限的觀點連起來。"
        },
        "ref": "9D · pp. 112–113 · Video 9.2 and 9.4",
        "wordBank": [
          {
            "word": "finite",
            "meaning": {
              "en": "limited; not endless",
              "zh": "有限的"
            }
          },
          {
            "word": "resources",
            "meaning": {
              "en": "things available for use",
              "zh": "可供使用的資源"
            }
          },
          {
            "word": "reuse",
            "meaning": {
              "en": "use something again",
              "zh": "再用"
            }
          },
          {
            "word": "repair",
            "meaning": {
              "en": "make a damaged thing work again",
              "zh": "修理"
            }
          }
        ],
        "steps": [
          {
            "en": "Predict: what could run out on a long boat journey?",
            "zh": "預測：長途航程中，甚麼可能用完？"
          }
        ],
        "links": [
          {
            "label": {
              "en": "Open the official TED Talk",
              "zh": "開啟 TED 官方演講"
            },
            "href": "https://www.ted.com/talks/dame_ellen_macarthur_the_surprising_thing_i_learned_sailing_solo_around_the_world"
          }
        ],
        "teacher": {
          "en": "Use the textbook-edited 9.2 and 9.4 extracts. Select short sections about supplies and recovering materials; do not play the full 16-minute talk here. Preview the player before class.",
          "zh": "使用課本剪輯9.2及9.4，選補給及回收材料的短段，本節不播放整段約16分鐘演講；課前先檢查播放器。"
        },
        "id": "s4-3"
      },
      {
        "minutes": 5,
        "title": {
          "en": "First viewing: connect the idea",
          "zh": "第一次觀看：連起觀點"
        },
        "lead": {
          "en": "Watch the short supplies section from Video 9.2.",
          "zh": "觀看影片9.2中關於補給的短段。"
        },
        "quiz": [
          {
            "prompt": {
              "en": "Why does the boat help explain finite resources?",
              "zh": "為甚麼船能幫助解釋資源有限？"
            },
            "choices": [
              {
                "en": "She can buy new supplies whenever she wants.",
                "zh": "She can buy new supplies whenever she wants."
              },
              {
                "en": "She must manage the supplies she carries.",
                "zh": "She must manage the supplies she carries."
              },
              {
                "en": "The weather never changes.",
                "zh": "The weather never changes."
              }
            ],
            "correct": 1,
            "feedback": {
              "en": "The supplies she carries limit what she can use during the journey.",
              "zh": "她帶上的物資限制了航程中的使用。"
            }
          }
        ],
        "fields": [
          {
            "key": "ted-gist",
            "label": {
              "en": "The main idea in my own words",
              "zh": "用自己的話說主旨"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s4-4"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Second viewing: collect evidence",
          "zh": "第二次觀看：找出證據"
        },
        "lead": {
          "en": "Replay the supplies section, then watch a short reuse section from Video 9.4.",
          "zh": "重播補給段，再看影片9.4中關於再用的短段。"
        },
        "ref": "9D · pp. 112–113 · selected extracts",
        "steps": [
          {
            "en": "Note two examples of supplies she needed.",
            "zh": "記下兩種她需要的補給品。"
          },
          {
            "en": "What does she propose doing with products or materials after use? Record one example you actually hear.",
            "zh": "她建議如何處理用過的產品或材料？記下一個實際聽到的例子。"
          },
          {
            "en": "Compare notes. Separate what she says from your own campus idea.",
            "zh": "比較筆記，分清她的說法與你自己的校園點子。"
          }
        ],
        "fields": [
          {
            "key": "ted-evidence",
            "label": {
              "en": "Two supplies / one proposed change / supporting words",
              "zh": "兩種補給／一項建議改變／支持詞句"
            },
            "hint": "",
            "rows": 5
          }
        ],
        "reveal": {
          "title": {
            "en": "Check and explain",
            "zh": "核對並解釋"
          },
          "lines": [
            {
              "en": "Supplies may include food, fuel, clothes and toiletries. Check which examples occur in the selected extract.",
              "zh": "補給例子包括食物、燃料、衣物及盥洗用品；核對所選段落實際提及哪些。"
            },
            {
              "en": "Her proposals include recovering and reusing components or materials. Use the example in your chosen clip.",
              "zh": "她提出回收及再用零件或材料；以所選片段的例子為準。"
            }
          ]
        },
        "teacher": {
          "en": "The 2015 talk includes older resource estimates. Do not present these as present-day countdowns. Assess the argument and the examples heard.",
          "zh": "2015年演講包含較早的資源估計，不當作現時倒數；評核觀點及聽到的例子。"
        },
        "id": "s4-5"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Hear the quiet words",
          "zh": "聽見較輕的詞"
        },
        "lead": {
          "en": "Listen to the short examples in Audio 56–57. Meaning words often stand out more.",
          "zh": "聽音訊56–57短例句，承載意思的詞通常較突出。"
        },
        "ref": "9D · p. 112 · Authentic listening skills · Ex. 1–2",
        "steps": [
          {
            "en": "First catch the stressed words. Replay and notice quieter articles, prepositions and conjunctions.",
            "zh": "先抓重讀詞，再重聽冠詞、介詞及連接詞的弱讀。"
          },
          {
            "en": "Practise this original sentence at a comfortable pace. Keep the nouns and main verbs clear.",
            "zh": "以舒適速度練習以下原創句子，讓名詞及主要動詞清楚。"
          }
        ],
        "example": "We need to find a way to use the books again.\nListen for quieter to / a / the.",
        "takeaway": {
          "en": "The aim is to recognise connected speech. You do not need to imitate an accent.",
          "zh": "目標是辨認連貫語流，不必模仿特定口音。"
        },
        "id": "s4-6"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Choose one campus problem",
          "zh": "選一項校園問題"
        },
        "lead": {
          "en": "Make a small change that a student team could organise.",
          "zh": "提出學生團隊可以統籌的小改變。"
        },
        "columns": [
          {
            "title": {
              "en": "Possible starting points",
              "zh": "可選起點"
            },
            "lines": [
              {
                "en": "Textbooks left unused after a course",
                "zh": "課程結束後閒置的課本"
              },
              {
                "en": "Decorations bought for a single event",
                "zh": "只用一次的活動裝飾"
              }
            ]
          },
          {
            "title": {
              "en": "Other everyday examples",
              "zh": "其他日常例子"
            },
            "lines": [
              {
                "en": "Equipment needed only occasionally",
                "zh": "偶爾才用到的器材"
              },
              {
                "en": "A useful object with a small repairable fault",
                "zh": "只有小故障、仍有用的物品"
              }
            ]
          }
        ],
        "steps": [
          {
            "en": "Choose one. Name who experiences the problem and what currently happens.",
            "zh": "選一項，說明誰遇到問題及現時如何處理。"
          }
        ],
        "id": "s4-7"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Make the idea workable",
          "zh": "讓點子可以實行"
        },
        "lead": {
          "en": "A useful idea needs people and arrangements.",
          "zh": "有用的點子需要人手及安排。"
        },
        "fields": [
          {
            "key": "campus-plan",
            "label": {
              "en": "Problem / proposed change / organiser / likely difficulty",
              "zh": "問題／改變建議／統籌者／可能困難"
            },
            "hint": "We could … Someone would need to … A difficulty might be …",
            "rows": 5
          }
        ],
        "steps": [
          {
            "en": "Agree on one change. Decide how people would participate and who would do the work.",
            "zh": "商議一項改變，決定如何參與及誰負責。"
          },
          {
            "en": "Connect one role to a skill from Session 1.",
            "zh": "把一個角色與第一節的技能連起來。"
          }
        ],
        "id": "s4-8"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Test the proposal",
          "zh": "試問計劃是否可行"
        },
        "lead": {
          "en": "Give another group a 30-second explanation. Ask one practical question about their plan.",
          "zh": "用30秒向另一組說明，再問對方一個實際問題。"
        },
        "example": "Who would store the books?\nHow would students find out?\nWhat would happen if an item was damaged?",
        "fields": [
          {
            "key": "plan-question",
            "label": {
              "en": "A question we still need answered",
              "zh": "我們仍需要解答的問題"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s4-9"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Ask clearly and politely",
          "zh": "清楚有禮地提問"
        },
        "lead": {
          "en": "Write an enquiry to a workshop coordinator who does not know you yet.",
          "zh": "寫信向尚未認識你的工作坊統籌查詢。"
        },
        "ref": "9E · p. 115 · Writing skill",
        "table": {
          "headers": [
            {
              "en": "Direct question",
              "zh": "直接問句"
            },
            {
              "en": "Indirect question",
              "zh": "間接問句"
            }
          ],
          "rows": [
            [
              {
                "en": "When does the workshop start?",
                "zh": "工作坊何時開始？"
              },
              {
                "en": "Could you tell me when the workshop starts?",
                "zh": "可否告訴我工作坊何時開始？"
              }
            ],
            [
              {
                "en": "Do beginners need experience?",
                "zh": "初學者需要經驗嗎？"
              },
              {
                "en": "I would like to know whether beginners need experience.",
                "zh": "我想知道初學者是否需要經驗。"
              }
            ]
          ]
        },
        "takeaway": {
          "en": "Inside the indirect question, use statement word order: when + subject + verb. Use if/whether for yes/no information.",
          "zh": "間接問句內用陳述語序：when + 主語 + 動詞；是非資訊用 if／whether。"
        },
        "id": "s4-10"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Fix the question",
          "zh": "修正問句"
        },
        "lead": {
          "en": "Compare the word order and punctuation.",
          "zh": "比較語序及標點。"
        },
        "practice": [
          {
            "number": 1,
            "prompt": "Could you tell me when does the class finish?",
            "answer": "Could you tell me when the class finishes?"
          },
          {
            "number": 2,
            "prompt": "I would like to know do I need a laptop.",
            "answer": "I would like to know if/whether I need a laptop."
          },
          {
            "number": 3,
            "prompt": "Where can I register? Begin: Could you tell me …",
            "answer": "Could you tell me where I can register?"
          },
          {
            "number": 4,
            "prompt": "Is there a fee? Begin: I would like to know …",
            "answer": "I would like to know if/whether there is a fee."
          }
        ],
        "takeaway": {
          "en": "Could you tell me …? takes a question mark. I would like to know … is a statement and ends with a full stop.",
          "zh": "Could you tell me …? 用問號；I would like to know … 是陳述句，以句號結束。"
        },
        "id": "s4-11"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Read as the coordinator",
          "zh": "以統籌角度閱讀"
        },
        "lead": {
          "en": "This original model asks about a class that could support a student project.",
          "zh": "以下原創示範查詢能支持學生計劃的課程。"
        },
        "example": "Subject: Enquiry about the poster-design workshop\n\nDear Workshop Coordinator,\n\nI am a first-year student interested in your poster-design workshop. I would like to learn how to make clearer posters for student activities.\n\nCould you tell me when the next workshop takes place? I would also like to know whether beginners can join. Do I need to bring a laptop or install any software beforehand?\n\nI am helping my classmates plan a second-hand textbook exchange, so these skills would be useful for our publicity.\n\nThank you for your help. I look forward to hearing from you.\n\nKind regards,\nAlex Chen",
        "steps": [
          {
            "en": "Find the purpose, useful context and three answerable questions. Which questions are indirect?",
            "zh": "找出目的、有用背景及三個可回答的問題；哪些是間接問句？"
          }
        ],
        "source": {
          "en": "Original teaching model; it replaces the unavailable student-book p. 152 model.",
          "zh": "原創教學示範，代替尚未提供的學生課本第152頁範文。"
        },
        "id": "s4-12"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Choose a class and a reason",
          "zh": "選課程及查詢原因"
        },
        "lead": {
          "en": "Choose poster design, event planning, basic repair or digital skills. These are imagined workshops.",
          "zh": "選海報設計、活動策劃、基礎維修或數碼技能，均為假設工作坊。"
        },
        "steps": [
          {
            "en": "Decide what you already know and what information is missing. Ask questions that are useful for your choice.",
            "zh": "決定已知甚麼、缺甚麼資訊，提出有助選擇的問題。"
          }
        ],
        "fields": [
          {
            "key": "email-plan",
            "label": {
              "en": "Recipient / purpose / relevant context / three questions",
              "zh": "收件人／目的／相關背景／三個問題"
            },
            "hint": "",
            "rows": 5
          }
        ],
        "id": "s4-13"
      },
      {
        "minutes": 10,
        "title": {
          "en": "Write your enquiry",
          "zh": "撰寫查詢電郵"
        },
        "lead": {
          "en": "Write 90–120 words. Make the purpose clear near the start.",
          "zh": "寫90–120字，開頭說清楚目的。"
        },
        "steps": [
          {
            "en": "Include a subject, greeting, brief context, three useful questions and a suitable close. Use at least two indirect questions.",
            "zh": "包括主旨、稱呼、簡短背景、三個有用問題及合適結語，至少兩個用間接問句。"
          },
          {
            "en": "Use your own situation and questions. You can refer to the model for structure.",
            "zh": "使用自己的情境及問題，可參考示範的組織方式。"
          }
        ],
        "fields": [
          {
            "key": "email-draft",
            "label": {
              "en": "My first email",
              "zh": "我的電郵初稿"
            },
            "hint": "Subject: …\nDear …",
            "rows": 10
          }
        ],
        "id": "s4-14"
      },
      {
        "minutes": 7,
        "title": {
          "en": "Help the recipient answer",
          "zh": "讓收件人容易回答"
        },
        "lead": {
          "en": "Exchange emails. Point to one strength and one specific place to improve.",
          "zh": "交換電郵，指出一個優點及一處具體改善位置。"
        },
        "steps": [
          {
            "en": "Can you identify why the writer is contacting you? Can you answer each question?",
            "zh": "能看出寫信原因嗎？每個問題都能回答嗎？"
          },
          {
            "en": "Check statement word order inside indirect questions and whether/if where needed.",
            "zh": "核對間接問句的陳述語序，以及 if／whether 的使用。"
          },
          {
            "en": "Revise at least one sentence. The revised version is your final lesson product.",
            "zh": "至少修訂一句，修訂版是本節最終作品。"
          }
        ],
        "fields": [
          {
            "key": "email-final",
            "label": {
              "en": "My revised email",
              "zh": "我的電郵修訂稿"
            },
            "hint": "Keep the subject and closing.",
            "rows": 10
          }
        ],
        "id": "s4-15"
      },
      {
        "minutes": 3,
        "title": {
          "en": "One next step you could take",
          "zh": "你可以採取的一個下一步"
        },
        "lead": {
          "en": "Choose one expression and one action you could use outside this classroom.",
          "zh": "選一個課外可用的表達及一項行動。"
        },
        "fields": [
          {
            "key": "exit",
            "label": {
              "en": "Useful expression / practical next step / one thing I improved",
              "zh": "有用表達／實際下一步／我改善的一點"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "takeaway": {
          "en": "You have described skills, evaluated views, checked messages and asked for information. Keep your work as evidence of what you can do.",
          "zh": "你已描述技能、評估觀點、核對訊息及查詢資訊，保留作品記錄自己的能力。"
        },
        "export": true,
        "id": "s4-16"
      }
    ]
  }
];
