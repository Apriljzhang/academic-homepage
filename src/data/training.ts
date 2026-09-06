export type TrainingSession = {
  number: number;
  slug: string;
  title: string;
};

export type TrainingTheme = {
  slug: string;
  shortTitle: string;
  title: string;
  context: string;
  description: string;
  sessions: readonly TrainingSession[];
};

export const eapTrainingTheme = {
  slug: 'english-for-academic-purposes',
  shortTitle: 'EAP',
  title: 'English for Academic Purposes',
  context: 'Applied linguistics and language education',
  description:
    'A developing sequence for academic writing in applied linguistics and language education. Detailed session content will be added progressively.',
  sessions: [
    { number: 1, slug: 'introduction', title: 'Introduction' },
    { number: 2, slug: 'literature-review', title: 'Literature Review' },
    { number: 3, slug: 'methods', title: 'Methods' },
    { number: 4, slug: 'findings-results', title: 'Findings / Results' },
    { number: 5, slug: 'discussion', title: 'Discussion' },
    { number: 6, slug: 'conclusion', title: 'Conclusion' },
  ],
} as const satisfies TrainingTheme;
