import { bilingual as b, escapeHtml as e } from './tirfMarkup.ts';
const primaryExamples: Record<string,[string,string]> = {
 'primary-strategy-intentions':['Use the rabbit picture to agree what has and can describe. Pupils point to a body feature and an action.','用兔子圖片確認has與can分別說甚麼，讓學生指認身體特徵及動作。'],
 'primary-strategy-evidence':['Every pupil chooses has or can and explains by pointing or in Chinese. Check their understanding of the words before interpreting an error.','每人選has或can，並指認或用中文解釋。先核對詞彙理解，再詮釋錯誤。'],
 'primary-strategy-feedback':['Ask whether long ears describes a body feature or an action. The pupil uses the answer to revise the sentence.','問long ears是在說身體特徵還是動作，讓學生運用答案修訂句子。'],
 'primary-strategy-peers':['A partner points to the picture and asks: body feature or action? The original pupil decides how to revise.','同伴指著圖片問：身體特徵還是動作？再由原作者決定如何修訂。'],
 'primary-strategy-ownership':['The pupil checks both sentences, chooses a change and explains why by pointing or in Chinese.','學生檢查兩句話、選擇修改，並指認或用中文解釋原因。'],
 'primary-feedback-feed-up':['“Use has for a body feature and can for an action.”','「用has說身體特徵，用can說動作。」'],
 'primary-feedback-feed-back':['“You named a body feature and an action. Check your choices of has and can.”','「你寫出了身體特徵及動作，再檢查has與can的選擇。」'],
 'primary-feedback-feed-forward':['“Match long ears to a body feature and jump to an action. Then choose again.”','「把long ears配到身體特徵，把jump配到動作，再選一次。」'],
 'primary-feedback-task':['“Long ears names a body feature. Your choice of can in this sentence needs checking.”','「Long ears是身體特徵，要再檢查這句的can。」'],
 'primary-feedback-process':['“First decide: body feature or action? Use that to choose has or can.”','「先判斷：身體特徵還是動作？再用這個判斷選has或can。」'],
 'primary-feedback-self-regulation':['“Check both sentences. Which choice needs changing? Explain why.”','「檢查兩句話，哪個選擇需要修改？請解釋原因。」'],
 'primary-feedback-self':['“You are clever!”','「你很聰明！」'],
 'primary-gu-targets':['Use has for a body feature and can for an action. Look for this distinction in both sentences.','用has說身體特徵，用can說動作；從兩句作答看學生能否分清。'],
 'primary-gu-eliciting':['Ask every pupil to choose has/can and explain by pointing or in Chinese. Keep the first response.','請每人選has/can，並指認或用中文解釋，先保留初次作答。'],
 'primary-gu-interpreting':['“It can long ears” may reflect confusion about has/can or the words. Ask the pupil to match the words to the picture.','“It can long ears”可能反映has/can或詞彙理解的困難，先請學生把詞語配到圖片。'],
 'primary-gu-feedback':['After checking the words, prompt the pupil to distinguish a body feature from an action and choose again.','核對詞彙後，提示學生分清身體特徵與動作，再自行選擇。'],
 'primary-gu-action':['The pupil revises and explains the change. The teacher checks both sentences and decides whether more help is needed.','學生修訂並解釋修改，教師檢視兩句話，再決定是否仍需協助。'],
};
export function scenarioChoiceHtml() {
 return `<div class="scenario-choice" role="group" aria-label="Classroom scenario / 課堂情境"><button type="button" class="secondary" data-scenario-select="1" aria-pressed="true">${b('Scenario 1 · Primary English','情境一 · 小學英語')}</button><button type="button" class="secondary" data-scenario-select="2" aria-pressed="false">${b('Scenario 2 · College English','情境二 · 大學英語')}</button></div>`;
}
export function scenarioPromptButtonsHtml(primaryKey: string, collegeKey: string, collegeEn: string, collegeZh: string) {
 const primary = primaryExamples[primaryKey];
 if(!primary || !collegeEn || !collegeZh)throw new Error(`Missing classroom example: ${primaryKey}`);
 const feedback = collegeKey.startsWith('feedback-');
 const improve = collegeKey === 'feedback-self';
 return `<div class="scenario-prompts scenario-example-prompts">${[
  {number:'1',key:primaryKey,en:primary[0],zh:primary[1]},
  {number:'2',key:collegeKey,en:collegeEn,zh:collegeZh},
 ].map(s=>`<div data-model-scenario="${s.number}"${s.number==='2'?' hidden':''}><p class="scenario-example-label">${b('Scenario '+s.number+' · '+(improve?'Feedback to improve':feedback?'Example feedback':'Classroom example'),'情境'+(s.number==='1'?'一':'二')+' · '+(improve?'有待改進的回饋':feedback?'回饋例子':'課堂例子'))}</p><${feedback?'blockquote':'p'} class="scenario-example-text">${b(s.en,s.zh)}</${feedback?'blockquote':'p'}><button type="button" class="secondary" data-framework-copy="${e(s.key)}">${b('Copy AI prompt: Scenario '+s.number,'複製AI指令：情境'+(s.number==='1'?'一':'二'))}</button><p class="status" role="status"></p></div>`).join('')}</div>`;
}
