import type { CoreText } from './dedc02QuantCoreLesson';
export interface SpssStep { click: string; explanation: CoreText; }
export interface SpssOutput { table: string; read: CoreText; }
export interface SpssSource { label: string; url: string; }
export interface SpssWorkflow {
 id: string; title: CoreText; question: CoreText; layout: CoreText; menu: string;
 steps: SpssStep[]; output: SpssOutput[]; checks: CoreText[]; sources: SpssSource[];
}
export interface SpssGuide { method: string; workflows: SpssWorkflow[]; }
const ibm=(topic:string,version='30.0.0')=>`https://www.ibm.com/docs/en/spss-statistics/${version}?topic=${topic}`;
export const spssPracticePath='/teaching/courses/dedc02/spss/topic8-practice.csv';
export const spssGuideBySlide: Record<string,SpssGuide>={
 "ttest-spss": {
  "method": "ttest",
  "workflows": [
   {
    "id": "independent",
    "title": [
     "Independent-samples t-test",
     "獨立樣本 t 檢定"
    ],
    "question": [
     "Do quiet-room and music-room learners have different mean quiz scores?",
     "安靜室與音樂室學習者的平均小測分數是否不同？"
    ],
    "layout": [
     "One row per learner. quiz = score; study_group: 1 = quiet room, 2 = music room.",
     "每列一人。quiz為分數；study_group：1 = 安靜室，2 = 音樂室。"
    ],
    "menu": "Analyze → Compare Means and Proportions → Independent-Samples T Test…",
    "steps": [
     {
      "click": "Test Variable(s): quiz; Grouping Variable: study_group",
      "explanation": [
       "Move each variable into its box.",
       "把兩個变量移入相應方框。"
      ]
     },
     {
      "click": "Define Groups… → Group 1: 1; Group 2: 2 → Continue",
      "explanation": [
       "Use the stored codes; group 3 is excluded.",
       "輸入類別代碼；第3組不納入。"
      ]
     },
     {
      "click": "Options… → Confidence Interval: 95% → Continue",
      "explanation": [
       "Request effect sizes and the homogeneity test if those options are shown.",
       "如有選項，要求效應量及方差齊性檢定。"
      ]
     },
     {
      "click": "OK",
      "explanation": [
       "Open the output tables.",
       "查看輸出表。"
      ]
     }
    ],
    "output": [
     {
      "table": "Group Statistics",
      "read": [
       "Read each group’s N, Mean and Std. Deviation.",
       "讀各組N、Mean及Std. Deviation。"
      ]
     },
     {
      "table": "Independent Samples Test",
      "read": [
       "Read t, df, two-sided p, Mean Difference and 95% CI from the same row. “Equal variances not assumed” is Welch.",
       "從同一列讀t、df、雙側p、Mean Difference及95%置信區間；Equal variances not assumed為Welch列。"
      ]
     }
    ],
    "checks": [
     [
      "Levene’s Sig. concerns variances; use the t-test’s p for the mean difference.",
      "Levene的Sig.針對方差；平均差須看t檢定的p。"
     ]
    ],
    "sources": [
     {
      "label": "IBM: Independent-Samples T Test",
      "url": "https://www.ibm.com/docs/en/spss-statistics/31.0.0?topic=tests-independent-samples-t-test"
     }
    ]
   },
   {
    "id": "paired",
    "title": [
     "Paired-samples t-test",
     "配對樣本 t 檢定"
    ],
    "question": [
     "Do the same learners’ mean scores change after a workshop?",
     "同一批學習者工作坊前後的平均分數是否改變？"
    ],
    "layout": [
     "One row per learner, with before and after scores on the same row.",
     "每列一人，同一人的before與after分數放在同一列。"
    ],
    "menu": "Analyze → Compare Means and Proportions → Paired-Samples T Test…",
    "steps": [
     {
      "click": "Paired Variables → Variable1: after; Variable2: before",
      "explanation": [
       "Move the two scores into one pair: the difference is after − before.",
       "把兩個分數放入同一對；差值為後測減前測。"
      ]
     },
     {
      "click": "Options… → Confidence Interval: 95% → Continue",
      "explanation": [
       "If requesting an effect size, use the SD of the paired differences and name that definition.",
       "若要求效應量，以配對差值的SD作分母，並列明此定義。"
      ]
     },
     {
      "click": "OK",
      "explanation": [
       "Open the paired output.",
       "查看配對輸出。"
      ]
     }
    ],
    "output": [
     {
      "table": "Paired Samples Statistics",
      "read": [
       "Read Mean, N and Std. Deviation for before and after.",
       "讀前後測的Mean、N及Std. Deviation。"
      ]
     },
     {
      "table": "Paired Samples Test",
      "read": [
       "Read the mean change, 95% CI, t, df and two-sided p.",
       "讀平均變化、95%置信區間、t、df及雙側p。"
      ]
     }
    ],
    "checks": [
     [
      "Use complete pairs and check the differences. Paired Samples Correlations does not test mean change.",
      "使用完整配對並檢視差值；Paired Samples Correlations不是平均變化的檢定。"
     ]
    ],
    "sources": [
     {
      "label": "IBM: Paired-Samples T Test and effect-size standardisers",
      "url": "https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=tests-paired-samples-t-test"
     }
    ]
   }
  ]
 },
 "correlation-spss": {
  "method": "correlation",
  "workflows": [
   {
    "id": "bivariate",
    "title": [
     "Pearson correlation",
     "Pearson相關"
    ],
    "question": [
     "Do learners who study longer tend to have higher quiz scores?",
     "溫習較久的學習者，小測分數是否傾向較高？"
    ],
    "layout": [
     "One row per learner. study_hours = weekly study hours; quiz = score.",
     "每列一人；study_hours為每週溫習時數，quiz為分數。"
    ],
    "menu": "Analyze → Correlate → Bivariate…",
    "steps": [
     {
      "click": "Variables: study_hours, quiz",
      "explanation": [
       "Move both variables into Variables.",
       "把兩個变量移入Variables。"
      ]
     },
     {
      "click": "Pearson; Two-tailed",
      "explanation": [
       "Use Pearson for the linear relationship taught here.",
       "此處研究線性關係，選Pearson。"
      ]
     },
     {
      "click": "OK",
      "explanation": [
       "Find the cell linking study_hours with quiz.",
       "找study_hours與quiz交叉的那一格。"
      ]
     }
    ],
    "output": [
     {
      "table": "Correlations",
      "read": [
       "Read Pearson Correlation (r), Sig. (2-tailed) and N.",
       "讀Pearson Correlation（r）、Sig. (2-tailed)及N。"
      ]
     }
    ],
    "checks": [
     [
      "Check a scatterplot for a roughly linear pattern and unusual points. The diagonal 1.000 is a variable’s correlation with itself.",
      "先用散佈圖檢查大致線性模式及異常點；對角線1.000是变量與自己的相關。"
     ]
    ],
    "sources": [
     {
      "label": "IBM: Bivariate Correlations",
      "url": "https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=features-bivariate-correlations"
     }
    ]
   }
  ]
 },
 "anova-spss": {
  "method": "anova",
  "workflows": [
   {
    "id": "oneway",
    "title": [
     "One-way ANOVA and follow-up comparisons",
     "單因子ANOVA及後續比較"
    ],
    "question": [
     "Do mean quiz scores differ across quiet-room, music-room and café learners?",
     "安靜室、音樂室及咖啡店學習者的平均小測分數是否不同？"
    ],
    "layout": [
     "quiz = score; study_group: 1 = quiet room, 2 = music room, 3 = café.",
     "quiz為分數；study_group：1 = 安靜室，2 = 音樂室，3 = 咖啡店。"
    ],
    "menu": "Analyze → Compare Means and Proportions → One-Way ANOVA…",
    "steps": [
     {
      "click": "Dependent List: quiz; Factor: study_group",
      "explanation": [
       "Put the score and group code in separate boxes.",
       "分數與組別代碼放在不同方框。"
      ]
     },
     {
      "click": "Options… → Descriptive; Homogeneity of variance test; Welch → Continue",
      "explanation": [
       "Request group summaries and the variance and overall tests.",
       "要求組別摘要、方差齊性及整體檢定。"
      ]
     },
     {
      "click": "Post Hoc… → Tukey OR Games-Howell → Continue",
      "explanation": [
       "Use Tukey for a justified equal-variance analysis; Games-Howell with Welch for unequal variances.",
       "有等方差理據時用Tukey；方差不等時配合Welch用Games-Howell。"
      ]
     },
     {
      "click": "OK",
      "explanation": [
       "Open the overall and pairwise results.",
       "查看整體及兩兩比較結果。"
      ]
     }
    ],
    "output": [
     {
      "table": "Descriptives",
      "read": [
       "Read each group’s N, Mean and Std. Deviation.",
       "讀各組N、Mean及Std. Deviation。"
      ]
     },
     {
      "table": "ANOVA / Robust Tests of Equality of Means",
      "read": [
       "Read F (or Welch Statistic), both df values and Sig. from the chosen test.",
       "從所選檢定讀F（或Welch Statistic）、兩個df及Sig.。"
      ]
     },
     {
      "table": "Multiple Comparisons",
      "read": [
       "Read the chosen method’s Mean Difference, adjusted Sig. and CI.",
       "讀所選方法的Mean Difference、調整後Sig.及置信區間。"
      ]
     }
    ],
    "checks": [
     [
      "A significant overall test does not mean every pair differs.",
      "整體顯著不表示每一對組別都不同。"
     ]
    ],
    "sources": [
     {
      "label": "IBM: One-Way ANOVA and effect-size option",
      "url": "https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=features-one-way-anova"
     }
    ]
   }
  ]
 },
 "chi-spss": {
  "method": "chi",
  "workflows": [
   {
    "id": "crosstabs",
    "title": [
     "Chi-square test of independence through Crosstabs",
     "用Crosstabs做卡方獨立性檢定"
    ],
    "question": [
     "Is study environment associated with preferring video or text?",
     "溫習環境是否與偏好影片或文字相關？"
    ],
    "layout": [
     "One row per learner. study_group has three groups; preference: 1 = video, 2 = text.",
     "每列一人；study_group有三組；preference：1 = 影片，2 = 文字。"
    ],
    "menu": "Analyze → Descriptive Statistics → Crosstabs…",
    "steps": [
     {
      "click": "Row(s): study_group; Column(s): preference",
      "explanation": [
       "Move each category variable into its box.",
       "把兩個類別变量移入相應方框。"
      ]
     },
     {
      "click": "Statistics… → Chi-square; Phi and Cramer’s V → Continue",
      "explanation": [
       "Request the test and association size.",
       "要求檢定及關聯大小。"
      ]
     },
     {
      "click": "Cells… → Observed; Expected; Row percentages → Continue",
      "explanation": [
       "Show counts and the percentage within each study group.",
       "顯示人數及每組內的百分比。"
      ]
     },
     {
      "click": "OK",
      "explanation": [
       "Open the crosstab and test tables.",
       "查看列聯表及檢定表。"
      ]
     }
    ],
    "output": [
     {
      "table": "Crosstabulation",
      "read": [
       "Read Count, Expected Count and row percentages; check valid N.",
       "讀Count、Expected Count及列百分比，確認有效N。"
      ]
     },
     {
      "table": "Chi-Square Tests → Pearson Chi-Square",
      "read": [
       "Read Value (χ²), df and the two-sided p. Check the expected-count footnote.",
       "讀Value（χ²）、df及雙側p，並看期望次數註解。"
      ]
     },
     {
      "table": "Symmetric Measures → Cramer’s V",
      "read": [
       "Read V as association size; use percentages to describe the pattern.",
       "讀V以了解關聯大小，用百分比描述模式。"
      ]
     }
    ],
    "checks": [
     [
      "Use independent cases. Small expected counts may require an exact test rather than the usual asymptotic p.",
      "使用獨立個案；期望次數太小時，可能須用精確檢定，不能直接依賴一般漸近p。"
     ]
    ],
    "sources": [
     {
      "label": "IBM: running Crosstabs",
      "url": "https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=relationships-running-analysis"
     }
    ]
   }
  ]
 }
};
