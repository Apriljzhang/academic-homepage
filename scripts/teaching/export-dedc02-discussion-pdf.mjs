/** Export the built lesson with expanded examples and readable annotation notes.
 * Run after the Astro build. Set PLAYWRIGHT_MODULE and CHROME_BIN if needed.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const dist = path.join(root, 'dist');
const output = path.join(root, 'public/teaching/courses/dedc02');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
const server = http.createServer((request, response) => {
  try {
    let filename = path.join(dist, decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
    if (!filename.startsWith(dist + path.sep) && filename !== dist) throw new Error('Invalid path');
    if (fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html');
    response.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream');
    response.end(fs.readFileSync(filename));
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}) });
  for (const language of ['en', 'zh']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`http://127.0.0.1:${server.address().port}/teaching/courses/dedc02/10-discussion-conclusion/`, { waitUntil: 'networkidle' });
    await page.evaluate(language => {
      document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en-GB';
      document.title = language === 'zh' ? '討論與結論 · DEDC02' : 'Discussion and Conclusion · DEDC02';
      document.querySelectorAll('.dc-deck .slide').forEach(slide => {
        slide.inert = false;
        slide.setAttribute('aria-hidden', 'false');
        slide.dataset.language = language;
        slide.querySelectorAll('.slide-inner > [data-language]').forEach(panel => { panel.hidden = panel.dataset.language !== language; });
        const part = slide.querySelector('.eyebrow');
        if (part) part.textContent = (language === 'zh' ? part.dataset.partZh : part.dataset.partEn) || '';
      });
      document.querySelectorAll('.published-example').forEach(example => { example.open = true; });
      document.querySelectorAll(`[data-language="${language}"] .annotation-example`).forEach(example => {
        const notes = document.createElement('section');
        notes.className = 'pdf-function-notes';
        const heading = document.createElement('h3');
        heading.textContent = language === 'zh' ? '段落功能解說' : 'How the passage develops the argument';
        notes.append(heading);
        const list = document.createElement('ul');
        example.querySelectorAll('[data-annotation]:not([data-annotation="clear"])').forEach(button => {
          const item = document.createElement('li');
          const label = document.createElement('b');
          label.textContent = `${button.textContent}: `;
          item.append(label, document.createTextNode(button.dataset.annotationHelp || ''));
          list.append(item);
        });
        notes.append(list);
        example.append(notes);
      });
    }, language);
    await page.addStyleTag({ content: `
      @page { size: A4 landscape; margin: 14mm; }
      html, body, main.deck.dc-deck { height: auto !important; max-height: none !important; overflow: visible !important; }
      .dc-deck .slide { display: block !important; height: auto !important; max-height: none !important; min-height: 0 !important; overflow: visible !important; break-inside: auto !important; break-after: page; padding: 0 !important; }
      .dc-deck .slide:last-child { break-after: auto; }
      .dc-deck .slide-inner { max-height: none !important; overflow: visible !important; }
      .dc-deck [data-language][hidden], [data-lesson-chrome], dialog, .export-actions, .annotation-tools, .annotation-help, [data-export-status] { display: none !important; }
      .dc-deck h1, .dc-deck h2, .dc-deck h3, .dc-deck summary, .dc-deck .example-source { break-after: avoid; }
      .dc-deck .reasoning-method li, .dc-deck .study-context, .dc-deck .pdf-function-notes li { break-inside: avoid; }
      .dc-deck .reasoning-method li { margin: 5pt 0; line-height: 1.35; }
      .dc-deck .reasoning-method span { margin-top: 2pt; line-height: 1.35; }
      .dc-deck .method-table :is(th,td) { padding: 5pt 6pt; font-size: 10pt; line-height: 1.35; }
      .dc-deck .original-excerpt p, .dc-deck .lecture-explanation { orphans: 3; widows: 3; }
      .dc-deck .published-example { break-before: page; }
      .dc-deck details > div { display: block !important; }
      .dc-deck .pdf-function-notes { margin: 12pt 0; padding-top: 8pt; border-top: 1px solid #bad8c5; break-inside: avoid; }
      .dc-deck .pdf-function-notes h3 { font-size: 11pt; }
      .dc-deck .pdf-function-notes li { font-size: 10pt; line-height: 1.45; margin: 5pt 0; }
    ` });
    await page.evaluate(() => document.fonts.ready);
    const filename = path.join(output, `discussion-conclusion-${language}.pdf`);
    await page.pdf({ path: filename, format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
    console.log(filename);
    await page.close();
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
