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

/** Degree-level blocks: doctoral dissertations first, then all master theses. */
export const supervisionBlocks: SupervisionBlock[] = [
  {
    title: 'PhD Dissertations',
    subtitle: '',
    cohorts: [
      {
        cohort: '2025',
        status: 'In progress',
        topics: [
          'Developmental Trajectories of Evaluative Judgement in AI-Assisted EFL Academic Writing Revision: A Longitudinal Mixed-Methods Study of Rubric-Based Intervention',
          'Informal digital learning of English and self-regulation among medium-achieving students in secondary school (mixed methods)',
        ],
      },
      {
        cohort: '2024',
        status: 'In progress',
        topics: [
          'The Impact of Implementing Online Formative Assessment for Students’ Psychological Capital and Self-Regulated Learning',
          'Evaluating the Efficacy of Informal Digital Learning of English on Language Proficiency: A Mixed-Methods Study in Huizhou, China',
        ],
      },
      {
        cohort: '2023',
        status: 'Completed',
        topics: [
          'A Study on the Influence Mechanism of Formative Assessment on Student’s Classroom Academic Emotions in English Class of Chinese Universities',
        ],
      },
    ],
  },
  {
    title: 'Master Theses',
    subtitle: '',
    cohorts: [
      {
        cohort: '2026',
        status: 'In progress',
        topics: ['Several master thesis projects underway; topics to be confirmed on programme records.'],
      },
      {
        cohort: '2025',
        status: 'Completed',
        topics: [
          'A Mixed-Methods Study on Oral Communication Teaching and Social-Emotional Competence Development in a Township Boarding School',
          'A Study on the Application of AI-Assisted Assessment and Peer Review in Primary School Chinese Writing Classes',
          'Informal Digital Learning of English on Rednote: A Study on Self-regulated Learning, Student Engagement and Their Relationships Among Non-English Major Undergraduates',
          'The Role of Gamification in Enhancing English Learning Motivation, Effectiveness, and Emotional Experience among Primary School Students',
          'Exploring Interactions and Motivation Among Chinese EFL Learners Engaging with TikTok Refugees on Xiaohongshu',
          'Peer vs. AI Assessment in Junior High School EFL Writing',
        ],
      },
      {
        cohort: '2024',
        status: 'Completed',
        topics: [
          'The Difficulties and Countermeasures of K-12 Online English Private Tutoring in Chinese Mainland',
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
