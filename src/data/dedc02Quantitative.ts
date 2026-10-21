import { methods, families } from './dedc02QuantGeneral';
export { methods, families };
export type QuantMethod = (typeof methods)[number];
export type Language = 'en' | 'zh';
export const jars = [
 ['purpose','Questions, hypotheses and status','研究問題、假設與分析狀態','Name the target quantities; distinguish primary, secondary and exploratory analyses.','說明目標量；區分主要、次要與探索性分析。'],
 ['design','Design, sampling and setting','設計、取樣與情境','Describe recruitment, inclusion/exclusion, selection, settings and dates.','交代招募、納入／排除、選取方式、情境與日期。'],
 ['sample','Sample size, power and precision','樣本量、檢定力與精確度','Explain intended and achieved sample sizes and their rationale; report participant flow.','說明預定與實得樣本量及理據，報告參與者流程。'],
 ['ethics','Ethics and data collection','倫理與資料收集','Identify ethical review, consent and procedures relevant to the study.','交代倫理審查、同意及相關收集程序。'],
 ['measures','Measures and scoring','測量與計分','Define variables, covariates, units, item coding and composite-score rules.','界定变量、協变量、單位、項目編碼與合成分數規則。'],
 ['quality','Measurement evidence','測量證據','Report relevant reliability in the current sample and validity/comparability evidence.','報告當前樣本中相關信度，以及效度／可比性證據。'],
 ['missing','Missingness and exclusions','缺失與排除','Report amounts/patterns, handling, outlier decisions, exclusions and final analysis n.','交代缺失數量／模式、處理、離群值決定、排除及最終分析人數。'],
 ['model','Model, estimand and estimation','模型、目標量與估計','Specify variables, contrasts, estimators, dependence, weighting and transformations.','明確說明变量、對比、估計法、依賴、權重與轉換。'],
 ['diagnostics','Assumptions and diagnostics','假設與診斷','Explain relevant checks, estimation failures and responses to violations.','說明相關檢查、估計失敗與違反假設的處理。'],
 ['results','Descriptives and all relevant results','描述與相關結果','Provide sample summaries and planned results, including non-significant findings.','提供樣本摘要與預定結果，包括不顯著的發現。'],
 ['uncertainty','Magnitude and uncertainty','大小與不確定性','Report estimates, units, intervals, effect sizes and inferential statistics as applicable.','按適用情況報告估計、單位、區間、效果量與推論統計量。'],
 ['multiplicity','Multiplicity and sensitivity','多重性與敏感度','Disclose multiple tests, adjustments, alternative models and unplanned changes.','披露多重檢定、調整、替代模型與未預定改動。'],
 ['presentation','Tables, figures and reproducibility','表圖與可重現性','Label units, n, intervals and notes; identify software, versions and access to data/materials/code where appropriate.','標示單位、人數、區間及註釋；適當交代軟件、版本與資料／材料／程式的取得方式。'],
 ['claims','Interpretation and limitations','詮釋與限制','Discuss precision, generalisability, alternatives and design-based limits on causal claims.','討論精確度、概化、替代解釋與設計對因果主張的限制。'],
].map(([id,en,zh,detail,detailZh])=>({id,en,zh,detail,detailZh}));
export const examples = ['regression','logistic','mediation','moderation','cfa','sem','lpa','mixed','meta'];
