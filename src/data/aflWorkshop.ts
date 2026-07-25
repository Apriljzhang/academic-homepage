export type SlideMeta = {
  id: string;
  number: string;
  time: string;
  minutes: number;
  title: string;
  subtitle: string;
};

export const sessionTitle =
  "Assessment for/as Learning in the Age of AI: From Measuring Performance to Building Learner Agency";

export const sessionQuestion =
  "How can assessment sustain active learning when GenAI can produce the final product?";

export const slides: SlideMeta[] = [
  {
    id: "why-change",
    number: "01",
    time: "00–10",
    minutes: 10,
    title: "Why assessment must change",
    subtitle: "Product, learning, and agency",
  },
  {
    id: "paradigm",
    number: "02",
    time: "10–25",
    minutes: 15,
    title: "From high-stakes to learning-oriented",
    subtitle: "Assessment as the bridge",
  },
  {
    id: "purposes",
    number: "03",
    time: "25–40",
    minutes: 15,
    title: "Of, for & as learning",
    subtitle: "Three purposes, one journey",
  },
  {
    id: "alignment",
    number: "04",
    time: "40–55",
    minutes: 15,
    title: "Alignment and visible quality",
    subtitle: "Intentions, criteria, and process",
  },
  {
    id: "strategies",
    number: "05",
    time: "55–75",
    minutes: 20,
    title: "Five formative strategies",
    subtitle: "Direction, evidence, ownership",
  },
  {
    id: "break",
    number: "06",
    time: "75–85",
    minutes: 10,
    title: "Pause",
    subtitle: "10-minute break",
  },
  {
    id: "evidence",
    number: "07",
    time: "85–100",
    minutes: 15,
    title: "Evidence and responsive teaching",
    subtitle: "Formative only when used",
  },
  {
    id: "feedback",
    number: "08",
    time: "100–115",
    minutes: 15,
    title: "Feedback that moves learning",
    subtitle: "Levels, principles, uptake",
  },
  {
    id: "peers",
    number: "09",
    time: "115–128",
    minutes: 13,
    title: "Peers, judgement, self-regulation",
    subtitle: "Learning through quality decisions",
  },
  {
    id: "genai",
    number: "10",
    time: "128–142",
    minutes: 14,
    title: "GenAI across the formative cycle",
    subtitle: "Scaffolding without outsourcing",
  },
  {
    id: "synthesis",
    number: "11",
    time: "142–150",
    minutes: 8,
    title: "Human non-negotiables",
    subtitle: "Judgement, empathy, agency",
  },
];

export const contrastTriad = [
  {
    label: "Polished product",
    text: "A finished answer or artefact that looks competent.",
    note: "Useful for display, weak as evidence of learning if no thinking trail is visible.",
  },
  {
    label: "Demonstrated learning",
    text: "Evidence of change: misconception, revision, explanation, transfer.",
    note: "Teachers can see what the learner understood, mistook, and improved.",
  },
  {
    label: "Learner agency",
    text: "The learner decides, justifies, monitors, and acts on feedback.",
    note: "Assessment succeeds when students keep ownership of thinking under AI conditions.",
  },
] as const;

export const paradigmShift = [
  {
    from: "High-stakes testing",
    to: "Learning-oriented assessment",
    point: "From ranking and certification alone toward evidence used while learning is still happening.",
  },
  {
    from: "Assessment after teaching",
    to: "Assessment inside instruction",
    point: "High-quality assessment and high-quality instruction reinforce each other.",
  },
  {
    from: "Teacher as grader",
    to: "Teacher as designer and diagnostician",
    point: "Design tasks, interpret evidence, and decide the next pedagogical move.",
  },
] as const;

export const assessmentPurposes = [
  {
    label: "Of learning",
    journey: "Where have we arrived?",
    focus: "Summarise attainment for certification, placement, or reporting.",
    example:
      "A final project receives a grade after the course to certify achievement. The evidence records a destination; it does not reshape the next learning move.",
  },
  {
    label: "For learning",
    journey: "Where are we now, and what next?",
    focus: "Use evidence to adapt teaching and close the gap during learning.",
    example:
      "A hinge question reveals a misconception; the teacher changes the next activity. Evidence becomes formative because someone acts on it.",
  },
  {
    label: "As learning",
    journey: "How do I regulate my own route?",
    focus: "Students learn by judging quality, monitoring progress, and deciding next steps.",
    example:
      "A student compares two exemplars, annotates a draft, and chooses one revision priority. Learning happens through the quality judgement itself.",
  },
] as const;

export const criteriaFramework = [
  {
    label: "Learning intention",
    meaning: "The overarching goal or standard for the task or unit—the ‘what’ students must achieve.",
  },
  {
    label: "Success criteria",
    meaning: "Shared, student-facing descriptions of quality that make excellence visible before work begins.",
  },
  {
    label: "Product criteria",
    meaning: "Qualities of the final deliverable: essay, presentation, model, performance.",
  },
  {
    label: "Performance criteria",
    meaning: "Qualities of the process: drafting, analysing, practising, collaborating, revising.",
  },
] as const;

