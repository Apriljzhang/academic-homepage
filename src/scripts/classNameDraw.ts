export type ClassId = 'F' | 'D';
export type StudentName = { name: string; englishName: string };
export type ClassRosters = Record<ClassId, StudentName[]>;
type DrawState = { version: 1; classes: ClassRosters; drawn: Record<ClassId, number[]>; last: Record<ClassId, number | null> };
const classIds: ClassId[] = ['F', 'D'];
const storageKey = 'general-english-class-name-draw-v1';

export const classNameBank: ClassRosters = {
  "F": [
    {
      "name": "刘赫钰",
      "englishName": "LIU HEYU"
    },
    {
      "name": "范俊宏",
      "englishName": "FAN JUNHONG"
    },
    {
      "name": "周彦希",
      "englishName": "ZHOU YANXI"
    },
    {
      "name": "刘雪莹",
      "englishName": "LIU XUEYING"
    },
    {
      "name": "陈懿",
      "englishName": "CHEN YI"
    },
    {
      "name": "雷昊天",
      "englishName": "LEI HAOTIAN"
    },
    {
      "name": "徐子涵",
      "englishName": "XU ZIHAN"
    },
    {
      "name": "陈蕴宁",
      "englishName": "CHEN YUNNING"
    },
    {
      "name": "朱率意",
      "englishName": "ZHU SHUAIYI"
    },
    {
      "name": "张诗玉",
      "englishName": "ZHANG SHIYU"
    },
    {
      "name": "陈子栎",
      "englishName": "CHEN ZIYUE"
    },
    {
      "name": "刘沂鑫",
      "englishName": "LIU YIXIN"
    },
    {
      "name": "葛理阳",
      "englishName": "GE LIYANG"
    },
    {
      "name": "郑馨语",
      "englishName": "ZHENG XINYU"
    },
    {
      "name": "张翘楚",
      "englishName": "ZHANG QIAOCHU"
    },
    {
      "name": "尧舜禹",
      "englishName": "YAO SHUNYU"
    },
    {
      "name": "陈嘉雯",
      "englishName": "CHEN JIAWEN"
    },
    {
      "name": "宣晋旻",
      "englishName": "XUAN JINMIN"
    },
    {
      "name": "郑浩",
      "englishName": "ZHENG HAO"
    }
  ],
  "D": [
    {
      "name": "何小川",
      "englishName": "HE XIAOCHUAN"
    },
    {
      "name": "張文奇",
      "englishName": "ZHANG WENQI"
    },
    {
      "name": "葛姝宏",
      "englishName": "GE SHUHONG"
    },
    {
      "name": "汪玉竺",
      "englishName": "WANG YUZHU"
    },
    {
      "name": "黃錫皓",
      "englishName": "HUANG XIHAO"
    },
    {
      "name": "李漁",
      "englishName": "LI YU Mira"
    },
    {
      "name": "宋裕童",
      "englishName": "SONG YUTONG"
    },
    {
      "name": "張睿杰",
      "englishName": "ZHANG RUIJIE"
    },
    {
      "name": "周雨萱",
      "englishName": "ZHOU YUXUAN"
    },
    {
      "name": "李釋光",
      "englishName": "LI SHIGUANG"
    },
    {
      "name": "郁万智",
      "englishName": "YU WANZHI"
    },
    {
      "name": "黃陳可",
      "englishName": "HUANG CHENKE"
    },
    {
      "name": "陳俊均",
      "englishName": "CHEN JUNJUN"
    },
    {
      "name": "林墨然",
      "englishName": "LIN MORAN"
    },
    {
      "name": "張鉉浩",
      "englishName": "ZHANG XUANHAO"
    },
    {
      "name": "劉綺穎",
      "englishName": "LIU YEE WING"
    },
    {
      "name": "楊玥妍",
      "englishName": "YANG YUET YIN ALLE..."
    },
    {
      "name": "陳星輝",
      "englishName": "CHAN SENG FAI"
    },
    {
      "name": "譚香瑜",
      "englishName": "TAN XIANG YU"
    },
    {
      "name": "何家熙",
      "englishName": "HO KA HEI"
    },
    {
      "name": "廖思龍",
      "englishName": "LIO SI LONG"
    },
    {
      "name": "戴銘",
      "englishName": "DAI MING"
    },
    {
      "name": "李承运",
      "englishName": "Owen"
    }
  ]
};

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
  const result = dialog.querySelector<HTMLElement>('.lesson-draw-result');
  const classButtons = document.querySelectorAll<HTMLButtonElement>('[data-class-draw]');
  const state: DrawState = { version: 1, classes: classNameBank, drawn: { F: [], D: [] }, last: { F: null, D: null } };
  let current: ClassId = 'F';
  let rolling = false;
  let rollTimeout = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    for (const id of classIds) {
      if (JSON.stringify(saved?.classes?.[id]) !== JSON.stringify(classNameBank[id])) continue;
      if (Array.isArray(saved.drawn?.[id])) state.drawn[id] = [...new Set<number>(saved.drawn[id].filter((i: unknown) => Number.isInteger(i) && Number(i) >= 0 && Number(i) < classNameBank[id].length))];
      if (state.drawn[id].includes(saved.last?.[id])) state.last[id] = saved.last[id];
    }
  } catch { /* The built-in bank works even without saved draw history. */ }

  const say = (message: string) => { if (feedback) feedback.textContent = message; };
  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { say('Browser saving is unavailable. Draw history remains available for this visit.'); }
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
    if (rolling) return;
    state.drawn[current] = [];
    state.last[current] = null;
    say('');
    save();
    render();
  });
}
