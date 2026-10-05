export type CloudMeaning = { en: string; zh: string; aliases: string[] };

// Common research-ethics terms; unfamiliar entries can be mapped in the instructor dialog.
export const ethicsWordMeanings: CloudMeaning[] = [
  { en: 'Research ethics', zh: '研究倫理', aliases: ['ethics', 'ethical research', '倫理', '伦理', '研究伦理', 'ética', 'ética da investigação', 'ética da pesquisa'] },
  { en: 'Research integrity', zh: '研究誠信', aliases: ['integrity', '誠信', '诚信', '研究诚信', 'integridade', 'integridade científica'] },
  { en: 'Informed consent', zh: '知情同意', aliases: ['consent', '同意', '知情同意書', '知情同意书', 'consentimento informado', 'consentimiento informado'] },
  { en: 'Voluntary participation', zh: '自願參與', aliases: ['voluntary', 'voluntariness', '自願', '自愿', '自愿参与', '參與自願', 'participação voluntária'] },
  { en: 'Right to withdraw', zh: '退出權', aliases: ['withdrawal', 'withdraw', '退出', '退出權利', '退出权', 'direito de desistir'] },
  { en: 'Privacy', zh: '私隱', aliases: ['隱私', '隐私', '私隐', 'privacidade', 'privacidad'] },
  { en: 'Confidentiality', zh: '保密', aliases: ['confidential', 'confidential data', '機密', '机密', '保密性', 'confidencialidade'] },
  { en: 'Anonymity', zh: '匿名', aliases: ['anonymous', '匿名性', '匿名化', 'anonimato'] },
  { en: 'Data protection', zh: '資料保護', aliases: ['protect data', 'data privacy', '數據保護', '数据保护', '资料保护', 'proteção de dados'] },
  { en: 'Data security', zh: '資料安全', aliases: ['secure storage', '安全儲存', '安全储存', '數據安全', '数据安全', 'segurança dos dados'] },
  { en: 'Data management', zh: '資料管理', aliases: ['research data', 'data handling', '數據管理', '数据管理', '资料管理', 'gestão de dados'] },
  { en: 'Risk', zh: '風險', aliases: ['risks', '風險評估', '风险', '风险评估', 'risco', 'riscos'] },
  { en: 'Harm', zh: '傷害', aliases: ['do no harm', '傷害最小化', '伤害', '避免傷害', 'dano', 'danos'] },
  { en: 'Benefit', zh: '益處', aliases: ['benefits', 'research benefit', '好處', '好处', '益处', 'benefício', 'benefícios'] },
  { en: 'Respect', zh: '尊重', aliases: ['respect for persons', '尊重參與者', '尊重参与者', 'respeito'] },
  { en: 'Dignity', zh: '尊嚴', aliases: ['human dignity', '尊严', 'dignidade'] },
  { en: 'Fairness', zh: '公平', aliases: ['justice', 'equity', '公正', '公平性', 'justiça', 'equidade'] },
  { en: 'Trust', zh: '信任', aliases: ['trustworthiness', '可信', '可信賴', '可信赖', 'confiança'] },
  { en: 'Transparency', zh: '透明度', aliases: ['transparent', '透明', 'transparência'] },
  { en: 'Honesty', zh: '誠實', aliases: ['truthfulness', '誠實報告', '诚实', '诚实报告', 'honestidade'] },
  { en: 'Accountability', zh: '問責', aliases: ['responsibility', 'responsible research', '責任', '责任', '问责', 'responsabilidade'] },
  { en: 'Ethics review', zh: '倫理審查', aliases: ['irb', 'institutional review board', 'ethics approval', '倫理批准', '伦理审查', '伦理批准', 'comissão de ética'] },
  { en: 'Power imbalance', zh: '權力不對等', aliases: ['power', 'coercion', '權力', '权力', '權力關係', '权力关系', 'pressão para participar'] },
  { en: 'Dual roles', zh: '雙重角色', aliases: ['dual role', 'researcher teacher', 'teacher researcher', '雙重身份', '双重角色', '双重身份'] },
  { en: 'Conflict of interest', zh: '利益衝突', aliases: ['conflicts of interest', 'coi', '利益冲突', 'conflito de interesses'] },
  { en: 'Authorship', zh: '作者署名', aliases: ['author order', 'author contribution', '署名', '作者順序', '作者顺序', 'autoria'] },
  { en: 'Plagiarism', zh: '剽竊', aliases: ['copying', '抄襲', '抄袭', '剽窃', 'plágio'] },
  { en: 'Fabrication', zh: '捏造', aliases: ['fabricated data', '虛構資料', '虚构数据', 'fabricação de dados'] },
  { en: 'Falsification', zh: '篡改', aliases: ['falsified data', '篡改資料', '篡改数据', 'falsificação de dados'] },
  { en: 'Selective reporting', zh: '選擇性報告', aliases: ['cherry picking', 'selective publication', '選擇性發表', '选择性报告', '选择性发表'] },
  { en: 'AI disclosure', zh: '人工智能使用披露', aliases: ['ai transparency', 'disclose ai', '人工智能披露', 'ai披露', '人工智慧披露', 'ia disclosure'] },
  { en: 'Bias', zh: '偏見', aliases: ['prejudice', '偏差', '偏见', 'viés'] },
  { en: 'Vulnerable participants', zh: '弱勢參與者', aliases: ['vulnerable groups', 'minors', 'children', '弱勢群體', '弱势群体', '未成年人', '兒童', '儿童'] },
  { en: 'Safeguards', zh: '保障措施', aliases: ['protection', 'safeguard', '保護措施', '保护措施', '保障', 'salvaguardas'] },
];

export function normalizeCloudTerm(value: string): string {
  let term = value.normalize('NFKC').toLocaleLowerCase()
    .replace(/[‘’]/g, "'").replace(/[‐‑‒–—]/g, '-')
    .replace(/\s+/g, ' ').trim().replace(/[.!?。！？,，;；:：]+$/g, '');
  if (/\p{Script=Han}/u.test(term)) term = term.replace(/\s+/g, '');
  return term;
}