export const criteriaExamples = [
  {
    title: "Argumentative essay",
    product: [
      "Write a well-supported argumentative essay.",
      "The thesis is clear and appears at the end of the introduction.",
    ],
    performance: [
      "Students organise evidence in a graphic organiser for 15 minutes before drafting.",
      "Feedback targets the organiser first, intervening before the full draft.",
    ],
  },
  {
    title: "Oral presentation",
    product: [
      "Give a 3-minute presentation using the past tense.",
      "Include five target vocabulary items within the time limit.",
    ],
    performance: [
      "Students practise aloud with a partner, focusing on stress and intonation.",
      "Feedback on the practice recording guides revision before the final talk.",
    ],
  },
] as const;

export const formativeStrategies = [
  {
    number: "1",
    label: "Clarify direction",
    question: "Where are we going?",
    action:
      "Share learning intentions, unpack success criteria, and examine exemplars so students know the target before they begin.",
    role: "Teacher clarifies; learners understand the destination.",
  },
  {
    number: "2",
    label: "Elicit evidence",
    question: "Where are we now?",
    action:
      "Design discussions, tasks, and checks that require every student to reveal thinking and misconceptions in real time.",
    role: "Teacher diagnoses the gap from visible evidence.",
  },
  {
    number: "3",
    label: "Move learning forward",
    question: "How do we close the gap?",
    action:
      "Give descriptive, specific, actionable feedback that tells students what to do next—not only how well they scored.",
    role: "Teacher and peers provide next-step information learners can use.",
  },
  {
    number: "4",
    label: "Activate peers",
    question: "How can peers help close the gap?",
    action:
      "Structure peer feedback and collaboration so students learn from and teach one another with shared criteria.",
    role: "Peers become instructional resources, expanding feedback capacity.",
  },
  {
    number: "5",
    label: "Activate the learner",
    question: "How can students close the gap themselves?",
    action:
      "Build self-assessment, monitoring, goal-setting, and reflection into the task so ownership stays with the learner.",
    role: "Learners regulate progress and make quality decisions.",
  },
] as const;

export const formativeDefinition = {
  core: "Assessment becomes formative when evidence is actually used to adapt teaching and learning to meet needs.",
  blackWiliam:
    "Comparison of actual and reference levels yields information which is then used to alter the gap (Black & Wiliam, 1998).",
};

export const elicitationTools = {
  planned: [
    "Text- or curriculum-embedded questions",
    "Exit tickets and quickwrites",
    "Portfolios and projects",
    "Peer and self-assessment protocols",
    "Conferencing with a clear look-for",
  ],
  contingent: [
    "Oral questioning in the moment",
    "Observation of confusion or silence",
    "Seatwork checks and mini-whiteboards",
    "Spontaneous performance probes",
    "Follow-up questions after a hinge response",
  ],
} as const;

export const annotatedCases = [
  {
    title: "Draft feedback loop",
    verdict: "Formative",
    scenario:
      "Students draft an introduction. The teacher highlights unclear thesis sentences, discusses anonymous examples, then gives time for revision.",
    why: "Evidence is interpreted and immediately used to change the next learning action.",
  },
  {
    title: "Mid-unit quiz for the gradebook",
    verdict: "Not yet formative",
    scenario:
      "A vocabulary quiz is scored, recorded, returned with praise, and the class moves on to a new text.",
    why: "Scores exist, but nobody uses them to adapt teaching or require student action.",
  },
  {
    title: "Metaphor exit ticket",
    verdict: "Formative",
    scenario:
      "Exit tickets show many students wrote similes. The next lesson becomes a sorting game to repair the misconception.",
    why: "The teacher diagnoses a pattern and redesigns instruction before moving on.",
  },
  {
    title: "End-of-term praise only",
    verdict: "Not yet formative",
    scenario:
      "Detailed comments and a grade arrive on the final day of term; students file the papers and leave.",
    why: "Feedback arrives too late to alter the gap. Delivery without uptake is not formative use.",
  },
] as const;

export const feedbackLevels = [
  {
    level: "Task",
    focus: "How well the work meets the immediate goal or correctness criteria.",
  },
  {
    level: "Process",
    focus: "The strategies and methods used to produce the work.",
  },
  {
    level: "Self-regulation",
    focus: "How learners monitor, evaluate, and adjust their own progress.",
  },
  {
    level: "Self",
    focus: "Praise of the person rather than the work—usually least useful for improvement.",
  },
] as const;

export const feedbackPrinciples = [
  "Focus feedback on the task, not the learner as a person.",
  "Provide elaborated guidance on what, how, and why to improve.",
  "Present feedback in manageable units to avoid overload.",
  "Keep messages specific, clear, and linked to goals.",
  "Reduce uncertainty between current performance and the target.",
  "Prefer unbiased, trustworthy sources and a learning orientation.",
  "Provide feedback after learners have attempted a solution.",
] as const;

