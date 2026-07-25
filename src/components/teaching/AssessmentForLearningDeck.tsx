import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  agenda,
  assessmentPurposes,
  disciplinePrompts,
  fiveMoves,
  formativeStrategies,
  references,
  strategyScenarios,
  workSamples,
} from "../../data/aflWorkshop";

type Purpose = "of" | "for" | "as";
type Discipline = keyof typeof disciplinePrompts;
type Planner = {
  discipline: Discipline;
  learningGoal: string;
  task: string;
  moves: Record<(typeof fiveMoves)[number]["key"], string>;
};
type ExitTicket = { stop: string; start: string; evidence: string };
type SavedState = {
  purposeAnswers: Record<string, Purpose>;
  strategyAnswers: Record<string, boolean>;
  sampleChoice: string;
  sampleRevealed: boolean;
  dialogueChoice: string;
  planner: Planner;
  exitTicket: ExitTicket;
};

const STORAGE_KEY = "ajz-afl-workshop-v2";

const emptyPlanner: Planner = {
  discipline: "Education",
  learningGoal: "",
  task: "",
  moves: { think: "", compare: "", judge: "", improve: "", reflect: "" },
};

const emptyExit: ExitTicket = { stop: "", start: "", evidence: "" };

const slides = [
  { id: "opening", number: "01", time: "00–12", title: "Did learning happen?", subtitle: "Product or evidence?" },
  { id: "ownership", number: "02", time: "12–28", title: "The ownership problem", subtitle: "Completion is not learning" },
  { id: "purposes", number: "03", time: "28–48", title: "Of, for & as learning", subtitle: "3 purposes, 1 task" },
  { id: "strategies", number: "04", time: "48–68", title: "5 formative strategies", subtitle: "Keep cognition with learners" },
  { id: "diagnosis", number: "05", time: "68–78", title: "Rapid diagnosis", subtitle: "Formative—or theatre?" },
  { id: "break", number: "06", time: "78–88", title: "Pause", subtitle: "10-minute break" },
  { id: "judgement", number: "07", time: "88–108", title: "Learn to judge quality", subtitle: "Compare before criteria" },
  { id: "dialogue", number: "08", time: "108–125", title: "AI as a dialogue partner", subtitle: "Do not outsource judgement" },
  { id: "redesign", number: "09", time: "125–143", title: "Redesign an assessment", subtitle: "Build a 5-move loop" },
  { id: "share", number: "10", time: "143–148", title: "60-second share", subtitle: "Test the design" },
  { id: "exit", number: "11", time: "148–150", title: "Commit to 1 change", subtitle: "Stop · start · evidence" },
] as const;

