// Reuse the existing General English navigation, language, quiz, timer and name-draw controls.
import './generalEnglishUnit5';

const deck = document.querySelector<HTMLElement>('[data-unit9-session]');
const session = deck?.dataset.unit9Session || '1';
const title = deck?.dataset.sessionTitle || 'Unit 9';
const storageKey = `general-english-unit9-session-${session}-v1`;
const inputs = Array.from(document.querySelectorAll<HTMLTextAreaElement>('[data-u9-field]'));
const fields: Record<string, string> = {};
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    for (const input of inputs) {
      const key = input.dataset.u9Field!;
      if (Object.hasOwn(stored, key) && typeof stored[key] === 'string') fields[key] = stored[key];
    }
  }
} catch { /* Notes remain usable when browser storage is unavailable. */ }
function status(input: HTMLTextAreaElement, saved?: boolean) {
  const output = input.parentElement?.querySelector('[data-u9-status]');
  const zh = input.closest('[data-language]')?.getAttribute('data-language') === 'zh';
  const count = input.value.trim() ? input.value.trim().split(/\s+/u).length : 0;
  if (output) output.textContent = `${count} ${zh ? '字詞' : count === 1 ? 'word' : 'words'}${saved === undefined ? '' : saved ? (zh ? ' · 已儲存於此瀏覽器，並未提交。' : ' · Saved in this browser; not submitted.') : (zh ? ' · 無法儲存，離開前請下載作品。' : ' · Saving unavailable. Download your work before leaving.')}`;
}
inputs.forEach(input => {
  const key = input.dataset.u9Field!;
  input.value = fields[key] || '';
  status(input);
  input.addEventListener('input', () => {
    fields[key] = input.value;
    let saved = false;
    try { localStorage.setItem(storageKey, JSON.stringify(fields)); saved = true; } catch { /* Preserve the in-memory draft. */ }
    inputs.filter(other => other.dataset.u9Field === key).forEach(other => {
      if (other !== input) other.value = input.value;
      status(other, saved);
    });
  });
});
function entries() {
  const seen = new Set<string>();
  return inputs.filter(input => {
    const key = input.dataset.u9Field!;
    if (seen.has(key) || !fields[key]?.trim()) return false;
    seen.add(key); return true;
  }).map(input => ({ label: input.dataset.fieldLabel || input.dataset.u9Field!, value: fields[input.dataset.u9Field!] }));
}
function exportStatus(button: Element, message: string) {
  const output = button.closest('.u9-export')?.querySelector('[data-u9-export-status]');
  if (output) output.textContent = message;
}
document.querySelectorAll<HTMLButtonElement>('[data-u9-download]').forEach(button => button.addEventListener('click', () => {
  const work = entries();
  const zh = button.closest('[data-language]')?.getAttribute('data-language') === 'zh';
  if (!work.length) { exportStatus(button, zh ? '請先在練習欄寫下內容。' : 'Write in a response field first.'); return; }
  const text = [`General English I — Unit 9, Session ${session}`, title, '', ...work.flatMap(item => [item.label, item.value, ''])].join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `general-english-unit9-session-${session}.txt`;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  exportStatus(button, zh ? '已要求瀏覽器下載文字檔。' : 'Text download requested.');
}));
function preparePrint() {
  const container = document.querySelector('.u9-print-notes');
  if (!container) return;
  container.replaceChildren();
  const heading = document.createElement('h1'); heading.textContent = `Unit 9 · Session ${session}: ${title}`; container.append(heading);
  const work = entries();
  if (!work.length) { const p = document.createElement('p'); p.textContent = 'No written responses yet. Use the practice sheets for blank activities.'; container.append(p); }
  work.forEach(item => { const h = document.createElement('h2'); h.textContent = item.label; const p = document.createElement('p'); p.textContent = item.value; container.append(h, p); });
}
window.addEventListener('beforeprint', preparePrint);
document.querySelectorAll('[data-u9-print]').forEach(button => button.addEventListener('click', () => { preparePrint(); window.print(); }));

// Unit 9 quizzes use feedback that also fits reading and listening questions.
document.querySelectorAll<HTMLElement>('[data-u9-quiz]').forEach(quiz => {
  quiz.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach(button => button.addEventListener('click', () => {
    const zh = quiz.dataset.languageCode === 'zh';
    const correct = button.dataset.choice === quiz.dataset.correct;
    quiz.querySelectorAll('[data-choice]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const feedback = quiz.querySelector('[data-quiz-feedback]');
    if (feedback) feedback.textContent = correct
      ? `${zh ? '答對了。' : 'Correct. '}${quiz.dataset.explanation}`
      : (zh ? '再試一次，根據例子或聽讀內容比較選項。' : 'Try again. Compare the choices with the example or source.');
  }));
});
