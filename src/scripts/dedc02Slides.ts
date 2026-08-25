const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
const currentLabel = document.querySelector<HTMLElement>('[data-current-slide]');
const totalLabel = document.querySelector<HTMLElement>('[data-slide-total]');
const progress = document.querySelector<HTMLElement>('.progress-track span');
const overview = document.querySelector<HTMLDialogElement>('.overview-dialog');
const overviewList = overview?.querySelector('ol');
const translateButton = document.querySelector<HTMLButtonElement>('[data-translate-current]');
let current = 0;
let dashboardResponses: Array<Record<string, any>> = [];
let refreshInterval = 0;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const functionUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/dedc02-exit-tickets` : '';
const answerLabels: Record<string, string> = {
  ontology: 'Ontology', epistemology: 'Epistemology', axiology: 'Axiology',
  methodology: 'Methodology and methods', assumption: 'My assumption', alignment: 'Weakest alignment',
};

function setTextLanguage(slide: HTMLElement, language: 'en' | 'zh') {
  slide.dataset.language = language;
  slide.querySelectorAll<HTMLElement>('[data-en][data-zh]').forEach((element) => {
    element.textContent = element.dataset[language] || '';
  });
}

function syncTranslateButton() {
  const isChinese = slides[current]?.dataset.language === 'zh';
  if (!translateButton) return;
  translateButton.textContent = isChinese ? 'English' : '中文';
  translateButton.setAttribute('aria-pressed', String(isChinese));
}

function showSlide(index: number) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => {
    const active = i === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  if (currentLabel) currentLabel.textContent = String(current + 1);
  if (progress) progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  overviewList?.querySelectorAll('li').forEach((li, i) => li.classList.toggle('is-current', i === current));
  history.replaceState(null, '', `#slide-${current + 1}`);
  syncTranslateButton();
}

if (totalLabel) totalLabel.textContent = String(slides.length);
slides.forEach((slide) => setTextLanguage(slide, 'en'));

document.querySelectorAll<HTMLElement>('[data-nav]').forEach((button) => {
  button.addEventListener('click', () => showSlide(current + (button.dataset.nav === 'next' ? 1 : -1)));
});

translateButton?.addEventListener('click', () => {
  const slide = slides[current];
  if (!slide) return;
  setTextLanguage(slide, slide.dataset.language === 'zh' ? 'en' : 'zh');
  syncTranslateButton();
});

if (overviewList) {
  slides.forEach((slide, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = slide.dataset.title || `Slide ${index + 1}`;
    button.addEventListener('click', () => { showSlide(index); overview?.close(); });
    item.append(button); overviewList.append(item);
  });
}
document.querySelector('[data-overview]')?.addEventListener('click', () => overview?.showModal());
document.querySelector('[data-close-overview]')?.addEventListener('click', () => overview?.close());
document.querySelector('[data-fullscreen]')?.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());

document.querySelectorAll<HTMLButtonElement>('[data-copy-prompt]').forEach((button) => {
  button.addEventListener('click', async () => {
    const prompt = button.parentElement?.querySelector<HTMLElement>('p')?.textContent || '';
    const original = button.textContent || 'Copy prompt';
    try { await navigator.clipboard.writeText(prompt); button.textContent = button.closest<HTMLElement>('.slide')?.dataset.language === 'zh' ? '已複製' : 'Copied'; }
    catch { button.textContent = 'Select and copy'; }
    setTimeout(() => button.textContent = original, 1200);
  });
});

