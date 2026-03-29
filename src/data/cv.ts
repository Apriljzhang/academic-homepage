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

export const summary =
  'An experienced researcher and lecturer working in language education and formative assessment. Skilled in mixed-methods research, data analysis, lecturing, tutoring, organisation, and collaborative enquiry. PhD from the University of Sheffield on formative assessment, motivation, and achievement in language education.';

export const researchInterests = {
  intro:
    'Alongside published work, I am developing projects on assessment for learning, multilingual higher education in Macau, motivation in digital contexts, and generative AI in language assessment and research practice. The themes below summarise ongoing directions; not every line corresponds to a finished publication.',
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
  note?: string;
  /** Link to this item on Google Scholar (where available). */
  scholarHref?: string;
};

/** Peer-reviewed articles and thesis, aligned with [Google Scholar](https://scholar.google.com/citations?user=UXwVmZ8AAAAJ&hl=en) (March 2026). */
export const publications: PublicationItem[] = [
  {
    citationHtml:
      'Ji, T., & Zhang, J. (2025). Demotivation in English learning of Chinese medical students: Insights from situated expectancy-value theory. <em>Acta Psychologica</em>, 253, Article 104716.',
    scholarHref:
      'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=UXwVmZ8AAAAJ&citation_for_view=UXwVmZ8AAAAJ:eQOLeE2rZwMC',
  },
  {
    citationHtml:
      'Wright, C., Lu, Y., Zhang, J., Zhang, L., & Zheng, Y. (2022). Tests of learning or testing for learning? An exploratory study of motivation and language learning strategies among HSK Level 1–3 test-takers in the UK. <em>International Journal of Chinese Language Teaching</em>, 3(3), 1–19.',
    scholarHref:
      'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=UXwVmZ8AAAAJ&citation_for_view=UXwVmZ8AAAAJ:YsMSGLbcyi4C',
  },
  {
    citationHtml:
      'Zheng, Y., Zheng, Y., & Zhang, J. (2021). HSK 试卷架构对1–3 级考生成绩的影响：以英语母语者为例. <em>国际汉语教学研究 International Chinese Language Education</em>, 6(3), 50–59.',
    scholarHref:
      'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=UXwVmZ8AAAAJ&citation_for_view=UXwVmZ8AAAAJ:Y0pCki6q_DkC',
  },
  {
    citationHtml:
      'Bai, W., & Zhang, J. (2021). Developing key competencies via formative assessment in primary school English classrooms—teacher education perspective. <em>Journal of Nanjing Xiaozhuang University</em>, 37(4), 22–27.',
    scholarHref:
      'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=UXwVmZ8AAAAJ&citation_for_view=UXwVmZ8AAAAJ:W7OEmFMy1HYC',
  },
  {
    citationHtml:
      'Zhang, J. (2018). <em>The impact of formative assessment on young English learners’ motivation and achievement in China</em>. PhD thesis, The University of Sheffield.',
    note: 'Thesis',
    scholarHref:
      'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=UXwVmZ8AAAAJ&citation_for_view=UXwVmZ8AAAAJ:UeHWp8X0CEIC',
  },
];

export const publicationsUnderReview: PublicationItem[] = [
  {
    citationHtml:
      'Zhang, J., Ji, T., & Wei, J. (under review). The impact of co-constructed rubric on peer assessment and academic performance in university English learning. <em>Studies in Educational Evaluation</em>.',
    note: 'Under review',
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
