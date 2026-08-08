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
export const siteTagline = 'Teaching, learning & assessment in technology-assisted language education';

/** Single site-wide biography — shown only on the home hero. */
export const summaryHtml =
  '<p>I am an Assistant Professor in the School of Education at City University of Macau, where I explore the human dimensions of <span class="font-semibold text-primary">language pedagogy</span> and <span class="font-semibold text-primary">educational assessment</span>. My work is grounded in the belief that <span class="font-semibold text-primary">Assessment <em>for</em> Learning (A<em>f</em>L)</span> and formative practices should do more than measure progress. Used thoughtfully, they can support wellbeing and engagement both within and beyond the classroom.</p>' +
  '<p class="mt-5">My move from English for Academic Purposes (EAP) teaching in the UK and China to my current role as a <span class="font-semibold text-primary">teacher-researcher</span> has sustained my commitment to the <span class="font-semibold text-primary">student experience</span>. My doctoral research at the University of Sheffield examined motivation among <span class="font-semibold text-primary">young learners</span> engaged in formative assessment. Since then, my work has broadened to include GenAI, peer-mediated feedback, co-constructed rubrics, and multilingual educational settings.</p>' +
  '<p class="mt-5">My current projects examine <span class="font-semibold text-primary">technology-assisted education</span>, including how <span class="font-semibold text-primary">GenAI</span> and <span class="font-semibold text-primary">informal digital tools</span> can support teaching and assessment without replacing human judgement. I also study language learning among <span class="font-semibold text-primary">young learners</span> and the role of <span class="font-semibold text-primary">emotion</span> in digital spaces. Across these areas, I aim to connect established educational practices with the needs of contemporary learners.</p>';

/** About page — narrative only (no photo). British English. */
export const aboutNarrativeParagraphs = [
  'I am a researcher in language education and assessment, with a particular interest in how formative and classroom-based assessment can support motivation and learning, especially for young learners and in multilingual settings. My doctoral work at the University of Sheffield examined formative assessment, motivation, and achievement among young English learners in China, and that thread—linking assessment practice to learner experience—still runs through what I do today.',
  'More recently my interests have broadened to assessment for learning in higher education, peer assessment and co-constructed rubrics, and the place of English and Chinese in universities in Macau. I also follow how motivation and engagement play out in digital spaces, and how educators and learners navigate generative AI in language assessment and in research practice.',
  'My published work includes studies on demotivation and expectancy-value perspectives in medical students’ English learning, motivation and learning strategies among HSK test-takers in the UK, formative assessment and key competencies in primary English classrooms, and collaborative work on Chinese language testing and test-taker characteristics. Together, these pieces reflect mixed-methods designs and a concern for both classroom relevance and testing contexts.',
  'Alongside research, I teach and supervise in teacher education and language education, and I contribute to conferences and professional networks in language assessment across Asia and beyond.',
] as const;

/** Four-quadrant summary on the Research overview (ResearchMap.astro). */
export const researchFramework = {
  why: [
    'How people learn languages and academic content happily, effectively, and wisely',
    'Assessment and pedagogy that support wellbeing as well as attainment',
  ],
  who: [
    'Children and young learners (kindergarten and primary)',
    'Undergraduates, postgraduates, and teacher educators',
    'Multilingual cohorts in local, global, and transnational contexts',
  ],
  what: [
    'Assessment for learning and formative classroom practice',
    'Generative AI and technology in language learning and assessment',
    'English and Chinese in multilingual contexts',
    'Motivation, social–emotional learning, and learner experience',
    'Pedagogy and tools that support teachers and learners',
  ],
  how: [
    'Mixed-methods designs (quantitative and qualitative)',
    'Longitudinal and cross-sectional studies',
    'Python, R, Stata, SPSS, and AMOS; NVivo',
    'Survey questionnaires, rating scales, and achievement data',
    'Interviews, journals, observation, think-aloud, and stimulated recall',
  ],
} as const;

export type ResearchThemeUpcoming = {
  citationHtml: string;
  status: string;
};

export type ResearchThemeDetailed = {
  id: string;
  title: string;
  description: string;
  upcoming: readonly ResearchThemeUpcoming[];
};

