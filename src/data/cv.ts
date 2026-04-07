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
export const summaryHtml =
  '<p>I serve as an Assistant Professor in the School of Education at the City University of Macau, where I look beyond the mechanics of language testing to explore the human side of <span class="font-semibold text-primary">language pedagogy</span> and <span class="font-semibold text-primary">educational assessment</span>. My scholarly work is driven by a fundamental belief that <span class="font-semibold text-primary">Assessment <em>for</em> Learning (A<em>f</em>L)</span> and formative practices should do more than measure progress. Instead, I am interested in how these tools can be used both within and beyond the classroom to foster a genuine sense of well-being and engagement, ensuring that the educational journey is as fulfilling as the final result.</p>' +
  '<p class="mt-5">My path to this point has been shaped by a transition from the practical world of English for Academic Purposes (EAP) in the UK and China to my current role as a <span class="font-semibold text-primary">teacher-researcher</span>. This journey has allowed me to remain a lifelong advocate for the <span class="font-semibold text-primary">student experience</span>. Starting with my doctoral research at the University of Sheffield, where I examined the motivational dynamics of <span class="font-semibold text-primary">young learners</span> in formative assessment practices, my work has grown into a broader portfolio. I now explore how we can empower students through GenAI and peer-mediated feedback and co-constructed rubrics, always seeking to understand the lived reality of those navigating multilingual settings.</p>' +
  '<p class="mt-5">In my current projects, I am increasingly focused on the evolving role of <span class="font-semibold text-primary">technology-assisted education</span>. I am curious about how <span class="font-semibold text-primary">GenAI</span> and <span class="font-semibold text-primary">informal digital tools</span> can be integrated thoughtfully into our teaching and assessment to support rather than replace human enquiry. Whether I am investigating the place of English within <span class="font-semibold text-primary">young learners</span> or looking at how <span class="font-semibold text-primary">emotions</span> play out in digital spaces, my goal is to bridge the gap between traditional structures and the needs of the modern learner. By bringing an empathetic and reflective lens to my research, I hope to contribute to an academic landscape where every student feels supported to reach their full potential.</p>';

/** About page — narrative only (no photo). British English. */
export const aboutNarrativeParagraphs = [
  'I am a researcher in language education and assessment, with a particular interest in how formative and classroom-based assessment can support motivation and learning, especially for young learners and in multilingual settings. My doctoral work at the University of Sheffield examined formative assessment, motivation, and achievement among young English learners in China, and that thread—linking assessment practice to learner experience—still runs through what I do today.',
  'More recently my interests have broadened to assessment for learning in higher education, peer assessment and co-constructed rubrics, and the place of English and Chinese in universities in Macau. I also follow how motivation and engagement play out in digital spaces, and how educators and learners navigate generative AI in language assessment and in research practice.',
  'My published work includes studies on demotivation and expectancy-value perspectives in medical students’ English learning, motivation and learning strategies among HSK test-takers in the UK, formative assessment and key competencies in primary English classrooms, and collaborative work on Chinese language testing and test-taker characteristics. Together, these pieces reflect mixed-methods designs and a concern for both classroom relevance and testing contexts.',
  'Alongside research, I teach and supervise in teacher education and language education, and I contribute to conferences and professional networks in language assessment across Asia and beyond.',
] as const;

/** Four-quadrant summary on the Research overview (ResearchMap.astro). */
export const researchFramework = {
  why: 'I want to understand how people can learn languages and academic content happily, effectively, and wisely—so that assessment and pedagogy support wellbeing as well as attainment. That motive runs from early language classrooms through to postgraduate study and professional education.',
  who: 'My work engages children and young learners in kindergarten and primary school; undergraduates and postgraduates in higher education, including trainee teachers and in-service educators; and multilingual cohorts in Macau and transnational contexts.',
  what:
    'Substantively, the portfolio turns on how assessment for learning and formative practices shape language classrooms; how English and Chinese figure in multilingual education, including universities in Macau; how motivation, social–emotional learning, and learner experience unfold in early years or higher education study; how generative AI and other technologies mediate language learning, assessment, and research practice; and how pedagogy, tools, and language development support teachers and learners in those environments. A single study often braids several of these strands rather than isolating one. The Research interests page uses five headings for clarity, but the boundaries are porous by design.',
  how: 'I use mixed-methods designs that combine quantitative and qualitative evidence. Common tools include SPSS and Python for survey and achievement data, and NVivo for qualitative coding. Methods span questionnaires and rating scales, semi-structured interviews, reflective journals, classroom-based inquiry and observation, ethnographic perspectives where appropriate, longitudinal designs when tracking change over time, systematic and scoping reviews to synthesise fields, and process-oriented techniques such as think-aloud and stimulated recall interview. The exact bundle depends on the research question and context.',
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
  citationHtml: string;
  /** Full DOI or retrieval URL (shown below citation in APA style). */
  doiUrl?: string;
};

