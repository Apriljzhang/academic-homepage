export type BoardKind = 'phrases' | 'viewpoint' | 'tone';
export type BoardGroup = { id: string; en: string; zh: string };
export const prepositionGroups: BoardGroup[] = ['for','with','from','on','to','in','at','about','of'].map(id => ({id,en:id,zh:id}));
export const meaningGroups: BoardGroup[] = [
 {id:'people',en:'People and communication',zh:'人際與溝通'},
 {id:'learning',en:'Learning and improving',zh:'學習與進步'},
 {id:'work',en:'Work and decisions',zh:'工作與決定'},
 {id:'challenges',en:'Feelings and challenges',zh:'感受與挑戰'},
 {id:'things',en:'Places and things',zh:'地方與事物'},
];
export const viewpointGroups: BoardGroup[] = [
 {id:'yes',en:'Yes',zh:'是'}, {id:'no',en:'No',zh:'否'}, {id:'depends',en:'It depends',zh:'視乎情況'},
];
export const toneGroups: BoardGroup[] = [
 {id:'critical',en:'Critical / measured',zh:'批判／平穩陳述'},
 {id:'warm',en:'Warm / affirming',zh:'親切／肯定'},
 {id:'qualified',en:'Balanced / qualified',zh:'平衡／有保留'},
 {id:'confident',en:'Confident / emphatic',zh:'自信／強調'},
 {id:'abrupt',en:'Abrupt / dismissive',zh:'直截／不以為然'},
 {id:'another',en:'Another tone',zh:'另一種語氣'},
];
// One possible semantic organisation, for discussion; several categories can fit.
export const phraseMeaningGroups = [
 'work','people','learning','work','people','work','people','people','work','learning','challenges','learning',
 'people','people','people','people','people','people','people','people','challenges','learning','people','learning',
 'people','people','learning','challenges','challenges','people','people','people','people','things','learning','challenges',
 'learning','learning','learning','challenges','challenges','challenges','work','challenges','things','things','things','challenges',
 'work','work','learning','work','people','learning','learning','challenges','things','challenges','people','learning',
];
