export type AgendaItem = {
  id: string;
  time: string;
  minutes: number;
  title: string;
  purpose: string;
};

export type ClassificationItem = {
  id: string;
  prompt: string;
  answer: "of" | "for" | "as";
  explanation: string;
};

export type StrategyScenario = {
  id: string;
  prompt: string;
  isFormative: boolean;
  explanation: string;
};

export const agenda: AgendaItem[] = [
  {
    id: "opening",
    time: "00–12",
    minutes: 12,
    title: "Did learning happen?",
    purpose: "Distinguish a polished product from evidence of learning.",
  },
  {
    id: "ownership",
    time: "12–28",
    minutes: 16,
    title: "The ownership problem",
    purpose: "Frame AI use as a question of thinking, judgement and agency.",
  },
  {
    id: "purposes",
    time: "28–48",
    minutes: 20,
    title: "Of, for and as learning",
    purpose: "Separate three assessment purposes through one shared task.",
  },
  {
    id: "strategies",
    time: "48–68",
    minutes: 20,
    title: "Five formative strategies",
    purpose: "Connect evidence, feedback, peers and learner ownership.",
  },
  {
    id: "diagnosis",
    time: "68–78",
    minutes: 10,
    title: "Rapid diagnosis",
    purpose: "Spot formative practice—and formative-looking theatre.",
  },
  {
    id: "break",
    time: "78–88",
    minutes: 10,
    title: "Pause",
    purpose: "A ten-minute break.",
  },
  {
    id: "judgement",
    time: "88–108",
    minutes: 20,
    title: "Learn to judge quality",
    purpose: "Compare first, then use criteria to refine judgement.",
  },
  {
    id: "dialogue",
    time: "108–125",
    minutes: 17,
    title: "Turn AI into a dialogue partner",
    purpose: "Replace answer delivery with prompts that preserve cognition.",
  },
  {
    id: "redesign",
    time: "125–143",
    minutes: 18,
    title: "Redesign an assessment",
    purpose: "Build a five-move learning loop for one discipline.",
  },
  {
    id: "share",
    time: "143–148",
    minutes: 5,
    title: "Sixty-second share",
    purpose: "Test whether the design requires thinking, judgement and action.",
  },
  {
    id: "exit",
    time: "148–150",
    minutes: 2,
    title: "Commit to one change",
    purpose: "Name what to stop, start and look for.",
  },
];

export const assessmentPurposes: ClassificationItem[] = [
  {
    id: "final-grade",
    prompt: "A final project is graded after the course to certify achievement.",
    answer: "of",
    explanation: "The evidence summarises attainment after learning; it does not shape the next learning move.",
  },
  {
    id: "hinge-question",
    prompt: "A teacher uses a hinge question, notices a misconception, and changes the next activity.",
    answer: "for",
    explanation: "Evidence is used immediately to adapt teaching and move learning forward.",
  },
  {
    id: "annotated-revision",
    prompt: "A student compares two exemplars, annotates their own draft, and chooses a revision priority.",
    answer: "as",
    explanation: "The student learns through making and using a quality judgement.",
  },
  {
    id: "ai-score",
    prompt: "An AI tool assigns a score and the student closes the page.",
    answer: "of",
    explanation: "A score alone records a result. Without interpretation or action, it is not formative.",
  },
  {
    id: "feedback-action",
    prompt: "A peer asks one question; the author explains which suggestion they will use, reject or adapt—and why.",
    answer: "as",
    explanation: "The learner evaluates feedback and takes responsibility for the next decision.",
  },
];

export const formativeStrategies = [
  {
    label: "Clarify direction",
    question: "Where am I going?",
    action: "Share learning intentions, unpack success criteria and examine exemplars.",
  },
  {
    label: "Elicit evidence",
    question: "Where am I now?",
    action: "Design questions and tasks that reveal thinking—not only finished answers.",
  },
  {
    label: "Move learning forward",
    question: "What next?",
    action: "Give feedback that creates a manageable action for the learner.",
  },
  {
    label: "Activate peers",
    question: "Who can help me see differently?",
    action: "Use peers as sources of questions, comparisons and alternative strategies.",
  },
  {
    label: "Activate the learner",
    question: "How will I regulate my learning?",
    action: "Build self-assessment, monitoring and decision-making into the task.",
  },
] as const;

