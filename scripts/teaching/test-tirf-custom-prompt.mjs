import assert from 'node:assert/strict';
import { createCustomSitePrompt } from '../../src/scripts/tirfCustomSitePrompt.js';
import { worksheet } from '../../src/data/tirfWorkshop.ts';
import { buildEn, buildZh } from '../../src/data/tirfSite.ts';

const requirements = { en: buildEn, zh: buildZh };
const values = Object.fromEntries(worksheet.map(field => [field.id, `Teacher entry: ${field.id}\n第二行：${field.id}`]));
for (const chinese of [false, true]) {
 const prompt = createCustomSitePrompt(worksheet, values, requirements, chinese);
 for (const field of worksheet) {
  assert.ok(prompt.includes(values[field.id]), `Full entry retained: ${field.id}`);
  assert.ok(prompt.includes(chinese ? field.labelZh : field.label));
 }
 assert.ok(prompt.endsWith(chinese ? buildZh : buildEn), 'Complete shared requirements included');
 for (const name of ['Black', 'Wiliam', 'Hattie', 'Timperley', 'Gu', '2009', '2007', '2021', 'index.html']) assert.ok(prompt.includes(name));
}
const partial = createCustomSitePrompt(worksheet, { audience: 'A primary English class in China' }, requirements);
assert.ok(partial.includes('[Not supplied; ask the teacher if essential]'));
assert.ok(partial.includes('[Not supplied; optional]'));
assert.ok(!partial.includes('Students should have a short reading period'), 'No college scenario substituted');
const edited = createCustomSitePrompt(worksheet, { ...values, goal: 'Revised target: describe a picture' }, requirements);
assert.ok(edited.includes('Revised target: describe a picture'));
assert.ok(!edited.includes(values.goal), 'Copy uses the latest entry');
assert.ok(createCustomSitePrompt(worksheet, {}, requirements, true).includes('［未提供；如屬必要資料，先向教師確認］'));
console.log('Custom prompt checks passed: all fields, multiline text, both languages, three frameworks, partial plans and edited entries.');
