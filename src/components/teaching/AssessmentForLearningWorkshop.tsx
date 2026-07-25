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
  openingChoice: string;
  purposeAnswers: Record<string, Purpose>;
  strategyAnswers: Record<string, boolean>;
  sampleChoice: string;
  sampleRevealed: boolean;
  dialogueChoice: string;
  planner: Planner;
  exitTicket: ExitTicket;
};

const STORAGE_KEY = "ajz-afl-workshop-v1";

const emptyPlanner: Planner = {
  discipline: "Education",
  learningGoal: "",
  task: "",
  moves: { think: "", compare: "", judge: "", improve: "", reflect: "" },
};

const emptyExit: ExitTicket = { stop: "", start: "", evidence: "" };

function ChoiceButton({
  active,
  children,
  onClick,
  tone = "blue",
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  tone?: "blue" | "red" | "green";
}) {
  const tones = {
    blue: active ? "border-secondary bg-secondary text-white" : "border-border bg-surface text-ink hover:border-secondary",
    red: active ? "border-primary bg-primary text-white" : "border-border bg-surface text-ink hover:border-primary",
    green: active
      ? "border-accent-purple bg-accent-purple text-ink"
      : "border-border bg-surface text-ink hover:border-accent-purple",
  };

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 rounded-lg border px-4 py-2.5 text-left text-sm font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function SectionHeader({
  eyebrow,
  title,
  minutes,
  children,
}: {
  eyebrow: string;
  title: string;
  minutes: string;
  children: ReactNode;
}) {
  return (
    <header className="grid gap-4 border-b border-border pb-6 md:grid-cols-[1fr_auto] md:items-start">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 className="mt-2 max-w-3xl text-pretty font-serif text-3xl font-semibold leading-tight text-ink md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted md:text-lg">{children}</p>
      </div>
      <p className="w-fit rounded-full border border-secondary/40 bg-secondary-faint px-3 py-1.5 text-xs font-bold text-ink">
        {minutes}
      </p>
    </header>
  );
}

function EvidenceNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-primary pl-3 text-sm leading-relaxed text-muted">
      <span className="font-bold uppercase tracking-wide text-primary">Evidence note · </span>
      {children}
    </p>
  );
}

