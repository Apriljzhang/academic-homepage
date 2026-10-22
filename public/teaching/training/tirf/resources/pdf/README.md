# Browser PDF dependencies

- pdf-lib 1.17.1: https://github.com/Hopding/pdf-lib (MIT; licence included).
- @pdf-lib/fontkit 1.1.1: https://github.com/Hopding/fontkit (MIT; licence included). Browser ESM build from the npm release, bundled with pako 1.0.11 using esbuild. The pako licence is included.
- Noto Sans TC: https://github.com/google/fonts/tree/main/ofl/notosanstc (SIL Open Font License; OFL included). Regular TTF instantiated at weight 400 with fontTools from the upstream variable font. No characters removed.

Loaded from this website only when creating a training PDF. Responses are processed in the browser and are not sent to a PDF service. Each PDF embeds the complete static font to preserve Latin and Chinese rendering.