/** Peer-reviewed work and doctoral dissertation, newest first. */
export const publications: PublicationItem[] = [
  {
    citationHtml:
      'Zhang, A. J., & Chen, Z. (2026). Breaking the fourth wall in Chinese EFL: Stakeholder perceptions of situated learning "in the wild" with young learners. <em>TESOL International Association Applied Linguistics Forum</em>, <em>46</em>(1), 1-6.',
  },
  {
    citationHtml:
      'Ji, T., & Zhang, A. J. (2025). Demotivation in English learning of Chinese medical students: Insights from situated expectancy-value theory. <em>Acta Psychologica</em>, <em>253</em>, Article 104716.',
    doiUrl: 'https://doi.org/10.1016/j.actpsy.2025.104716',
  },
  {
    citationHtml:
      'Wright, C., Lu, Y., Zhang, A. J., Zhang, L., & Zheng, Y. (2022). Tests of learning or testing for learning? An exploratory study of motivation and language learning strategies among HSK level 1–3 test-takers in UK. <em>International Journal of Chinese Language Teaching</em>, <em>3</em>(3), 1–19.',
    doiUrl: 'https://doi.org/10.46451/ijclt.2022.03.01',
  },
  {
    citationHtml:
      'Zheng, Y., Zheng, Y., & Zhang, A. J. (2021). HSK 试卷架构对 1–3 级考生成绩的影响：以英语母语者为例. <em>国际汉语教学研究 International Chinese Language Education</em>, <em>6</em>(3), 50–59.',
  },
  {
    citationHtml:
      'Bai, W., & Zhang, A. J. (2021). Developing key competencies via formative assessment in primary school English classrooms: Teacher education perspective. <em>Journal of Nanjing Xiaozhuang University</em>, <em>37</em>(4), 22–27.',
  },
  {
    citationHtml:
      'Zhang, A. J. (2018). <em>The impact of formative assessment on young English learners’ motivation and achievement in China</em> [Doctoral dissertation, University of Sheffield]. White Rose eTheses Online.',
    doiUrl: 'https://etheses.whiterose.ac.uk/id/eprint/21497',
  },
];

/** Teaching page — narrative only (no job-by-job list). British English. */
export const teachingNarrativeParagraphs = [
  'Earlier work was in the United Kingdom: English for Academic Purposes with international undergraduates and postgraduates, plus primary school partnership teaching while I completed my doctorate at Sheffield on formative assessment and young language learners.',
  'I am now Assistant Professor in the School of Education at City University of Macau. I teach research methods, assessment, and language- and education-focused modules at master’s and doctoral level, and I supervise MEd and PhD students. Seminars draw on English alongside Chinese and on higher education in Macau and the Greater Bay Area, without treating any single system as the default.',
] as const;

/**
 * Teaching philosophy — short statement aligned with current CityU role.
 */
export const teachingPhilosophyParagraphs = [
  'Teaching is grounded in language education and applied linguistics, with assessment for learning and formative assessment at the centre. I use research-led discussion and mixed-methods literacy so students can read and critique empirical work, then connect ideas from the literature to tasks, rubrics, and classroom dialogue.',
  'Preparation through the Sheffield Teaching Assistant Programme still informs how I lead seminars, design assessment, and mentor dissertations. Examples from mainland China collaborations sometimes illustrate teacher education and assessment alongside Macau-based cases.',
] as const;

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
  {
    paperTitle:
      'Interplay between personality traits, vocabulary learning strategy, and achievement in Chinese EFL classes (with L. Zong)',
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
    description: 'Research themes, peer-reviewed outputs, and funded projects—organised in subpages.',
    accent: 'green' as const,
  },
  {
    slug: 'teaching' as const,
    title: 'Teaching',
    kicker: 'Philosophy & supervision',
    description:
      'Approach and trajectory across the UK and China / Macau, plus MEd and doctoral supervision.',
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
