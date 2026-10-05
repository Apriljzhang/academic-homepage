import { ethicsWordMeanings, normalizeCloudTerm, type CloudMeaning } from '../data/dedc02EthicsWordMeanings';

type CloudWord = { term: string; count: number };
type CloudResults = { words: CloudWord[]; total: number };
type DisplayMeaning = Pick<CloudMeaning, 'en' | 'zh'>;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const functionUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/dedc02-ethics-wordcloud` : '';
const svgNS = 'http://www.w3.org/2000/svg';
const mappingStorageKey = 'dedc02-ethics-word-mappings-v1';
let toTraditional = (value: string) => value;
const meaningKey = (value: string) => normalizeCloudTerm(toTraditional(value));
const builtInMeanings = new Map<string, DisplayMeaning>();

function displayWords(words: CloudWord[], language: 'en' | 'zh', custom: Map<string, DisplayMeaning>) {
  const grouped = new Map<string, CloudWord>();
  const unknown: CloudWord[] = [];
  for (const word of words) {
    const key = meaningKey(word.term);
    const meaning = custom.get(key) || builtInMeanings.get(key)
      || (/^[0-9]+([.,][0-9]+)?$/.test(key) ? { en: word.term, zh: word.term } : undefined);
    if (!meaning) unknown.push(word);
    const label = meaning ? meaning[language] : word.term;
    const groupKey = meaning ? meaningKey(meaning.en) : `__raw__${normalizeCloudTerm(word.term)}`;
    const existing = grouped.get(groupKey);
    if (existing) existing.count += word.count;
    else grouped.set(groupKey, { term: label, count: word.count });
  }
  return {
    words: [...grouped.values()].sort((a, b) => b.count - a.count || a.term.localeCompare(b.term)),
    unknown: unknown.sort((a, b) => b.count - a.count || a.term.localeCompare(b.term)),
  };
}

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
  const clearButton = form?.querySelector<HTMLButtonElement>('[type="reset"]');
  const submitStatus = studentDialog?.querySelector<HTMLElement>('[data-cloud-submit-status]');
  const copyStatus = studentDialog?.querySelector<HTMLElement>('[data-cloud-copy-status]');
  const resultStatus = instructorDialog?.querySelector<HTMLElement>('[data-cloud-result-status]');
  const refreshButton = instructorDialog?.querySelector<HTMLButtonElement>('[data-cloud-refresh]');
  const resetButton = instructorDialog?.querySelector<HTMLButtonElement>('[data-cloud-reset]');
  const resetPanel = instructorDialog?.querySelector<HTMLElement>('[data-cloud-reset-panel]');
  const resetForm = resetPanel?.querySelector<HTMLFormElement>('[data-cloud-reset-form]');
  const resetCode = resetPanel?.querySelector<HTMLInputElement>('[data-cloud-reset-code]');
  const resetCancel = resetPanel?.querySelector<HTMLButtonElement>('[data-cloud-reset-cancel]');
  const resetStatus = resetPanel?.querySelector<HTMLElement>('[data-cloud-reset-status]');
  const svg = instructorDialog?.querySelector<SVGSVGElement>('[data-cloud-svg]');
  const accessibleList = instructorDialog?.querySelector<HTMLElement>('[data-cloud-accessible-list]');
  const allSummary = instructorDialog?.querySelector<HTMLElement>('[data-cloud-all-summary]');
  const allList = instructorDialog?.querySelector<HTMLElement>('[data-cloud-all-list]');
  const mapPanel = instructorDialog?.querySelector<HTMLDetailsElement>('[data-cloud-map-panel]');
  const mapSummary = mapPanel?.querySelector<HTMLElement>('[data-cloud-map-summary]');
  const mapForm = mapPanel?.querySelector<HTMLFormElement>('[data-cloud-map-form]');
  const mapRows = mapPanel?.querySelector<HTMLElement>('[data-cloud-map-rows]');
  const mapStatus = mapPanel?.querySelector<HTMLElement>('[data-cloud-map-status]');
  if (!slide || !studentDialog || !instructorDialog || !form || !clearButton || !submitStatus || !copyStatus || !resultStatus || !refreshButton || !resetButton || !resetPanel || !resetForm || !resetCode || !resetCancel || !resetStatus || !svg || !accessibleList || !allSummary || !allList || !mapPanel || !mapSummary || !mapForm || !mapRows || !mapStatus) return;

  let language: 'en' | 'zh' = 'en';
  let updating = false;
  let resetting = false;
  let resultVersion = 0;
  let latestResult: CloudResults = { words: [], total: 0 };
  let mappedRowsSignature = '';
  let meaningLoaded = false;
  let meaningLoading: Promise<void> | undefined;
  const customMappings = new Map<string, DisplayMeaning>();
  function ensureMeanings() {
    meaningLoading ||= (async () => {
      const { default: OpenCC } = await import('opencc-js/cn2t');
      toTraditional = OpenCC.Converter({ from: 'cn', to: 'tw' });
      for (const meaning of ethicsWordMeanings) {
        for (const alias of [meaning.en, meaning.zh, ...meaning.aliases]) {
          builtInMeanings.set(meaningKey(alias), meaning);
        }
      }
      try {
        const saved = JSON.parse(localStorage.getItem(mappingStorageKey) || '[]');
        if (Array.isArray(saved)) {
          for (const item of saved) {
            if (Array.isArray(item) && item.length === 2 && typeof item[0] === 'string'
              && typeof item[1]?.en === 'string' && typeof item[1]?.zh === 'string') {
              customMappings.set(meaningKey(item[0]), { en: item[1].en, zh: toTraditional(item[1].zh) });
            }
          }
        }
      } catch { /* Continue with the shared vocabulary. */ }
      meaningLoaded = true;
    })();
    return meaningLoading;
  }
  const chinese = () => language === 'zh';
  const message = (en: string, zh: string) => chinese() ? zh : en;
  const dialogs = { student: studentDialog, instructor: instructorDialog };

  function renderMapRows(unknown: CloudWord[]) {
    const signature = JSON.stringify([language, unknown.map((word) => [word.term, word.count])]);
    if (signature === mappedRowsSignature) return;
    const drafts = new Map<string, { en: string; zh: string }>();
    mapRows.querySelectorAll<HTMLElement>('.cloud-map-row').forEach((row) => {
      const source = row.dataset.source || '';
      drafts.set(source, {
        en: row.querySelector<HTMLInputElement>('[data-map-en]')?.value || '',
        zh: row.querySelector<HTMLInputElement>('[data-map-zh]')?.value || '',
      });
    });
    mapRows.replaceChildren();
    for (const word of unknown) {
      const row = document.createElement('div');
      row.className = 'cloud-map-row';
      row.dataset.source = word.term;
      const original = document.createElement('span');
      original.className = 'cloud-map-original';
      original.textContent = `${word.term} (${word.count})`;
      row.append(original);
      for (const target of ['en', 'zh'] as const) {
        const label = document.createElement('label');
        const caption = document.createElement('span');
        caption.textContent = target === 'en' ? message('English', '英文') : message('Traditional Chinese', '繁體中文');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 40;
        input.dataset[target === 'en' ? 'mapEn' : 'mapZh'] = '';
        input.value = drafts.get(word.term)?.[target] || '';
        label.append(caption, input);
        row.append(label);
      }
      mapRows.append(row);
    }
    mappedRowsSignature = signature;
  }

  function renderCloud() {
    const grouped = displayWords(latestResult.words, language, customMappings);
    drawCloud(svg, grouped.words, chinese());
    accessibleList.textContent = grouped.words.map((word) => `${word.term} (${word.count})`).join(', ');
    allSummary.textContent = message(`All displayed terms (${grouped.words.length})`, `所有顯示詞語（${grouped.words.length}）`);
    allList.replaceChildren(...grouped.words.map((word) => {
      const item = document.createElement('li');
      item.textContent = `${word.term} (${word.count})`;
      return item;
    }));
    mapPanel.hidden = grouped.unknown.length === 0;
    if (grouped.unknown.length) {
      mapSummary.textContent = message(`Map unfamiliar entries (${grouped.unknown.length})`, `配對未識別詞語（${grouped.unknown.length}）`);
      renderMapRows(grouped.unknown);
    } else {
      mapPanel.open = false;
      mapRows.replaceChildren();
      mappedRowsSignature = '';
    }
    resultStatus.textContent = latestResult.total
      ? message(`${latestResult.total} words or phrases submitted · ${grouped.words.length} displayed terms`, `已提交 ${latestResult.total} 個詞語或短語 · 顯示 ${grouped.words.length} 種詞語`)
      : message('Waiting for student words…', '正在等待學生提交詞語…');
  }

  function closeResetPanel() {
    resetForm.reset();
    resetStatus.textContent = '';
    resetPanel.hidden = true;
    resetButton.disabled = false;
  }

  function setLanguage(next: 'en' | 'zh') {
    language = next;
    document.querySelectorAll<HTMLElement>('.cloud-dialog [data-cloud-en]').forEach((node) => {
      node.textContent = node.dataset[next === 'zh' ? 'cloudZh' : 'cloudEn'] || '';
    });
    document.querySelectorAll<HTMLButtonElement>('.cloud-dialog [data-cloud-language]').forEach((button) => {
      button.textContent = next === 'zh' ? 'English' : '中文';
    });
    if (instructorDialog.open && meaningLoaded) renderCloud();
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
      if (dialog === instructorDialog) closeResetPanel();
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
    clearButton.disabled = true;
    submitStatus.textContent = message('Sending…', '正在提交…');
    try {
      await requestCloud({ action: 'submit', words });
      form.querySelectorAll<HTMLInputElement>('.cloud-inputs input').forEach((input) => { input.value = ''; });
      submitStatus.textContent = message('Your words were added anonymously.', '你的詞語已匿名加入。');
    } catch (error) {
      submitStatus.textContent = error instanceof Error ? error.message : String(error);
    } finally { if (button) button.disabled = false; clearButton.disabled = false; }
  });
  form.addEventListener('reset', () => {
    submitStatus.textContent = message('Boxes cleared. Submitted words remain in the cloud.', '已清空輸入框；已提交的詞語仍保留在詞雲中。');
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
    if (updating || resetting || !instructorDialog.open) return;
    updating = true;
    const version = resultVersion;
    try {
      await ensureMeanings();
      const result = await requestCloud<CloudResults>({ action: 'results' });
      if (version !== resultVersion) return;
      latestResult = result;
      renderCloud();
    } catch (error) { if (version === resultVersion) resultStatus.textContent = error instanceof Error ? error.message : String(error); }
    finally { updating = false; }
  }

  refreshButton.addEventListener('click', refresh);
  mapForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const additions: Array<[string, DisplayMeaning]> = [];
    for (const row of mapRows.querySelectorAll<HTMLElement>('.cloud-map-row')) {
      const original = row.dataset.source || '';
      const en = row.querySelector<HTMLInputElement>('[data-map-en]')?.value.normalize('NFKC').replace(/\s+/g, ' ').trim() || '';
      const zh = row.querySelector<HTMLInputElement>('[data-map-zh]')?.value.normalize('NFKC').replace(/\s+/g, ' ').trim() || '';
      if (!en && !zh) continue;
      if (!/[A-Za-z]/.test(en) || /\p{Script=Han}/u.test(en) || !/\p{Script=Han}/u.test(zh) || en.length > 40 || zh.length > 40) {
        mapStatus.textContent = message('For each mapped entry, add an English label and a Chinese label.', '每個配對詞語都須填寫英文及中文標籤。');
        return;
      }
      const known = builtInMeanings.get(meaningKey(en)) || builtInMeanings.get(meaningKey(zh))
        || [...customMappings.values()].find((meaning) => meaningKey(meaning.en) === meaningKey(en) || meaningKey(meaning.zh) === meaningKey(zh));
      additions.push([meaningKey(original), known || { en, zh: toTraditional(zh) }]);
    }
    if (!additions.length) {
      mapStatus.textContent = message('Enter labels for at least one entry.', '請至少為一個詞語填寫標籤。');
      return;
    }
    for (const [key, labels] of additions) customMappings.set(key, labels);
    try {
      localStorage.setItem(mappingStorageKey, JSON.stringify([...customMappings]));
      mapStatus.textContent = message('Mappings saved in this browser.', '配對已儲存在此瀏覽器。');
    } catch {
      mapStatus.textContent = message('Mappings applied for this visit, but this browser could not save them.', '本次瀏覽已套用配對，但瀏覽器未能儲存。');
    }
    renderCloud();
  });
  resetButton.addEventListener('click', () => {
    resetPanel.hidden = false;
    resetButton.disabled = true;
    resetCode.focus();
  });
  resetCancel.addEventListener('click', closeResetPanel);
  resetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const code = resetCode.value.trim();
    if (!/^[0-9]{6}$/.test(code)) {
      resetStatus.textContent = message('Enter the six-digit reset code.', '請輸入六位數重設代碼。');
      return;
    }
    resetting = true;
    resultVersion += 1;
    refreshButton.disabled = true;
    resetCode.disabled = true;
    resetCancel.disabled = true;
    const submitButton = resetForm.querySelector<HTMLButtonElement>('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    resetStatus.textContent = message('Resetting word cloud…', '正在重設詞雲…');
    try {
      await requestCloud({ action: 'reset', resetCode: code });
      latestResult = { words: [], total: 0 };
      renderCloud();
      resultStatus.textContent = message('Word cloud reset. Waiting for student words…', '詞雲已重設，正在等待學生提交詞語…');
      closeResetPanel();
    } catch (error) {
      resetStatus.textContent = error instanceof Error && error.message === 'Reset code not recognised'
        ? message('Reset code not recognised.', '重設代碼不正確。')
        : error instanceof Error ? error.message : String(error);
    } finally {
      resetCode.value = '';
      resetting = false;
      refreshButton.disabled = false;
      resetCode.disabled = false;
      resetCancel.disabled = false;
      if (submitButton) submitButton.disabled = false;
    }
  });
  window.setInterval(() => { if (instructorDialog.open) void refresh(); }, 5000);
  const initialView = new URLSearchParams(location.search).get('cloud');
  if (initialView === 'student' || initialView === 'instructor') open(initialView, false);
}
