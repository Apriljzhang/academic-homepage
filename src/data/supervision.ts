/**
 * Supervision summaries without student names. Cohorts are listed newest first within each block.
 */

export const supervisionIntroParagraphs: readonly string[] = [];

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

/** Programme blocks: doctoral first, then MEd, then prior MA. Newest cohort first within each block. */
export const supervisionBlocks: SupervisionBlock[] = [
  {
    title: 'Doctor of Philosophy (Education)',
    subtitle: '',
    cohorts: [
      {
        cohort: '2025',
        status: 'In progress',
        topics: [
          'Evaluative judgement in AI-enabled English language teaching: think-aloud process study with doctoral-level participants',
          'Informal digital learning of English and self-regulation among medium-achieving students in secondary school (mixed methods)',
        ],
      },
      {
        cohort: '2024',
        status: 'In progress',
        topics: ['Online formative assessment, psychological capital, and self-regulated learning'],
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
  {
    title: 'Master of Education',
    subtitle: '',
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
    title: 'MA (English)',
    subtitle: '',
    cohorts: [
      {
        cohort: '2024',
        status: 'Completed',
        topics: [
          'AI chatbot–mediated English learning versus traditional instruction: flow, emotions, and oral proficiency among adolescent EFL learners',
          'Peer feedback in kindergarten language education: teacher observations and concerns',
        ],
      },
      {
        cohort: '2023',
        status: 'Completed',
        topics: [
          'Systematic review of learning analytics in language learning and teaching',
          'Co-constructed rubrics and peer assessment in EFL',
          'Self-acceptance, peace of mind, and L2 learning motivation (professional cohort context)',
          'Systematic review of video and video-call feedback in language learning and teaching',
        ],
      },
      {
        cohort: '2022',
        status: 'Completed',
        topics: [
          'Parents’ attitudes and behaviours and young learners’ English learning in kindergarten',
          'Lesson study: perceptions and impact across teacher contexts',
          'Self-regulated strategies and motivation in secondary English writing (private versus public sectors)',
          'Chinese learning motivation and cultural identity among heritage learners in an overseas Confucius Institute setting',
        ],
      },
    ],
  },
];
