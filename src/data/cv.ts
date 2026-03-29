export const person = {
  displayNameEn: 'April Jiawei Zhang',
  displayNameZh: '張家維',
  get fullDisplayName() {
    return `${this.displayNameEn} ${this.displayNameZh}`;
  },
  title: 'Assistant Professor',
  affiliation: 'School of Education, City University of Macau',
  affiliationShort: 'City University of Macau (CityU)',
  /** Office landline (Macau) */
  officePhone: '+853 8590 2644',
} as const;

/** Short strapline under the name (home hero), in the spirit of faculty landing pages. */
export const siteTagline = 'Teaching, learning & assessment in language education';

/** Single site-wide biography — shown only on the home hero. */
export const summary =
  'An experienced researcher and lecturer working in language education and formative assessment. Skilled in mixed-methods research, data analysis, lecturing, tutoring, organisation, and collaborative enquiry. PhD from the University of Sheffield on formative assessment, motivation, and achievement in language education.';

/** About page — narrative only (no photo). British English. */
export const aboutNarrativeParagraphs = [
  'I am a researcher in language education and assessment, with a particular interest in how formative and classroom-based assessment can support motivation and learning, especially for young learners and in multilingual settings. My doctoral work at the University of Sheffield examined formative assessment, motivation, and achievement among young English learners in China, and that thread—linking assessment practice to learner experience—still runs through what I do today.',
  'More recently my interests have broadened to assessment for learning in higher education, peer assessment and co-constructed rubrics, and the place of English and Chinese in universities in Macau. I also follow how motivation and engagement play out in digital spaces, and how educators and learners navigate generative AI in language assessment and in research practice.',
  'My published work includes studies on demotivation and expectancy-value perspectives in medical students’ English learning, motivation and learning strategies among HSK test-takers in the UK, formative assessment and key competencies in primary English classrooms, and collaborative work on Chinese language testing and test-taker characteristics. Together, these pieces reflect mixed-methods designs and a concern for both classroom relevance and testing contexts.',
  'Alongside research, I teach and supervise in teacher education and language education, and I contribute to conferences and professional networks in language assessment across Asia and beyond.',
] as const;

export const researchInterests = {
  /** Short line for Research page only (no repeat of biography). */
  pageLead:
    'Current work spans assessment for learning, multilingual higher education in Macau, motivation in digital contexts, and generative AI in language assessment and research practice. The themes below organise ongoing directions; not every item corresponds to a finished publication.',
  themes: [
    {
      title: 'Assessment for learning',
      text: 'Formative and holistic assessment, engagement, peer feedback (including early-years settings), co-constructed rubrics, and humanising perspectives in language testing.',
    },
    {
      title: 'Language education and multilingual contexts',
      text: 'English and Chinese language teaching and learning; language dynamics in Macau higher education, including student perceptions of Mandarin use and L1/Ln use in multilingual universities.',
    },
    {
      title: 'Motivation, SEL, and learner experience',
      text: 'Job crafting and occupational characteristics in education-related roles; social–emotional learning; motivation in digital and social platforms (e.g. Xiaohongshu).',
    },
    {
      title: 'Generative AI in education',
      text: 'Affordances and attitudes around GenAI in language assessment, educator and learner coping strategies, GenAI literacy, and ethical and affective dimensions of GenAI-assisted research.',
    },
    {
      title: 'Pedagogy and tools',
      text: 'Flipped learning, conversational agents and speaking with young learners, vocabulary and individual differences, and exploratory AI-assisted workflows for research.',
    },
  ],
} as const;

export type PublicationItem = {
  citationHtml: string;
  /** Full DOI or retrieval URL (shown below citation in APA style). */
  doiUrl?: string;
};