const timerInput = document.querySelector<HTMLInputElement>('[data-timer-minutes]');
const timerStart = document.querySelector<HTMLButtonElement>('[data-timer-start]');
const timerReset = document.querySelector<HTMLButtonElement>('[data-timer-reset]');
const timerOutput = document.querySelector<HTMLOutputElement>('[data-timer-output]');
let timerRemaining = 0;
let timerInterval = 0;
function paintTimer() {
  if (!timerOutput) return;
  timerOutput.hidden = timerRemaining <= 0;
  timerOutput.textContent = `${String(Math.floor(timerRemaining / 60)).padStart(2, '0')}:${String(timerRemaining % 60).padStart(2, '0')}`;
}
timerStart?.addEventListener('click', () => {
  if (timerInterval) { window.clearInterval(timerInterval); timerInterval = 0; timerStart.textContent = 'Start'; return; }
  if (timerRemaining <= 0) {
    const minutes = Math.floor(Number(timerInput?.value || 0));
    if (minutes < 1) { timerInput?.focus(); return; }
    timerRemaining = minutes * 60; paintTimer();
  }
  timerStart.textContent = 'Pause';
  timerInterval = window.setInterval(() => {
    timerRemaining = Math.max(0, timerRemaining - 1); paintTimer();
    if (!timerRemaining) { window.clearInterval(timerInterval); timerInterval = 0; timerStart.textContent = 'Start'; }
  }, 1000);
});
timerReset?.addEventListener('click', () => {
  window.clearInterval(timerInterval); timerInterval = 0; timerRemaining = 0;
  if (timerStart) timerStart.textContent = 'Start';
  if (timerInput) timerInput.value = '';
  paintTimer();
});

document.querySelectorAll<HTMLTextAreaElement>('textarea[data-save]').forEach((field) => {
  const key = `dedc02-grounding-${field.dataset.save}`;
  try { field.value = localStorage.getItem(key) || ''; } catch {}
  field.addEventListener('input', () => { try { localStorage.setItem(key, field.value); } catch {} });
});

async function callExitTicketFunction(payload: Record<string, unknown>) {
  if (!functionUrl || !supabaseKey) throw new Error('Response collection is not configured');
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: supabaseKey, authorization: `Bearer ${supabaseKey}` },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const exitForm = document.querySelector<HTMLFormElement>('[data-exit-form]');
const exitStatus = document.querySelector<HTMLElement>('[data-exit-status]');
exitForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(exitForm);
  const submit = exitForm.querySelector<HTMLButtonElement>('button[type="submit"]');
  const answers: Record<string, string> = {};
  Object.keys(answerLabels).forEach((key) => answers[key] = String(formData.get(key) || ''));
  if (submit) submit.disabled = true;
  if (exitStatus) exitStatus.textContent = 'Submitting…';
  try {
    await callExitTicketFunction({ action: 'submit', preferredName: formData.get('preferredName'), classCode: formData.get('classCode'), answers });
    if (exitStatus) exitStatus.textContent = 'Exit ticket submitted. Thank you.';
    exitForm.querySelectorAll<HTMLTextAreaElement>('textarea').forEach((field) => {
      field.value = ''; try { localStorage.removeItem(`dedc02-grounding-${field.dataset.save}`); } catch {}
    });
  } catch (error) {
    if (exitStatus) exitStatus.textContent = error instanceof Error ? error.message : 'Could not submit the exit ticket.';
  } finally { if (submit) submit.disabled = false; }
});

document.querySelectorAll<HTMLButtonElement>('[data-exit-view]').forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.exitView;
    document.querySelectorAll<HTMLButtonElement>('[data-exit-view]').forEach((x) => x.classList.toggle('is-active', x === button));
    document.querySelectorAll<HTMLElement>('[data-exit-panel]').forEach((panel) => panel.hidden = panel.dataset.exitPanel !== view);
    if (view !== 'teacher') { window.clearInterval(refreshInterval); refreshInterval = 0; }
  });
});

const dashboardClass = document.querySelector<HTMLInputElement>('[data-dashboard-class-code]');
const dashboardAccess = document.querySelector<HTMLInputElement>('[data-dashboard-access-code]');
const dashboardStatus = document.querySelector<HTMLElement>('[data-dashboard-status]');
const responseCount = document.querySelector<HTMLElement>('[data-response-count]');
const responseList = document.querySelector<HTMLElement>('[data-response-list]');
const exportButton = document.querySelector<HTMLButtonElement>('[data-export-csv]');
const refreshButton = document.querySelector<HTMLButtonElement>('[data-refresh-responses]');
try { if (dashboardAccess) dashboardAccess.value = sessionStorage.getItem('dedc02-teacher-code') || ''; } catch {}