export default function AssessmentForLearningWorkshop() {
  const [loaded, setLoaded] = useState(false);
  const [openingChoice, setOpeningChoice] = useState("");
  const [purposeAnswers, setPurposeAnswers] = useState<Record<string, Purpose>>({});
  const [strategyAnswers, setStrategyAnswers] = useState<Record<string, boolean>>({});
  const [sampleChoice, setSampleChoice] = useState("");
  const [sampleRevealed, setSampleRevealed] = useState(false);
  const [dialogueChoice, setDialogueChoice] = useState("");
  const [planner, setPlanner] = useState<Planner>(emptyPlanner);
  const [exitTicket, setExitTicket] = useState<ExitTicket>(emptyExit);
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedState>;
        if (saved.openingChoice) setOpeningChoice(saved.openingChoice);
        if (saved.purposeAnswers) setPurposeAnswers(saved.purposeAnswers);
        if (saved.strategyAnswers) setStrategyAnswers(saved.strategyAnswers);
        if (saved.sampleChoice) setSampleChoice(saved.sampleChoice);
        if (saved.sampleRevealed) setSampleRevealed(saved.sampleRevealed);
        if (saved.dialogueChoice) setDialogueChoice(saved.dialogueChoice);
        if (saved.planner) setPlanner({ ...emptyPlanner, ...saved.planner });
        if (saved.exitTicket) setExitTicket({ ...emptyExit, ...saved.exitTicket });
      }
    } catch {
      setStatus("Your previous local progress could not be read. A fresh session has started.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const state: SavedState = {
      openingChoice,
      purposeAnswers,
      strategyAnswers,
      sampleChoice,
      sampleRevealed,
      dialogueChoice,
      planner,
      exitTicket,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    dialogueChoice,
    exitTicket,
    loaded,
    openingChoice,
    planner,
    purposeAnswers,
    sampleChoice,
    sampleRevealed,
    strategyAnswers,
  ]);

  const milestones = useMemo(
    () => [
      Boolean(openingChoice),
      Object.keys(purposeAnswers).length === assessmentPurposes.length,
      Object.keys(strategyAnswers).length === strategyScenarios.length,
      Boolean(sampleChoice && sampleRevealed),
      Boolean(dialogueChoice),
      fiveMoves.every(({ key }) => planner.moves[key].trim().length > 0),
      Boolean(planner.learningGoal.trim() && planner.task.trim()),
      Boolean(exitTicket.stop.trim() && exitTicket.start.trim() && exitTicket.evidence.trim()),
    ],
    [dialogueChoice, exitTicket, openingChoice, planner, purposeAnswers, sampleChoice, sampleRevealed, strategyAnswers],
  );
  const progress = Math.round((milestones.filter(Boolean).length / milestones.length) * 100);

  const plannerSummary = useMemo(() => {
    const lines = [
      "ASSESSMENT FOR/AS LEARNING DESIGN",
      `Discipline: ${planner.discipline}`,
      `Learning goal: ${planner.learningGoal || "—"}`,
      `Current task: ${planner.task || "—"}`,
      "",
      ...fiveMoves.flatMap(({ key, title }) => [`${title}:`, planner.moves[key] || "—", ""]),
      "EXIT COMMITMENT",
      `Stop: ${exitTicket.stop || "—"}`,
      `Start: ${exitTicket.start || "—"}`,
      `Evidence: ${exitTicket.evidence || "—"}`,
    ];
    return lines.join("\n");
  }, [exitTicket, planner]);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(plannerSummary);
      setStatus("Your design summary has been copied.");
    } catch {
      setStatus("Copy was blocked by the browser. Select the text in the design fields and copy it manually.");
    }
  }

  function resetProgress() {
    if (!window.confirm("Clear all answers saved on this device?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setOpeningChoice("");
    setPurposeAnswers({});
    setStrategyAnswers({});
    setSampleChoice("");
    setSampleRevealed(false);
    setDialogueChoice("");
    setPlanner(emptyPlanner);
    setExitTicket(emptyExit);
    setStatus("Local workshop progress has been cleared.");
  }

  function updateMove(key: (typeof fiveMoves)[number]["key"], value: string) {
    setPlanner((current) => ({ ...current, moves: { ...current.moves, [key]: value } }));
  }

  return (
    <div className="afl-workshop -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="sticky top-0 z-30 border-y border-border bg-page/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wide text-muted">
              <span>Workshop trail</span>
              <span>{progress}% explored</span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-secondary-faint"
              role="progressbar"
              aria-label="Workshop activity progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <a
            href="#agenda"
            className="hidden min-h-11 items-center rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-ink no-underline hover:border-secondary sm:flex"
          >
            Agenda
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Interactive workshop · 150 minutes</p>
            <h1 className="mt-4 max-w-4xl text-pretty font-serif text-4xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Who owns the learning when AI can complete the task?
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
              Use <strong className="text-ink">Assessment for Learning</strong> and{" "}
              <strong className="text-ink">Assessment as Learning</strong> to keep students thinking, judging, monitoring
              and improving.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">The learning trace</p>
            <ol className="mt-4 space-y-3">
              {["Think first", "Compare", "Judge", "Improve", "Reflect"].map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary-faint font-serif text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-ink">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <section id="agenda" aria-labelledby="agenda-title" className="scroll-mt-24 py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Run of session</p>
              <h2 id="agenda-title" className="mt-2 font-serif text-3xl font-semibold text-ink">
                One question, eleven moves
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              Use this page as a projected facilitation guide or open it on a phone. No response leaves this device.
            </p>
          </div>
          <ol className="mt-7 grid gap-3 md:grid-cols-2">
            {agenda.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="group grid min-h-24 grid-cols-[4.25rem_1fr] rounded-xl border border-border bg-surface p-4 text-ink no-underline shadow-sm transition-transform hover:-translate-y-0.5 hover:border-secondary motion-reduce:transform-none"
                >
                  <span className="font-mono text-sm font-bold text-primary">{item.time}</span>
                  <span>
                    <span className="block font-serif text-lg font-semibold group-hover:text-primary">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{item.purpose}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <main className="space-y-10">
          <section id="opening" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <SectionHeader eyebrow="Opening provocation" title="The product is finished. Did learning happen?" minutes="12 min">
              Two submissions respond to the same task. Choose the one that gives a teacher more evidence of learning.
            </SectionHeader>
            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              {Object.entries(workSamples).map(([key, sample]) => (
                <article key={key} className="rounded-xl border border-border bg-page p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-secondary">{sample.label}</p>
                  <blockquote className="mt-3 font-serif text-lg leading-relaxed text-ink">“{sample.text}”</blockquote>
                  <ul className="mt-5 space-y-2 text-sm text-muted">
                    {sample.evidence.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-primary">
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    aria-pressed={openingChoice === key}
                    onClick={() => setOpeningChoice(key)}
                    className={`mt-5 min-h-11 w-full rounded-lg border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                      openingChoice === key
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-ink hover:border-primary"
                    }`}
                  >
                    Choose {sample.label.split(" · ")[0]}
                  </button>
                </article>
              ))}
            </div>
            {openingChoice && (
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary-faint p-5" role="status">
                <p className="font-semibold text-ink">
                  A polished product is evidence of a product. It is not automatically evidence of the learner’s thinking.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Sample B exposes a change in understanding and the reason for revision. That trace gives teacher and
                  learner something they can use next.
                </p>
              </div>
            )}
          </section>

          <section id="ownership" className="scroll-mt-24 grid gap-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <SectionHeader eyebrow="The core problem" title="AI makes completion cheap. Learning still costs thought." minutes="16 min">
                The professional question is not simply whether a student used AI. It is whether the task still requires
                the learner to generate evidence, exercise judgement and act on feedback.
              </SectionHeader>
            </div>
            <div className="grid content-center gap-3">
              {[
                ["Completion", "Was something submitted?"],
                ["Participation", "Did the learner do something visible?"],
                ["Active learning", "Did the learner think, judge, monitor and change?"],
              ].map(([label, question], index) => (
                <div
                  key={label}
                  className={`rounded-xl border p-4 ${index === 2 ? "border-primary/40 bg-primary-faint" : "border-border bg-page"}`}
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-secondary">{label}</p>
                  <p className="mt-1 font-serif text-lg font-semibold text-ink">{question}</p>
                </div>
              ))}
              <EvidenceNote>
                Activity is not automatically agency. The learner must make decisions that affect the quality and direction
                of the work.
              </EvidenceNote>
            </div>
          </section>

          <section id="purposes" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <SectionHeader eyebrow="Concept lab" title="Assessment of, for and as learning" minutes="20 min">
              The same tool can serve different purposes. Classify each practice by what the evidence is used to do.
            </SectionHeader>
            <div className="mt-7 overflow-x-auto">
              <div className="grid min-w-[42rem] grid-cols-3 border-y border-border bg-page text-sm">
                {[
                  ["OF learning", "Summarise or certify attainment"],
                  ["FOR learning", "Use evidence to decide the next teaching or learning move"],
                  ["AS learning", "Learn through judging, monitoring and regulating"],
                ].map(([title, text]) => (
                  <div key={title} className="border-r border-border p-4 last:border-r-0">
                    <p className="font-serif text-lg font-semibold text-ink">{title}</p>
                    <p className="mt-1 leading-relaxed text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-7 space-y-4">
              {assessmentPurposes.map((item, index) => {
                const answer = purposeAnswers[item.id];
                return (
                  <fieldset key={item.id} className="rounded-xl border border-border bg-page p-4 sm:p-5">
                    <legend className="px-1 font-semibold leading-relaxed text-ink">
                      <span className="mr-2 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                      {item.prompt}
                    </legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(["of", "for", "as"] as Purpose[]).map((option) => (
                        <ChoiceButton
                          key={option}
                          active={answer === option}
                          onClick={() => setPurposeAnswers((current) => ({ ...current, [item.id]: option }))}
                          tone={option === "of" ? "blue" : option === "for" ? "red" : "green"}
                        >
                          Assessment {option}
                        </ChoiceButton>
                      ))}
                    </div>
                    {answer && (
                      <p
                        className={`mt-4 rounded-lg border p-3 text-sm leading-relaxed ${
                          answer === item.answer
                            ? "border-accent-purple/40 bg-accent-purple-faint text-ink"
                            : "border-primary/30 bg-primary-faint text-ink"
                        }`}
                      >
                        <strong>{answer === item.answer ? "Yes." : `Look again: this is assessment ${item.answer}.`}</strong>{" "}
                        {item.explanation}
                      </p>
                    )}
                  </fieldset>
                );
              })}
            </div>
          </section>

          <section id="strategies" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <SectionHeader eyebrow="Assessment for Learning" title="Five strategies that keep cognition with the learner" minutes="20 min">
              Formative assessment is not a tool or event. It is a process in which evidence changes what teacher, peer or
              learner does next.
            </SectionHeader>
            <ol className="mt-7 grid gap-4 lg:grid-cols-5">
              {formativeStrategies.map((strategy, index) => (
                <li key={strategy.label} className="rounded-xl border border-border bg-page p-4">
                  <span className="grid size-8 place-items-center rounded-full bg-secondary-faint font-serif font-bold text-secondary">
                    {index + 1}
                  </span>
                  <p className="mt-4 font-serif text-lg font-semibold text-ink">{strategy.label}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-primary">{strategy.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{strategy.action}</p>
                </li>
              ))}
            </ol>
            <div className="mt-7 grid gap-4 border-t border-border pt-6 md:grid-cols-3">
              {[
                ["Teacher", "engineers situations that reveal learning"],
                ["Peers", "become resources for comparison and explanation"],
                ["Learner", "owns the judgement and next action"],
              ].map(([actor, role]) => (
                <div key={actor}>
                  <p className="text-xs font-bold uppercase tracking-wide text-secondary">{actor}</p>
                  <p className="mt-1 font-serif text-lg text-ink">{role}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="diagnosis" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <SectionHeader eyebrow="Rapid diagnosis" title="Formative—or merely formative-looking?" minutes="10 min">
              Decide whether the practice uses evidence to move learning forward.
            </SectionHeader>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {strategyScenarios.map((scenario) => {
                const answer = strategyAnswers[scenario.id];
                const answered = typeof answer === "boolean";
                return (
                  <article key={scenario.id} className="rounded-xl border border-border bg-page p-5">
                    <p className="font-semibold leading-relaxed text-ink">{scenario.prompt}</p>
                    <div className="mt-4 flex gap-2">
                      <ChoiceButton
                        active={answer === true}
                        onClick={() => setStrategyAnswers((current) => ({ ...current, [scenario.id]: true }))}
                        tone="green"
                      >
                        Formative
                      </ChoiceButton>
                      <ChoiceButton
                        active={answer === false}
                        onClick={() => setStrategyAnswers((current) => ({ ...current, [scenario.id]: false }))}
                        tone="red"
                      >
                        Not yet
                      </ChoiceButton>
                    </div>
                    {answered && (
                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        <strong className="text-ink">
                          {answer === scenario.isFormative ? "Sound diagnosis. " : "Reconsider. "}
                        </strong>
                        {scenario.explanation}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section id="break" className="scroll-mt-24 rounded-2xl border border-dashed border-secondary bg-secondary-faint p-6 text-center">
            <p className="font-serif text-2xl font-semibold text-ink">Pause · 10 minutes</p>
            <p className="mt-2 text-sm text-muted">When you return, bring one example of feedback you received but never used.</p>
          </section>

          <section id="judgement" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <SectionHeader eyebrow="Assessment as Learning" title="Judge first. Then meet the criteria." minutes="20 min">
              Evaluative judgement grows when learners compare quality, articulate reasons and calibrate those reasons
              against criteria and exemplars.
            </SectionHeader>
            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              <article className="rounded-xl border border-border bg-page p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-secondary">Response 1</p>
                <p className="mt-3 font-serif text-lg leading-relaxed text-ink">
                  “AI feedback is useful because it is immediate, detailed and available at any time.”
                </p>
                <p className="mt-4 text-sm text-muted">Clear claim · no conditions · learner action unspecified</p>
              </article>
              <article className="rounded-xl border border-border bg-page p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-secondary">Response 2</p>
                <p className="mt-3 font-serif text-lg leading-relaxed text-ink">
                  “Immediacy may help, but feedback supports learning only when the learner can interpret it, judge its
                  relevance and use it to revise.”
                </p>
                <p className="mt-4 text-sm text-muted">Qualified claim · mechanism identified · action visible</p>
              </article>
            </div>
            <fieldset className="mt-6">
              <legend className="font-semibold text-ink">Which response demonstrates the stronger judgement—and why?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Response 1", "Response 2", "It depends"].map((choice) => (
                  <ChoiceButton
                    key={choice}
                    active={sampleChoice === choice}
                    onClick={() => {
                      setSampleChoice(choice);
                      setSampleRevealed(false);
                    }}
                    tone={choice === "Response 2" ? "green" : "blue"}
                  >
                    {choice}
                  </ChoiceButton>
                ))}
              </div>
            </fieldset>
            {sampleChoice && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setSampleRevealed(true)}
                  className="min-h-11 rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  Reveal the quality lens
                </button>
              </div>
            )}
            {sampleRevealed && (
              <div className="mt-5 grid gap-3 rounded-xl border border-accent-purple/40 bg-accent-purple-faint p-5 md:grid-cols-3">
                {[
                  ["Claim", "Is it precise and appropriately qualified?"],
                  ["Reason", "Does it explain how or why?"],
                  ["Action", "Can the learner use it to decide what happens next?"],
                ].map(([label, text]) => (
                  <div key={label}>
                    <p className="text-xs font-bold uppercase tracking-wide text-accent-purple">{label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="dialogue" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <SectionHeader eyebrow="AI and feedback literacy" title="Do not outsource the judgement" minutes="17 min">
              AI can widen the feedback conversation, but the learner must remain responsible for checking, selecting and
              using the response.
            </SectionHeader>
            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              <button
                type="button"
                aria-pressed={dialogueChoice === "answer"}
                onClick={() => setDialogueChoice("answer")}
                className={`rounded-xl border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                  dialogueChoice === "answer" ? "border-primary bg-primary-faint" : "border-border bg-page hover:border-primary"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Answer machine</p>
                <p className="mt-3 font-mono text-sm leading-relaxed text-ink">
                  “Improve this essay and give me the final version.”
                </p>
                <p className="mt-4 text-sm text-muted">AI performs the judgement and revision; the learner sees only a replacement.</p>
              </button>
              <button
                type="button"
                aria-pressed={dialogueChoice === "dialogue"}
                onClick={() => setDialogueChoice("dialogue")}
                className={`rounded-xl border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                  dialogueChoice === "dialogue"
                    ? "border-accent-purple bg-accent-purple-faint"
                    : "border-border bg-page hover:border-accent-purple"
                }`}
              >
                  <p className="text-xs font-bold uppercase tracking-wide text-ink">Assessment dialogue</p>
                <p className="mt-3 font-mono text-sm leading-relaxed text-ink">
                  “Ask me to state my criterion first. Offer one counter-example. Do not rewrite. After my revision, ask me
                  to explain which suggestion I used, adapted or rejected.”
                </p>
                <p className="mt-4 text-sm text-muted">AI creates prompts and contrasts; the learner keeps the decisions.</p>
              </button>
            </div>
            {dialogueChoice && (
              <div className="mt-5 rounded-xl border border-secondary/40 bg-secondary-faint p-5">
                <p className="font-semibold text-ink">A simple design rule</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  If AI removes the target thinking, redesign the interaction. Ask for a question, contrast, hint, critique
                  or counter-example—not the performance you intend to assess.
                </p>
              </div>
            )}
          </section>

          <section id="redesign" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <SectionHeader eyebrow="Design studio" title="Build a five-move assessment loop" minutes="18 min">
              Choose a disciplinary problem, define the learning that matters, then make thinking and improvement visible.
              Your draft stays on this device.
            </SectionHeader>
            <div className="mt-7 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
              <aside className="rounded-xl border border-border bg-page p-5">
                <label htmlFor="discipline" className="text-xs font-bold uppercase tracking-wide text-secondary">
                  Disciplinary lens
                </label>
                <select
                  id="discipline"
                  name="discipline"
                  autoComplete="off"
                  value={planner.discipline}
                  onChange={(event) =>
                    setPlanner((current) => ({ ...current, discipline: event.target.value as Discipline }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                >
                  {Object.keys(disciplinePrompts).map((discipline) => (
                    <option key={discipline}>{discipline}</option>
                  ))}
                </select>
                <p className="mt-4 text-sm leading-relaxed text-muted">{disciplinePrompts[planner.discipline]}</p>
                <div className="mt-6 space-y-4">
                  <label className="block text-sm font-semibold text-ink">
                    Learning goal
                    <textarea
                      name="learning-goal"
                      autoComplete="off"
                      value={planner.learningGoal}
                      onChange={(event) => setPlanner((current) => ({ ...current, learningGoal: event.target.value }))}
                      rows={3}
                      placeholder="What should learners understand or be able to do independently?"
                      className="mt-2 w-full rounded-lg border border-border bg-surface p-3 font-normal leading-relaxed text-ink placeholder:text-muted/70 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-ink">
                    Current task
                    <textarea
                      name="current-task"
                      autoComplete="off"
                      value={planner.task}
                      onChange={(event) => setPlanner((current) => ({ ...current, task: event.target.value }))}
                      rows={3}
                      placeholder="What are students currently asked to produce?"
                      className="mt-2 w-full rounded-lg border border-border bg-surface p-3 font-normal leading-relaxed text-ink placeholder:text-muted/70 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </label>
                </div>
              </aside>
              <div className="space-y-4">
                {fiveMoves.map((move, index) => (
                  <label key={move.key} className="grid gap-3 rounded-xl border border-border bg-page p-4 sm:grid-cols-[2.5rem_1fr]">
                    <span className="grid size-9 place-items-center rounded-full bg-primary-faint font-serif font-bold text-primary">
                      {index + 1}
                    </span>
                    <span>
                      <span className="font-serif text-lg font-semibold text-ink">{move.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{move.prompt}</span>
                      <textarea
                        name={`assessment-move-${move.key}`}
                        autoComplete="off"
                        value={planner.moves[move.key]}
                        onChange={(event) => updateMove(move.key, event.target.value)}
                        rows={2}
                        className="mt-3 w-full rounded-lg border border-border bg-surface p-3 font-sans text-sm leading-relaxed text-ink placeholder:text-muted/70 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                        placeholder="Write the learner action and the evidence it will produce…"
                      />
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section id="share" className="scroll-mt-24 rounded-2xl border border-secondary/40 bg-secondary-faint p-5 sm:p-8">
            <SectionHeader eyebrow="Sixty-second share" title="Test the design with three questions" minutes="5 min">
              A design passes only if all three answers are visible in what students are required to do.
            </SectionHeader>
            <ol className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                "Must the learner think before receiving an answer?",
                "Must the learner make and justify a quality judgement?",
                "Must the learner use feedback to improve something visible?",
              ].map((question, index) => (
                <li key={question} className="rounded-xl border border-secondary/30 bg-surface p-5">
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">Check {index + 1}</span>
                  <p className="mt-2 font-serif text-xl font-semibold leading-snug text-ink">{question}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="exit" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <SectionHeader eyebrow="Exit ticket" title="Commit to one assessable change" minutes="2 min">
              Avoid broad intentions. Name a practice, a replacement and the evidence that will tell you whether it worked.
            </SectionHeader>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                ["stop", "I will stop…", "A practice that rewards completion without revealing learning"],
                ["start", "I will start…", "One AfL or AaL move learners must perform"],
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
                    className="mt-3 w-full rounded-lg border border-border bg-surface p-3 font-normal leading-relaxed text-ink placeholder:text-muted/70 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <button
                type="button"
                onClick={copySummary}
                className="min-h-11 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                Copy my design summary
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-11 rounded-lg border border-border bg-page px-4 py-2.5 text-sm font-bold text-ink hover:border-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                Print or save as PDF
              </button>
              <button
                type="button"
                onClick={resetProgress}
                className="min-h-11 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-muted hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                Clear this device
              </button>
            </div>
            <p className="mt-4 text-sm text-muted" aria-live="polite">
              {status || "Your entries are saved only in this browser. Nothing is submitted or tracked."}
            </p>
          </section>
        </main>

        <section className="mt-12 border-t border-border pt-8" aria-labelledby="references-title">
          <details className="rounded-xl border border-border bg-surface p-5">
            <summary id="references-title" className="cursor-pointer font-serif text-xl font-semibold text-ink">
              Conceptual foundations and further reading
            </summary>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
              {references.map((reference) => (
                <li key={reference}>{reference}</li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              Terminology is used carefully: assessment becomes formative through the use of evidence, not through a
              particular tool; assessment as learning foregrounds the learner’s metacognitive and evaluative role.
            </p>
          </details>
        </section>
      </div>
    </div>
  );
}