/** Five project-based themes; upcoming manuscripts sit under each theme on /research/themes. */
export const researchThemesDetailed: readonly ResearchThemeDetailed[] = [
  {
    id: 'assessment-for-learning',
    title: 'Assessment for learning',
    description:
      'Formative and holistic assessment, engagement, and peer feedback—including in early-years settings—co-constructed rubrics, and humanising perspectives in language testing.',
    upcoming: [
      {
        status: 'In preparation',
        citationHtml:
          '<em>Assessment as learning in the EMI classroom: Scrutinising the socio-constructivist dynamics and affective shifts of rubric co-construction</em>.',
      },
      {
        status: 'In preparation',
        citationHtml:
          '<em>From washback to impact by design: A review of washback research in language assessment: Fundamentals and contexts</em>.',
      },
      {
        status: 'In preparation',
        citationHtml:
          '<em>From social referencing to cognitive scaffolding: A mixed-methods study of peer feedback dynamics in Chinese kindergartens</em>.',
      },
    ],
  },
  {
    id: 'language-education-multilingual',
    title: 'Language education and multilingual contexts',
    description:
      'English and Chinese language teaching and learning; language dynamics in Macau higher education, including student perceptions of Mandarin use and L1/Ln use in multilingual universities.',
    upcoming: [
      {
        status: 'In preparation',
        citationHtml:
          '<em>Mandarin as the first language in multilanguage classrooms in Macau’s higher education: The use and impact</em>.',
      },
    ],
  },
  {
    id: 'motivation-sel-experience',
    title: 'Motivation, SEL, and learner experience',
    description:
      'Job crafting and occupational characteristics in education-related roles; social–emotional learning; motivation in digital and social platforms (e.g. Xiaohongshu).',
    upcoming: [
      {
        status: 'In preparation',
        citationHtml:
          '<em>Peace of mind, self-evaluation, and self-acceptance in Chinese pilots’ aviation English motivation: An English for specific purposes perspective</em>.',
      },
      {
        status: 'In preparation',
        citationHtml:
          '<em>Welfare-adjacent universities: Governing student precarity through platformized responsibilization and conditional care</em>.',
      },
    ],
  },
  {
    id: 'generative-ai-education',
    title: 'Generative AI in education',
    description:
      'Affordances and attitudes around GenAI in language assessment, educator and learner coping strategies, GenAI literacy, and ethical and affective dimensions of GenAI-assisted research.',
    upcoming: [
      {
        status: 'In preparation',
        citationHtml:
          '<em>Multidimensional GenAI literacy in EFL academic writing: A longitudinal study on human and AI assessment in Macau higher education</em>.',
      },
      {
        status: 'In preparation',
        citationHtml:
          '<em>The algorithmic mirror: Linking multidimensional AI literacy to evaluative judgment and writing quality in AI-assisted L2 argumentative writing</em>.',
      },
      {
        status: 'In preparation',
        citationHtml:
          '<em>The Impact of AI Chatbot on EFL learners\' speaking performance via flow experience</em>.',
      },
    ],
  },
  {
    id: 'pedagogy-tools',
    title: 'Pedagogy and tools',
    description:
      'Flipped learning, conversational agents and speaking with young learners, vocabulary and individual differences, and exploratory AI-assisted workflows for research.',
    upcoming: [
      {
        status: 'In preparation',
        citationHtml:
          '<em>Interplay between personality traits, vocabulary learning strategy and achievement in English language courses in EMI</em>.',
      },
    ],
  },
] as const;

/** Current taught courses — CityU School of Education (codes indicate programme level). */
export const teachingCoursesMastersCityU = [
  { code: 'MEDC04', name: 'Education Research Methods' },
  { code: 'ETE02', name: 'Audio-visual Materials Design' },
  { code: 'MTL006', name: 'Teaching Assessment' },
] as const;

export const teachingCoursesDoctoralCityU = [
  { code: 'DEDC01', name: 'Learning for Educational Change in Organisational Settings' },
  { code: 'DEDC02', name: 'Advanced Research Method' },
  { code: 'DEDE01', name: 'Evaluation of Educational Quality and Improvement in Organisational Settings' },
] as const;

export type ProfessionalMembership = { name: string; href?: string };

export const professionalMemberships: ProfessionalMembership[] = [
  { name: 'British Educational Research Association (BERA)', href: 'https://www.bera.ac.uk/' },
  { name: 'Asian Association for Language Assessment (AALA)', href: 'https://www.aalawebsite.com/' },
  { name: 'International Language Testing Association (ILTA)', href: 'https://www.iltaonline.com/' },
  { name: 'UK Association for Language Testing and Assessment (UKALTA)', href: 'https://www.ukalta.org/' },
  { name: 'China Association for Language Testing and Assessment (CALTA)' },
  {
    name: 'International TESOL Union (ITU)',
    href: 'https://www.tesol.org/',
  },
];

