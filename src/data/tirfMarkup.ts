export const escapeHtml = (value: string) => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const bilingual = (en: string, zh: string) => `<span data-language="en">${escapeHtml(en)}</span><span data-language="zh" lang="zh-Hant" hidden>${escapeHtml(zh)}</span>`;