function renderResponses(responses: Array<Record<string, any>>) {
  dashboardResponses = responses;
  if (responseCount) responseCount.textContent = String(responses.length);
  if (exportButton) exportButton.disabled = responses.length === 0;
  if (!responseList) return;
  responseList.replaceChildren();
  responses.forEach((response) => {
    const card = document.createElement('details'); card.className = 'response-card';
    const summary = document.createElement('summary');
    const name = document.createElement('span'); name.textContent = String(response.preferred_name || 'Unnamed');
    const date = document.createElement('small'); date.textContent = new Date(response.created_at).toLocaleString();
    summary.append(name, date); card.append(summary);
    const list = document.createElement('dl');
    Object.entries(answerLabels).forEach(([key, label]) => {
      const wrapper = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = String(response.answers?.[key] || '—'); wrapper.append(dt, dd); list.append(wrapper);
    });
    card.append(list); responseList.append(card);
  });
}

async function loadResponses(silent = false) {
  const classCode = dashboardClass?.value.trim() || '';
  const accessCode = dashboardAccess?.value.trim() || '';
  if (!classCode || !accessCode) { if (dashboardStatus) dashboardStatus.textContent = 'Enter both the class code and teacher access code.'; return; }
  if (!silent && dashboardStatus) dashboardStatus.textContent = 'Loading responses…';
  try {
    const data = await callExitTicketFunction({ action: 'list', classCode, accessCode });
    try { sessionStorage.setItem('dedc02-teacher-code', accessCode); } catch {}
    renderResponses(Array.isArray(data.responses) ? data.responses : []);
    if (dashboardStatus) dashboardStatus.textContent = `Showing responses for ${classCode.toUpperCase()}.`;
    if (refreshButton) refreshButton.hidden = false;
    window.clearInterval(refreshInterval);
    refreshInterval = window.setInterval(() => loadResponses(true), 10000);
  } catch (error) {
    window.clearInterval(refreshInterval); refreshInterval = 0;
    if (dashboardStatus) dashboardStatus.textContent = error instanceof Error ? error.message : 'Could not load responses.';
  }
}
document.querySelector('[data-load-responses]')?.addEventListener('click', () => loadResponses());
refreshButton?.addEventListener('click', () => loadResponses());

function csvCell(value: unknown): string { return `"${String(value ?? '').replaceAll('"', '""')}"`; }
exportButton?.addEventListener('click', () => {
  const headers = ['Preferred name', 'Submitted at', ...Object.values(answerLabels)];
  const rows = dashboardResponses.map((response) => [response.preferred_name, response.created_at, ...Object.keys(answerLabels).map((key) => response.answers?.[key] || '')]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.download = `dedc02-exit-tickets-${(dashboardClass?.value || 'class').toUpperCase()}.csv`; link.click(); URL.revokeObjectURL(link.href);
});

document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); showSlide(current + 1); }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); showSlide(current - 1); }
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
  if (event.key.toLowerCase() === 'o') overview?.showModal();
  if (event.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
});

let touchX = 0;
document.addEventListener('touchstart', (event) => { touchX = event.changedTouches[0]?.clientX || 0; }, { passive: true });
document.addEventListener('touchend', (event) => { const dx = (event.changedTouches[0]?.clientX || 0) - touchX; if (Math.abs(dx) > 70) showSlide(current + (dx < 0 ? 1 : -1)); }, { passive: true });

const initialHash = Number(location.hash.replace('#slide-', ''));
showSlide(Number.isFinite(initialHash) && initialHash > 0 ? initialHash - 1 : 0);
