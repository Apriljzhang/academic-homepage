export type ClassId = 'F' | 'D';
export type StudentName = { name: string; englishName: string };
export type ClassRosters = Record<ClassId, StudentName[]>;
type DrawState = { version: 1; classes: ClassRosters; drawn: Record<ClassId, number[]>; last: Record<ClassId, number | null> };
const classIds: ClassId[] = ['F', 'D'];
const storageKey = 'general-english-class-name-draw-v1';

export function parseClassRosters(value: unknown): ClassRosters {
  const input = value as { version?: unknown; classes?: Partial<Record<ClassId, unknown>> } | null;
  if (!input || input.version !== 1 || !input.classes) throw new Error('Choose a class-list JSON file containing Classes F and D.');
  const classes = {} as ClassRosters;
  for (const id of classIds) {
    const rows = input.classes[id];
    if (!Array.isArray(rows) || rows.length === 0 || rows.length > 2000) throw new Error(`Class ${id} needs a non-empty list of names.`);
    classes[id] = rows.map((row: unknown) => {
      const item = row as Partial<StudentName> | null;
      if (!item || typeof item.name !== 'string' || typeof item.englishName !== 'string' || !(item.name.trim() || item.englishName.trim()) || item.name.length > 200 || item.englishName.length > 200) throw new Error(`A name in Class ${id} is missing or invalid.`);
      return { name: item.name.trim(), englishName: item.englishName.trim() };
    });
  }
  return classes;
}

/** Choose uniformly among the students who have not yet been drawn. */
export function drawStudentIndex(total: number, drawn: number[], random: () => number = Math.random): number | null {
  const used = new Set(drawn);
  const remaining = Array.from({ length: total }, (_, i) => i).filter(i => !used.has(i));
  if (!remaining.length) return null;
  return remaining[Math.min(remaining.length - 1, Math.max(0, Math.floor(random() * remaining.length)))];
}

