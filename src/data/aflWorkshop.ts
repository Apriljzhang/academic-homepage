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

export const whyFormativeMatters = [
  "Formative assessment has a significant positive effect on student achievement (Hattie, 2009).",
  "It helps reduce achievement gaps and supports self-regulated learning (Black & Wiliam, 1998).",
  "It encourages engagement and metacognition (Nicol & Macfarlane-Dick, 2006).",
  "It enables responsive teaching (Heritage, 2010) and fosters a growth mindset (Wiliam, 2011).",
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
    label: "Learning intention / criteria",
    meaning:
      "The overarching goal or standard for the task or unit—the ‘what’ the student must achieve (Andrade & Heritage, 2017).",
  },
  {
    label: "Success criteria",
    meaning: "Shared, student-facing descriptions of quality that make excellence visible before work begins.",
  },
  {
    label: "Product criteria",
    meaning: "Qualities of the final, observable deliverable: essay, presentation, model, performance.",
  },
  {
    label: "Performance criteria",
    meaning: "Standards for process, skills, thinking, and behaviours used during the task—drafting, practising, analysing.",
  },
] as const;

export const criteriaExamples = [
  {
    title: "Argumentative essay",
    product: [
      "Write a well-supported argumentative essay.",
      "The thesis statement is clear and appears in the final paragraph of the introduction.",
    ],
    performance: [
      "Students spend 15 minutes organising evidence into a graphic organiser before writing.",
      "Feedback focus: the teacher comments only on the organiser (performance) before drafting begins.",
    ],
  },
  {
    title: "Oral presentation",
    product: [
      "Give a 3-minute oral presentation using the past tense.",
      "The presentation includes five target vocabulary words within the time limit.",
    ],
    performance: [
      "The student practises aloud with a partner for 10 minutes, focusing on stress and intonation.",
      "Feedback on the practice recording: ‘Your intonation is strong, but you used only 3 target words. Next step: add two more’—before the final product.",
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
    examples: [
      "Deconstruct a prompt with a strong exemplar and co-create a success-criteria checklist.",
      "Provide high- and low-quality anonymised analyses; students identify why one succeeds before drafting.",
      "State a clear communicative goal (e.g., describe a daily routine with 10 sequenced past-tense verbs).",
    ],
  },
  {
    number: "2",
    label: "Elicit evidence",
    question: "Where are we now?",
    action:
      "Design discussions, tasks, and checks that require every student to reveal thinking and misconceptions in real time.",
    role: "Teacher diagnoses the gap from visible evidence.",
    examples: [
      "Think–Ink–Pair–Share so every student writes before anyone speaks.",
      "Mini-whiteboards or quick polls after a grammar contrast (affect / effect).",
      "Exit tickets: one emerging theme plus one supporting quote.",
    ],
  },
  {
    number: "3",
    label: "Move learning forward",
    question: "How do we close the gap?",
    action:
      "Give descriptive, specific, actionable feedback that tells students what to do next—not only how well they scored.",
    role: "Teacher and peers provide next-step information learners can use.",
    examples: [
      "Multimodal feedback: a 30-second audio note naming one strength and one next step.",
      "Replace ‘Vague thesis’ with an explicit revision instruction (what and how).",
      "Focus first-draft feedback on a single criterion to reduce cognitive load.",
    ],
  },
  {
    number: "4",
    label: "Activate peers",
    question: "How can peers help close the gap?",
    action:
      "Structure peer feedback and collaboration so students learn from and teach one another with shared criteria.",
    role: "Peers become instructional resources, expanding feedback capacity.",
    examples: [
      "Peer review with one focused task (e.g., highlight three sensory images; circle run-ons).",
      "Two Stars and a Wish based on shared success criteria.",
      "Jigsaw or expert groups: master one device, then teach peers.",
    ],
  },
  {
    number: "5",
    label: "Activate the learner",
    question: "How can students close the gap themselves?",
    action:
      "Build self-assessment, monitoring, goal-setting, and reflection into the task so ownership stays with the learner.",
    role: "Learners regulate progress and make quality decisions.",
    examples: [
      "Portfolio reflection: what I tried, what worked, what I will improve next.",
      "Self-assessment checklist against success criteria before submission.",
      "After feedback, set one specific learning goal for the next unit.",
    ],
  },
] as const;

export const formativeDefinition = {
  core: "Assessment becomes formative when the evidence is actually used to adapt teaching work to meet learning needs.",
  blackWiliam:
    "Assessment refers to activities that provide information to be used as feedback to modify teaching and learning. Comparison of actual and reference levels yields information which is then used to alter the gap (Black & Wiliam, 1998).",
};

export const elicitationTools = {
  planned: [
    "Text- or curriculum-embedded questions and tests",
    "Exit tickets, homework, and quickwrites",
    "Portfolios, projects, and rating scales",
    "Peer and self-assessment protocols",
    "Conferencing and questionnaires with clear look-fors",
  ],
  contingent: [
    "Oral questioning in the moment",
    "Observation of confusion, silence, or seatwork",
    "Spontaneous and structured performance probes",
    "Interviews and follow-up after a hinge response",
    "Unplanned moments that rely on teacher judgement",
  ],
} as const;

export const annotatedCases = [
  {
    title: "The draft feedback loop",
    verdict: "Formative",
    scenario:
      "Year 9 students draft an argumentative introduction. Instead of grading, the teacher highlights unclear thesis sentences, discusses three anonymous problem sentences, and gives 15 minutes for revision.",
    why: "Evidence is interpreted and immediately used to change the next learning action.",
  },
  {
    title: "The mid-unit vocabulary check",
    verdict: "Not yet formative",
    scenario:
      "A 20-word quiz is marked out of 20, recorded in the gradebook, returned with ‘Good job, most of you got above 15’, and the class moves on to a new story.",
    why: "Scores exist, but nobody uses them to adapt teaching or require student action.",
  },
  {
    title: "The metaphor exit ticket",
    verdict: "Formative",
    scenario:
      "Exit tickets show that 40% of students wrote similes. The teacher cancels the planned personification lesson and creates a simile-versus-metaphor sorting game.",
    why: "The teacher diagnoses a pattern and redesigns instruction before moving on.",
  },
  {
    title: "The final essay praise",
    verdict: "Not yet formative",
    scenario:
      "Detailed comments and an A− arrive on the last day of term; students file the papers and leave for the break.",
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
  {
    title: "Focus on the task, not the learner",
    detail: "Address specific features of the work with suggestions on how to improve.",
  },
  {
    title: "Provide elaborated feedback",
    detail: "Describe the what, how, and why—more effective than verification of results alone.",
  },
  {
    title: "Present feedback in manageable units",
    detail: "Small enough pieces to avoid overload; stepwise feedback helps students correct errors themselves.",
  },
  {
    title: "Be specific, clear, and goal-linked",
    detail: "Unclear feedback impedes learning; link messages to goals and performance.",
  },
  {
    title: "Keep feedback as simple as needed",
    detail: "Generate only enough information to help—not more cues than the learner can use.",
  },
  {
    title: "Reduce uncertainty about the target",
    detail: "Clarify goals and show how current performance relates to what must be accomplished.",
  },
  {
    title: "Stay unbiased and trustworthy",
    detail: "Feedback from a trusted source is taken more seriously; promote a learning goal orientation.",
  },
  {
    title: "Feedback after an attempt",
    detail: "Do not reveal answers before learners try to solve the problem on their own.",
  },
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
    label: "Focused peer-review protocol",
    text: "Assign one criterion at a time (e.g., sensory imagery; run-on sentences) so peer comments stay usable.",
  },
  {
    label: "Checklists and portfolios",
    text: "Learners rate their own work, attach reflections, and track what they will improve next.",
  },
  {
    label: "Goal setting after feedback",
    text: "Identify one weak area and set a specific, public learning goal for the next unit.",
  },
] as const;

export const genaiUses = [
  {
    name: "Success Criteria Translator",
    role: "Clarify direction",
    prompt:
      "Turn this learning goal into (A) five ‘I can’ statements, (B) one exit-ticket check, and (C) a 10-word student-facing summary.",
    teacherHelp: "Generate differentiated criteria or annotate exemplars against success criteria.",
    learnerHelp: "Rephrase a complex prompt into a checklist, or turn a rubric line into ‘I can’ statements.",
    caution: "Teachers still judge whether the translated criteria match the intended standard.",
  },
  {
    name: "Pre-Mortem Plan",
    role: "Anticipate misconceptions",
    prompt:
      "Based on this objective and activity, name three likely misconceptions and one quick no-tech formative check for each.",
    teacherHelp: "Cluster exit-ticket responses into misconception categories; draft look-fors for observation.",
    learnerHelp: "Ask what key concept a draft answer seems to miss; generate practice items for self-check.",
    caution: "Use predictions to design checks—not to remove productive struggle entirely.",
  },
  {
    name: "Focused Feedback Generator",
    role: "Move learning forward",
    prompt:
      "Review this student work. Focus only on [one criterion]. Give one sentence of descriptive praise and one actionable next step. Ignore other errors.",
    teacherHelp: "Produce ‘one star and one next step’ on a single criterion; identify the class’s most common error.",
    learnerHelp: "Request two concrete ways to strengthen evidence; generate practice sentences for a recurring error.",
    caution: "Teacher judgement decides which criterion matters now and whether the advice is sound.",
  },
  {
    name: "Targeted Peer Review Builder",
    role: "Activate peers",
    prompt:
      "Generate a peer-review form for [criterion 1] and [criterion 2] with three sentence stems and a 1–5 rating scale.",
    teacherHelp: "Create focused peer forms and sentence stems; generate good/bad feedback examples for training.",
    learnerHelp: "Simulate an ideal peer review before meeting a classmate; refine vague peer comments into next steps.",
    caution: "Peers still need training to use criteria and avoid vague praise.",
  },
  {
    name: "Learning Reflection Planner",
    role: "Activate the learner",
    prompt:
      "From this feedback, write a three-part reflection: key error to fix, one SMART goal, and one resource or practice activity.",
    teacherHelp: "Generate SMART goal templates and reflective journal prompts tailored to the skill.",
    learnerHelp: "Draft a three-step action plan from self-assessment; track growth across assignments.",
    caution: "Reflection counts only when the learner chooses and justifies the next action.",
  },
] as const;

export const roleShifts = [
  {
    who: "The teacher",
    from: "Grader / synthesizer",
    to: "Architect / curator",
    point:
      "Design the input (prompts, tasks), interpret AI-assisted analysis of misconceptions, and spend more time acting on evidence and building rapport.",
  },
  {
    who: "The learner",
    from: "Passive recipient",
    to: "Active manager / refiner",
    point:
      "Proactively seek, generate, and challenge feedback; use GenAI as a practice partner and reflection tool—not as the performer of the assessed work.",
  },
] as const;

export const humanNonNegotiables = [
  {
    label: "Judgement",
    teacher: "Interprets the why behind the data—overwhelm, missing prerequisites, distraction.",
    learner: "Judges whether feedback is actually helpful for the current goal.",
    genai: "Processes what the data says; cannot supply pedagogical context or motivation.",
  },
  {
    label: "Empathy",
    teacher: "Provides emotional scaffolding and the motivational push to engage with hard feedback.",
    learner: "Needs belonging and trust to take intellectual risks.",
    genai: "Is non-judgemental but non-empathetic; cannot read emotional state or belonging.",
  },
  {
    label: "Design",
    teacher: "Creates high-leverage tasks, rich texts, and discussions that elicit genuine evidence.",
    learner: "Chooses how to engage with those tasks.",
    genai: "Can rephrase or optimise prompts; cannot alone design culturally relevant cognitive conflict.",
  },
  {
    label: "Agency & ethics",
    teacher: "Sets boundaries for honest, educational use of tools.",
    learner: "Holds responsibility for intellectual honesty and self-regulation.",
    genai: "Responds to prompts; has no ethical agency or understanding of integrity.",
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
  "Hattie, J. (2009). Visible learning. Routledge.",
  "Hattie, J., & Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81–112.",
  "Nicol, D. J., & Macfarlane-Dick, D. (2006). Formative assessment and self-regulated learning. Studies in Higher Education, 31(2), 199–218.",
  "Shute, V. J. (2008). Focus on formative feedback. Review of Educational Research, 78(1), 153–189.",
  "Tai, J., Ajjawi, R., Boud, D., Dawson, P., & Panadero, E. (2018). Developing evaluative judgement. Higher Education, 76, 467–481.",
  "Wiliam, D. (2011). Embedded formative assessment. Solution Tree Press.",
] as const;
