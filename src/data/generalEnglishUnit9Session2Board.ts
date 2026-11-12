export type BoardKind = 'viewpoint' | 'tone';
export type BoardGroup = { id: string; en: string; zh: string };
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
