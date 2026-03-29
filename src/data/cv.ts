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

/** Minimal line on the About page (photo + short purpose). */
export const aboutPageLead =
  'This site is just my research—interests, publications, and funded work. That is it.';

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
};

/** Peer-reviewed work and doctoral dissertation (APA 7th), newest first. */
export const publications: PublicationItem[] = [
  {
    citationHtml:
      'Ji, T., & Zhang, J. (2025). Demotivation in English learning of Chinese medical students: Insights from situated expectancy-value theory. <em>Acta Psychologica</em>, <em>253</em>, Article 104716.',
  },
  {
    citationHtml:
      'Wright, C., Lu, Y., Zhang, J., Zhang, L., & Zheng, Y. (2022). Tests of learning or testing for learning? An exploratory study of motivation and language learning strategies among HSK level 1–3 test-takers in UK. <em>International Journal of Chinese Language Teaching</em>, <em>3</em>(3), 1–19.',
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
      'Zhang, J. (2018). <em>The impact of formative assessment on young English learners’ motivation and achievement in China</em> [Doctoral dissertation, University of Sheffield].',
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
    kicker: 'Publications & collaboration',
    description: 'Research themes, peer-reviewed publications in APA 7th style, and funded projects.',
    accent: 'sage' as const,
  },
  {
    slug: 'teaching' as const,
    title: 'Teaching',
    kicker: 'Higher education & schools',
    description:
      'University teaching, EAP, and related roles, together with earlier school-based experience in the UK.',
    accent: 'sky' as const,
  },
  {
    slug: 'service' as const,
    title: 'Service',
    kicker: 'Conferences & engagement',
    description:
      'Selected conference presentations and scholarly dissemination in language education and assessment.',
    accent: 'blush' as const,
  },
] as const;