export const strategyScenarios: StrategyScenario[] = [
  {
    id: "quiz-score",
    prompt: "Students take a five-question quiz. The teacher records the marks and begins the next topic.",
    isFormative: false,
    explanation: "The quiz could produce useful evidence, but nobody uses it to decide what happens next.",
  },
  {
    id: "traffic-lights",
    prompt: "Students select green, amber or red. The teacher asks two amber students to explain and adapts the example.",
    isFormative: true,
    explanation: "The signal becomes formative because it elicits thinking and changes the teaching response.",
  },
  {
    id: "generic-praise",
    prompt: "AI tells every student: “Excellent work—add more detail.” Students submit the same draft.",
    isFormative: false,
    explanation: "Generic comments without a required learner action do not move learning forward.",
  },
  {
    id: "feedback-log",
    prompt: "Students label each AI suggestion accept, adapt or reject, explain why, then highlight the resulting revision.",
    isFormative: true,
    explanation: "The design makes judgement and uptake visible rather than treating feedback as information delivered.",
  },
];

export const workSamples = {
  polished: {
    label: "Sample A · Polished product",
    text: "Formative assessment transforms classrooms by enabling continuous feedback, personalising instruction and empowering every learner to reach their full potential.",
    evidence: [
      "Fluent and confident prose",
      "No visible source trail",
      "No explanation of key terms",
      "No record of alternatives considered",
      "No revision decisions",
    ],
  },
  traceable: {
    label: "Sample B · Traceable thinking",
    text: "I first treated all feedback as formative. After comparing the two cases, I revised my claim: feedback becomes formative only when evidence is interpreted and used to change a learner’s or teacher’s next action.",
    evidence: [
      "Initial misconception is visible",
      "Comparison produced a conceptual change",
      "The revised claim is more precise",
      "Reason for revision is stated",
      "A next question can be asked",
    ],
  },
};

export const disciplinePrompts = {
  Humanities: "Students use AI to draft a historical interpretation but cannot defend the reliability of its evidence.",
  Education: "Students can name learning theories but cannot use them to diagnose a new classroom case.",
  STEM: "Students obtain a correct solution from AI but cannot explain why the method works or transfer it.",
  Arts: "Students generate a polished concept but cannot articulate or evaluate their creative decisions.",
} as const;

export const fiveMoves = [
  {
    key: "think",
    title: "Think first",
    prompt: "What must learners predict, attempt or explain before using AI?",
  },
  {
    key: "compare",
    title: "Compare",
    prompt: "What will they compare—their attempt, an exemplar, a peer response or AI output?",
  },
  {
    key: "judge",
    title: "Judge",
    prompt: "Which criteria will they use, and how must they justify the judgement?",
  },
  {
    key: "improve",
    title: "Improve",
    prompt: "What visible revision or next action must follow from feedback?",
  },
  {
    key: "reflect",
    title: "Reflect",
    prompt: "How will they explain what changed, why it changed and what they will do independently next time?",
  },
] as const;

export const references = [
  "Black, P., & Wiliam, D. (1998). Assessment and classroom learning. Assessment in Education, 5(1), 7–74.",
  "Earl, L. M. (2013). Assessment as Learning: Using Classroom Assessment to Maximize Student Learning (2nd ed.). Corwin.",
  "Wiliam, D., & Thompson, M. (2008). Integrating assessment with learning: What will it take to make it work?",
  "Tai, J., Ajjawi, R., Boud, D., Dawson, P., & Panadero, E. (2018). Developing evaluative judgement. Higher Education, 76, 467–481.",
  "Carless, D., & Boud, D. (2018). The development of student feedback literacy. Assessment & Evaluation in Higher Education, 43(8), 1315–1325.",
] as const;
