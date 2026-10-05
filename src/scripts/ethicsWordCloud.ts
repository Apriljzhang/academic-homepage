type CloudWord = { term: string; count: number };
type CloudResults = { words: CloudWord[]; total: number; sessionCode: string };

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const functionUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/dedc02-ethics-wordcloud` : '';
const svgNS = 'http://www.w3.org/2000/svg';
const fixedSessionCode = 'DEDC02';

class CloudRequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

function cloudUrl(code: string): string {
  const url = new URL(location.href);
  url.searchParams.delete('presenter');
  url.searchParams.set('cloud', code);
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
  if (!response.ok) throw new CloudRequestError(response.status, data.error || 'The word cloud could not be updated.');
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

export function initEthicsWordCloud(isCurrentSlide: () => boolean) {
  const slide = document.querySelector<HTMLElement>('.cloud-slide');
  const form = slide?.querySelector<HTMLFormElement>('[data-cloud-form]');
  const sessionInput = slide?.querySelector<HTMLInputElement>('[data-cloud-session-input]');
  const presenter = slide?.querySelector<HTMLElement>('[data-cloud-presenter]');
  const copyButton = slide?.querySelector<HTMLButtonElement>('[data-cloud-copy]');
  const revealButton = slide?.querySelector<HTMLButtonElement>('[data-cloud-reveal]');
  const refreshButton = slide?.querySelector<HTMLButtonElement>('[data-cloud-refresh]');
  const hideButton = slide?.querySelector<HTMLButtonElement>('[data-cloud-hide]');
  const entry = slide?.querySelector<HTMLElement>('[data-cloud-entry]');
  const display = slide?.querySelector<HTMLElement>('[data-cloud-display]');
  const svg = slide?.querySelector<SVGSVGElement>('[data-cloud-svg]');
  const accessibleList = slide?.querySelector<HTMLElement>('[data-cloud-accessible-list]');
  const submitStatus = slide?.querySelector<HTMLElement>('[data-cloud-submit-status]');
  const presenterStatus = slide?.querySelector<HTMLElement>('[data-cloud-presenter-status]');
  const resultStatus = slide?.querySelector<HTMLElement>('[data-cloud-result-status]');
  if (!slide || !form || !sessionInput || !presenter || !copyButton || !revealButton || !refreshButton || !hideButton || !entry || !display || !svg || !accessibleList || !submitStatus || !presenterStatus || !resultStatus) return;

  const sessionCode = fixedSessionCode;
  let updating = false;
  const chinese = () => slide.dataset.language === 'zh';
  const message = (en: string, zh: string) => chinese() ? zh : en;
  const presenterKey = 'dedc02-ethics-presenter';
  const url = new URL(location.href);
  const linkCode = url.searchParams.get('presenter')?.trim().toUpperCase() || '';
  let presenterCode = '';
  if (/^[A-HJ-NP-Z2-9]{10}$/.test(linkCode)) {
    presenterCode = linkCode;
    try { sessionStorage.setItem(presenterKey, presenterCode); } catch { /* Keep it for this page. */ }
    url.searchParams.delete('presenter');
    history.replaceState(null, '', url);
  } else {
    try { presenterCode = sessionStorage.getItem(presenterKey) || ''; } catch { /* Student view. */ }
  }
  if (presenterCode) {
    presenter.hidden = false;
    revealButton.disabled = true;
    presenterStatus.textContent = message('Opening instructor view…', '正在開啟教師畫面…');
    void requestCloud<{ sessionCode: string }>({ action: 'create', accessCode: presenterCode })
      .then(() => {
        revealButton.disabled = false;
        presenterStatus.textContent = message('Ready to reveal student words.', '可以顯示學生詞語。');
      })
      .catch((error) => {
        presenterStatus.textContent = error instanceof Error ? error.message : String(error);
      });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const words = Array.from(form.querySelectorAll<HTMLInputElement>('.cloud-inputs input'))
      .map((input) => input.value.normalize('NFKC').replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (!words.length) { submitStatus.textContent = message('Enter at least one word.', '請至少輸入一個詞語。'); return; }
    const button = form.querySelector<HTMLButtonElement>('[type="submit"]');
    if (button) button.disabled = true;
    submitStatus.textContent = message('Sending…', '正在提交…');
    try {
      await requestCloud({ action: 'submit', sessionCode: sessionInput.value.trim().toUpperCase(), words });
      form.querySelectorAll<HTMLInputElement>('.cloud-inputs input').forEach((input) => { input.value = ''; });
      submitStatus.textContent = message('Your words were added anonymously.', '你的詞語已匿名加入。');
    } catch (error) {
      submitStatus.textContent = error instanceof CloudRequestError && error.status === 404
        ? message('The DEDC02 word cloud has expired. Ask your instructor to open their private presenter link.', 'DEDC02詞雲已過期；請教師開啟專用教師連結。')
        : error instanceof Error ? error.message : String(error);
    }
    finally { if (button) button.disabled = false; }
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(cloudUrl(fixedSessionCode));
      presenterStatus.textContent = message('Student link copied.', '已複製學生連結。');
    } catch {
      presenterStatus.textContent = message('Copy the student link from the lesson page address.', '請複製課堂頁面的學生連結。');
    }
  });

  async function refresh() {
    if (updating || display.hidden || !isCurrentSlide()) return;
    updating = true;
    try {
      const result = await requestCloud<CloudResults>({ action: 'results', accessCode: presenterCode, sessionCode });
      drawCloud(svg, result.words, chinese());
      accessibleList.textContent = result.words.map((word) => `${word.term} (${word.count})`).join(', ');
      resultStatus.textContent = result.total
        ? message(`${result.total} words or phrases submitted · ${result.words.length} distinct`, `已提交 ${result.total} 個詞語或短語 · ${result.words.length} 種不同詞語`)
        : message('Waiting for student words…', '正在等待學生提交詞語…');
    } catch (error) { resultStatus.textContent = error instanceof Error ? error.message : String(error); }
    finally { updating = false; }
  }

  revealButton.addEventListener('click', async () => {
    entry.hidden = true;
    display.hidden = false;
    resultStatus.textContent = message('Loading word cloud…', '正在載入詞雲…');
    await refresh();
    if (resultStatus.textContent === 'Presenter code not recognised') { display.hidden = true; entry.hidden = false; presenterStatus.textContent = resultStatus.textContent; }
  });
  refreshButton.addEventListener('click', refresh);
  hideButton.addEventListener('click', () => { display.hidden = true; entry.hidden = false; });
  window.setInterval(() => { if (!display.hidden) void refresh(); }, 5000);
}