function Frame({
  eyebrow,
  title,
  time,
  children,
}: {
  eyebrow: string;
  title: string;
  time: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="grid shrink-0 gap-2 border-b border-border pb-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          <h2 className="mt-1 text-pretty font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl lg:text-4xl">
            {title}
          </h2>
        </div>
        <span className="w-fit rounded-full border border-secondary/40 bg-secondary-faint px-3 py-1 text-xs font-bold text-ink">
          {time}
        </span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-5 pr-1">{children}</div>
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
  tone = "blue",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  tone?: "blue" | "red" | "green";
}) {
  const style = {
    blue: active ? "border-secondary bg-secondary text-white" : "border-border bg-surface hover:border-secondary",
    red: active ? "border-primary bg-primary text-white" : "border-border bg-surface hover:border-primary",
    green: active ? "border-accent-purple bg-accent-purple text-ink" : "border-border bg-surface hover:border-accent-purple",
  };
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-semibold text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${style[tone]}`}
    >
      {children}
    </button>
  );
}

export default function AssessmentForLearningDeck() {
  const [slideIndex, setSlideIndex] = useState(-1);
  const [purposeAnswers, setPurposeAnswers] = useState<Record<string, Purpose>>({});
  const [strategyAnswers, setStrategyAnswers] = useState<Record<string, boolean>>({});
  const [sampleChoice, setSampleChoice] = useState("");
  const [sampleRevealed, setSampleRevealed] = useState(false);
  const [dialogueChoice, setDialogueChoice] = useState("");
  const [planner, setPlanner] = useState<Planner>(emptyPlanner);
  const [exitTicket, setExitTicket] = useState<ExitTicket>(emptyExit);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#slide-", "");
    const index = slides.findIndex(({ id }) => id === hash);
    if (index >= 0) setSlideIndex(index);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedState>;
        if (saved.purposeAnswers) setPurposeAnswers(saved.purposeAnswers);
        if (saved.strategyAnswers) setStrategyAnswers(saved.strategyAnswers);
        if (saved.sampleChoice) setSampleChoice(saved.sampleChoice);
        if (saved.sampleRevealed) setSampleRevealed(saved.sampleRevealed);
        if (saved.dialogueChoice) setDialogueChoice(saved.dialogueChoice);
        if (saved.planner) setPlanner({ ...emptyPlanner, ...saved.planner });
        if (saved.exitTicket) setExitTicket({ ...emptyExit, ...saved.exitTicket });
      }
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const state: SavedState = {
      purposeAnswers,
      strategyAnswers,
      sampleChoice,
      sampleRevealed,
      dialogueChoice,
      planner,
      exitTicket,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [dialogueChoice, exitTicket, loaded, planner, purposeAnswers, sampleChoice, sampleRevealed, strategyAnswers]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goTo(Math.min(slides.length - 1, Math.max(0, slideIndex + 1)));
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        if (slideIndex <= 0) showOverview();
        else goTo(slideIndex - 1);
      }
      if (event.key === "Escape") showOverview();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slideIndex]);

  const summary = useMemo(
    () =>
      [
        "ASSESSMENT FOR/AS LEARNING DESIGN",
        `Discipline: ${planner.discipline}`,
        `Learning goal: ${planner.learningGoal || "—"}`,
        `Current task: ${planner.task || "—"}`,
        "",
        ...fiveMoves.flatMap(({ key, title }) => [`${title}: ${planner.moves[key] || "—"}`]),
        "",
        `Stop: ${exitTicket.stop || "—"}`,
        `Start: ${exitTicket.start || "—"}`,
        `Evidence: ${exitTicket.evidence || "—"}`,
      ].join("\n"),
    [exitTicket, planner],
  );

  function goTo(index: number) {
    setSlideIndex(index);
    window.history.replaceState(null, "", `#slide-${slides[index].id}`);
  }

  function showOverview() {
    setSlideIndex(-1);
    window.history.replaceState(null, "", window.location.pathname);
  }

  function updateMove(key: (typeof fiveMoves)[number]["key"], value: string) {
    setPlanner((current) => ({ ...current, moves: { ...current.moves, [key]: value } }));
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setStatus("Design summary copied.");
    } catch {
      setStatus("Copy was blocked. Use Print or save as PDF instead.");
    }
  }

  function clearProgress() {
    if (!window.confirm("Clear all workshop answers saved on this device?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setPurposeAnswers({});
    setStrategyAnswers({});
    setSampleChoice("");
    setSampleRevealed(false);
    setDialogueChoice("");
    setPlanner(emptyPlanner);
    setExitTicket(emptyExit);
    setStatus("Local answers cleared.");
  }

  function renderSlide() {
    const slide = slides[slideIndex];
    if (!slide) return null;

    if (slide.id === "opening") {
      return (
        <Frame eyebrow="Opening provocation" title="The product is finished. Did learning happen?" time="12 min">
          <p className="max-w-3xl text-base leading-relaxed text-muted">
            Choose the submission that gives a teacher more usable evidence of learning.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {Object.entries(workSamples).map(([key, sample]) => (
              <article key={key} className="rounded-xl border border-border bg-page p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-secondary">{sample.label}</p>
                <blockquote className="mt-2 font-serif text-lg leading-relaxed text-ink">“{sample.text}”</blockquote>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {sample.evidence.slice(0, 3).map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
                <Choice active={sampleChoice === key} onClick={() => setSampleChoice(key)} tone="red">
                  Choose {sample.label.split(" · ")[0]}
                </Choice>
              </article>
            ))}
          </div>
          {sampleChoice && (
            <p className="mt-4 rounded-xl border border-primary/30 bg-primary-faint p-4 text-sm leading-relaxed text-ink">
              <strong>Sample B exposes a change in understanding.</strong> A polished product is evidence of a product;
              a learning trace makes thinking and revision available for the next move.
            </p>
          )}
        </Frame>
      );
    }

    if (slide.id === "ownership") {
      return (
        <Frame eyebrow="The core problem" title="AI makes completion cheap. Learning still costs thought." time="16 min">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <p className="font-serif text-2xl leading-relaxed text-ink sm:text-3xl">
              The key question is not only <em>whether</em> a student used AI. It is whether the assessment still requires
              the learner to think, judge, monitor and change.
            </p>
            <div className="space-y-3">
              {[
                ["Completion", "Was something submitted?"],
                ["Participation", "Did the learner do something visible?"],
                ["Active learning", "Did the learner make decisions that changed the work?"],
              ].map(([label, question], index) => (
                <div
                  key={label}
                  className={`rounded-xl border p-4 ${index === 2 ? "border-primary/40 bg-primary-faint" : "border-border bg-page"}`}
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-secondary">{label}</p>
                  <p className="mt-1 font-semibold text-ink">{question}</p>
                </div>
              ))}
            </div>
          </div>
        </Frame>
      );
    }

    if (slide.id === "purposes") {
      return (
        <Frame eyebrow="Concept lab" title="Assessment of, for & as learning" time="20 min">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["OF", "Summarise attainment"],
              ["FOR", "Use evidence for the next move"],
              ["AS", "Learn through judging & regulating"],
            ].map(([label, text]) => (
              <div key={label} className="rounded-xl border border-border bg-page p-3">
                <p className="font-serif text-xl font-semibold text-primary">{label}</p>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {assessmentPurposes.map((item) => {
              const answer = purposeAnswers[item.id];
              return (
                <fieldset key={item.id} className="rounded-xl border border-border bg-page p-3">
                  <legend className="px-1 text-sm font-semibold leading-relaxed text-ink">{item.prompt}</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(["of", "for", "as"] as Purpose[]).map((option) => (
                      <Choice
                        key={option}
                        active={answer === option}
                        onClick={() => setPurposeAnswers((current) => ({ ...current, [item.id]: option }))}
                        tone={option === "of" ? "blue" : option === "for" ? "red" : "green"}
                      >
                        {option}
                      </Choice>
                    ))}
                  </div>
                  {answer && (
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      <strong className="text-ink">{answer === item.answer ? "Yes. " : `This is ${item.answer}. `}</strong>
                      {item.explanation}
                    </p>
                  )}
                </fieldset>
              );
            })}
          </div>
        </Frame>
      );
    }

    if (slide.id === "strategies") {
      return (
        <Frame eyebrow="Assessment for Learning" title="5 strategies that keep cognition with the learner" time="20 min">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {formativeStrategies.map((strategy, index) => (
              <li key={strategy.label} className="rounded-xl border border-border bg-page p-4">
                <span className="grid size-8 place-items-center rounded-full bg-secondary-faint font-serif font-bold text-secondary">
                  {index + 1}
                </span>
                <p className="mt-3 font-serif text-lg font-semibold text-ink">{strategy.label}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary">{strategy.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{strategy.action}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 border-l-2 border-primary pl-4 text-sm leading-relaxed text-muted">
            Assessment becomes formative through the <strong className="text-ink">use of evidence</strong>, not through a
            particular quiz, app or feedback tool.
          </p>
        </Frame>
      );
    }

    if (slide.id === "diagnosis") {
      return (
        <Frame eyebrow="Rapid diagnosis" title="Formative—or merely formative-looking?" time="10 min">
          <div className="grid gap-3 lg:grid-cols-2">
            {strategyScenarios.map((scenario) => {
              const answer = strategyAnswers[scenario.id];
              const answered = typeof answer === "boolean";
              return (
                <article key={scenario.id} className="rounded-xl border border-border bg-page p-4">
                  <p className="text-sm font-semibold leading-relaxed text-ink">{scenario.prompt}</p>
                  <div className="mt-3 flex gap-2">
                    <Choice
                      active={answer === true}
                      onClick={() => setStrategyAnswers((current) => ({ ...current, [scenario.id]: true }))}
                      tone="green"
                    >
                      Formative
                    </Choice>
                    <Choice
                      active={answer === false}
                      onClick={() => setStrategyAnswers((current) => ({ ...current, [scenario.id]: false }))}
                      tone="red"
                    >
                      Not yet
                    </Choice>
                  </div>
                  {answered && (
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      <strong className="text-ink">{answer === scenario.isFormative ? "Sound diagnosis. " : "Reconsider. "}</strong>
                      {scenario.explanation}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </Frame>
      );
    }

    if (slide.id === "break") {
      return (
        <Frame eyebrow="Pause" title="Take 10 minutes." time="78–88">
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-secondary bg-secondary-faint p-8 text-center">
            <div>
              <p className="font-serif text-4xl font-semibold text-ink sm:text-5xl">Bring back 1 example</p>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
                Think of feedback you received but never used. What stopped it from becoming learning?
              </p>
            </div>
          </div>
        </Frame>
      );
    }

    if (slide.id === "judgement") {
      return (
        <Frame eyebrow="Assessment as Learning" title="Judge first. Then meet the criteria." time="20 min">
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              ["Response 1", "AI feedback is useful because it is immediate, detailed and available at any time."],
              [
                "Response 2",
                "Immediacy may help, but feedback supports learning only when the learner interprets it, judges its relevance and uses it to revise.",
              ],
            ].map(([label, text]) => (
              <article key={label} className="rounded-xl border border-border bg-page p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-secondary">{label}</p>
                <blockquote className="mt-2 font-serif text-lg leading-relaxed text-ink">“{text}”</blockquote>
              </article>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Response 1", "Response 2", "It depends"].map((choice) => (
              <Choice
                key={choice}
                active={sampleChoice === choice}
                onClick={() => {
                  setSampleChoice(choice);
                  setSampleRevealed(false);
                }}
                tone={choice === "Response 2" ? "green" : "blue"}
              >
                {choice}
              </Choice>
            ))}
            {sampleChoice && (
              <button
                type="button"
                onClick={() => setSampleRevealed(true)}
                className="min-h-11 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                Reveal quality lens
              </button>
            )}
          </div>
          {sampleRevealed && (
            <div className="mt-4 grid gap-3 rounded-xl border border-accent-purple/40 bg-accent-purple-faint p-4 sm:grid-cols-3">
              <p><strong>Claim:</strong> precise & qualified?</p>
              <p><strong>Reason:</strong> explains how or why?</p>
              <p><strong>Action:</strong> supports a next move?</p>
            </div>
          )}
        </Frame>
      );
    }

    if (slide.id === "dialogue") {
      return (
        <Frame eyebrow="AI & feedback literacy" title="Do not outsource the judgement" time="17 min">
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              {
                key: "answer",
                title: "Answer machine",
                prompt: "Improve this essay and give me the final version.",
                note: "AI performs the judgement and revision.",
                tone: "red" as const,
              },
              {
                key: "dialogue",
                title: "Assessment dialogue",
                prompt:
                  "Ask me for my criterion first. Offer 1 counter-example. Do not rewrite. Ask me to justify what I use, adapt or reject.",
                note: "AI supplies contrast; the learner keeps the decisions.",
                tone: "green" as const,
              },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={dialogueChoice === item.key}
                onClick={() => setDialogueChoice(item.key)}
                className={`rounded-xl border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                  dialogueChoice === item.key
                    ? item.tone === "green"
                      ? "border-accent-purple bg-accent-purple-faint"
                      : "border-primary bg-primary-faint"
                    : "border-border bg-page hover:border-secondary"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{item.title}</p>
                <p className="mt-3 font-mono text-sm leading-relaxed text-ink">“{item.prompt}”</p>
                <p className="mt-4 text-sm text-muted">{item.note}</p>
              </button>
            ))}
          </div>
          <p className="mt-5 rounded-xl border border-secondary/40 bg-secondary-faint p-4 text-sm leading-relaxed text-ink">
            Ask AI for a <strong>question, contrast, hint, critique or counter-example</strong>—not the performance you
            intend to assess.
          </p>
        </Frame>
      );
    }

    if (slide.id === "redesign") {
      return (
        <Frame eyebrow="Design studio" title="Build a 5-move assessment loop" time="18 min">
          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-3 rounded-xl border border-border bg-page p-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-secondary">
                Disciplinary lens
                <select
                  name="discipline"
                  autoComplete="off"
                  value={planner.discipline}
                  onChange={(event) =>
                    setPlanner((current) => ({ ...current, discipline: event.target.value as Discipline }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  {Object.keys(disciplinePrompts).map((discipline) => <option key={discipline}>{discipline}</option>)}
                </select>
              </label>
              <p className="text-sm leading-relaxed text-muted">{disciplinePrompts[planner.discipline]}</p>
              {[
                ["learningGoal", "Learning goal", "What should learners do independently?"],
                ["task", "Current task", "What do students currently produce?"],
              ].map(([key, label, placeholder]) => (
                <label key={key} className="block text-sm font-semibold text-ink">
                  {label}
                  <textarea
                    name={key}
                    autoComplete="off"
                    value={planner[key as "learningGoal" | "task"]}
                    onChange={(event) => setPlanner((current) => ({ ...current, [key]: event.target.value }))}
                    rows={2}
                    placeholder={placeholder}
                    className="mt-1 w-full rounded-lg border border-border bg-surface p-2 font-normal text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  />
                </label>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fiveMoves.map((move, index) => (
                <label key={move.key} className="rounded-xl border border-border bg-page p-3">
                  <span className="font-serif text-lg font-semibold text-ink">{index + 1}. {move.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">{move.prompt}</span>
                  <textarea
                    name={`move-${move.key}`}
                    autoComplete="off"
                    value={planner.moves[move.key]}
                    onChange={(event) => updateMove(move.key, event.target.value)}
                    rows={2}
                    placeholder="Learner action + visible evidence…"
                    className="mt-2 w-full rounded-lg border border-border bg-surface p-2 text-sm text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  />
                </label>
              ))}
            </div>
          </div>
        </Frame>
      );
    }

    if (slide.id === "share") {
      return (
        <Frame eyebrow="60-second share" title="Test the design with 3 questions" time="5 min">
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              "Must the learner think before receiving an answer?",
              "Must the learner make & justify a quality judgement?",
              "Must the learner use feedback to improve something visible?",
            ].map((question, index) => (
              <li key={question} className="rounded-xl border border-secondary/30 bg-secondary-faint p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-primary">Check {index + 1}</span>
                <p className="mt-2 font-serif text-2xl font-semibold leading-snug text-ink">{question}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center font-serif text-xl text-muted">If any answer is “no”, revise the assessment loop.</p>
        </Frame>
      );
    }

    return (
      <Frame eyebrow="Exit ticket" title="Commit to 1 assessable change" time="2 min">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["stop", "I will stop…", "A practice that rewards completion without revealing learning"],
            ["start", "I will start…", "1 AfL or AaL move learners must perform"],
            ["evidence", "I will look for…", "A visible sign of thinking, judgement or improvement"],
          ].map(([key, label, placeholder]) => (
            <label key={key} className="rounded-xl border border-border bg-page p-4 text-sm font-semibold text-ink">
              {label}
              <textarea
                name={`exit-${key}`}
                autoComplete="off"
                value={exitTicket[key as keyof ExitTicket]}
                onChange={(event) => setExitTicket((current) => ({ ...current, [key]: event.target.value }))}
                rows={4}
                placeholder={placeholder}
                className="mt-3 w-full rounded-lg border border-border bg-surface p-3 font-normal text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={copySummary} className="min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
            Copy Design Summary
          </button>
          <button type="button" onClick={() => window.print()} className="min-h-11 rounded-lg border border-border bg-page px-4 py-2 text-sm font-bold text-ink hover:border-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
            Print / Save as PDF
          </button>
          <button type="button" onClick={clearProgress} className="min-h-11 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
            Clear This Device
          </button>
        </div>
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {status || "Answers stay in this browser. Nothing is submitted or tracked."}
        </p>
        <details className="mt-4 rounded-xl border border-border bg-page p-4">
          <summary className="cursor-pointer font-semibold text-ink">Conceptual Foundations</summary>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
            {references.map((reference) => <li key={reference}>{reference}</li>)}
          </ul>
        </details>
      </Frame>
    );
  }

  return (
    <div className="otr-deck -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Open Teaching Resources · 2026/07</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold text-ink sm:text-3xl">
              Assessment for/as Learning in the Age of AI
            </h1>
          </div>
          {slideIndex >= 0 && (
            <button type="button" onClick={showOverview} className="min-h-11 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-ink hover:border-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
              Overview
            </button>
          )}
        </header>

        <div className="flex h-[calc(100dvh-13rem)] min-h-[34rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {slideIndex < 0 ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">150-minute interactive deck</p>
                  <h2 className="mt-2 text-pretty font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                    Who owns the learning when AI can complete the task?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    Use <strong className="text-ink">Assessment for Learning</strong> and{" "}
                    <strong className="text-ink">Assessment as Learning</strong> to keep students thinking, judging,
                    monitoring and improving.
                  </p>
                  <div className="mt-5 rounded-xl border border-primary/30 bg-primary-faint p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">Learning trace</p>
                    <p className="mt-2 font-serif text-xl font-semibold text-ink">
                      Think first → Compare → Judge → Improve → Reflect
                    </p>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-muted">
                    Click a slide to begin. Use the on-screen controls, ← / → keys, Page Up / Page Down, or Escape to
                    return to this overview.
                  </p>
                </div>
                <ol className="grid gap-2 sm:grid-cols-2">
                  {slides.map((slide, index) => (
                    <li key={slide.id}>
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        className="group grid min-h-24 w-full grid-cols-[2.75rem_1fr] rounded-xl border border-border bg-page p-3 text-left transition-transform hover:-translate-y-0.5 hover:border-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary motion-reduce:transform-none"
                      >
                        <span className="font-mono text-sm font-bold text-primary">{slide.number}</span>
                        <span>
                          <span className="block font-serif text-lg font-semibold text-ink group-hover:text-primary">{slide.title}</span>
                          <span className="mt-1 block text-xs text-muted">{slide.time} · {slide.subtitle}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 p-5 sm:p-7">{renderSlide()}</div>
              <nav aria-label="Slide controls" className="flex shrink-0 items-center gap-3 border-t border-border bg-page px-4 py-3">
                <button
                  type="button"
                  onClick={() => (slideIndex === 0 ? showOverview() : goTo(slideIndex - 1))}
                  className="min-h-11 rounded-lg border border-border bg-surface px-4 text-sm font-bold text-ink hover:border-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  ← Previous
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-muted">
                    <span className="truncate">{slides[slideIndex].title}</span>
                    <span>{slideIndex + 1} / {slides.length}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary-faint">
                    <div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (slideIndex === slides.length - 1 ? showOverview() : goTo(slideIndex + 1))}
                  className="min-h-11 rounded-lg bg-ink px-4 text-sm font-bold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  {slideIndex === slides.length - 1 ? "Overview" : "Next →"}
                </button>
              </nav>
            </>
          )}
        </div>

        <p className="mt-3 text-center text-xs text-muted">
          Private by design: responses remain on this device. No account, submission or analytics.
        </p>
      </div>
    </div>
  );
}
