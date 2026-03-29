/**
 * Supervision summaries without student names. Cohorts are listed newest first within each block.
 */

export const supervisionIntroParagraphs = [
  'I supervise dissertations and theses in language education, assessment, and technology-enhanced learning at City University of Macau, School of Education: Master of Education and doctoral projects on formative assessment, AI in language education, informal digital learning, and teacher acceptance of innovation.',
  'The summaries below group dissertation themes by cohort and programme. No individual students are named. Working titles may evolve as projects mature.',
] as const;

export type SupervisionCohort = {
  cohort: string;
  status: 'Completed' | 'In progress';
  topics: string[];
};

export type SupervisionBlock = {
  title: string;
  subtitle: string;
  cohorts: SupervisionCohort[];
};

/** Newest cohort first within each block. */
export const supervisionBlocks: SupervisionBlock[] = [
  {
    title: 'Master of Education',
    subtitle: 'City University of Macau, School of Education',
    cohorts: [
      {
        cohort: '2026',
        status: 'In progress',
        topics: ['Several MEd dissertation projects underway; topics to be confirmed on programme records.'],
      },
      {
        cohort: '2025',
        status: 'In progress',
        topics: [
          'AI-assisted evaluation and peer assessment in primary school Chinese writing',
          'Generative AI affordances for oral English teaching in primary schools',
          'Acceptance and uptake of peer assessment and AI-based assessment in junior secondary English writing (UTAUT-based mixed methods)',
          'Informal digital learning of English on social platforms and self-regulated learning',
          'Teachers’ acceptance of gamified EFL and primary pupils’ achievement emotions (mixed methods)',
          'Further MEd dissertation in development',
        ],
      },
      {
        cohort: '2024',
        status: 'Completed',
        topics: [
          'K–12 online English private tutoring in mainland China: difficulties, countermeasures, and narrative inquiry into interactive online teaching',
        ],
      },
    ],
  },
  {
    title: 'Doctor of Philosophy (Education)',
    subtitle: 'City University of Macau, School of Education',
    cohorts: [
      {
        cohort: '2025',
        status: 'In progress',
        topics: [
          'Evaluative judgement in AI-enabled English language teaching: think-aloud process study with doctoral-level participants',
        ],
      },
      {
        cohort: '2024',
        status: 'In progress',
        topics: [
          'Online formative assessment, psychological capital, and self-regulated learning',
          'Efficacy of informal digital learning of English on language proficiency (mixed methods, regional context)',
        ],
      },
      {
        cohort: '2023',
        status: 'In progress',
        topics: [
          'Mechanisms linking formative assessment to classroom academic emotions in university English courses',
        ],
      },
    ],
  },
];