export type PublicationItem = {
  /** Full reference in APA 7th edition (HTML for italics). */
  citationHtml: string;
  /** Optional DOI/URL used elsewhere (e.g. map/collaborators); prefer embedding in citationHtml. */
  doiUrl?: string;
  /** Site-hosted PDF under /publications/ (from 代表作), when available. */
  pdfPath?: string;
};

/** Peer-reviewed work and doctoral dissertation, newest first. APA 7th. */
export const publications: PublicationItem[] = [
  {
    citationHtml:
      'Hou, Y., Ouyang, B., Liu, J. E., Zhang, A. J., & Sun, Z. (2026). A case study of high school graduates\' reflections on career education: Insights from high-stakes context. <em>The Career Development Quarterly</em>. Advance online publication. <a href="https://doi.org/10.1002/cdq.70033" target="_blank" rel="noopener noreferrer">https://doi.org/10.1002/cdq.70033</a>',
    doiUrl: 'https://doi.org/10.1002/cdq.70033',
    pdfPath: '/publications/2026-career-education.pdf',
  },
  {
    citationHtml:
      'Zhang, A. J., & Chen, Z. (2026). Breaking the fourth wall in Chinese EFL: Stakeholder perceptions of situated learning “in the wild” with young learners. <em>TESOL International Association Applied Linguistics Forum, 46</em>(1), 1–6.',
    pdfPath: '/publications/2026-breaking-fourth-wall-efl.pdf',
  },
  {
    citationHtml:
      'Ji, T., & Zhang, A. J. (2025). Demotivation in English learning of Chinese medical students: Insights from situated expectancy-value theory. <em>Acta Psychologica, 253</em>, Article 104716. <a href="https://doi.org/10.1016/j.actpsy.2025.104716" target="_blank" rel="noopener noreferrer">https://doi.org/10.1016/j.actpsy.2025.104716</a>',
    doiUrl: 'https://doi.org/10.1016/j.actpsy.2025.104716',
    pdfPath: '/publications/2025-demotivation-medical-students.pdf',
  },
  {
    citationHtml:
      'Wright, C., Lu, Y., Zhang, A. J., Zhang, L., & Zheng, Y. (2022). Tests of learning or testing for learning? An exploratory study of motivation and language learning strategies among HSK level 1–3 test-takers in UK. <em>International Journal of Chinese Language Teaching, 3</em>(3), 1–19. <a href="https://doi.org/10.46451/ijclt.2022.03.01" target="_blank" rel="noopener noreferrer">https://doi.org/10.46451/ijclt.2022.03.01</a>',
    doiUrl: 'https://doi.org/10.46451/ijclt.2022.03.01',
    pdfPath: '/publications/2022-tests-of-learning-hsk.pdf',
  },
  {
    citationHtml:
      'Zheng, Y., Zheng, Y., & Zhang, A. J. (2021). HSK试卷架构对1–3级考生成绩的影响：以英语母语者为例 [The impact of HSK test structure on Level 1–3 test-taker performance: Evidence from English L1 speakers]. <em>国际汉语教学研究 [International Chinese Language Education], 6</em>(3), 50–59.',
    pdfPath: '/publications/2021-hsk-test-structure.pdf',
  },
  {
    citationHtml:
      'Bai, W., & Zhang, A. J. (2021). Developing key competencies via formative assessment in primary school English classrooms: Teacher education perspective. <em>Journal of Nanjing Xiaozhuang University, 37</em>(4), 22–27.',
    pdfPath: '/publications/2021-formative-assessment-teacher-education.pdf',
  },
  {
    citationHtml:
      'Zhang, A. J. (2018). <em>The impact of formative assessment on young English learners’ motivation and achievement in China</em> [Doctoral dissertation, University of Sheffield]. White Rose eTheses Online. <a href="https://etheses.whiterose.ac.uk/id/eprint/21497" target="_blank" rel="noopener noreferrer">https://etheses.whiterose.ac.uk/id/eprint/21497</a>',
    doiUrl: 'https://etheses.whiterose.ac.uk/id/eprint/21497',
  },
];

