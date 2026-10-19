import rawMethods from './dedc02QuantMethods.json';
export const methods = rawMethods;
export type QuantMethod = (typeof methods)[number];
export type Language = 'en' | 'zh';
export const families = [
  ['describe','Describe a sample','描述樣本','What patterns occur?','樣本呈現甚麼模式？'],
  ['compare','Compare groups or conditions','比較組別或條件','Which outcomes differ?','哪些結果有差異？'],
  ['relate','Relate variables and predict outcomes','變量關聯與結果預測','What is the target outcome and relationship?','目標結果與關係是甚麼？'],
  ['pathways','Pathways and interactions','路徑與交互作用','Through which pathway, or under what conditions?','透過哪條路徑，或在何種條件下？'],
  ['constructs','Constructs and structural models','構念與結構模型','What do indicators measure, and how do constructs relate?','指標測量甚麼？構念如何相關？'],
  ['measurement','Assessment and score interpretation','評核與分數解釋','What do items, raters and score decisions contribute?','項目、評分者與分數決策各有甚麼作用？'],
  ['profiles','Profiles and grouping','剖面與分群','Which patterns distinguish cases?','哪些模式區分不同個案？'],
  ['change','Change and temporal relations','變化與時間關係','How do processes change or precede one another?','過程如何變化，或具有甚麼時間先後關係？'],
  ['dependence','Nested or repeated observations','巢套或重複觀察','Which level of association is the target?','目標是哪一層次的關聯？'],
  ['networks','Networks and sequences','網絡與序列','What connects, co-occurs or follows what?','哪些元素連結、共現或接續？'],
  ['configurations','Combinations of conditions','條件組合','Which configurations are sufficient or necessary?','哪些組態具有充分或必要關係？'],
  ['viewpoints','Shared viewpoints','共享觀點','Which whole rankings express a shared perspective?','哪些完整排序表達共享觀點？'],
  ['prediction','Prediction on new cases','新個案的預測','How well do models predict held-out outcomes?','模型對保留樣本的預測表現如何？'],
  ['text','Linguistic feature measurement','語言特徵測量','How will texts become defensible measurements?','如何把文本轉成可辯護的測量？'],
  ['synthesis','Synthesis across studies','跨研究統合','What do accumulated estimates and publications show?','累積估計與出版文獻顯示甚麼？'],
  ['support','Estimation and uncertainty','估計與不確定性','How will estimates be obtained and qualified?','如何取得及限定估計？'],
].map(([id,en,zh,prompt,promptZh])=>({id,en,zh,prompt,promptZh}));
export const jars = [
 ['purpose','Questions, hypotheses and status','研究問題、假設與分析狀態','Name the target quantities; distinguish primary, secondary and exploratory analyses.','說明目標量；區分主要、次要與探索性分析。'],
 ['design','Design, sampling and setting','設計、取樣與情境','Describe recruitment, inclusion/exclusion, selection, settings and dates.','交代招募、納入／排除、選取方式、情境與日期。'],
 ['sample','Sample size, power and precision','樣本量、檢定力與精確度','Explain intended and achieved sample sizes and their rationale; report participant flow.','說明預定與實得樣本量及理據，報告參與者流程。'],
 ['ethics','Ethics and data collection','倫理與資料收集','Identify ethical review, consent and procedures relevant to the study.','交代倫理審查、同意及相關收集程序。'],
 ['measures','Measures and scoring','測量與計分','Define variables, covariates, units, item coding and composite-score rules.','界定變量、協變量、單位、項目編碼與合成分數規則。'],
 ['quality','Measurement evidence','測量證據','Report relevant reliability in the current sample and validity/comparability evidence.','報告當前樣本中相關信度，以及效度／可比性證據。'],
 ['missing','Missingness and exclusions','缺失與排除','Report amounts/patterns, handling, outlier decisions, exclusions and final analysis n.','交代缺失數量／模式、處理、離群值決定、排除及最終分析人數。'],
 ['model','Model, estimand and estimation','模型、目標量與估計','Specify variables, contrasts, estimators, dependence, weighting and transformations.','明確說明變量、對比、估計法、依賴、權重與轉換。'],
 ['diagnostics','Assumptions and diagnostics','假設與診斷','Explain relevant checks, estimation failures and responses to violations.','說明相關檢查、估計失敗與違反假設的處理。'],
 ['results','Descriptives and all relevant results','描述與相關結果','Provide sample summaries and planned results, including non-significant findings.','提供樣本摘要與預定結果，包括不顯著的發現。'],
 ['uncertainty','Magnitude and uncertainty','大小與不確定性','Report estimates, units, intervals, effect sizes and inferential statistics as applicable.','按適用情況報告估計、單位、區間、效果量與推論統計量。'],
 ['multiplicity','Multiplicity and sensitivity','多重性與敏感度','Disclose multiple tests, adjustments, alternative models and unplanned changes.','披露多重檢定、調整、替代模型與未預定改動。'],
 ['presentation','Tables, figures and reproducibility','表圖與可重現性','Label units, n, intervals and notes; identify software, versions and access to data/materials/code where appropriate.','標示單位、人數、區間及註釋；適當交代軟件、版本與資料／材料／程式的取得方式。'],
 ['claims','Interpretation and limitations','詮釋與限制','Discuss precision, generalisability, alternatives and design-based limits on causal claims.','討論精確度、概化、替代解釋與設計對因果主張的限制。'],
].map(([id,en,zh,detail,detailZh])=>({id,en,zh,detail,detailZh}));
export const examples = ['regression','mediation','moderation','sem','lpa','mixed','rasch','ena','qca'];
