type CloudWord = { term: string; count: number };
type CloudResults = { words: CloudWord[]; total: number };

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const functionUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/dedc02-ethics-wordcloud` : '';
const svgNS = 'http://www.w3.org/2000/svg';

function cloudUrl(view: 'student' | 'instructor'): string {
  const url = new URL(location.href);
  url.searchParams.set('cloud', view);
  url.hash = 'slide-2';
  return url.toString();
}

async function requestCloud<T>(payload: Record<string, unknown>): Promise<T> {
  if (!functionUrl || !supabaseKey) throw new Error('The live word cloud is not configured on this site.');
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The word cloud could not be updated.');
  return data as T;
}

function drawCloud(svg: SVGSVGElement, words: CloudWord[], chinese: boolean) {
  svg.replaceChildren();
  if (!words.length) return;
  const colours = ['#176444', '#215475', '#ad5a2d', '#5e477d', '#33696b'];
  const placed: Array<{ x: number; y: number; w: number; h: number }> = [];
  const highest = Math.max(...words.map((word) => word.count));
  const ranked = [...words].sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
  for (const [index, word] of ranked.entries()) {
    let fontSize = Math.round(26 + 46 * Math.sqrt(word.count / highest));
    const wide = Array.from(word.term).reduce((sum, character) => sum + (/\p{Script=Han}/u.test(character) ? 1 : .57), 0);
    fontSize = Math.min(fontSize, Math.floor(800 / Math.max(wide, 1)));
    fontSize = Math.max(17, fontSize);
    const width = Math.min(920, fontSize * wide + 15);
    const height = fontSize * 1.2;
    let spot: { x: number; y: number } | undefined;
    for (let step = 0; step < 1150; step += 1) {
      const angle = step * 2.399963229728653;
      const radius = 3.4 * Math.sqrt(step);
      const x = 500 + radius * 9.4 * Math.cos(angle);
      const y = 215 + radius * 4.1 * Math.sin(angle);
      const box = { x: x - width / 2, y: y - height / 2, w: width, h: height };
      if (box.x < 15 || box.x + box.w > 985 || box.y < 18 || box.y + box.h > 412) continue;
      if (placed.some((other) => box.x < other.x + other.w + 10 && box.x + box.w + 10 > other.x && box.y < other.y + other.h + 7 && box.y + box.h + 7 > other.y)) continue;
      placed.push(box);
      spot = { x, y };
      break;
    }
    if (!spot) continue;
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', String(spot.x));
    text.setAttribute('y', String(spot.y));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('font-size', String(fontSize));
    text.setAttribute('font-weight', word.count === highest ? '750' : '600');
    text.setAttribute('fill', colours[index % colours.length]);
    text.textContent = word.term;
    const title = document.createElementNS(svgNS, 'title');
    title.textContent = `${word.term}: ${word.count} ${chinese ? '次' : word.count === 1 ? 'response' : 'responses'}`;
    text.append(title);
    svg.append(text);
  }
}

export function initEthicsWordCloud() {
  const slide = document.querySelector<HTMLElement>('.cloud-slide');
  const studentDialog = document.querySelector<HTMLDialogElement>('[data-cloud-dialog="student"]');
  const instructorDialog = document.querySelector<HTMLDialogElement>('[data-cloud-dialog="instructor"]');
  const form = studentDialog?.querySelector<HTMLFormElement>('[data-cloud-form]');
  const submitStatus = studentDialog?.querySelector<HTMLElement>('[data-cloud-submit-status]');
  const copyStatus = studentDialog?.querySelector<HTMLElement>('[data-cloud-copy-status]');
  const resultStatus = instructorDialog?.querySelector<HTMLElement>('[data-cloud-result-status]');
  const svg = instructorDialog?.querySelector<SVGSVGElement>('[data-cloud-svg]');
  const accessibleList = instructorDialog?.querySelector<HTMLElement>('[data-cloud-accessible-list]');
  if (!slide || !studentDialog || !instructorDialog || !form || !submitStatus || !copyStatus || !resultStatus || !svg || !accessibleList) return;

  let language: 'en' | 'zh' = 'en';
  let updating = false;
  const chinese = () => language === 'zh';
  const message = (en: string, zh: string) => chinese() ? zh : en;
  const dialogs = { student: studentDialog, instructor: instructorDialog };

  function setLanguage(next: 'en' | 'zh') {
    language = next;
    document.querySelectorAll<HTMLElement>('.cloud-dialog [data-cloud-en]').forEach((node) => {
      node.textContent = node.dataset[next === 'zh' ? 'cloudZh' : 'cloudEn'] || '';
    });
    document.querySelectorAll<HTMLButtonElement>('.cloud-dialog [data-cloud-language]').forEach((button) => {
      button.textContent = next === 'zh' ? 'English' : '中文';
    });
  }

  function open(view: 'student' | 'instructor', updateUrl = true) {
    const dialog = dialogs[view];
    if (!dialog.open) {
      setLanguage(slide.dataset.language === 'zh' ? 'zh' : 'en');
      dialog.showModal();
    }
    if (updateUrl) history.replaceState(null, '', cloudUrl(view));
    if (view === 'instructor') {
      resultStatus.textContent = message('Loading word cloud…', '正在載入詞雲…');
      void refresh();
    }
  }

  document.querySelectorAll<HTMLAnchorElement>('[data-cloud-open]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const view = link.dataset.cloudOpen;
      if (view === 'student' || view === 'instructor') open(view);
    });
  });
  document.querySelectorAll<HTMLButtonElement>('.cloud-dialog [data-cloud-close]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });
  document.querySelectorAll<HTMLButtonElement>('.cloud-dialog [data-cloud-language]').forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(chinese() ? 'en' : 'zh');
      if (instructorDialog.open) void refresh();
    });
  });
  [studentDialog, instructorDialog].forEach((dialog) => {
    dialog.addEventListener('close', () => {
      const url = new URL(location.href);
      url.searchParams.delete('cloud');
      history.replaceState(null, '', url);
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const words = Array.from(form.querySelectorAll<HTMLInputElement>('.cloud-inputs input'))
      .map((input) => input.value.normalize('NFKC').replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (!words.length) { submitStatus.textContent = message('Enter at least one word.', '請至少輸入一個詞語。'); return; }
    const button = form.querySelector<HTMLButtonElement>('[type="submit"]');
    if (button) button.disabled = true;
    submitStatus.textContent = message('Sending…', '正在提交…');
    try {
      await requestCloud({ action: 'submit', words });
      form.querySelectorAll<HTMLInputElement>('.cloud-inputs input').forEach((input) => { input.value = ''; });
      submitStatus.textContent = message('Your words were added anonymously.', '你的詞語已匿名加入。');
    } catch (error) {
      submitStatus.textContent = error instanceof Error ? error.message : String(error);
    } finally { if (button) button.disabled = false; }
  });

  studentDialog.querySelector<HTMLButtonElement>('[data-cloud-copy]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(cloudUrl('student'));
      copyStatus.textContent = message('Student link copied.', '已複製學生連結。');
    } catch {
      copyStatus.textContent = message('Copy the address from your browser.', '請從瀏覽器複製網址。');
    }
  });

  async function refresh() {
    if (updating || !instructorDialog.open) return;
    updating = true;
    try {
      const result = await requestCloud<CloudResults>({ action: 'results' });
      drawCloud(svg, result.words, chinese());
      accessibleList.textContent = result.words.map((word) => `${word.term} (${word.count})`).join(', ');
      resultStatus.textContent = result.total
        ? message(`${result.total} words or phrases submitted · ${result.words.length} distinct`, `已提交 ${result.total} 個詞語或短語 · ${result.words.length} 種不同詞語`)
        : message('Waiting for student words…', '正在等待學生提交詞語…');
    } catch (error) { resultStatus.textContent = error instanceof Error ? error.message : String(error); }
    finally { updating = false; }
  }

  instructorDialog.querySelector<HTMLButtonElement>('[data-cloud-refresh]')?.addEventListener('click', refresh);
  window.setInterval(() => { if (instructorDialog.open) void refresh(); }, 5000);
  const initialView = new URLSearchParams(location.search).get('cloud');
  if (initialView === 'student' || initialView === 'instructor') open(initialView, false);
}