/** Teaching overview — four cards on the main Teaching page. British English. */
export const teachingOverviewCards = [
  {
    group: 'Teaching philosophy',
    title: 'Learning as a shared process',
    text: 'My teaching sits at the intersection of language education and applied linguistics, with Assessment for Learning (AfL) at the centre of my practice. I treat learning as a social, co-constructed process, so my sessions combine concise input with practical workshops and research-led discussion. Students contribute actively to shared academic enquiry.',
  },
  {
    group: 'Teaching philosophy',
    title: 'Transparent assessment',
    text: 'I use guided inquiry to help students identify patterns in educational theory and practice. Assessment is made transparent through co-constructed rubrics and structured peer assessment. This collaborative approach helps students understand criteria, monitor their learning, and use feedback to develop both their work and their scholarly identity.',
  },
  {
    group: 'Professional experience',
    title: 'United Kingdom',
    text: 'I began my academic teaching in the United Kingdom, specialising in English for Academic Purposes (EAP) with international undergraduate and postgraduate students. I also taught through primary-school partnerships while completing my doctorate at the University of Sheffield. My PhD research on formative assessment and young language learners continues to inform my evidence-based approach to teaching.',
  },
  {
    group: 'Professional experience',
    title: 'City University of Macau',
    text: 'I am now an Assistant Professor in the School of Education at City University of Macau, where I teach advanced modules in research methods, assessment, and language education at master’s and doctoral level. I supervise master’s dissertations and doctoral research, and aim to create an inclusive, intellectually demanding environment that honours students’ varied academic and linguistic backgrounds.',
  },
] as const;

/** Service — AALA 2026 co-chair (see also talks list). */
export const aalaConferenceUrl = 'https://aalaconference.com/' as const;

export type EditorialRole = {
  role: string;
  journal: string;
  specialIssue: string;
  href: string;
  years?: string;
};

export const editorialRoles: EditorialRole[] = [
  {
    role: 'Guest editor',
    journal: 'Language Testing in Asia',
    specialIssue: 'A Humanistic Approach to Assessment, Standards, Innovation, and Accountability',
    href: 'https://link.springer.com/collections/hfddgecgfa',
    years: '2026 – 2028',
  },
];

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
  {
    paperTitle:
      'Interplay between personality traits, vocabulary learning strategy, and achievement in Chinese EFL classes',
    event: 'BERA Conference 2024',
    place: 'Manchester, UK',
    date: 'Sep 2024',
  },
  {
    paperTitle: 'Impact of co-constructed rubrics within EFL and peer assessment in Chinese higher education',
    event: '58th RELC International Conference',
    place: 'Singapore',
    date: 'Mar 2024',
  },
  {
    paperTitle: 'Will co-constructed rubrics improve academic performance for EFL learners?',
    event: 'The 4th Southeast Asian Conference on Education',
    place: 'Chiang Mai, Thailand',
    date: 'Feb 2024',
  },
  {
    paperTitle: 'Co-constructed rubrics and peer assessment in EFL in higher education: Preliminary findings',
    event: 'Cambridge China Education Forum',
    place: 'University of Cambridge, UK',
    date: 'Jul 2023',
  },
  {
    paperTitle:
      'Motivation and achievement: Exploring formative assessment strategies for young Chinese English learners',
    event: 'Language Testing Forum 2018',
    place: 'University of Bedfordshire, UK',
    date: 'Nov 2018',
  },
  {
    paperTitle: 'Enhancing English learning: The role of formative assessment in motivating young Chinese learners',
    event: 'The 5th Annual International AALA Conference',
    place: 'Shanghai Jiao Tong University, China',
    date: 'Oct 2018',
  },
  {
    paperTitle:
      'The impact of formative assessment on young Chinese learners’ motivation and achievement in English learning',
    event: 'Annual Conference of China English Language Education Association',
    place: 'Beijing Foreign Studies University, China',
    date: 'Oct 2018',
  },
  {
    paperTitle:
      'The impact of formative assessment on young Chinese learners’ motivation and achievement in English learning: Preliminary findings (poster)',
    event:
      'Georgetown University Round Table: Useful Assessment and Evaluation in Language Education',
    place: 'Georgetown University, USA',
    date: 'Apr 2016',
  },
  {
    paperTitle: 'If you are happy and you know it, clap your hands: Formative assessment in primary school English classes',
    event: '1st International Conference on Language Testing and Assessment',
    place: 'Guangzhou, China',
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
    description: 'Research themes, peer-reviewed outputs, and funded projects, organised across dedicated pages.',
    accent: 'green' as const,
  },
  {
    slug: 'teaching' as const,
    title: 'Teaching',
    kicker: 'Philosophy & supervision',
    description:
      'Teaching philosophy and experience across the UK, China, and Macau, master’s and doctoral supervision, and training resources.',
    accent: 'blue' as const,
  },
  {
    slug: 'service' as const,
    title: 'Service',
    kicker: 'Conferences & engagement',
    description:
      'AALA 2026 conference leadership, journal editorship, the APRIL academic-writing skill, and conference presentations.',
    accent: 'red' as const,
  },
] as const;
