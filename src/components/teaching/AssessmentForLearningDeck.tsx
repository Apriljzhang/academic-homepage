import { useEffect, useState, type ReactNode } from "react";
import {
  annotatedCases,
  assessmentPurposes,
  contrastTriad,
  criteriaExamples,
  criteriaFramework,
  elicitationTools,
  feedbackLevels,
  feedbackPrinciples,
  formativeDefinition,
  formativeStrategies,
  genaiUses,
  humanNonNegotiables,
  paradigmShift,
  peerSelfPractices,
  practitionerInsights,
  references,
  roleShifts,
  sessionQuestion,
  sessionTitle,
  slides,
  takeaways,
  whyFormativeMatters,
} from "../../data/aflWorkshop";

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

export default function AssessmentForLearningDeck() {
  const [slideIndex, setSlideIndex] = useState(-1);

  useEffect(() => {
    const hash = window.location.hash.replace("#slide-", "");
    const index = slides.findIndex(({ id }) => id === hash);
    if (index >= 0) setSlideIndex(index);
  }, []);

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

  function goTo(index: number) {
    setSlideIndex(index);
    window.history.replaceState(null, "", `#slide-${slides[index].id}`);
  }

  function showOverview() {
    setSlideIndex(-1);
    window.history.replaceState(null, "", window.location.pathname);
  }

  function renderSlide() {
    const slide = slides[slideIndex];
    if (!slide) return null;

    if (slide.id === "why-change") {
      return (
        <Frame eyebrow="Opening" title="Why assessment must change in the age of AI" time="10 min">
          <p className="max-w-3xl font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            For future teachers, the first question is no longer only whether a product looks finished. It is whether
            assessment still makes thinking, judgement, and agency visible.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {contrastTriad.map((item) => (
              <article key={item.label} className="rounded-xl border border-border bg-page p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{item.label}</p>
                <p className="mt-2 font-semibold text-ink">{item.text}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 rounded-xl border border-secondary/35 bg-secondary-faint p-4 text-sm leading-relaxed text-ink">
            Guiding proposition: <strong>Assessment is the bridge between teaching and learning.</strong> When GenAI can
            generate polished products, the bridge must carry evidence of thinking—not only completion.
          </p>
        </Frame>
      );
    }

    if (slide.id === "paradigm") {
      return (
        <Frame eyebrow="Paradigm shift" title="From high-stakes testing to learning-oriented assessment" time="15 min">
          <div className="grid gap-3">
            {paradigmShift.map((item) => (
              <article key={item.from} className="grid gap-2 rounded-xl border border-border bg-page p-4 sm:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">From</p>
                  <p className="mt-1 font-serif text-lg font-semibold text-ink">{item.from}</p>
                </div>
                <p className="hidden place-self-center text-primary sm:block" aria-hidden="true">
                  →
                </p>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">Toward</p>
                  <p className="mt-1 font-serif text-lg font-semibold text-ink">{item.to}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted sm:col-span-3">{item.point}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-border bg-page p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">Why formative assessment matters</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              {whyFormativeMatters.map((line) => (
                <li key={line}>— {line}</li>
              ))}
            </ul>
          </div>
        </Frame>
      );
    }

    if (slide.id === "purposes") {
      return (
        <Frame eyebrow="Concept map" title="Assessment of, for & as learning" time="15 min">
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted">
            Think of assessment as a journey: destination, current position, and the route the learner chooses next.
          </p>
          <div className="grid gap-3 lg:grid-cols-3">
            {assessmentPurposes.map((item) => (
              <article key={item.label} className="rounded-xl border border-border bg-page p-4">
                <p className="font-serif text-2xl font-semibold text-primary">{item.label}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-secondary">{item.journey}</p>
                <p className="mt-3 text-sm font-semibold text-ink">{item.focus}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.example}</p>
              </article>
            ))}
          </div>
        </Frame>
      );
    }

    if (slide.id === "alignment") {
      return (
        <Frame eyebrow="Constructive alignment" title="Make quality visible before work begins" time="15 min">
          <div className="grid gap-3 sm:grid-cols-2">
            {criteriaFramework.map((item) => (
              <article key={item.label} className="rounded-xl border border-border bg-page p-4">
                <p className="font-serif text-lg font-semibold text-ink">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.meaning}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {criteriaExamples.map((example) => (
              <article key={example.title} className="rounded-xl border border-secondary/30 bg-secondary-faint p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{example.title}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink">Product criteria</p>
                <ul className="mt-1 space-y-1 text-sm text-muted">
                  {example.product.map((line) => (
                    <li key={line}>— {line}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink">Performance criteria</p>
                <ul className="mt-1 space-y-1 text-sm text-muted">
                  {example.performance.map((line) => (
                    <li key={line}>— {line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Frame>
      );
    }

    if (slide.id === "strategies") {
      return (
        <Frame eyebrow="Assessment for Learning" title="Five strategies that keep cognition with the learner" time="20 min">
          <ol className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {formativeStrategies.map((strategy) => (
              <li key={strategy.number} className="rounded-xl border border-border bg-page p-4">
                <span className="grid size-8 place-items-center rounded-full bg-secondary-faint font-serif font-bold text-secondary">
                  {strategy.number}
                </span>
                <p className="mt-3 font-serif text-lg font-semibold text-ink">{strategy.label}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary">{strategy.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{strategy.action}</p>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-ink">{strategy.role}</p>
                <ul className="mt-3 space-y-1 text-xs leading-relaxed text-muted">
                  {strategy.examples.map((example) => (
                    <li key={example}>— {example}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Frame>
      );
    }

    if (slide.id === "break") {
      return (
        <Frame eyebrow="Pause" title="Take 10 minutes." time="75–85">
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-secondary bg-secondary-faint p-8 text-center">
            <div>
              <p className="font-serif text-4xl font-semibold text-ink sm:text-5xl">Hold one classroom image</p>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
                Think of feedback you once received but never used. What would have made that feedback formative?
              </p>
            </div>
          </div>
        </Frame>
      );
    }

    if (slide.id === "evidence") {
      return (
        <Frame eyebrow="Responsive teaching" title="Formative only when evidence changes the next move" time="15 min">
          <blockquote className="rounded-xl border border-primary/30 bg-primary-faint p-4 font-serif text-lg leading-relaxed text-ink">
            {formativeDefinition.core}{" "}
            <span className="text-base text-muted">{formativeDefinition.blackWiliam}</span>
          </blockquote>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-border bg-page p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-secondary">Planned elicitation</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {elicitationTools.planned.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-xl border border-border bg-page p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-secondary">Contingent elicitation</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {elicitationTools.contingent.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </article>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {annotatedCases.map((item) => (
              <article key={item.title} className="rounded-xl border border-border bg-page p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-serif text-lg font-semibold text-ink">{item.title}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      item.verdict === "Formative"
                        ? "bg-accent-purple-faint text-ink"
                        : "bg-primary-faint text-primary"
                    }`}
                  >
                    {item.verdict}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.scenario}</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">{item.why}</p>
              </article>
            ))}
          </div>
        </Frame>
      );
    }

    if (slide.id === "feedback") {
      return (
        <Frame eyebrow="Feedback literacy" title="Feedback that moves learning forward" time="15 min">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {feedbackLevels.map((item) => (
              <article key={item.level} className="rounded-xl border border-border bg-page p-4">
                <p className="font-serif text-xl font-semibold text-primary">{item.level}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.focus}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-border bg-page p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">
              Formative feedback guidelines (Shute, 2008)
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {feedbackPrinciples.map((principle) => (
                <li key={principle.title} className="text-sm leading-relaxed text-muted">
                  <strong className="text-ink">{principle.title}.</strong> {principle.detail}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 rounded-xl border border-secondary/35 bg-secondary-faint p-4 text-sm leading-relaxed text-ink">
            Delivery is not enough. Feedback becomes formative only when learners interpret it, judge its relevance, and
            use it to revise something visible.
          </p>
        </Frame>
      );
    }

    if (slide.id === "peers") {
      return (
        <Frame eyebrow="Assessment as Learning" title="Peers, evaluative judgement, and self-regulation" time="13 min">
          <div className="grid gap-3 sm:grid-cols-2">
            {peerSelfPractices.map((item) => (
              <article key={item.label} className="rounded-xl border border-border bg-page p-4">
                <p className="font-serif text-lg font-semibold text-ink">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            When students learn to judge quality, give focused peer feedback, and set revision goals, assessment builds
            ownership, self-efficacy, and motivation—not only a record of scores.
          </p>
        </Frame>
      );
    }

    if (slide.id === "genai") {
      return (
        <Frame eyebrow="GenAI tools" title="Use GenAI across the formative cycle—without outsourcing judgement" time="14 min">
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted">
            GenAI can provide contrast, diagnosis, scaffolding, and draft feedback. It should not replace the learner’s
            quality decisions or the teacher’s pedagogical interpretation.
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {genaiUses.map((item) => (
              <article key={item.name} className="rounded-xl border border-border bg-page p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-serif text-lg font-semibold text-ink">{item.name}</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">{item.role}</p>
                </div>
                <p className="mt-3 font-mono text-xs leading-relaxed text-ink">“{item.prompt}”</p>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  <strong className="text-ink">Teacher:</strong> {item.teacherHelp}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  <strong className="text-ink">Learner:</strong> {item.learnerHelp}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.caution}</p>
              </article>
            ))}
          </div>
        </Frame>
      );
    }

    return (
      <Frame eyebrow="Synthesis" title="Human non-negotiables when GenAI enters assessment" time="8 min">
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          {roleShifts.map((item) => (
            <article key={item.who} className="rounded-xl border border-secondary/30 bg-secondary-faint p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{item.who}</p>
              <p className="mt-2 font-serif text-lg font-semibold text-ink">
                {item.from} → {item.to}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.point}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {humanNonNegotiables.map((item) => (
            <article key={item.label} className="rounded-xl border border-border bg-page p-4">
              <p className="font-serif text-xl font-semibold text-primary">{item.label}</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                <li>
                  <strong className="text-ink">Teacher:</strong> {item.teacher}
                </li>
                <li>
                  <strong className="text-ink">Learner:</strong> {item.learner}
                </li>
                <li>
                  <strong className="text-ink">GenAI:</strong> {item.genai}
                </li>
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-accent-purple/35 bg-accent-purple-faint p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink">What practitioners often discover</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
              {practitionerInsights.aha.map((line) => (
                <li key={line}>— {line}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-border bg-page p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Tensions that remain</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
              {practitionerInsights.tensions.map((line) => (
                <li key={line}>— {line}</li>
              ))}
            </ul>
          </article>
        </div>
        <ul className="mt-5 space-y-2 rounded-xl border border-secondary/35 bg-secondary-faint p-4">
          {takeaways.map((line) => (
            <li key={line} className="font-serif text-lg font-semibold leading-snug text-ink">
              {line}
            </li>
          ))}
        </ul>
        <details className="mt-4 rounded-xl border border-border bg-page p-4">
          <summary className="cursor-pointer font-semibold text-ink">Conceptual foundations</summary>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
            {references.map((reference) => (
              <li key={reference}>{reference}</li>
            ))}
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
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Open Teaching Resources · 2026/07 · Capital Normal University
            </p>
            <h1 className="mt-1 max-w-4xl font-serif text-2xl font-semibold text-ink sm:text-3xl">{sessionTitle}</h1>
          </div>
          {slideIndex >= 0 && (
            <button
              type="button"
              onClick={showOverview}
              className="min-h-11 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-ink hover:border-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              Overview
            </button>
          )}
        </header>

        <div className="flex h-[calc(100dvh-13rem)] min-h-[34rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {slideIndex < 0 ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
              <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                    150-minute information deck
                  </p>
                  <h2 className="mt-2 text-pretty font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                    {sessionQuestion}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    A lecture resource for Capital Normal University students on using{" "}
                    <strong className="text-ink">Assessment for Learning</strong> and{" "}
                    <strong className="text-ink">Assessment as Learning</strong> to keep thinking, judgement, and agency
                    with learners when generative AI can complete the task.
                  </p>
                  <div className="mt-5 rounded-xl border border-primary/30 bg-primary-faint p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">Core trace</p>
                    <p className="mt-2 font-serif text-xl font-semibold text-ink">
                      Clarify → Elicit → Feedback → Peers → Ownership
                    </p>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-muted">
                    Click a slide to begin. Use on-screen controls, ← / →, Page Up / Page Down, or Escape to return to
                    this overview. This deck is information-only—no responses are collected.
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
                          <span className="block font-serif text-lg font-semibold text-ink group-hover:text-primary">
                            {slide.title}
                          </span>
                          <span className="mt-1 block text-xs text-muted">
                            {slide.time} · {slide.subtitle}
                          </span>
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
              <nav
                aria-label="Slide controls"
                className="flex shrink-0 items-center gap-3 border-t border-border bg-page px-4 py-3"
              >
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
                    <span>
                      {slideIndex + 1} / {slides.length}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary-faint">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none"
                      style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }}
                    />
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
          Information deck for classroom presentation and self-study. No accounts, submissions, or analytics.
        </p>
      </div>
    </div>
  );
}
