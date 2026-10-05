/** One timer for every DEDC02 lesson; sound is primed by the Start click. */
export function initLessonTimer() {
  const input = document.querySelector<HTMLInputElement>('[data-timer-minutes]');
  const start = document.querySelector<HTMLButtonElement>('[data-timer-start]');
  const reset = document.querySelector<HTMLButtonElement>('[data-timer-reset]');
  const output = document.querySelector<HTMLOutputElement>('[data-timer-output]');
  const status = document.querySelector<HTMLElement>('[data-timer-status]');
  if (!input || !start || !reset || !output) return;

  let remainingMs = 0;
  let deadline = 0;
  let interval = 0;
  let displayActive = false;
  let audioContext: AudioContext | null = null;

  const stop = () => { window.clearInterval(interval); interval = 0; };
  const paint = () => {
    const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
    output.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    output.hidden = !displayActive;
    input.hidden = displayActive;
  };
  const primeAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext ||= new AudioContextClass();
      if (audioContext.state === 'suspended') void audioContext.resume().catch(() => {});
    } catch { /* Visual alert remains available if audio is blocked. */ }
  };
  const ding = () => {
    if (!audioContext) return;
    const context = audioContext;
    const play = () => {
      const now = context.currentTime;
      [880, 1320].forEach((frequency, index) => {
        const at = now + index * 0.16;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.12, at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.25);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.26);
      });
    };
    if (context.state === 'suspended') void context.resume().then(play).catch(() => {});
    else if (context.state === 'running') play();
  };
  const finish = () => {
    stop();
    remainingMs = 0;
    start.textContent = 'Start';
    output.classList.add('is-finished');
    if (status) status.textContent = 'Time is up.';
    paint();
    ding();
  };

  start.addEventListener('click', () => {
    if (interval) {
      remainingMs = Math.max(0, deadline - Date.now());
      stop();
      start.textContent = 'Resume';
      if (status) status.textContent = 'Paused.';
      paint();
      return;
    }
    if (remainingMs <= 0) {
      const minutes = Number(input.value);
      if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 999) {
        if (status) status.textContent = 'Enter a time between 0 and 999 minutes.';
        input.focus();
        return;
      }
      remainingMs = minutes * 60_000;
    }
    primeAudio();
    displayActive = true;
    deadline = Date.now() + remainingMs;
    start.textContent = 'Pause';
    output.classList.remove('is-finished');
    if (status) status.textContent = 'Timer running. A ding will sound when time is up.';
    paint();
    interval = window.setInterval(() => {
      remainingMs = Math.max(0, deadline - Date.now());
      if (remainingMs <= 0) finish();
      else paint();
    }, 250);
  });

  reset.addEventListener('click', () => {
    stop();
    remainingMs = 0;
    deadline = 0;
    displayActive = false;
    input.value = '';
    start.textContent = 'Start';
    output.classList.remove('is-finished');
    if (status) status.textContent = '';
    paint();
    input.focus();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); start.click(); }
  });
  paint();
}