export function initClassNameDraw() {
  const dialog = document.querySelector<HTMLDialogElement>('.lesson-name-draw');
  if (!dialog) return;
  const title = dialog.querySelector<HTMLElement>('[data-draw-title]');
  const name = dialog.querySelector<HTMLElement>('[data-draw-name]');
  const english = dialog.querySelector<HTMLElement>('[data-draw-english]');
  const count = dialog.querySelector<HTMLElement>('[data-draw-count]');
  const feedback = dialog.querySelector<HTMLElement>('[data-draw-feedback]');
  const again = dialog.querySelector<HTMLButtonElement>('[data-draw-again]');
  const reset = dialog.querySelector<HTMLButtonElement>('[data-draw-reset]');
  const file = dialog.querySelector<HTMLInputElement>('[data-draw-file]');
  const importer = dialog.querySelector<HTMLDetailsElement>('[data-draw-import]');
  const result = dialog.querySelector<HTMLElement>('.lesson-draw-result');
  const classButtons = document.querySelectorAll<HTMLButtonElement>('[data-class-draw]');
  let state: DrawState | null = null;
  let current: ClassId = 'F';
  let rolling = false;
  let rollTimeout = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    const classes = parseClassRosters(saved);
    state = { version: 1, classes, drawn: { F: [], D: [] }, last: { F: null, D: null } };
    for (const id of classIds) {
      if (Array.isArray(saved.drawn?.[id])) state.drawn[id] = [...new Set<number>(saved.drawn[id].filter((i: unknown) => Number.isInteger(i) && Number(i) >= 0 && Number(i) < classes[id].length))];
      if (state.drawn[id].includes(saved.last?.[id])) state.last[id] = saved.last[id];
    }
  } catch { /* Load class lists locally when the browser has no saved roster. */ }

  const say = (message: string) => { if (feedback) feedback.textContent = message; };
  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { say('Browser saving is unavailable. Class lists remain available for this visit.'); }
  };
  const render = () => {
    if (title) title.textContent = `Class ${current}`;
    const students = state?.classes[current] || [];
    const drawn = state?.drawn[current] || [];
    const index = state?.last[current];
    const student = index != null ? students[index] : null;
    if (name) { name.textContent = student?.name || student?.englishName || 'Ready'; name.lang = student?.name ? 'zh' : 'en'; }
    if (english) english.textContent = student?.name ? student.englishName : '';
    if (count) count.textContent = students.length ? `${drawn.length} of ${students.length} drawn · ${students.length - drawn.length} remaining` : '';
    if (again) { again.disabled = !students.length || drawn.length === students.length; again.textContent = drawn.length === students.length && students.length ? 'All names drawn' : student ? 'Draw again' : 'Draw a name'; }
    if (reset) reset.disabled = !drawn.length;
  };
  const setRolling = (active: boolean) => {
    rolling = active;
    result?.classList.toggle('is-rolling', active);
    result?.setAttribute('aria-live', active ? 'off' : 'polite');
    result?.setAttribute('aria-busy', String(active));
    classButtons.forEach(button => { button.disabled = active; });
    if (file) file.disabled = active;
    if (active) {
      if (again) { again.disabled = true; again.textContent = 'Rolling…'; }
      if (reset) reset.disabled = true;
    }
  };
  const cancelRoll = () => {
    window.clearTimeout(rollTimeout);
    rollTimeout = 0;
    if (!rolling) return;
    render();
    setRolling(false);
    say('');
  };
  const draw = () => {
    if (rolling) return;
    say('');
    if (!state) { render(); if (importer) importer.open = true; say('Load your class lists to draw a name.'); return; }
    const index = drawStudentIndex(state.classes[current].length, state.drawn[current]);
    if (index === null) { render(); say('Everyone in this class has been drawn. Reset the class to start a new round.'); return; }
    render();
    setRolling(true);
    say('Rolling…');
    const activeState = state;
    const activeClass = current;
    const students = activeState.classes[activeClass];
    const remaining = students.filter((_, i) => !activeState.drawn[activeClass].includes(i));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 450 : 1800;
    const began = Date.now();
    let previous = -1;
    const tick = () => {
      if (!rolling) return;
      const elapsed = Date.now() - began;
      if (elapsed >= duration) {
        rollTimeout = 0;
        activeState.drawn[activeClass].push(index);
        activeState.last[activeClass] = index;
        say('');
        save();
        render();
        setRolling(false);
        return;
      }
      if (reducedMotion) {
        if (name) { name.textContent = 'Rolling…'; name.lang = 'en'; }
        if (english) english.textContent = '';
      } else {
        let preview = Math.floor(Math.random() * remaining.length);
        if (preview === previous && remaining.length > 1) preview = (preview + 1) % remaining.length;
        previous = preview;
        const student = remaining[preview];
        if (name) { name.textContent = student.name || student.englishName; name.lang = student.name ? 'zh' : 'en'; }
        if (english) english.textContent = student.name ? student.englishName : '';
      }
      rollTimeout = window.setTimeout(tick, 55 + 160 * Math.pow(elapsed / duration, 2));
    };
    tick();
  };
  classButtons.forEach(button => button.addEventListener('click', () => {
    if (rolling) return;
    const id = button.dataset.classDraw;
    if (id !== 'F' && id !== 'D') return;
    current = id;
    draw();
    dialog.showModal();
  }));
  dialog.querySelector('[data-close-draw]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', cancelRoll);
  again?.addEventListener('click', draw);
  reset?.addEventListener('click', () => {
    if (!state || rolling) return;
    state.drawn[current] = [];
    state.last[current] = null;
    say('');
    save();
    render();
  });
  file?.addEventListener('change', async () => {
    const selected = file.files?.[0];
    if (!selected) return;
    try {
      if (selected.size > 2_000_000) throw new Error('Choose a class-list JSON file smaller than 2 MB.');
      const classes = parseClassRosters(JSON.parse(await selected.text()));
      cancelRoll();
      state = { version: 1, classes, drawn: { F: [], D: [] }, last: { F: null, D: null } };
      if (importer) importer.open = false;
      save();
      draw();
    } catch (error) { say(error instanceof Error ? error.message : 'The class lists could not be loaded.'); }
    file.value = '';
  });
}
