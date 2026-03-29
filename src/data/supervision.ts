/**
 * Supervision records (MUST English MA; CityU MEd / PhD in Education).
 * Topics taken from student proposals, theses, and supervision folders where available.
 */

export type SupervisionEntry = {
  student: string;
  programme: string;
  institution: 'Macau University of Science and Technology (MUST)' | 'City University of Macau';
  status: 'Completed' | 'In progress';
  cohort?: string;
  topic: string;
};

export const supervisionIntroParagraphs = [
  'I supervise dissertations and theses in language education, assessment, and technology-enhanced learning. At MUST (University International College), I supervised English MA students on topics spanning motivation, classroom assessment, early language learning, and systematic reviews. At City University of Macau, School of Education, I supervise Master of Education and doctoral candidates working on formative assessment, AI in language education, informal digital learning, and teacher acceptance of innovation.',
  'The lists below summarise supervisees and working or final thesis titles. For current students, titles may evolve as the project matures.',
] as const;

export const supervisionMustMa: SupervisionEntry[] = [
  {
    student: 'Hao Muyao',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2022',
    topic:
      'The impact of parents’ attitudes and behaviours on young learners’ English learning in kindergarten',
  },
  {
    student: 'Wang Xueying (Lisa)',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2022',
    topic: 'Perceptions and impact of lesson study: A comparison among language teachers across different contexts',
  },
  {
    student: 'Guo Yanmin (Mandy)',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2022',
    topic:
      'Self-regulated strategies and motivation in Chinese secondary school students’ English writing: Private and public sectors',
  },
  {
    student: 'Song Minghui (Monica)',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2022',
    topic:
      'Chinese learning motivation and cultural identity among heritage children at the University of Florence Confucius Institute (Florence “heritage class”)',
  },
  {
    student: 'Li Hui',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2023',
    topic: 'A systematic review of learning analytics in language learning and teaching',
  },
  {
    student: 'Jenny Haiqing Gong',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2023',
    topic: 'Co-creating rubrics and peer assessment in EFL (dissertation focus on co-constructed assessment)',
  },
  {
    student: 'Huang Jiaying (Joy)',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2023',
    topic:
      'The mediating effect of self-acceptance between peace of mind and L2 learning motivation among Chinese pilots',
  },
  {
    student: 'Liu Wenli',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2023',
    topic: 'Systematic review of video feedback and video-call feedback in language learning and teaching',
  },
  {
    student: 'Zhang Gongzhe',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2024',
    topic:
      'AI chatbot–mediated English learning versus traditional instruction: Flow experience, emotions, and oral proficiency among adolescent EFL learners',
  },
  {
    student: 'Mani',
    programme: 'MA (English)',
    institution: 'Macau University of Science and Technology (MUST)',
    status: 'Completed',
    cohort: '2024',
    topic: 'Peer feedback in kindergarten language education: Teachers’ observations and concerns',
  },
];

export const supervisionCityUMasters: SupervisionEntry[] = [
  {
    student: 'Wang Yu',
    programme: 'MEd',
    institution: 'City University of Macau',
    status: 'Completed',
    cohort: '2024',
    topic:
      'Difficulties and countermeasures in K–12 online English private tutoring in mainland China (including narrative inquiry into interactive online English teaching)',
  },
  {
    student: 'Liu Sijia',
    programme: 'MEd',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2025',
    topic: 'AI-assisted evaluation and peer assessment in primary school Chinese writing classes',
  },
  {
    student: 'Liu Ziyan',
    programme: 'MEd',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2025',
    topic: 'Generative AI affordances for oral English teaching in primary schools (working title)',
  },
  {
    student: 'Li Aiyan',
    programme: 'MEd',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2025',
    topic:
      'Students’ acceptance and uptake of peer assessment and AI-based assessment in junior secondary English writing: A mixed-methods study using UTAUT',
  },
  {
    student: 'Tan Shuai',
    programme: 'MEd',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2025',
    topic: 'Informal digital learning of English on Xiaohongshu (“red note”): Self-regulated learning and related constructs',
  },
  {
    student: 'Zhang Yitian',
    programme: 'MEd',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2025',
    topic:
      'Teachers’ acceptance of gamified EFL instruction and primary pupils’ achievement emotions: Mixed-methods study (working title)',
  },
  {
    student: 'Tan Tingzhen',
    programme: 'MEd',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2025',
    topic: 'MEd dissertation in progress (title to be confirmed)',
  },
  ...(['Xu Renyu', 'Li Yingxi', 'Jin Ziyu', 'Chen Yitong', 'Chen Ziyue'] as const).map((student) => ({
    student,
    programme: 'MEd',
    institution: 'City University of Macau' as const,
    status: 'In progress' as const,
    cohort: '2026',
    topic: 'Supervision underway; thesis topic to be confirmed on programme records',
  })),
];

export const supervisionCityUPhD: SupervisionEntry[] = [
  {
    student: 'Jiang Haitian',
    programme: 'PhD (Education)',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2023',
    topic:
      'Influence mechanism of formative assessment on students’ classroom academic emotions in English courses at Chinese universities',
  },
  {
    student: 'Ni Chen',
    programme: 'PhD (Education)',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2024',
    topic:
      'Impact of implementing online formative assessment on students’ psychological capital and self-regulated learning',
  },
  {
    student: 'Zhao Qizhe',
    programme: 'PhD (Education)',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2024',
    topic:
      'Evaluating the efficacy of informal digital learning of English on language proficiency: A mixed-methods study in Huizhou, China',
  },
  {
    student: 'Wei Jingyi',
    programme: 'PhD (Education)',
    institution: 'City University of Macau',
    status: 'In progress',
    cohort: '2025',
    topic:
      'Unpacking evaluative judgement in AI-enabled ELT: A think-aloud process study with doctoral students',
  },
];