/** Peer-reviewed work and doctoral dissertation (APA 7th), newest first. DOI or URL where available. */
export const publications: PublicationItem[] = [
  {
    citationHtml:
      'Ji, T., & Zhang, J. (2025). Demotivation in English learning of Chinese medical students: Insights from situated expectancy-value theory. <em>Acta Psychologica</em>, <em>253</em>, Article 104716.',
    doiUrl: 'https://doi.org/10.1016/j.actpsy.2025.104716',
  },
  {
    citationHtml:
      'Wright, C., Lu, Y., Zhang, J., Zhang, L., & Zheng, Y. (2022). Tests of learning or testing for learning? An exploratory study of motivation and language learning strategies among HSK level 1–3 test-takers in UK. <em>International Journal of Chinese Language Teaching</em>, <em>3</em>(3), 1–19.',
    doiUrl: 'https://doi.org/10.46451/ijclt.2022.03.01',
  },
  {
    citationHtml:
      'Zheng, Y., Zheng, Y., & Zhang, J. (2021). HSK 试卷架构对 1–3 级考生成绩的影响：以英语母语者为例. <em>国际汉语教学研究 International Chinese Language Education</em>, <em>6</em>(3), 50–59.',
  },
  {
    citationHtml:
      'Bai, W., & Zhang, J. (2021). Developing key competencies via formative assessment in primary school English classrooms: Teacher education perspective. <em>Journal of Nanjing Xiaozhuang University</em>, <em>37</em>(4), 22–27.',
  },
  {
    citationHtml:
      'Zhang, J. (2018). <em>The impact of formative assessment on young English learners’ motivation and achievement in China</em> [Doctoral dissertation, University of Sheffield]. White Rose eTheses Online.',
    doiUrl: 'https://etheses.whiterose.ac.uk/id/eprint/21497',
  },
];

/** Teaching page — narrative only (no job-by-job list). British English. */
export const teachingNarrativeParagraphs = [
  'My teaching has grown along two trajectories: extended work in the United Kingdom and, more recently, university teaching in Macau and mainland China. In the UK I spent several years in English for Academic Purposes and related support roles at research-intensive universities, working with international undergraduates and postgraduates on academic communication, reading and writing for their disciplines, and the transition into British higher education. That period also included school-based practice—primary and secondary—where I taught English, contributed to Mandarin provision for younger learners, and took part in partnership arrangements between schools and the university while I completed my doctorate.',
  'Since moving to Macau I have taught at faculty level in international-facing programmes, including English language and education-oriented modules that connect language pedagogy, assessment literacy, and teacher development. Across both contexts, what I most often teach clusters around academic English, language education methodology, and how assessment—formative and classroom-based—can be used to support learning rather than only to certify it.',
  'The contrast between the UK and China/Macau has shaped how I explain language policy, multilingual classrooms, and learner motivation to students: in one setting the emphasis is often on adaptation to an Anglophone academy; in the other, on English alongside Chinese and the particular profile of higher education in the Greater Bay Area. I draw on that contrast deliberately in seminars and project supervision so that trainees can compare systems without treating either as the default.',
] as const;

/**
 * Teaching philosophy and methods — informed by prior applications (e.g. language education lecturing)
 * and Sheffield Teaching Assistant Programme preparation: seminars, assessment literacy, dissertation feedback.
 */
export const teachingPhilosophyParagraphs = [
  'My teaching is grounded in language education and applied linguistics, with a sustained interest in how formative assessment can shape what happens in the classroom. I am comfortable with mixed-methods and evidence-informed discussion, and I use both quantitative and qualitative approaches in research-led teaching where that helps students read empirical work critically.',
  'I aim to connect research and practice explicitly: insights from my own and others’ studies on motivation, feedback, and classroom assessment inform how I design tasks, rubrics, and dialogue in the room. Students have responded well when formative ideas from the literature are translated into concrete strategies they can try in practicum or school-based contexts.',
  'In higher education I have taught language-focused and education-focused modules, marked dissertations, and given detailed developmental feedback in line with UK university expectations. Training through the Sheffield Teaching Assistant Programme covered lecturing, leading seminars, supervising projects, and assessment design—experience I still draw on when mentoring trainees and dissertation writers.',
  'Outside formal courses I have maintained collaborative links with universities in mainland China on teacher education and assessment projects, which feeds into examples and comparative perspectives I use with Macau and international students.',
] as const;

/** Manuscripts not yet in the numbered publications list — edit as status changes. */
export type UpcomingPublication = {
  citationHtml: string;
  status: string;
};

export const upcomingPublications: UpcomingPublication[] = [
  {
    status: 'Under review',
    citationHtml:
      'Zhang, J., Ji, T., & Wei, J. (under review). The impact of co-constructed rubric on peer assessment and academic performance in university English learning. <em>Studies in Educational Evaluation</em>.',
  },
];

/** Service — AALA 2026 co-chair (see also talks list). */
export const aalaConferenceUrl = 'https://aalaconference.com/' as const;

