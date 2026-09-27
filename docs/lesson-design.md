# HTML lesson design requirements

Applies to the five DEDC02 lessons and future interactive HTML lesson presentations. These pages use a white-and-green presentation system within the academic website. The website’s cream editorial theme continues to apply to course indexes and ordinary content pages.

## Shared implementation

Use `CourseSlideLayout` with `lessonDeck`, `LessonDeckChrome`, `src/styles/lesson-deck.css`, and the helpers in `src/scripts/lessonDeck.ts`. Shared elements must be changed in these files so all lessons receive the same change. Keep lesson-specific diagrams, activity logic and content in the lesson’s own files.

```astro
<CourseSlideLayout {title} {description} lessonDeck>
  <LessonDeckChrome {courseHref} lessonTitle="Lesson title" />
  <main class="deck" aria-label="Lesson title slide deck">
    <!-- Bilingual slide sections and activities. -->
  </main>
  <!-- Optional lesson-specific dialogs. -->
</CourseSlideLayout>
```

The lesson script must call `syncLessonNavigation(current, slides.length)` when showing a slide and `bindLessonShortcuts(showSlide, () => current, slides.length, overview)` once. Derive the total from the rendered slide sections, including any sections generated from data; never hardcode the displayed count.

## Placement contract

| Element | Required position and order |
| --- | --- |
| Language and timer | Fixed at the top right, aligned with the right edge of the 1120px content column on wide screens. Language button first; timer minutes, countdown, Start/Pause, Reset next. |
| Content column | Centred horizontally, at most 1120px wide. Slides start 6.5rem from the top, with 6rem of space below for navigation. On phones: 5.75rem top, 1.25rem sides, 6rem bottom. Content starts at the top of this area rather than moving vertically with its length. |
| Slide metadata | First in the content column, left aligned, small uppercase green text with a thin green rule underneath. Use `.slide-header` and `.eyebrow`; Lesson 1’s direct `.eyebrow` receives the same treatment. |
| Title and opening content | Directly below the metadata. Cover slides use a short green bar, then the title and a brief lead. All titles share the same font, weight and scale. |
| Activity content | Below the heading/instructions, inside the content column. Put action buttons and feedback next to the activity they affect. |
| Source notes / takeaway | Below the associated explanation or activity. Sources are quiet text; takeaways use a restrained green emphasis strip. |
| Navigation | Fixed at the bottom centre in this exact order: course home, previous, current / total (opens overview), next, full screen. Progress line sits beneath the navigation pill. |
| Overview | Centred modal; lesson title at upper left, close button at upper right, ordered slide list below, keyboard help last. Two columns on desktop, one on phones. Highlight and announce the current slide. |
| Personal PDF, when provided | A closing tool after the lesson activities, with its button in the closing slide. Use the same dialog shell: heading left, close right, optional personal message, Create PDF action, print instruction. It is not a numbered activity. |

Controls must stay in the same place on every slide and every lesson. Do not duplicate translation controls within individual slide headers. Reserve the toolbar space even while the timer output is hidden. Respect device safe areas.

## Visual system

- White background `#fff`; dark green headings/text `#0f4a32`; functional green `#1f6b45`; pale green `#edf7f0`; rules `#bad8c5`; muted supporting text `#607b6d`.
- Source Serif 4, weight 600, for slide titles; Source Sans 3 for body, labels, forms and controls.
- Cover title: `clamp(3.3rem, 7vw, 7rem)`, line-height `.94`; phones: `clamp(2.5rem, 12vw, 4.5rem)`.
- Standard content headings use the existing shared lesson scale. Dense diagrams may have smaller headings or text where needed for comprehension, while preserving the shared font and colours.
- Plain light panels, thin rules and modest radii. Use soft shadows only for floating controls. Additional colours may distinguish meaningful categories inside a diagram; keep the shared interface green.
- Course indexes use compact numbered lesson links (`1.`, `2.`, etc.), without `Week` badges or large descriptive boxes.

## Interaction and accessibility

- Open in English; offer Traditional Chinese through the top-right `中文` button. The toggle translates the current slide, changes to `English`, and accurately reports `aria-pressed`. Existing per-slide language choices remain available when revisiting a slide.
- Use one consistent SVG home icon, `←` / `→`, the one-line `current / total` counter, and the full-screen icon. Give every icon control an accessible name and a hover title.
- Shared controls have at least 44px targets and visible green focus outlines. Disabled previous/next controls show the first/last-slide boundary.
- Overview dialogs have an accessible heading, native modal focus handling, Escape dismissal and a clear close button. Keyboard shortcuts must not navigate behind an open dialog or intercept typing, selection, links or activity buttons.
- Support arrows, Page Up / Page Down, Home / End, O for overview and F for full screen. Swipe navigation requires a predominantly horizontal gesture outside interactive content; vertical scrolling and activity gestures remain usable.
- Every active slide has `aria-hidden="false"`; inactive slides have `aria-hidden="true"`. Hidden language panels must stay hidden even when component styles set `display`.
- Keep reveals immediate and independently operable. The timer must not gate answers.
- Preserve existing saved-response keys and activity data while revising design. Feedback is adjacent to the relevant action and uses text as well as colour.
- Long slides scroll vertically without clipping controls or hiding the final activity. Phone layouts stack panels and avoid horizontal page scrolling. Honour reduced-motion preferences.
- Print/PDF output excludes floating controls and dialogs. Preserve lesson-specific response summaries and export content.

## Review before publication

When reviewing a lesson, inspect its cover, a normal explanation, a dense/interactive slide, Chinese content, overview, and closing tools. Compare the same control positions across lessons. Check a phone viewport, keyboard focus, first/last navigation boundaries and print styles. Run the production build and inspect the live deployment after an authorised push.

## Review record — 27 September 2026

Reviewed all five lesson sources and live presentation pages. The shared content palette was already established, but the home glyphs, timer wording, dialog sizes, cover typography and control markup differed. Counters wrapped over three lines, and duplicated hidden translation buttons remained in Lesson 2. The lessons now use one shared control component and stylesheet, the same content origin, one-line counters and consistent navigation/shortcut rules. Subject-specific activities and their saved-response keys are retained.
