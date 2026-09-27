# Teaching page requirements

For DEDC02 lessons and new interactive HTML lesson presentations, read `docs/lesson-design.md` at the repository root before editing or adding a lesson. This is the required design and control-placement contract.

Reuse `src/components/lessons/LessonDeckChrome.astro`, `src/styles/lesson-deck.css`, and `src/scripts/lessonDeck.ts` with `CourseSlideLayout`'s `lessonDeck` prop. Make common interface changes in the shared files. Keep lesson-specific diagrams and activities separate; preserve bilingual content, activity outputs and saved-response keys.

Course lists use compact numbered links without Week badges. Standard editorial teaching pages follow the main `design.md` system.
