// Shared by the workshop deck and its standalone participant pack.
export function createCustomSitePrompt(fields, values, requirements, chinese = false) {
 const title = chinese ? '依我的課堂計劃製作形成性評估網站' : 'Build a formative assessment site from my classroom plan';
 const guidance = chinese
  ? '以下是教師填寫的課堂計劃。保留其班級、目標、準則、任務、語言需要及課堂限制，不要套用其他情境。先核對計劃與三個框架是否配合；如缺少必要資料，先提出簡短問題。清楚標示建議補充的內容，等教師檢視後再製作網站。第二項準則可不填，按目標決定是否需要。'
  : 'The classroom plan below contains the teacher’s own entries. Preserve its class, target, criteria, task, language needs and classroom constraints; do not substitute another scenario. First check how the plan fits the three frameworks. Ask brief questions about missing essential information. Clearly label any proposed additions for teacher review before building the site. The second criterion is optional; include it only if the target needs it.';
 const plan = fields.map(field => {
  const value = String(values[field.id] ?? '').trim();
  const missing = field.id === 'criterion2'
   ? (chinese ? '［未提供；此項可選］' : '[Not supplied; optional]')
   : (chinese ? '［未提供；如屬必要資料，先向教師確認］' : '[Not supplied; ask the teacher if essential]');
  return `${chinese ? field.labelZh : field.label}\n${value || missing}`;
 }).join('\n\n');
 return [title, guidance, chinese ? '教師的課堂計劃' : 'Teacher’s classroom plan', plan,
  chinese ? '三個框架與網站製作要求' : 'Three frameworks and site-building requirements',
  chinese ? requirements.zh : requirements.en].join('\n\n');
}
