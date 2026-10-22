/** Browser-only PDF creation. Responses stay on the participant's device. */
const assetRoot = '/teaching/training/tirf/resources/pdf/';
let fontBytes: Promise<ArrayBuffer> | undefined;

export async function createTrainingPdf(record: Element): Promise<Uint8Array> {
 const [{ PDFDocument, rgb }, fontkit] = await Promise.all([
  import(/* @vite-ignore */ `${assetRoot}pdf-lib.esm.min.js`),
  import(/* @vite-ignore */ `${assetRoot}fontkit.es.min.js`),
 ]);
 if (!fontBytes) fontBytes = fetch(`${assetRoot}NotoSansTC-Regular.ttf`).then(response => {
  if (!response.ok) throw new Error('The PDF font could not be loaded. Please retry.');
  return response.arrayBuffer();
 }).catch(error => { fontBytes = undefined; throw error; });
 const pdf = await PDFDocument.create();
 pdf.registerFontkit(fontkit.default);
 // Keep the full static font: subsetting this CJK font loses rendered glyphs.
 const font = await pdf.embedFont(await fontBytes, { subset: false });
 pdf.setTitle('My TIRF classroom plan and workshop notes');
 pdf.setAuthor('Workshop participant');
 pdf.setLanguage('en-GB');
 const width = 595.28, height = 841.89, margin = 46;
 const ink = rgb(0.06, 0.29, 0.20), muted = rgb(0.30, 0.38, 0.33);
 let page = pdf.addPage([width, height]), y = height - margin;
 const newPage = () => { page = pdf.addPage([width, height]); y = height - margin; };
 function wrap(text: string, size: number): string[] {
  const lines: string[] = [];
  const maxWidth = width - margin * 2;
  for (const paragraph of text.replace(/\t/g, '    ').split(/\r\n|\r|\n/)) {
   let line = '';
   for (const token of paragraph.match(/\S+\s*|\s+/gu) || []) {
    if (font.widthOfTextAtSize(line + token, size) <= maxWidth) { line += token; continue; }
    if (line) { lines.push(line.trimEnd()); line = ''; }
    // Long words, URLs and Chinese text can wrap without a space.
    for (const character of token) {
     if (line && font.widthOfTextAtSize(line + character, size) > maxWidth) {
      lines.push(line.trimEnd()); line = '';
     }
     line += character;
    }
   }
   lines.push(line.trimEnd());
  }
  return lines;
 }
 for (const block of record.querySelectorAll('h1,h2,h3,p')) {
  const kind = block.tagName.toLowerCase();
  const size = kind === 'h1' ? 20 : kind === 'h2' ? 14 : 11;
  const lineHeight = size * 1.5;
  const isHeading = kind !== 'p';
  const lines = wrap(block.textContent || '', size);
  if (isHeading && y - margin < Math.min(lines.length * lineHeight + (kind === 'h2' ? 76 : 42), height - margin * 2)) newPage();
  if (kind === 'h2') y -= 8;
  for (const line of lines) {
   if (y - lineHeight < margin) newPage();
   y -= lineHeight;
   page.drawText(line, { x: margin, y, size, font, color: isHeading ? ink : muted });
  }
  y -= kind === 'h2' ? 8 : 6;
 }
 const pages = pdf.getPages();
 pages.forEach((sheet: any, index: number) => {
  sheet.drawText(`${index + 1} / ${pages.length}`, { x: width - margin - 36, y: 24, size: 9, font, color: muted });
 });
 return pdf.save();
}