export const grants = [
  {
    title: 'Implementation and Implication of Co-creating Rubric and Peer Assessment in EFL Courses',
    years: '2022 – 2023',
    institution: 'Macau University of Science and Technology',
    role: 'Principal Investigator',
  },
  {
    title: 'HSK Test-taker Characteristics, Test Performance and Implications for HSK Test Constructs',
    years: '2019 – 2020',
    institution: 'University of Leeds; University of Southampton; University of Nottingham',
    role: 'Research assistant',
  },
  {
    title: 'The Impact of Formative Assessment in Trainee Teacher Training',
    years: '2017 – 2020',
    institution: 'Nanjing Xiaozhuang University',
    role: 'Co-Principal Investigator',
  },
] as const;

export const talks = [
  { event: '58th RELC International Conference', place: 'Singapore', date: 'Mar 2024' },
  {
    event: 'The 4th Southeast Asian Conference on Education',
    place: 'Chiang Mai, Thailand',
    date: 'Feb 2024',
  },
  {
    event: 'Cambridge China Education Forum',
    place: 'University of Cambridge, UK',
    date: 'Jul 2023',
  },
  {
    event: 'Language Testing Forum 2018',
    place: 'University of Bedfordshire, UK',
    date: 'Nov 2018',
  },
  {
    event: 'The 5th Annual International AALA Conference',
    place: 'Shanghai Jiao Tong University, China',
    date: 'Oct 2018',
  },
  {
    event: 'Annual Conference of China English Language Education Association',
    place: 'Beijing Foreign Studies University, China',
    date: 'Oct 2018',
  },
  {
    event: 'Georgetown University Round Table: Useful Assessment and Evaluation in Language Education',
    place: 'Georgetown University, USA',
    date: 'Apr 2016',
  },
  {
    event: 'International Conference on Language Testing and Assessment',
    place: 'Guangdong University of Foreign Studies, China',
    date: 'Nov 2015',
  },
] as const;

export const teachingUniversity = [
  {
    role: 'Assistant Professor',
    place: 'School of Education, City University of Macau',
    dates: 'Aug 2024 – present',
  },
  {
    role: 'Assistant Professor',
    place: 'University International College, Macau University of Science and Technology',
    dates: 'Sep 2021 – Jun 2024',
  },
  {
    role: 'EAP course tutor',
    place: 'University of Nottingham Ningbo China',
    dates: 'Feb – Jun 2021',
  },
  {
    role: 'EAP lecturer',
    place: 'Centre for English Language Education, University of Leeds',
    dates: 'Jul – Sep 2019; Mar – Sep 2020',
  },
  {
    role: 'Invited speaker',
    place:
      'Applied Linguistics and Language Policy Studies Training Programme, School of East Asian Studies (Ministry of Education of the PRC)',
    dates: 'Nov – Dec 2017',
  },
  {
    role: 'Part-time teacher',
    place: 'School of Education, The University of Sheffield',
    dates: 'Oct – Nov 2017, 2018, 2019',
  },
  {
    role: 'Part-time Mandarin tutor',
    place: 'School of East Asian Studies, The University of Sheffield',
    dates: 'Sep 2014 – Dec 2015; Sep – Oct 2017; Feb – Jun 2020',
  },
] as const;

export const teachingSchools = [
  { place: 'Silverdale Secondary School, Sheffield', dates: 'Oct – Dec 2018' },
  {
    place: 'Sheffield High School for Girls; Birkdale School, Sheffield',
    dates: 'Apr – Oct 2018',
  },
  { place: 'Malin Bridge Primary School, Sheffield', dates: 'Jan 2014 – Dec 2016' },
  { place: 'Star Mandarin School, Sheffield', dates: 'Feb 2013 – Jun 2020' },
] as const;

/** Home page spotlight cards (paths are completed with `withBase` in the layout). */
export const homeSectionCards = [
  {
    slug: 'research' as const,
    title: 'Research',
    kicker: 'Themes, outputs, funding',
    description: 'Research themes, publications (including forthcoming work), and funded projects— organised in subpages.',
    accent: 'green' as const,
  },
  {
    slug: 'teaching' as const,
    title: 'Teaching',
    kicker: 'Philosophy & supervision',
    description:
      'Approach and trajectory across the UK and China/Macau, plus MA and doctoral supervision in English and Education.',
    accent: 'blue' as const,
  },
  {
    slug: 'service' as const,
    title: 'Service',
    kicker: 'Conferences & engagement',
    description: 'AALA 2026 organisation, conference presentations, and related professional service.',
    accent: 'purple' as const,
  },
] as const;
