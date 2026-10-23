import { bilingual as b, escapeHtml as e } from './tirfMarkup.ts';
export function scenarioPromptButtonsHtml(primaryKey: string, collegeKey: string) {
 return `<div class="scenario-prompts" role="group" aria-label="AI prompts for both classroom scenarios"><button type="button" class="secondary" data-framework-copy="${e(primaryKey)}">${b('Copy prompt: Scenario 1','複製指令：情境一')}</button><button type="button" class="secondary" data-framework-copy="${e(collegeKey)}">${b('Copy prompt: Scenario 2','複製指令：情境二')}</button><p class="status" role="status"></p></div>`;
}
