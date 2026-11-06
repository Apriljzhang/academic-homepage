import type { UnitSlide, Text } from './generalEnglishUnit5';
export type Unit9Field = { key: string; label: Text; hint: string; rows: number };
export type Unit9Slide = UnitSlide & { id: string; fields?: Unit9Field[]; timeline?: Text[]; teacher?: Text; export?: boolean };
export type Unit9Session = { number: number; slug: string; title: Text; sections: string; pages: string; outcome: Text; slides: Unit9Slide[] };
export const unit9Sessions: Unit9Session[] = [
  {
    "number": 1,
    "slug": "skills-and-opportunities",
    "title": {
      "en": "What can I contribute?",
      "zh": "我能作出甚麼貢獻？"
    },
    "sections": "9A",
    "pages": "104–107",
    "outcome": {
      "en": "Describe roles, identify work priorities and explain an earlier experience.",
      "zh": "描述角色、辨認工作取向，並說明較早發生的經歷。"
    },
    "slides": [
      {
        "minutes": 3,
        "title": {
          "en": "What can I contribute?",
          "zh": "我能作出甚麼貢獻？"
        },
        "lead": {
          "en": "A campus event needs a team. What could you bring to it?",
          "zh": "校園活動需要團隊。你能帶來甚麼？"
        },
        "cover": true,
        "steps": [
          {
            "en": "Tell a partner one thing you enjoy doing. Ordinary skills count.",
            "zh": "告訴同伴一件你喜歡做的事，日常技能也可以。"
          }
        ],
        "takeaway": {
          "en": "Today: describe roles → listen for priorities → connect experience to a role.",
          "zh": "今天：描述角色 → 聽出取向 → 把經歷與角色連起來。"
        },
        "id": "s1-1"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Choose your two priorities",
          "zh": "選出最重視的兩項"
        },
        "lead": {
          "en": "What matters when you choose a part-time job or student activity?",
          "zh": "選兼職或學生活動時，你重視甚麼？"
        },
        "columns": [
          {
            "title": {
              "en": "Your options",
              "zh": "可選項目"
            },
            "lines": [
              {
                "en": "enjoyment · money · useful experience",
                "zh": "樂趣 · 收入 · 有用的經驗"
              },
              {
                "en": "helping people · convenient hours · working with friends",
                "zh": "幫助別人 · 合適的時間 · 與朋友合作"
              }
            ]
          },
          {
            "title": {
              "en": "Ask and compare",
              "zh": "提問與比較"
            },
            "lines": [
              {
                "en": "What matters most to you? Why?",
                "zh": "你最重視甚麼？為甚麼？"
              },
              {
                "en": "Would your priorities change during exam week?",
                "zh": "考試週時，你的取向會改變嗎？"
              }
            ]
          }
        ],
        "example": "I value flexible hours because I need time for my assignments.",
        "fields": [
          {
            "key": "priorities",
            "label": {
              "en": "My two priorities and reasons",
              "zh": "我的兩項取向及原因"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s1-2"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Who makes your day possible?",
          "zh": "誰讓你的一天順利進行？"
        },
        "lead": {
          "en": "Think about breakfast, travelling to class and using your phone.",
          "zh": "想想吃早餐、上學及使用手機。"
        },
        "ref": "9A · p. 105 · Ex. 2, 4",
        "wordBank": [
          {
            "word": "chef",
            "meaning": {
              "en": "prepares and cooks food",
              "zh": "準備及烹調食物"
            }
          },
          {
            "word": "software developer",
            "meaning": {
              "en": "creates computer programs",
              "zh": "開發電腦程式"
            }
          },
          {
            "word": "accountant",
            "meaning": {
              "en": "prepares and checks financial records",
              "zh": "編製及核對財務紀錄"
            }
          },
          {
            "word": "architect",
            "meaning": {
              "en": "designs buildings",
              "zh": "設計建築物"
            }
          },
          {
            "word": "paramedic",
            "meaning": {
              "en": "gives emergency medical care",
              "zh": "提供緊急醫療照護"
            }
          },
          {
            "word": "cleaner",
            "meaning": {
              "en": "keeps places clean",
              "zh": "保持地方清潔"
            }
          }
        ],
        "steps": [
          {
            "en": "Match the jobs in Ex. 2. Explain two jobs without translating the title.",
            "zh": "完成第2題配對，用英語解釋兩個職業的工作。"
          },
          {
            "en": "Choose one essential task from your day. What would happen if nobody did it?",
            "zh": "選一天中的一項必要工作。如果沒有人做，會怎樣？"
          }
        ],
        "id": "s1-3"
      },
      {
        "minutes": 6,
        "title": {
          "en": "A role needs actions",
          "zh": "角色需要具體行動"
        },
        "lead": {
          "en": "Use job vocabulary to describe a student team.",
          "zh": "運用職業詞彙描述學生團隊。"
        },
        "table": {
          "headers": [
            {
              "en": "Role",
              "zh": "角色"
            },
            {
              "en": "What you do",
              "zh": "工作內容"
            },
            {
              "en": "A useful skill",
              "zh": "有用技能"
            }
          ],
          "rows": [
            [
              {
                "en": "Welcome assistant",
                "zh": "接待助手"
              },
              {
                "en": "Answer questions and explain directions",
                "zh": "回答問題及指路"
              },
              {
                "en": "communication · patience",
                "zh": "溝通 · 耐心"
              }
            ],
            [
              {
                "en": "Event organiser",
                "zh": "活動統籌"
              },
              {
                "en": "Coordinate people and check the schedule",
                "zh": "協調人手及核對時間表"
              },
              {
                "en": "organisation · teamwork",
                "zh": "組織 · 團隊合作"
              }
            ],
            [
              {
                "en": "Photographer",
                "zh": "攝影員"
              },
              {
                "en": "Take and select useful photographs",
                "zh": "拍攝及挑選合適照片"
              },
              {
                "en": "observation · creativity",
                "zh": "觀察 · 創意"
              }
            ],
            [
              {
                "en": "Publicity assistant",
                "zh": "宣傳助手"
              },
              {
                "en": "Write clear posts and prepare posters",
                "zh": "撰寫清楚的帖文及製作海報"
              },
              {
                "en": "writing · design",
                "zh": "寫作 · 設計"
              }
            ]
          ]
        },
        "steps": [
          {
            "en": "Describe a role. Your partner guesses it, then gives one reason it could be enjoyable or difficult.",
            "zh": "描述一個角色，讓同伴猜，再說一個有趣或困難之處。"
          }
        ],
        "id": "s1-4"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Before you listen",
          "zh": "聆聽前準備"
        },
        "lead": {
          "en": "Julia and Tomas discuss a science photographer and their own work priorities.",
          "zh": "Julia 和 Tomas 討論科學攝影師及各自的工作取向。"
        },
        "ref": "9A · p. 106 · Audio 53 · Ex. 6",
        "steps": [
          {
            "en": "Make two columns: Julia / Tomas. Predict where adventure, fun, money, safety and staying near family might go.",
            "zh": "分成 Julia／Tomas 兩欄，預測 adventure、fun、money、safety 及 staying near family 屬於哪欄。"
          },
          {
            "en": "Your predictions are guesses. Leave space for listening evidence.",
            "zh": "預測只是猜想，留空記錄聆聽證據。"
          }
        ],
        "id": "s1-5"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Listen for what matters",
          "zh": "聽出重視的事情"
        },
        "lead": {
          "en": "Play Audio 53 once. Check the priorities, without trying to write every word.",
          "zh": "播放音訊53一次，核對取向，不必逐字記錄。"
        },
        "ref": "9A · p. 106 · Ex. 6",
        "fields": [
          {
            "key": "listening",
            "label": {
              "en": "Julia / Tomas: priorities and words I heard",
              "zh": "Julia／Tomas：取向及聽到的詞"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "reveal": {
          "title": {
            "en": "Check and explain",
            "zh": "核對並解釋"
          },
          "lines": [
            {
              "en": "Julia: adventure and fun. Tomas: money, safety and staying near family.",
              "zh": "Julia：冒險與樂趣。Tomas：收入、安全及與家人住得近。"
            }
          ]
        },
        "teacher": {
          "en": "If audio is unavailable, use the original substitute dialogue in the teaching guide. Its questions are separate from textbook Ex. 6–7.",
          "zh": "沒有音訊時，可使用教學指引的原創替代對話；其問題與課本第6–7題不同。"
        },
        "id": "s1-6"
      },
      {
        "minutes": 5,
        "title": {
          "en": "True, false or not given?",
          "zh": "正確、錯誤，還是未提及？"
        },
        "lead": {
          "en": "Replay the relevant parts. A possible idea is different from a stated fact.",
          "zh": "重聽相關部分，可能的意思與明確說出的事實有分別。"
        },
        "ref": "9A · p. 106 · Ex. 7: items 3, 5, 6, 9",
        "steps": [
          {
            "en": "Decide on items 3, 5, 6 and 9. Write a keyword supporting each decision.",
            "zh": "判斷第3、5、6及9小題，記下支持每項判斷的關鍵詞。"
          },
          {
            "en": "Compare with a partner before checking. For false items, correct the statement.",
            "zh": "先與同伴比較再核對，把錯誤的說法改正。"
          }
        ],
        "reveal": {
          "title": {
            "en": "Check and explain",
            "zh": "核對並解釋"
          },
          "lines": [
            {
              "en": "3 True: Julia has not decided exactly what she wants to do.",
              "zh": "3 正確：Julia 尚未確定想做甚麼。"
            },
            {
              "en": "5 False: Tomas does not want to be away from his family so much.",
              "zh": "5 錯誤：Tomas 不想經常遠離家人。"
            },
            {
              "en": "6 False: Tomas says he does not want to be a doctor.",
              "zh": "6 錯誤：Tomas 說他不想當醫生。"
            },
            {
              "en": "9 Not given: Julia says money matters less, but does not state how much she wants.",
              "zh": "9 未提及：Julia 較不重視收入，但沒有說想賺多少錢。"
            }
          ]
        },
        "id": "s1-7"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Two events. Which came first?",
          "zh": "兩件事，哪件先發生？"
        },
        "lead": {
          "en": "The lesson started at 9.00. I arrived at 9.10.",
          "zh": "課堂九時開始，我九時十分到達。"
        },
        "ref": "9A · pp. 106–107 · Past perfect",
        "timeline": [
          {
            "en": "9.00 · lesson started",
            "zh": "9:00 · 課堂開始"
          },
          {
            "en": "9.10 · I arrived",
            "zh": "9:10 · 我到達"
          },
          {
            "en": "Now · I am telling you",
            "zh": "現在 · 我正在講述"
          }
        ],
        "example": "By the time I arrived, the lesson had already started.",
        "columns": [
          {
            "title": {
              "en": "Earlier past event",
              "zh": "較早的過去事件"
            },
            "lines": [
              {
                "en": "had / had not + past participle",
                "zh": "had／had not + 過去分詞"
              },
              {
                "en": "The lesson had started.",
                "zh": "課堂已經開始。"
              }
            ]
          },
          {
            "title": {
              "en": "Later past event",
              "zh": "較後的過去事件"
            },
            "lines": [
              {
                "en": "past simple",
                "zh": "一般過去式"
              },
              {
                "en": "I arrived.",
                "zh": "我到達。"
              }
            ]
          }
        ],
        "takeaway": {
          "en": "The past perfect looks back from a past moment. Both events are before now.",
          "zh": "過去完成式從過去某一刻回望較早的事情；兩件事都在現在之前。"
        },
        "id": "s1-8"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Put the events in order",
          "zh": "排出事件次序"
        },
        "lead": {
          "en": "Say which action happened first, then complete the sentence.",
          "zh": "先說哪個動作較早，再完成句子。"
        },
        "practice": [
          {
            "number": 1,
            "prompt": "I reached the bus stop at 8.10. The bus left at 8.05. By the time I reached the stop, the bus ___ (leave).",
            "answer": "had left — leaving happened before reaching the stop."
          },
          {
            "number": 2,
            "prompt": "We arrived at the event. Nobody had prepared the signs. Which happened first: arriving or preparing?",
            "answer": "Arriving happened; preparing had not happened before that past moment."
          },
          {
            "number": 3,
            "prompt": "Before I joined the media team, I ___ (never / edit) a video.",
            "answer": "had never edited — my lack of experience was before joining."
          },
          {
            "number": 4,
            "prompt": "After we checked the room, we started the event. Must checked become had checked?",
            "answer": "No. After already makes the sequence clear. Had checked is also possible."
          }
        ],
        "id": "s1-9"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Make experience visible",
          "zh": "把經歷說清楚"
        },
        "lead": {
          "en": "Small experiences can show a useful skill.",
          "zh": "小經歷也能反映有用技能。"
        },
        "example": "Before I started university, I had organised a trip with two friends. I checked the times and made a plan.",
        "steps": [
          {
            "en": "Use a real or invented example: helping someone, planning a trip, making a poster or solving a small problem.",
            "zh": "用真實或虛構例子：幫助別人、規劃旅行、製作海報或解決小問題。"
          }
        ],
        "fields": [
          {
            "key": "experience",
            "label": {
              "en": "One earlier experience and the skill it shows",
              "zh": "一項較早的經歷及相關技能"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s1-10"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Your team challenge",
          "zh": "團隊挑戰"
        },
        "lead": {
          "en": "Plan a one-hour welcome activity for new students.",
          "zh": "規劃一小時的新生活動。"
        },
        "steps": [
          {
            "en": "Work in groups of four. Choose an activity and a role for each person.",
            "zh": "四人一組，選活動並為每人分配角色。"
          },
          {
            "en": "Your plan needs a location, a simple schedule and someone responsible for each task.",
            "zh": "計劃須有地點、簡單時間表及各項工作的負責人。"
          }
        ],
        "example": "Our activity is ___. We need someone to ___. I suggest ___ because ___.",
        "id": "s1-11"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Prepare your contribution",
          "zh": "準備你的貢獻"
        },
        "lead": {
          "en": "Everyone prepares a role recommendation before the discussion.",
          "zh": "每人在討論前先準備一個角色建議。"
        },
        "columns": [
          {
            "title": {
              "en": "Build your explanation",
              "zh": "組織說明"
            },
            "lines": [
              {
                "en": "I would like to help with … because …",
                "zh": "我想協助……，因為……"
              },
              {
                "en": "Before I …, I had …",
                "zh": "在我……之前，我已經……"
              }
            ]
          },
          {
            "title": {
              "en": "If you are trying something new",
              "zh": "首次嘗試也可以"
            },
            "lines": [
              {
                "en": "I have not tried … yet, but I would like to learn.",
                "zh": "我尚未試過……，但想學習。"
              },
              {
                "en": "I could work with … to practise …",
                "zh": "我可以跟……合作，練習……"
              }
            ]
          }
        ],
        "fields": [
          {
            "key": "role-plan",
            "label": {
              "en": "My role, evidence and one thing to learn",
              "zh": "我的角色、支持經歷及一項學習需要"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s1-12"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Agree on the team",
          "zh": "商議團隊分工"
        },
        "lead": {
          "en": "Each person speaks for 30–45 seconds. Listeners ask a useful question.",
          "zh": "每人說30–45秒，聆聽者提出有用問題。"
        },
        "steps": [
          {
            "en": "Use your notes as prompts. Explain the experience; avoid reading a whole paragraph.",
            "zh": "以筆記提示，說明經歷，避免整段照讀。"
          },
          {
            "en": "Ask: What did you do? When can you help? What support would you need?",
            "zh": "提問：你做了甚麼？何時能幫忙？需要甚麼支援？"
          },
          {
            "en": "Agree on a team plan. A person can share a role.",
            "zh": "商議團隊計劃，同一角色可由多人分擔。"
          }
        ],
        "id": "s1-13"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Something has changed",
          "zh": "安排有變"
        },
        "lead": {
          "en": "Your photographer cannot arrive until halfway through the event.",
          "zh": "攝影員只能在活動進行一半後到達。"
        },
        "steps": [
          {
            "en": "Decide how to cover the first half. Change responsibilities if needed.",
            "zh": "決定如何處理前半段，需要時調整分工。"
          },
          {
            "en": "Prepare a 45-second update explaining the revised plan and one reason.",
            "zh": "準備45秒更新，說明修改後的安排及一個原因。"
          }
        ],
        "fields": [
          {
            "key": "team-update",
            "label": {
              "en": "Our revised plan",
              "zh": "我們修改後的計劃"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s1-14"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Make the explanation clearer",
          "zh": "把說明說清楚"
        },
        "lead": {
          "en": "Give a neighbouring group one useful observation, then improve your update.",
          "zh": "向鄰組提出一項有用觀察，再改善更新說明。"
        },
        "steps": [
          {
            "en": "Check: is everyone responsible for something? Does the experience support the role? Is the event order clear?",
            "zh": "核對：每人都有職責嗎？經歷能支持角色嗎？事件先後清楚嗎？"
          },
          {
            "en": "Choose one sentence to improve and say the update again.",
            "zh": "選一句改善，再說一次更新。"
          }
        ],
        "takeaway": {
          "en": "A successful team uses people’s skills and makes room to learn.",
          "zh": "有效的團隊運用成員技能，也安排學習機會。"
        },
        "id": "s1-15"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Show what you can do",
          "zh": "展示你的學習"
        },
        "lead": {
          "en": "Complete this on your own before comparing answers.",
          "zh": "先獨立完成，再比較答案。"
        },
        "fields": [
          {
            "key": "exit",
            "label": {
              "en": "My role choice, reason and two-event sentence",
              "zh": "我的角色選擇、原因及兩件事的句子"
            },
            "hint": "I would choose … because … By the time …, … had …",
            "rows": 4
          }
        ],
        "quiz": [
          {
            "prompt": {
              "en": "By the time we arrived, the event ___.",
              "zh": "By the time we arrived, the event ___."
            },
            "choices": [
              {
                "en": "has started",
                "zh": "has started"
              },
              {
                "en": "had started",
                "zh": "had started"
              },
              {
                "en": "starts",
                "zh": "starts"
              }
            ],
            "correct": 1,
            "feedback": {
              "en": "Had started marks the event before our past arrival.",
              "zh": "had started 表示在我們到達之前，活動已開始。"
            }
          }
        ],
        "id": "s1-16"
      },
      {
        "minutes": 2,
        "title": {
          "en": "Bring one small example",
          "zh": "帶來一個小例子"
        },
        "lead": {
          "en": "Before Session 2, note three things you have learned in different parts of your life.",
          "zh": "第二節前，記下在生活不同範疇學過的三件事。"
        },
        "steps": [
          {
            "en": "Choose study, a hobby, a shared responsibility or helping someone. About 10 minutes.",
            "zh": "可選學習、興趣、共同責任或幫助別人，約10分鐘。"
          },
          {
            "en": "Keep today’s role explanation. You will connect experiences to skills next time.",
            "zh": "保留今天的角色說明，下次會把經歷與技能連起來。"
          }
        ],
        "export": true,
        "id": "s1-17"
      }
    ]
  },
  {
    "number": 2,
    "slug": "learning-beyond-subjects",
    "title": {
      "en": "What am I learning beyond my subjects?",
      "zh": "除了學科知識，我還學到甚麼？"
    },
    "sections": "9B",
    "pages": "108–109",
    "outcome": {
      "en": "Read viewpoints, explain tone with evidence and connect an experience to a useful skill.",
      "zh": "閱讀不同觀點、用證據解釋語氣，並把經歷與有用技能連起來。"
    },
    "slides": [
      {
        "minutes": 3,
        "title": {
          "en": "What did you actually learn?",
          "zh": "你實際學到了甚麼？"
        },
        "lead": {
          "en": "Think of a task that seemed useful, frustrating or both.",
          "zh": "想一項有用、令人困擾，或兩者皆有的任務。"
        },
        "cover": true,
        "steps": [
          {
            "en": "Explain it to a partner in two sentences.",
            "zh": "用兩句向同伴說明。"
          }
        ],
        "takeaway": {
          "en": "Today: read different views → examine wording → give a specific response.",
          "zh": "今天：閱讀不同觀點 → 分析措辭 → 提出具體回應。"
        },
        "id": "s2-1"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Take a position",
          "zh": "表達立場"
        },
        "lead": {
          "en": "“A university course is useful only if it directly prepares you for a job.”",
          "zh": "「大學課程只有直接為就業作準備，才有用。」"
        },
        "steps": [
          {
            "en": "Choose agree, disagree or unsure. Give one reason and listen to a different view.",
            "zh": "選同意、不同意或不確定；說一個原因，再聽不同看法。"
          },
          {
            "en": "You can change your position after reading.",
            "zh": "閱讀後可以改變立場。"
          }
        ],
        "fields": [
          {
            "key": "first-position",
            "label": {
              "en": "My starting position and reason",
              "zh": "我的最初立場及原因"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s2-2"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Useful words travel together",
          "zh": "把常用詞組一起學"
        },
        "lead": {
          "en": "Notice the preposition that belongs with each verb.",
          "zh": "留意各動詞配搭的介詞。"
        },
        "ref": "9B · p. 108 · Ex. 1",
        "wordBank": [
          {
            "word": "apply for",
            "meaning": {
              "en": "apply for a society role",
              "zh": "申請社團職位"
            }
          },
          {
            "word": "agree with",
            "meaning": {
              "en": "agree with a classmate",
              "zh": "同意同學的看法"
            }
          },
          {
            "word": "graduate from",
            "meaning": {
              "en": "graduate from university",
              "zh": "大學畢業"
            }
          },
          {
            "word": "depend on",
            "meaning": {
              "en": "depend on the timetable",
              "zh": "取決於時間表"
            }
          },
          {
            "word": "introduce someone to",
            "meaning": {
              "en": "introduce a friend to the team",
              "zh": "向團隊介紹朋友"
            }
          },
          {
            "word": "decide on",
            "meaning": {
              "en": "decide on a topic",
              "zh": "選定題目"
            }
          }
        ],
        "steps": [
          {
            "en": "Complete Ex. 1. Say the whole phrase when checking, including the preposition.",
            "zh": "完成第1題，核對時說完整詞組，包括介詞。"
          }
        ],
        "id": "s2-3"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Use the phrase in your life",
          "zh": "把詞組用在生活中"
        },
        "lead": {
          "en": "Choose the preposition, then replace one detail with your own.",
          "zh": "選介詞，再改一項細節，變成自己的句子。"
        },
        "practice": [
          {
            "number": 1,
            "prompt": "I applied ___ a role in the student society.",
            "answer": "for"
          },
          {
            "number": 2,
            "prompt": "We have not decided ___ a presentation topic.",
            "answer": "on"
          },
          {
            "number": 3,
            "prompt": "Whether I can attend depends ___ my timetable.",
            "answer": "on"
          },
          {
            "number": 4,
            "prompt": "I agree ___ Mei that we need another rehearsal.",
            "answer": "with"
          },
          {
            "number": 5,
            "prompt": "Please introduce me ___ your project partner.",
            "answer": "to"
          }
        ],
        "fields": [
          {
            "key": "phrase",
            "label": {
              "en": "Two original sentences using today’s phrases",
              "zh": "用今天的詞組寫兩句自己的句子"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s2-4"
      },
      {
        "minutes": 4,
        "title": {
          "en": "One question, six answers",
          "zh": "一個問題，六個回答"
        },
        "lead": {
          "en": "Does school prepare you for the world of work?",
          "zh": "學校能讓你準備好進入職場嗎？"
        },
        "ref": "9B · pp. 108–109 · Ex. 3–4",
        "steps": [
          {
            "en": "Skim all six paragraphs. Read the first and last sentences and look for position words.",
            "zh": "略讀六段，留意首尾句及立場詞。"
          },
          {
            "en": "Mark each writer yes, no or depends. Do not stop at every new word.",
            "zh": "標示每位作者的立場：yes、no 或 depends，不必每遇生詞就停下。"
          }
        ],
        "teacher": {
          "en": "Keep the six full paragraphs in the e-book. Do not project an answer before students have located evidence.",
          "zh": "完整六段使用電子書；學生找出證據後才揭示答案。"
        },
        "id": "s2-5"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Become the reader for one voice",
          "zh": "負責讀懂一個觀點"
        },
        "lead": {
          "en": "Each person reads one paragraph closely. In smaller groups, take two each.",
          "zh": "每人細讀一段；人數較少時，每人負責兩段。"
        },
        "ref": "9B · p. 109",
        "steps": [
          {
            "en": "Find the writer’s position, their main reason and a phrase that supports your interpretation.",
            "zh": "找出立場、主要原因及支持你解讀的詞句。"
          },
          {
            "en": "Prepare a short explanation in your own words. A new word can be checked after you identify the main idea.",
            "zh": "用自己的話準備簡短說明，先找主旨，再查必要生詞。"
          }
        ],
        "fields": [
          {
            "key": "expert-reading",
            "label": {
              "en": "Writer / position / reason / textual evidence",
              "zh": "作者／立場／原因／文本證據"
            },
            "hint": "Name: … Position: … Reason: … Evidence: …",
            "rows": 5
          }
        ],
        "id": "s2-6"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Build the whole picture",
          "zh": "拼出完整圖像"
        },
        "lead": {
          "en": "Share your paragraph. Listeners complete their reading grid.",
          "zh": "分享負責的段落，聆聽者完成閱讀表。"
        },
        "table": {
          "headers": [
            {
              "en": "Writer",
              "zh": "作者"
            },
            {
              "en": "Position",
              "zh": "立場"
            },
            {
              "en": "Reason + evidence",
              "zh": "原因及證據"
            }
          ],
          "rows": [
            [
              {
                "en": "Lydia",
                "zh": "Lydia"
              },
              {
                "en": "Yes / no / depends",
                "zh": "是／否／視乎情況"
              },
              {
                "en": "Find a phrase in p. 109",
                "zh": "在第109頁找出詞句"
              }
            ],
            [
              {
                "en": "Sophia",
                "zh": "Sophia"
              },
              {
                "en": "Yes / no / depends",
                "zh": "是／否／視乎情況"
              },
              {
                "en": "Find a phrase in p. 109",
                "zh": "在第109頁找出詞句"
              }
            ],
            [
              {
                "en": "Daniela",
                "zh": "Daniela"
              },
              {
                "en": "Yes / no / depends",
                "zh": "是／否／視乎情況"
              },
              {
                "en": "Find a phrase in p. 109",
                "zh": "在第109頁找出詞句"
              }
            ],
            [
              {
                "en": "Paul",
                "zh": "Paul"
              },
              {
                "en": "Yes / no / depends",
                "zh": "是／否／視乎情況"
              },
              {
                "en": "Find a phrase in p. 109",
                "zh": "在第109頁找出詞句"
              }
            ],
            [
              {
                "en": "Danh",
                "zh": "Danh"
              },
              {
                "en": "Yes / no / depends",
                "zh": "是／否／視乎情況"
              },
              {
                "en": "Find a phrase in p. 109",
                "zh": "在第109頁找出詞句"
              }
            ],
            [
              {
                "en": "Aslan",
                "zh": "Aslan"
              },
              {
                "en": "Yes / no / depends",
                "zh": "是／否／視乎情況"
              },
              {
                "en": "Find a phrase in p. 109",
                "zh": "在第109頁找出詞句"
              }
            ]
          ]
        },
        "steps": [
          {
            "en": "Ask one clarification question. Then open the paragraph and check the explanation against it.",
            "zh": "提出一個澄清問題，再打開相關段落核對。"
          }
        ],
        "id": "s2-7"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Check the interpretation",
          "zh": "核對解讀"
        },
        "lead": {
          "en": "Decide whether the reasons fit the writer’s overall position.",
          "zh": "判斷原因是否符合作者整體立場。"
        },
        "ref": "9B · p. 108 · Ex. 4–6",
        "reveal": {
          "title": {
            "en": "Check and explain",
            "zh": "核對並解釋"
          },
          "lines": [
            {
              "en": "No: Lydia and Aslan. Yes: Sophia and Paul. Depends: Daniela and Danh.",
              "zh": "否：Lydia 和 Aslan。是：Sophia 和 Paul。視乎情況：Daniela 和 Danh。"
            },
            {
              "en": "Sophia emphasises thinking; Paul connects teamwork in sport to work.",
              "zh": "Sophia 強調思考；Paul 把運動中的團隊合作與工作連起來。"
            },
            {
              "en": "Daniela recognises a starting point and further learning; Danh emphasises exploring interests.",
              "zh": "Daniela 肯定起步基礎及後續學習；Danh 強調探索興趣。"
            }
          ]
        },
        "steps": [
          {
            "en": "Complete Ex. 6. For one answer, identify how the exercise paraphrases the reading.",
            "zh": "完成第6題，選一題指出題目如何改述閱讀內容。"
          }
        ],
        "id": "s2-8"
      },
      {
        "minutes": 5,
        "title": {
          "en": "What creates the tone?",
          "zh": "甚麼形成語氣？"
        },
        "lead": {
          "en": "Tone comes from choices of words and sentences.",
          "zh": "語氣來自詞語及句式的選擇。"
        },
        "ref": "9B · p. 108 · Ex. 7",
        "steps": [
          {
            "en": "Find wording that makes Aslan sound dismissive and Sophia sound warm.",
            "zh": "找出讓 Aslan 顯得不屑、Sophia 顯得親切的措辭。"
          },
          {
            "en": "Find qualifications in Daniela’s or Danh’s paragraph. Explain what they limit.",
            "zh": "在 Daniela 或 Danh 的段落找出限定語，說明它們限制了甚麼。"
          }
        ],
        "takeaway": {
          "en": "A friendly tone does not prove a claim. An unfriendly writer may still raise a useful problem.",
          "zh": "友善語氣不代表論點已獲證實；語氣不友善的作者也可能提出有用問題。"
        },
        "id": "s2-9"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Same topic, different wording",
          "zh": "同一話題，不同措辭"
        },
        "lead": {
          "en": "Read these original student comments. Which sounds dismissive, warm or qualified?",
          "zh": "閱讀這些原創學生留言，判斷哪個顯得不屑、親切或有保留。"
        },
        "reading": [
          {
            "number": 1,
            "text": {
              "en": "Group work is a waste of time. Nobody learns anything.",
              "zh": "分組工作浪費時間，根本沒有人學到任何東西。"
            }
          },
          {
            "number": 2,
            "text": {
              "en": "My partner helped me explain an idea I had struggled with. I felt much more confident after our rehearsal.",
              "zh": "同伴幫我把一直說不清的想法講明白；排練後我更有信心。"
            }
          },
          {
            "number": 3,
            "text": {
              "en": "Group work can help us practise explaining ideas, although the tasks need clear responsibilities.",
              "zh": "分組工作能讓我們練習解釋想法，但任務需要清楚分工。"
            }
          }
        ],
        "quiz": [
          {
            "prompt": {
              "en": "Which comment makes the broadest unsupported claim?",
              "zh": "哪個留言作出的無證據概括最大？"
            },
            "choices": [
              {
                "en": "1",
                "zh": "1"
              },
              {
                "en": "2",
                "zh": "2"
              },
              {
                "en": "3",
                "zh": "3"
              }
            ],
            "correct": 0,
            "feedback": {
              "en": "Nobody learns anything generalises to everyone without evidence.",
              "zh": "Nobody learns anything 在沒有證據下概括所有人。"
            }
          }
        ],
        "source": {
          "en": "Original class examples.",
          "zh": "原創課堂例子。"
        },
        "id": "s2-10"
      },
      {
        "minutes": 3,
        "title": {
          "en": "A complaint worth examining",
          "zh": "值得分析的抱怨"
        },
        "lead": {
          "en": "Read the situation before deciding what advice to give.",
          "zh": "先讀情況，再決定給甚麼建議。"
        },
        "example": "“Our group spent three hours preparing a five-minute presentation. One person did most of the work, and we barely used English. What did we actually learn?”",
        "steps": [
          {
            "en": "Name one real problem. Name one possible learning benefit. What detail would you need to know?",
            "zh": "指出一項實際問題及一項可能的學習益處；還需要知道甚麼？"
          }
        ],
        "id": "s2-11"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Connect an action to a skill",
          "zh": "把行動與技能連起來"
        },
        "lead": {
          "en": "Choose a precise action instead of writing “It is useful.”",
          "zh": "選具體行動，避免只寫「這很有用」。"
        },
        "table": {
          "headers": [
            {
              "en": "Action",
              "zh": "行動"
            },
            {
              "en": "Skill practised",
              "zh": "練習的技能"
            },
            {
              "en": "A possible improvement",
              "zh": "可作的改善"
            }
          ],
          "rows": [
            [
              {
                "en": "Explaining a slide",
                "zh": "解釋投影片"
              },
              {
                "en": "Making information clear",
                "zh": "清楚傳達資訊"
              },
              {
                "en": "Rehearse with a listener",
                "zh": "向聆聽者排練"
              }
            ],
            [
              {
                "en": "Comparing sources",
                "zh": "比較資料來源"
              },
              {
                "en": "Checking evidence",
                "zh": "核對證據"
              },
              {
                "en": "Explain why a source is suitable",
                "zh": "說明來源為何合適"
              }
            ],
            [
              {
                "en": "Dividing tasks",
                "zh": "分配任務"
              },
              {
                "en": "Coordinating responsibilities",
                "zh": "協調責任"
              },
              {
                "en": "Agree a check-in time",
                "zh": "約定進度核對時間"
              }
            ]
          ]
        },
        "fields": [
          {
            "key": "response-plan",
            "label": {
              "en": "Problem / possible benefit / one practical change",
              "zh": "問題／可能益處／一項實際改變"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s2-12"
      },
      {
        "minutes": 7,
        "title": {
          "en": "Write a useful reply",
          "zh": "寫有用的回覆"
        },
        "lead": {
          "en": "Write 70–90 words to the student. Recognise the problem and give a specific next step.",
          "zh": "寫70–90字回覆同學，指出問題並提出具體下一步。"
        },
        "example": "I understand why you feel … One useful part could be … For example, … Next time, your group could …",
        "steps": [
          {
            "en": "Use one idea from the reading and one concrete example. Acknowledge the reading writer by name.",
            "zh": "運用一個閱讀觀點及一個具體例子，寫出閱讀作者的名字。"
          }
        ],
        "fields": [
          {
            "key": "reply-draft",
            "label": {
              "en": "My first reply",
              "zh": "我的初稿"
            },
            "hint": "Aim for 70–90 words.",
            "rows": 7
          }
        ],
        "id": "s2-13"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Read it as your classmate",
          "zh": "以同學角度閱讀"
        },
        "lead": {
          "en": "Exchange replies. Give one suggestion that the writer can use immediately.",
          "zh": "交換回覆，給一項可立即採用的建議。"
        },
        "steps": [
          {
            "en": "Underline the specific problem and proposed action. Is the connection between activity and skill explained?",
            "zh": "劃出具體問題及建議行動，有解釋活動與技能的關係嗎？"
          },
          {
            "en": "Check one dependent preposition if used. Ask about one unclear sentence.",
            "zh": "如有介詞配搭，核對一處，並問一句意思不清楚的句子。"
          }
        ],
        "fields": [
          {
            "key": "reply-revised",
            "label": {
              "en": "My revised reply",
              "zh": "我的修訂稿"
            },
            "hint": "Make at least one useful change.",
            "rows": 7
          }
        ],
        "id": "s2-14"
      },
      {
        "minutes": 5,
        "title": {
          "en": "What do you think now?",
          "zh": "你現在怎樣看？"
        },
        "lead": {
          "en": "Return to your first position. You may keep it, qualify it or change it.",
          "zh": "回到最初立場，可以保留、加上條件或改變。"
        },
        "fields": [
          {
            "key": "exit",
            "label": {
              "en": "My position, reading evidence and personal example",
              "zh": "我的立場、閱讀證據及個人例子"
            },
            "hint": "I now think … In the reading, … In my experience, …",
            "rows": 5
          }
        ],
        "takeaway": {
          "en": "Show where an interpretation comes from. A label alone is not enough.",
          "zh": "說明解讀的依據，只有標籤並不足夠。"
        },
        "id": "s2-15"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Prepare a small interview",
          "zh": "準備小訪談"
        },
        "lead": {
          "en": "Ask a classmate about an interest, an experience and something they want to learn.",
          "zh": "問同學一項興趣、一項經歷及一項想學的事情。"
        },
        "steps": [
          {
            "en": "Write keywords from three answers. Check your notes with the speaker. About 10 minutes.",
            "zh": "記錄三個答案的關鍵詞，並跟說話者核對，約10分鐘。"
          },
          {
            "en": "You can use a fictional profile from the next lesson if you cannot arrange an interview.",
            "zh": "未能安排訪談時，可使用下節的虛構人物資料。"
          }
        ],
        "export": true,
        "id": "s2-16"
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
    "sections": "9C + 9E speaking",
    "pages": "110–111, 114",
    "outcome": {
      "en": "Ask useful questions and report answers without changing meaning or certainty.",
      "zh": "提出有用問題，轉述答案時保留原意及確定程度。"
    },
    "slides": [
      {
        "minutes": 3,
        "title": {
          "en": "Did she actually say that?",
          "zh": "她真的這樣說嗎？"
        },
        "lead": {
          "en": "A small change can turn a possibility into a promise.",
          "zh": "小改動也能把可能變成承諾。"
        },
        "cover": true,
        "example": "Original: “I might join if the meetings are on Fridays.”\nReport: “She said she would join.”",
        "steps": [
          {
            "en": "What has disappeared? What might the listener wrongly expect?",
            "zh": "少了甚麼？聆聽者可能產生甚麼錯誤期望？"
          }
        ],
        "takeaway": {
          "en": "Today: ask → listen → report → check with the speaker.",
          "zh": "今天：提問 → 聆聽 → 轉述 → 跟說話者核對。"
        },
        "id": "s3-1"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Keep the condition",
          "zh": "保留條件"
        },
        "lead": {
          "en": "Check information, certainty and conditions.",
          "zh": "核對資訊、確定程度及條件。"
        },
        "quiz": [
          {
            "prompt": {
              "en": "“I can help on Friday, but only after three.” Which report keeps the meaning?",
              "zh": "「星期五我能幫忙，但只能三時後。」哪個轉述保留原意？"
            },
            "choices": [
              {
                "en": "She said she could help all Friday.",
                "zh": "She said she could help all Friday."
              },
              {
                "en": "She said she could help on Friday after three.",
                "zh": "She said she could help on Friday after three."
              },
              {
                "en": "She said she could not help on Friday.",
                "zh": "She said she could not help on Friday."
              }
            ],
            "correct": 1,
            "feedback": {
              "en": "After three is a necessary condition.",
              "zh": "三時後是必要條件。"
            }
          }
        ],
        "fields": [
          {
            "key": "message-repair",
            "label": {
              "en": "Repair the opening report",
              "zh": "修正開場的轉述"
            },
            "hint": "She said she might … if …",
            "rows": 3
          }
        ],
        "id": "s3-2"
      },
      {
        "minutes": 3,
        "title": {
          "en": "Before the careers conversation",
          "zh": "職業對話前準備"
        },
        "lead": {
          "en": "Think of one app you use often. What makes it easy or difficult to use?",
          "zh": "想一個常用應用程式，甚麼令它容易或難用？"
        },
        "ref": "9E · p. 114 · Audio 59 · Ex. 2",
        "steps": [
          {
            "en": "Predict what a user experience designer might improve.",
            "zh": "預測使用者體驗設計師可能改善甚麼。"
          },
          {
            "en": "Prepare three note headings: interests / job tasks / skills.",
            "zh": "準備三個筆記欄：興趣／工作內容／技能。"
          }
        ],
        "id": "s3-3"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Listen for the main connection",
          "zh": "聽出主要關聯"
        },
        "lead": {
          "en": "Play Audio 59. How do the student’s interests connect to the suggested role?",
          "zh": "播放音訊59，學生的興趣與建議職業有甚麼關聯？"
        },
        "ref": "9E · p. 114 · Ex. 2",
        "fields": [
          {
            "key": "careers-gist",
            "label": {
              "en": "Interests and the suggested role",
              "zh": "興趣及建議職業"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "reveal": {
          "title": {
            "en": "Check and explain",
            "zh": "核對並解釋"
          },
          "lines": [
            {
              "en": "The student enjoys games, does well in IT and likes art. The adviser suggests UX design.",
              "zh": "學生喜歡遊戲、資訊科技成績好，也喜歡美術；顧問建議使用者體驗設計。"
            }
          ]
        },
        "id": "s3-4"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Check the details",
          "zh": "核對細節"
        },
        "lead": {
          "en": "Replay Audio 59. Complete the four choices, then compare one piece of evidence.",
          "zh": "重播音訊59，完成四項選擇，再比較一項證據。"
        },
        "ref": "9E · p. 114 · Ex. 2–3",
        "reveal": {
          "title": {
            "en": "Check and explain",
            "zh": "核對並解釋"
          },
          "lines": [
            {
              "en": "Ex. 2: enjoys / easy to use / banks / art.",
              "zh": "第2題：enjoys／easy to use／banks／art。"
            },
            {
              "en": "The conversation links design with teamwork and computer skills.",
              "zh": "對話把設計與團隊合作、電腦技能連起來。"
            }
          ]
        },
        "teacher": {
          "en": "The textbook conversation’s pay comparisons are a speaker’s claims in that recording. Do not present them as current salary guidance.",
          "zh": "錄音中的收入比較屬該對話說法，不當作現時薪酬指引。"
        },
        "id": "s3-5"
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
            ]
          ]
        },
        "takeaway": {
          "en": "Common pattern after said/told: present → past; past/present perfect → past perfect; can → could.",
          "zh": "said／told 後的常見變化：現在式 → 過去式；過去式／現在完成式 → 過去完成式；can → could。"
        },
        "id": "s3-6"
      },
      {
        "minutes": 5,
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
          "en": "Teach common backshift first. Present forms may remain when reporting information that is still true; judge the meaning in context. Reported questions are outside this lesson’s assessed scope.",
          "zh": "先教常見時態後移；仍然屬實的資訊可保留現在式，須按語境判斷。本節不評核間接問句轉述。"
        },
        "id": "s3-7"
      },
      {
        "minutes": 5,
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
          }
        ],
        "takeaway": {
          "en": "Yes/no questions often rise; wh-questions often fall. Natural intonation varies with purpose.",
          "zh": "是非問句常上揚，wh 問句常下降；自然語調會按目的改變。"
        },
        "id": "s3-9"
      },
      {
        "minutes": 4,
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
            "en": "Take turns asking. Add one follow-up that responds to the answer.",
            "zh": "輪流提問，加一條根據答案而來的追問。"
          },
          {
            "en": "Avoid judging someone’s ability from their favourite subject alone. Ask for an example.",
            "zh": "不要只憑喜歡的科目判斷能力，請對方舉例。"
          }
        ],
        "id": "s3-10"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Interview, report, verify",
          "zh": "訪談、轉述、核對"
        },
        "lead": {
          "en": "Work in groups of three: speaker, interviewer and new listener. Rotate roles.",
          "zh": "三人一組：說話者、訪問者及新聆聽者，之後輪換角色。"
        },
        "steps": [
          {
            "en": "The interviewer asks four questions and records keywords. The speaker checks the notes.",
            "zh": "訪問者問四題並記錄關鍵詞，說話者核對筆記。"
          },
          {
            "en": "The interviewer reports three answers to the new listener. The original speaker then checks the report.",
            "zh": "訪問者向新聆聽者轉述三個答案，原說話者再核對。"
          },
          {
            "en": "Use your own information or choose a fictional profile on the next slide.",
            "zh": "可用自己的資料，或選下頁的虛構人物。"
          }
        ],
        "id": "s3-11"
      },
      {
        "minutes": 4,
        "title": {
          "en": "Prepare your information",
          "zh": "準備你的資料"
        },
        "lead": {
          "en": "Choose a campus media team, welcome event or design workshop.",
          "zh": "選校園媒體團隊、新生活動或設計工作坊。"
        },
        "columns": [
          {
            "title": {
              "en": "Fictional profile: Kai",
              "zh": "虛構人物：Kai"
            },
            "lines": [
              {
                "en": "“I enjoy photography. I helped at a school sports day.”",
                "zh": "「我喜歡攝影，曾在學校運動會幫忙。」"
              },
              {
                "en": "“I can help on Friday after three. I want to learn video editing.”",
                "zh": "「星期五三時後我能幫忙，我想學剪片。」"
              }
            ]
          },
          {
            "title": {
              "en": "Fictional profile: Mei",
              "zh": "虛構人物：Mei"
            },
            "lines": [
              {
                "en": "“I like drawing. I have never made an event poster.”",
                "zh": "「我喜歡畫畫，但未做過活動海報。」"
              },
              {
                "en": "“I might join if beginners are welcome. I need to check my timetable.”",
                "zh": "「如果歡迎初學者，我可能加入；我要先看時間表。」"
              }
            ]
          }
        ],
        "fields": [
          {
            "key": "interview-plan",
            "label": {
              "en": "My questions and the speaker’s key answers",
              "zh": "我的問題及說話者答案關鍵詞"
            },
            "hint": "Keep names optional. Record meaning, not every word.",
            "rows": 6
          }
        ],
        "id": "s3-12"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Round one: find out",
          "zh": "第一輪：了解對方"
        },
        "lead": {
          "en": "Ask, listen and check. Everyone takes the interviewer role once.",
          "zh": "提問、聆聽及核對，每人都擔任一次訪問者。"
        },
        "steps": [
          {
            "en": "Use two minutes per interviewer. Ask four questions, then check one detail aloud.",
            "zh": "每位訪問者兩分鐘，問四題，再口頭核對一項細節。"
          },
          {
            "en": "Try: “So you can help after three, but you are not sure about Saturday?”",
            "zh": "可說：「所以你三時後能幫忙，但星期六未確定？」"
          }
        ],
        "fields": [
          {
            "key": "interview-notes",
            "label": {
              "en": "Keywords I will report",
              "zh": "我要轉述的關鍵詞"
            },
            "hint": "",
            "rows": 5
          }
        ],
        "id": "s3-13"
      },
      {
        "minutes": 6,
        "title": {
          "en": "Round two: pass it on",
          "zh": "第二輪：轉告別人"
        },
        "lead": {
          "en": "Report three answers without reading the original sentences aloud.",
          "zh": "轉述三個答案，避免逐句讀出原句。"
        },
        "example": "Kai said he enjoyed photography. He told me he had helped at a sports day. He said he could help on Friday after three.",
        "steps": [
          {
            "en": "Rotate every two minutes. The new listener asks one clarification question.",
            "zh": "每兩分鐘輪換，新聆聽者問一個澄清問題。"
          },
          {
            "en": "Check the person, time, tense and certainty. Leave out details you did not hear.",
            "zh": "核對人物、時間、時態及確定程度，未聽到的細節不要添加。"
          }
        ],
        "fields": [
          {
            "key": "reported-answers",
            "label": {
              "en": "Three answers in reported speech",
              "zh": "用間接引語轉述三個答案"
            },
            "hint": "",
            "rows": 5
          }
        ],
        "id": "s3-14"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Check with the source",
          "zh": "跟原說話者核對"
        },
        "lead": {
          "en": "The original speaker checks the report. Repair one sentence, then say it again.",
          "zh": "原說話者核對轉述，修正一句，再說一次。"
        },
        "steps": [
          {
            "en": "Does it preserve the information? The certainty? The conditions?",
            "zh": "有保留資訊、確定程度及條件嗎？"
          },
          {
            "en": "If the grammar is correct but the meaning changed, fix the meaning first.",
            "zh": "文法正確但意思改變時，先修正意思。"
          }
        ],
        "fields": [
          {
            "key": "verified-report",
            "label": {
              "en": "My corrected report and what changed",
              "zh": "我的修正轉述及改動之處"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "id": "s3-15"
      },
      {
        "minutes": 5,
        "title": {
          "en": "Report it independently",
          "zh": "獨立轉述"
        },
        "lead": {
          "en": "Use the situation given here, then explain one change.",
          "zh": "根據以下情境轉述，再解釋一項改動。"
        },
        "example": "Yesterday, Alex told you: “I am free tomorrow, but I can only stay for an hour.”\nReport the message today.",
        "fields": [
          {
            "key": "exit",
            "label": {
              "en": "My report and one explanation",
              "zh": "我的轉述及一項解釋"
            },
            "hint": "",
            "rows": 3
          }
        ],
        "reveal": {
          "title": {
            "en": "Check and explain",
            "zh": "核對並解釋"
          },
          "lines": [
            {
              "en": "Alex said he was free today, but he could only stay for an hour.",
              "zh": "Alex 說他今天有空，但只能留一小時。"
            },
            {
              "en": "Tomorrow becomes today because you are reporting on the following day. Keep the one-hour condition.",
              "zh": "翌日轉述時，tomorrow 變成 today；保留只能一小時的條件。"
            }
          ]
        },
        "id": "s3-16"
      },
      {
        "minutes": 2,
        "title": {
          "en": "Bring an object with another life",
          "zh": "帶來可再利用的物品"
        },
        "lead": {
          "en": "Before Session 4, photograph or describe something that could be repaired, borrowed, shared or reused.",
          "zh": "第四節前，拍攝或描述一件可維修、借用、共享或再用的物品。"
        },
        "steps": [
          {
            "en": "A book, bag, cable or decoration is enough. Explain one possible next use. About 10 minutes.",
            "zh": "書、袋、電線或裝飾都可以，說明一種下一步用途，約10分鐘。"
          }
        ],
        "export": true,
        "id": "s3-17"
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
