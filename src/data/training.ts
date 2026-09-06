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
    { number: 1, slug: 'philosophical-foundations', title: 'Philosophical Foundations' },
    { number: 2, slug: 'research-questions', title: 'Research Questions' },
    { number: 3, slug: 'introduction', title: 'Introduction' },
    { number: 4, slug: 'literature-review', title: 'Literature Review' },
    { number: 5, slug: 'methodology', title: 'Methodology' },
    { number: 6, slug: 'results-findings', title: 'Results / Findings' },
    { number: 7, slug: 'discussion', title: 'Discussion' },
    { number: 8, slug: 'conclusion', title: 'Conclusion' },
    { number: 9, slug: 'abstract', title: 'Abstract' },
    { number: 10, slug: 'references-citation', title: 'References and Citation' },
  ],
} as const satisfies TrainingTheme;
