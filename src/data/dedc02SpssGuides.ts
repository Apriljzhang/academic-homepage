import type { CoreText } from './dedc02QuantCoreLesson';
export interface SpssStep { click: string; explanation: CoreText; }
export interface SpssOutput { table: string; read: CoreText; }
export interface SpssSource { label: string; url: string; }
export interface SpssWorkflow {
 id: string; title: CoreText; question: CoreText; layout: CoreText; menu: string;
 steps: SpssStep[]; output: SpssOutput[]; checks: CoreText[]; sources: SpssSource[];
}
export interface SpssGuide { method: string; workflows: SpssWorkflow[]; }
const ibm=(topic:string,version='30.0.0')=>`https://www.ibm.com/docs/en/spss-statistics/${version}?topic=${topic}`;
export const spssPracticePath='/teaching/courses/dedc02/spss/topic8-practice.csv';
export const spssGuideBySlide: Record<string,SpssGuide>={
 'ttest-output':{method:'ttest',workflows:[
  {id:'independent',title:['Independent-samples t-test','獨立樣本 t 檢定'],question:['Do quiet-room and music-room learners have different mean quiz scores?','安靜室與音樂室學習者的平均小測分數是否不同？'],layout:['One row per learner. quiz is the score; study_group identifies unrelated groups: 1 = quiet room, 2 = music room. The practice file also contains group 3, which this test excludes.','每列一位學習者。quiz為分數；study_group表示不同人的組別：1 = 安靜室、2 = 音樂室。練習檔亦有第3組，本次檢定不納入。'],menu:'Analyze → Compare Means and Proportions → Independent-Samples T Test…',steps:[
   {click:'Analyze → Compare Means and Proportions → Independent-Samples T Test…',explanation:['Open the independent-samples dialog. If your menu says Compare Means, use that submenu instead.','開啟獨立樣本對話框。若選單名為Compare Means，便從該子選單進入。']},
   {click:'Test Variable(s): quiz; Grouping Variable: study_group',explanation:['Select a variable in the left list and use the arrow to move it into its box. The score and group code go in different boxes.','在左邊選取变量，用箭嘴移至指定方框；分數與組別代碼放在不同位置。']},
   {click:'Define Groups… → Use specified values → Group 1: 1; Group 2: 2 → Continue',explanation:['Type the stored codes, not the labels “quiet” and “music”. The comparison is group 1 minus group 2; only these 24 learners enter this test.','輸入儲存的代碼1和2，而非quiet及music標籤。比較方向為第1組減第2組，只納入這24人。']},
   {click:'Options… → Confidence Interval Percentage: 95 → Continue',explanation:['Keep 95% for the mean-difference CI. For one outcome, cases missing its score or group are excluded.','平均差的置信區間設為95%；單一結果分析會排除分數或組別缺失的個案。']},
   {click:'Estimate effect sizes; Homogeneity of variance test (if shown)',explanation:['Request effect sizes when available. In version 31+, select the homogeneity checkbox for Levene’s test; older versions include it automatically.','如有選項，要求效應量。31版起須勾選方差齊性檢定以取得Levene結果；較早版本會自動提供。']},
   {click:'OK',explanation:['The Output Viewer opens with descriptive and test tables. Keep all numbers for the chosen t-test version on the same row.','Output Viewer會產生描述及檢定表；所選t檢定版本的數值須取自同一列。']},
  ],output:[
   {table:'Group Statistics',read:['Find N, Mean and Std. Deviation for each group. This practice comparison has N = 12 per group.','找各組N、Mean及Std. Deviation；此練習每組N = 12。']},
   {table:'Independent Samples Test',read:['Equal variances not assumed is the Welch row. Read t, df, Two-Sided p / Sig. (2-tailed), Mean Difference and both CI limits from that row when reporting Welch.','Equal variances not assumed是Welch列；報Welch時，t、df、雙側p、Mean Difference及置信區間上下限均取自這一列。']},
   {table:'Homogeneity of Variance Test / Levene’s Test',read:['This tests equal variances, not equal means. Its Sig. is not the p-value for the mean difference.','此表檢定方差是否相等，不是平均數是否相等；其Sig.不是平均差的p值。']},
   {table:'Independent Samples Effect Sizes (when requested)',read:['Read the named effect-size estimate and its interval. Record the standardiser and comparison direction.','讀具名效應量估計及區間，記下標準化分母及比較方向。']},
  ],checks:[['Inspect group distributions and unusual scores. Welch can be specified without using a preliminary Levene p-value as an automatic switch; the pooled row requires the equal-variance assumption.','檢視各組分佈及異常值。可事先指定Welch，不必把Levene的p當自動切換開關；合併方差列需要方差相等假設。']],sources:[
   {label:'IBM: Independent-Samples T Test',url:ibm('tests-independent-samples-t-test','31.0.0')},
   {label:'IBM: Define Groups',url:ibm('test-independent-samples-t-define-groups')},
   {label:'IBM: T-TEST output',url:ibm('test-overview-t-command')},
   {label:'IBM: version 31 interface changes',url:ibm('overview-whats-new-in-spss-statistics','31.0.0')},
  ]},
  {id:'paired',title:['Paired-samples t-test','配對樣本 t 檢定'],question:['Do the same learners’ mean scores change after a workshop?','同一批學習者工作坊前後的平均分數是否改變？'],layout:['One row per learner, with before and after in two columns. Keep each person’s scores on the same row; this example uses all 36 learners.','每列一人，before及after分別為前後測兩欄；同一人的數值必須放在同一列，本例用全部36人。'],menu:'Analyze → Compare Means and Proportions → Paired-Samples T Test…',steps:[
   {click:'Analyze → Compare Means and Proportions → Paired-Samples T Test…',explanation:['Open the paired dialog; use Compare Means if that is your submenu’s name.','開啟配對對話框；如你的子選單名為Compare Means，使用該名稱。']},
   {click:'Paired Variables → Variable1: after; Variable2: before',explanation:['Select the two variables and move them into one pair. Putting after first makes the reported difference after minus before.','選兩個变量並移入同一對；after放第一，報告差值便是後測減前測。']},
   {click:'Options… → Confidence Interval Percentage: 95 → Continue',explanation:['Keep a 95% CI. A learner needs both scores to enter this paired comparison.','保留95%置信區間；每位學習者必須有兩個分數才會納入此配對比較。']},
   {click:'Estimate effect sizes → Standard deviation of the difference (if available)',explanation:['For this walkthrough, use the SD of the within-person differences as the standardiser. Name this paired-d definition when reporting; it differs from independent-groups d.','此指引以個人前後差值的SD作分母。報告時說明這個配對d定義，它與獨立組別d不同。']},
   {click:'OK',explanation:['SPSS produces paired descriptives, a correlations table and the paired-difference test.','SPSS產生配對描述統計、相關表及配對差值檢定。']},
  ],output:[
   {table:'Paired Samples Statistics',read:['Read Mean, N and Std. Deviation for after and before; N = 36 in the complete practice file.','讀after及before的Mean、N和Std. Deviation；完整練習檔N = 36。']},
   {table:'Paired Samples Test',read:['Read Paired Differences: Mean, its 95% CI, t, df and the two-sided p. With 36 complete pairs, df = 35.','讀Paired Differences中的Mean、95%置信區間、t、df及雙側p；36對完整資料的df = 35。']},
   {table:'Paired Samples Correlations',read:['This shows how before and after scores correlate. Its significance does not test whether the mean changed.','此表顯示前後測相關；其顯著性不是檢定平均數有否改變。']},
   {table:'Paired Samples Effect Sizes (when requested)',read:['Read Cohen’s d or Hedges’ correction and its CI, checking that the selected standardiser matches your report.','讀Cohen d或Hedges校正及其置信區間，確認所選標準化分母與報告一致。']},
  ],checks:[['Check the distribution of after − before, especially for a small sample. Neither the correlation table nor two separate SDs replace this check.','檢視after − before的分佈，小樣本尤其重要；相關表及兩個單獨SD不能取代此檢查。']],sources:[
   {label:'IBM: Paired-Samples T Test and effect-size standardisers',url:ibm('tests-paired-samples-t-test')},
   {label:'IBM: paired-test options',url:ibm('test-paired-samples-t-options','32.0.0')},
   {label:'IBM: T-TEST output',url:ibm('test-overview-t-command')},
  ]},
 ]},
 'correlation-output':{method:'correlation',workflows:[
  {id:'bivariate',title:['Pearson or Spearman correlation','Pearson或Spearman相關'],question:['Do learners who study longer tend to have higher quiz scores?','溫習較久的學習者，小測分數是否傾向較高？'],layout:['One row per learner; study_hours and quiz are two measurements for that same person. No grouping variable is needed.','每列一人，study_hours及quiz是同一人的兩個測量，不需要組別变量。'],menu:'Analyze → Correlate → Bivariate…',steps:[
   {click:'Graphs → Chart Builder… → Scatter/Dot → Simple Scatter',explanation:['Drag the chart into the preview, study_hours onto X and quiz onto Y; click OK. Inspect the shape and unusual points before choosing the coefficient.','把散點圖拖入預覽，study_hours放X軸、quiz放Y軸，按OK；先看形狀及異常點，再選係數。']},
   {click:'Analyze → Correlate → Bivariate… → Variables: study_hours, quiz',explanation:['Select both variables and use the arrow to put them together in Variables.','選兩個变量，用箭嘴一同移至Variables。']},
   {click:'Correlation Coefficients: Pearson; Test of Significance: Two-tailed',explanation:['Use Pearson for the planned linear association. For a rank-based monotonic question, select Spearman instead and label it accordingly; do not choose by whichever p is smaller.','此處計劃研究線性關聯，選Pearson。若問題針對秩次的單調關係，改選Spearman並清楚標示；不可按哪個p較小才選。']},
   {click:'Options… → Means and standard deviations (Pearson); Exclude cases pairwise → Continue',explanation:['For Pearson, request means/SD when offered. This example uses complete pairs. With several variables, pairwise deletion can give different N per correlation; listwise uses a common complete set.','Pearson如有選項便要求平均數／SD。本例只用完整配對；多变量時，逐對排除可使每個相關的N不同，逐列排除則使用共同完整個案。']},
   {click:'Confidence Interval… → Estimate confidence interval… → 95 → Continue (if available)',explanation:['Request the coefficient’s CI and keep the selected method recorded. This dialog was added in 27.0.1; an older version may not have it.','要求係數置信區間並記錄所選方法；此對話框自27.0.1加入，較舊版未必有。']},
   {click:'OK',explanation:['Read the off-diagonal cell linking study_hours and quiz, not the diagonal 1.000 for a variable correlated with itself.','讀study_hours與quiz交叉的非對角格，不要讀变量與自己相關的對角線1.000。']},
  ],output:[
   {table:'Scatterplot',read:['Look for a roughly straight pattern for Pearson, or a consistently rising/falling pattern for Spearman; inspect outliers.','Pearson看大致直線模式，Spearman看持續上升／下降模式，並檢視異常點。']},
   {table:'Descriptive Statistics (when requested)',read:['Read each variable’s mean and SD. Its individual N can differ from the complete-pair N when data are missing.','讀各变量平均數及SD；有缺失時，單一变量N可能與完整配對N不同。']},
   {table:'Correlations / Nonparametric Correlations',read:['Find Pearson Correlation or Spearman’s rho, Sig. (2-tailed) and N. The complete practice data give N = 36.','找Pearson Correlation或Spearman’s rho、Sig. (2-tailed)及N；完整練習資料N = 36。']},
   {table:'Confidence interval output (when requested)',read:['Record lower and upper bounds for that same coefficient. Do not treat a CI for a variable’s mean as a CI for r.','記錄同一係數的上下限；不要把某变量平均數的置信區間當成r的置信區間。']},
  ],checks:[['A significant correlation does not establish causation. Report which coefficient you ran; the star beside it is not its effect size.','相關顯著不代表因果；報清楚所用係數，旁邊星號不是效應量。']],sources:[
   {label:'IBM: scatterplot in Chart Builder',url:ibm('data-effects-transformations','32.0.0')},
   {label:'IBM: Bivariate Correlations',url:ibm('features-bivariate-correlations')},
   {label:'IBM: correlation options and missing values',url:ibm('correlations-bivariate-options','32.0.0')},
   {label:'IBM: correlation confidence intervals',url:ibm('correlations-bivariate-confidence-interval','32.0.0')},
   {label:'IBM: 27.0.1 confidence-interval addition',url:'https://community.ibm.com/community/user/blogs/brent-gardiner/2020/11/03/whats-new-in-spss-statistics-27010?hlmlt=VT'},
  ]},
 ]},
 'anova-output':{method:'anova',workflows:[
  {id:'oneway',title:['One-way ANOVA and follow-up comparisons','單因子ANOVA及後續比較'],question:['Do mean quiz scores differ across quiet-room, music-room and café learners?','安靜室、音樂室及咖啡店學習者的平均小測分數是否不同？'],layout:['One row per learner. quiz is the score; study_group is one factor with three codes: 1 = quiet, 2 = music, 3 = café.','每列一人；quiz是分數，study_group是單一因素，有三個代碼：1 = 安靜室、2 = 音樂室、3 = 咖啡店。'],menu:'Analyze → Compare Means and Proportions → One-Way ANOVA…',steps:[
   {click:'Analyze → Compare Means and Proportions → One-Way ANOVA…',explanation:['Use Compare Means if that is the submenu name in your version.','如你的版本子選單名為Compare Means，便使用該名稱。']},
   {click:'Dependent List: quiz; Factor: study_group',explanation:['Move the score into Dependent List and the three-level grouping variable into Factor. Do not enter the three groups as separate score columns.','分數放Dependent List，三水平組別变量放Factor；不要把三組分數分成三欄輸入。']},
   {click:'Options… → Descriptive; Homogeneity of variance test; Welch; Means plot → Continue',explanation:['Request group summaries, Levene’s test, a robust overall test and a means chart. Keep 95% confidence where offered.','要求各組摘要、Levene檢定、穩健整體檢定及平均數圖；如有置信水平選項，保留95%。']},
   {click:'Post Hoc… → Tukey OR Games-Howell → Continue',explanation:['Choose Tukey for a justified equal-variance analysis, or Games-Howell for unequal variances alongside Welch. Use the planned procedure, not both to hunt for significance.','方差相等有理據時用Tukey；方差不等時配合Welch用Games-Howell。按計劃選程序，不要兩種都試來找顯著。']},
   {click:'Estimate effect size for overall tests (if available)',explanation:['Select this main-dialog option to request ANOVA Effect Sizes. Availability and wording vary across versions.','如主對話框有此選項，勾選以取得ANOVA Effect Sizes；版本間可用性及文字不同。']},
   {click:'OK',explanation:['SPSS produces the overall tests and the requested pairwise comparisons. Match the output table to the analysis you intend to report.','SPSS產生整體檢定及所要求的兩兩比較；按計劃報告的分析選相應輸出表。']},
  ],output:[
   {table:'Descriptives / Means Plot',read:['Find each group’s N, mean and SD; this practice file has three groups of 12. The plot helps show direction.','找各組N、平均數及SD；此練習有三組，每組12人，圖形有助顯示方向。']},
   {table:'Test of Homogeneity of Variances',read:['Read the Levene result as evidence about equal variances, not as the test of mean differences. Inspect distributions and group sizes too.','Levene結果是方差相等的證據，不是平均差檢定；亦要看分佈及各組人數。']},
   {table:'ANOVA OR Robust Tests of Equality of Means',read:['For the conventional test, read F, between/within df and Sig. from ANOVA. For Welch, read Statistic, df1, df2 and Sig. from the Welch row in Robust Tests.','傳統檢定從ANOVA讀F、組間／組內df及Sig.；Welch則從Robust Tests的Welch列讀Statistic、df1、df2及Sig.。']},
   {table:'Multiple Comparisons',read:['Read the chosen method’s (I) group, (J) group, Mean Difference (I−J), adjusted Sig. and CI. This identifies specific comparisons beyond the overall test.','讀所選方法的(I)組、(J)組、Mean Difference (I−J)、調整後Sig.及置信區間；這回答整體檢定以外的具體比較。']},
   {table:'ANOVA Effect Sizes (when requested)',read:['Name the reported effect size and CI. The conventional ANOVA effect-size table is not automatically a Welch-specific effect-size estimate.','說明報告的效應量名稱及置信區間；傳統ANOVA效應量表不會自動變成Welch專用效應量估計。']},
  ],checks:[['A significant overall test does not mean every pair differs. Keep the chosen overall test and follow-up method clear; do not copy an effect size without checking its definition.','整體顯著不表示每一對都不同；須分清所選整體檢定及後續方法，效應量亦須先確認定義。']],sources:[
   {label:'IBM: One-Way ANOVA and effect-size option',url:ibm('features-one-way-anova')},
   {label:'IBM: ANOVA options, Levene and Welch',url:ibm('anova-one-way-options')},
   {label:'IBM: post hoc tests, Tukey and Games-Howell',url:ibm('anova-one-way-post-hoc-tests','31.0.0')},
  ]},
 ]},
 'chi-output':{method:'chi',workflows:[
  {id:'crosstabs',title:['Chi-square test of independence through Crosstabs','用Crosstabs做卡方獨立性檢定'],question:['Is study environment associated with preferring video or text?','溫習環境是否與偏好影片或文字相關？'],layout:['One row per learner. study_group has three categories; preference is 1 = video, 2 = text. Use individual records without weighting.','每列一人；study_group有三類，preference為1 = 影片、2 = 文字。使用個人紀錄，不加權。'],menu:'Analyze → Descriptive Statistics → Crosstabs…',steps:[
   {click:'Analyze → Descriptive Statistics → Crosstabs…',explanation:['Use this two-variable independence route. It differs from a one-variable goodness-of-fit chi-square procedure.','使用此兩变量獨立性檢定路徑；它與單一变量的卡方適合度檢定不同。']},
   {click:'Row(s): study_group; Column(s): preference',explanation:['Move the group code into rows and preference into columns. With this layout, row percentages compare preferences within each group.','組別代碼放列，偏好放欄；此排列的列百分比可比較各組內的偏好。']},
   {click:'Statistics… → Chi-square; Phi and Cramer’s V → Continue',explanation:['Request the test and an association-size measure. These produce Chi-Square Tests and Symmetric Measures.','勾選檢定及關聯大小指標，產生Chi-Square Tests與Symmetric Measures。']},
   {click:'Cells… → Counts: Observed, Expected; Percentages: Row → Continue',explanation:['Show actual counts, the no-association baseline and each group’s percentages. Leave Create APA style table off if it disables those cell choices.','顯示實際人數、無關聯基準及各組百分比。如Create APA style table會停用上述選項，先不要勾選。']},
   {click:'OK',explanation:['The practice crosstab is 3 × 2. Each group has 12 people; there are 18 video and 18 text preferences, so every expected count is 6.','練習表為3 × 2，每組12人；總共18人選影片、18人選文字，因此每格期望次數都是6。']},
   {click:'Chi-Square Tests → expected-count footnote; Exact… if needed and available',explanation:['Inspect expected counts before using the asymptotic p-value. Sparse tables may need Fisher’s exact test (2 × 2) or an exact/Monte Carlo procedure; availability depends on edition and platform.','使用漸近p前先看期望次數；稀疏表可能需要2 × 2的Fisher精確檢定，或精確／Monte Carlo程序，功能視版本及平台而定。']},
  ],output:[
   {table:'Case Processing Summary',read:['Check Valid N and Missing. This complete practice dataset should give Valid N = 36.','檢查Valid N及Missing；此完整練習資料應為Valid N = 36。']},
   {table:'study_group × preference Crosstabulation',read:['Compare Count, Expected Count and % within study_group. Row percentages use that row’s 12 learners as denominator.','比較Count、Expected Count及% within study_group；列百分比以該列12人作分母。']},
   {table:'Chi-Square Tests → Pearson Chi-Square',read:['Read Value (χ²), df and Asymptotic Significance (2-sided). Here df = (3−1)(2−1) = 2. Read the expected-count footnote below the table.','讀Value（χ²）、df及Asymptotic Significance (2-sided)；此處df = (3−1)(2−1) = 2，並看表下期望次數註解。']},
   {table:'Symmetric Measures → Cramer’s V',read:['Read the Value as association size. Use the crosstab percentages for the pattern; V has no positive/negative direction.','Value為關聯大小；模式看列聯表百分比，V沒有正負方向。']},
  ],checks:[['For this practice, observed video/text counts are 9/3, 6/6 and 3/9, but expected counts are 6/6 in every group. Expected means the no-association baseline, not a target someone hopes to reach.','此練習實際影片／文字人數為9／3、6／6、3／9，期望則每組都是6／6。「期望」是無關聯基準，不是希望達到的目標。'],['Do not enter before/after responses from the same person as unrelated cases. A paired yes/no question needs an appropriate paired categorical analysis.','不可把同一人的前後反應當成互不相關個案；配對是／否問題需要合適的配對類別分析。']],sources:[
   {label:'IBM: running Crosstabs',url:ibm('relationships-running-analysis')},
   {label:'IBM: Crosstabs statistics and Cramér’s V',url:ibm('crosstabs-statistics')},
   {label:'IBM: cell counts and percentages',url:ibm('crosstabs-cell-display','32.0.0')},
   {label:'IBM: obtaining exact tests',url:ibm('tests-obtaining-exact','32.0.0')},
  ]},
 ]},
};