export const peerSelfPractices = [
  {
    label: "Exemplars and comparison",
    text: "Students compare strong and weak work against criteria before drafting, building evaluative judgement.",
  },
  {
    label: "Two Stars and a Wish",
    text: "Peers name two strengths and one actionable improvement tied to shared success criteria.",
  },
  {
    label: "TAG feedback",
    text: "Tell something that works, Ask a clarifying question, Give a specific next-step suggestion.",
  },
  {
    label: "Checklists and portfolios",
    text: "Learners rate their own work, attach reflections, and track what they will improve next.",
  },
] as const;

export const genaiUses = [
  {
    name: "Success Criteria Translator",
    role: "Clarify direction",
    prompt:
      "Turn this learning goal into (A) five ‘I can’ statements, (B) one exit-ticket check, and (C) a 10-word student-facing summary.",
    caution: "Teachers still judge whether the translated criteria match the intended standard.",
  },
  {
    name: "Pre-Mortem Plan",
    role: "Anticipate misconceptions",
    prompt:
      "Based on this objective and activity, name three likely misconceptions and one quick no-tech formative check for each.",
    caution: "Use predictions to design checks—not to pre-empt productive struggle entirely.",
  },
  {
    name: "Focused Feedback Generator",
    role: "Move learning forward",
    prompt:
      "Review this student work. Focus only on [one criterion]. Give one sentence of descriptive praise and one actionable next step. Ignore other errors.",
    caution: "Teacher judgement decides which criterion matters now and whether the advice is sound.",
  },
  {
    name: "Targeted Peer Review Builder",
    role: "Activate peers",
    prompt:
      "Generate a peer-review form for [criterion 1] and [criterion 2] with three sentence stems and a simple rating scale.",
    caution: "Peers still need training to use criteria and avoid vague praise.",
  },
  {
    name: "Learning Reflection Planner",
    role: "Activate the learner",
    prompt:
      "From this feedback, write a three-part reflection: key error to fix, one SMART goal, and one resource or practice activity.",
    caution: "Reflection counts only when the learner chooses and justifies the next action.",
  },
] as const;

export const humanNonNegotiables = [
  {
    label: "Judgement",
    teacher: "Interprets why an error occurred and what it means pedagogically.",
    learner: "Judges whether feedback is useful for the current goal.",
    genai: "Processes patterns in the data; cannot supply pedagogical context.",
  },
  {
    label: "Empathy",
    teacher: "Provides emotional scaffolding and motivation to engage with hard feedback.",
    learner: "Needs belonging and trust to take intellectual risks.",
    genai: "Is non-judgemental but non-empathetic; cannot read emotional state.",
  },
  {
    label: "Design",
    teacher: "Creates tasks that elicit genuine thinking and cognitive conflict.",
    learner: "Chooses how to engage with rich tasks.",
    genai: "Can rephrase or optimise prompts; cannot design culturally relevant experience alone.",
  },
  {
    label: "Agency & ethics",
    teacher: "Sets boundaries for honest, educational use of tools.",
    learner: "Keeps responsibility for intellectual honesty and self-regulation.",
    genai: "Responds to prompts; has no ethical agency of its own.",
  },
] as const;

export const practitionerInsights = {
  aha: [
    "GenAI is most powerful when it helps design formative assessment—not when it only grades faster.",
    "Clear success criteria make feedback, peer review, and self-assessment usable.",
    "No-tech moves (TPS, TAG, Two Stars and a Wish) remain essential alongside AI scaffolds.",
  ],
  tensions: [
    "Where scaffolding ends and over-automation begins—preserving productive struggle.",
    "Reliability, fairness, and uneven access or AI literacy across students.",
    "Workload: how much feedback should be AI-drafted versus teacher-crafted.",
  ],
} as const;

export const takeaways = [
  "GenAI provides the power and the pace; educators provide the direction and the heart.",
  "Use GenAI to handle the what, so teachers and learners can focus on the why.",
  "Formative assessment is a human conversation; GenAI is a microphone that can help every student be heard.",
] as const;

export const references = [
  "Andrade, H., & Heritage, M. (2017). Using formative assessment to enhance learning, achievement, and academic self-regulation. Routledge.",
  "Black, P., & Wiliam, D. (1998). Assessment and classroom learning. Assessment in Education, 5(1), 7–74.",
  "Carless, D., & Boud, D. (2018). The development of student feedback literacy. Assessment & Evaluation in Higher Education, 43(8), 1315–1325.",
  "Earl, L. M. (2013). Assessment as learning: Using classroom assessment to maximize student learning (2nd ed.). Corwin.",
  "Hattie, J., & Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81–112.",
  "Shute, V. J. (2008). Focus on formative feedback. Review of Educational Research, 78(1), 153–189.",
  "Tai, J., Ajjawi, R., Boud, D., Dawson, P., & Panadero, E. (2018). Developing evaluative judgement. Higher Education, 76, 467–481.",
  "Wiliam, D. (2011). Embedded formative assessment. Solution Tree Press.",
] as const;
