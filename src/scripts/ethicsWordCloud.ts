type CloudWord = { term: string; count: number };
type CloudResults = { words: CloudWord[]; total: number; sessionCode: string };

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const functionUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/dedc02-ethics-wordcloud` : '';
const svgNS = 'http://www.w3.org/2000/svg';

function cloudUrl(code: string): string {
  const url = new URL(location.href);
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

export function initEthicsWordCloud(isCurrentSlide: () => boolean) {
  const slide = document.querySelector<HTMLElement>('.cloud-slide');
  const form = slide?.querySelector<HTMLFormElement>('[data-cloud-form]');
  const sessionInput = slide?.querySelector<HTMLInputElement>('[data-cloud-session-input]');
  const accessInput = slide?.querySelector<HTMLInputElement>('[data-cloud-access-code]');
  const createButton = slide?.querySelector<HTMLButtonElement>('[data-cloud-create]');
  const sessionPanel = slide?.querySelector<HTMLElement>('[data-cloud-session]');
  const sessionLabel = slide?.querySelector<HTMLElement>('[data-cloud-session-code]');
  const joinLink = slide?.querySelector<HTMLInputElement>('[data-cloud-join-link]');
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
  if (!slide || !form || !sessionInput || !accessInput || !createButton || !sessionPanel || !sessionLabel || !joinLink || !copyButton || !revealButton || !refreshButton || !hideButton || !entry || !display || !svg || !accessibleList || !submitStatus || !presenterStatus || !resultStatus) return;

  let sessionCode = '';
  let updating = false;
  const chinese = () => slide.dataset.language === 'zh';
  const message = (en: string, zh: string) => chinese() ? zh : en;

  function setSession(code: string) {
    sessionCode = code;
    sessionInput.value = code;
    sessionLabel.textContent = code;
    joinLink.value = cloudUrl(code);
    sessionPanel.hidden = false;
  }

  const initialCode = new URLSearchParams(location.search).get('cloud')?.trim().toUpperCase() || '';
  if (/^[A-Z2-9]{6}$/.test(initialCode)) setSession(initialCode);

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
    } catch (error) { submitStatus.textContent = error instanceof Error ? error.message : String(error); }
    finally { if (button) button.disabled = false; }
  });

  createButton.addEventListener('click', async () => {
    createButton.disabled = true;
    presenterStatus.textContent = message('Creating session…', '正在建立課堂…');
    try {
      const result = await requestCloud<{ sessionCode: string }>({ action: 'create', accessCode: accessInput.value });
      setSession(result.sessionCode);
      history.replaceState(null, '', cloudUrl(result.sessionCode));
      presenterStatus.textContent = message('Session ready. Share the student link or code.', '課堂已準備好。請分享學生連結或代碼。');
    } catch (error) { presenterStatus.textContent = error instanceof Error ? error.message : String(error); }
    finally { createButton.disabled = false; }
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(joinLink.value);
      presenterStatus.textContent = message('Student link copied.', '已複製學生連結。');
    } catch {
      joinLink.select();
      presenterStatus.textContent = message('Select and copy the student link.', '請選取並複製學生連結。');
    }
  });

  async function refresh() {
    if (updating || display.hidden || !isCurrentSlide()) return;
    updating = true;
    try {
      const result = await requestCloud<CloudResults>({ action: 'results', accessCode: accessInput.value, sessionCode });
      drawCloud(svg, result.words, chinese());
      accessibleList.textContent = result.words.map((word) => `${word.term} (${word.count})`).join(', ');
      resultStatus.textContent = result.total
        ? message(`${result.total} words or phrases submitted · ${result.words.length} distinct`, `已提交 ${result.total} 個詞語或短語 · ${result.words.length} 種不同詞語`)
        : message('Waiting for student words…', '正在等待學生提交詞語…');
    } catch (error) { resultStatus.textContent = error instanceof Error ? error.message : String(error); }
    finally { updating = false; }
  }

  revealButton.addEventListener('click', async () => {
    sessionCode = sessionInput.value.trim().toUpperCase();
    if (!sessionCode) { presenterStatus.textContent = message('Enter a session code.', '請輸入課堂代碼。'); return; }
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
