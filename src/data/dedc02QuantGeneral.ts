// General teaching catalogue. The separate vault inventory retains the full
// record of specialist applications and supporting procedures.
import rawMethods from './dedc02QuantMethods.json';

// Core organisation follows UCLA OARC's outcome/predictor decision table.
// Additional branches extend that structure to the advanced methods in this lesson.
export const families = [
 ['describe','Describe one sample','描述單一樣本','What does the sample distribution show?','樣本分佈顯示甚麼？','core','One or more','一個或多個','None required','不一定需要','Continuous or categorical','連續或類別'],
 ['compare','One outcome: compare groups','一個結果：比較組別','Do group means or rank distributions differ?','組別平均數或秩次分佈是否不同？','core','One','一個','Categorical groups; optional covariates','類別組別；可加入協變量','Continuous or ordinal','連續或序位'],
 ['categorical','One categorical outcome','一個類別結果','Are categories associated, or what predicts category probabilities?','類別之間有關聯嗎？甚麼預測各類別的機率？','core','One','一個','Categorical, continuous or mixed','類別、連續或混合','Binary, ordered or unordered categories','二元、有序或無序類別'],
 ['relate','One continuous outcome: association or regression','一個連續結果：相關或迴歸','How does a continuous outcome vary with the predictors?','連續結果如何隨預測變量改變？','core','One','一個','Continuous, categorical or mixed','連續、類別或混合','Continuous','連續'],
 ['multivariate','Several continuous outcomes','多個連續結果','Do groups differ across outcomes considered jointly?','把多個結果一併考慮時，組別是否有差異？','core','Two or more','兩個或以上','Categorical groups; optional covariates','類別組別；可加入協變量','Several continuous outcomes','多個連續結果'],
 ['constructs','Many indicators: dimensions and measurement','多個指標：維度與測量','What structure underlies the indicators?','指標背後有何結構？','core','No single designated outcome','不指定單一結果','Several observed indicators','多個觀察指標','Continuous or categorical indicators','連續或類別指標'],
 ['change','Repeated outcomes across time','跨時點重複結果','How do outcomes change or relate across occasions?','結果如何隨時點變化或互相關聯？','core','One or more, repeatedly measured','一個或多個，重複測量','Time, groups or prior measurements','時間、組別或先前測量','Repeated continuous outcomes or time series','重複連續結果或時間序列'],
 ['pathways','Indirect effects, interactions and SEM','間接效果、交互作用與SEM','Through which pathway, or under which conditions, are variables related?','變量透過哪條路徑、或在何種條件下有關？','extension','One or a system of outcomes','一個結果或結果系統','Predictors, mediators, moderators or latent constructs','預測、中介、調節變量或潛在構念','Observed or latent outcomes','觀察或潛在結果'],
 ['count','Event counts and rates','事件次數與發生率','What predicts the expected count or rate?','甚麼預測預期次數或發生率？','extension','One','一個','Continuous, categorical or mixed','連續、類別或混合','Non-negative counts; exposure if needed','非負計數；按需要加入暴露量'],
 ['profiles','Clusters, latent profiles and latent classes','群集、潛在剖面與潛在類別','Which cases show similar multivariate patterns?','哪些個案呈現相似的多變量模式？','extension','No designated outcome for grouping','分群時不指定結果','Several grouping indicators','多個分群指標','Continuous for LPA; categorical for LCA','LPA用連續指標；LCA用類別指標'],
 ['dependence','Nested, crossed or otherwise correlated observations','巢套、交叉或其他相關觀察','How should the model represent dependence?','模型應如何表達依賴？','extension','One or more correlated outcomes','一個或多個相關結果','Predictors plus person/group/item structure','預測變量加個人／群體／項目結構','Match the response distribution and link','配合結果分佈及連結函數'],
 ['survival','Time until an event','事件發生前的時間','How long until an event occurs?','事件發生前需多久？','extension','One event-time outcome','一個事件時間結果','Continuous, categorical or mixed','連續、類別或混合','Time plus event/censoring status','時間加事件／設限狀態'],
 ['networks','Conditional relationships in a system','系統中的條件關係','Which variables remain associated conditional on the others?','在其他變量條件下，哪些變量仍有關聯？','extension','No single designated outcome','不指定單一結果','Variables treated as nodes','把變量視為節點','Joint multivariate observations','聯合多變量觀察'],
 ['prediction','Prediction for unseen cases','預測未見過的個案','How accurate are predictions on held-out data?','對保留資料的預測有多準確？','extension','One or more','一個或多個','Features with independent validation','特徵加獨立驗證','Continuous or categorical','連續或類別'],
 ['synthesis','Effect estimates from several studies','多項研究的效果估計','What do study estimates show together?','研究估計綜合顯示甚麼？','extension','Study effect estimates','研究效果估計','Study characteristics or none','研究特徵或沒有','Effect estimates and sampling variances','效果估計及抽樣變異數'],
 ['support','Estimation and uncertainty across models','跨模型的估計與不確定性','How will parameters and uncertainty be estimated?','如何估計參數及不確定性？','extension','Defined by the substantive model','由實質模型決定','Defined by the substantive model','由實質模型決定','Must respect the model and sampling structure','須配合模型與取樣結構'],
].map(([id,en,zh,prompt,promptZh,section,outcomes,outcomesZh,predictors,predictorsZh,outcomeType,outcomeTypeZh])=>({id,en,zh,prompt,promptZh,section,outcomes,outcomesZh,predictors,predictorsZh,outcomeType,outcomeTypeZh}));

// id, branch, general introduction (English / Chinese), question (English / Chinese)
const introductions = [
  ['describe','describe','Summarises frequencies, central tendency, spread and the shape of a distribution.','概括次數、集中趨勢、離散程度及分佈形態。','What are the typical values, variability and distribution of the variables?','變量的典型值、變異程度及分佈如何？'],
  ['ttest','compare','Compares two means, using independent groups or paired differences according to the design.','按設計，以獨立組別或配對差值比較兩個平均數。','Do two independent groups differ in their means, or is the mean paired difference zero?','兩個獨立組別的平均數是否不同？配對差值的平均數是否為零？'],
  ['anova','compare','Compares means across groups and can estimate the main effects and interactions of categorical factors.','比較各組平均數，亦可估計類別因素的主效應及交互作用。','Do means differ across groups or combinations of categorical factors?','不同組別或類別因素組合的平均數是否有差異？'],
  ['ancova','compare','Uses a regression model to compare group means conditional on specified covariates.','以迴歸模型比較在指定協變量條件下的組別平均數。','How do group means compare after adjusting for specified covariates?','調整指定協變量後，各組平均數如何比較？'],
  ['manova','compare','Tests group differences in a set of continuous outcomes jointly; MANCOVA adds covariates.','聯合檢驗多個連續結果的組別差異；MANCOVA另納入協變量。','Do groups differ on a set of continuous outcomes considered together?','把多個連續結果一併考慮時，組別是否有差異？'],
  ['rank','compare','Uses ranks to test specified distributional or location hypotheses, with the test chosen for the grouping and pairing.','以秩次檢驗指定的分佈或位置假設，並按分組及配對結構選擇檢定。','Do independent or paired observations differ under a rank-based hypothesis?','在秩次檢定的假設下，獨立或配對觀察是否有差異？'],
  ['chi','compare','Compares observed category counts with expected counts under a stated model, including independence in a contingency table.','比較觀察類別次數與指定模型下的期望次數，包括列聯表中的獨立性。','Are two categorical variables associated, or do category frequencies fit an expected distribution?','兩個類別變量是否有關聯？類別次數是否符合預期分佈？'],
  ['equivalence','compare','Tests whether a difference is contained within prespecified bounds of practical equivalence.','檢驗差異是否落在事先訂定的實質等效界限內。','Is the difference small enough to fall within prespecified equivalence bounds?','差異是否小至落在事先訂定的等效界限內？'],
  ['correlation','relate','Quantifies linear or monotonic association; partial correlation adjusts for specified other variables.','量化線性或單調關聯；偏相關則調整指定的其他變量。','How strong is the linear or monotonic association between variables?','變量之間的線性或單調關聯有多強？'],
  ['regression','relate','Models the conditional mean of a continuous outcome using one or more predictors. Hierarchical entry compares prespecified blocks.','以一個或多個預測變量分析連續結果的條件平均數；分塊投入可比較預定的變量組。','How does the expected value of a continuous outcome vary with one or more predictors?','連續結果的期望值如何隨一個或多個預測變量改變？'],
  ['logistic','relate','Models the log odds of a binary outcome and can express results as odds ratios or predicted probabilities.','分析二元結果的對數勝算，並可用勝算比或預測機率呈現結果。','How is the probability of a binary outcome related to predictors?','二元結果的發生機率與預測變量有何關係？'],
  ['ordinal','relate','Uses ordinal models for ordered categories and multinomial models for categories without an assumed order.','對有序類別使用序位模型，對沒有假定次序的類別使用多項模型。','How do predictors relate to the probabilities of ordered or unordered outcome categories?','預測變量與有序或無序結果類別的機率有何關係？'],
  ['count','relate','Models non-negative event counts using a suitable count distribution and accounts for exposure when required.','以合適的計數分佈分析非負事件次數，並在需要時考慮暴露量。','How does the expected number or rate of events vary with predictors?','事件的預期次數或發生率如何隨預測變量改變？'],
  ['gam','relate','Uses smooth functions to model nonlinear relationships without fixing a single straight-line form.','以平滑函數分析非線性關係，毋須限定為單一直線。','Does the outcome have a nonlinear relationship with a predictor?','結果與預測變量是否存在非線性關係？'],
  ['robust','relate','Uses an estimator designed to reduce the influence of some departures from an ordinary regression model.','使用特定估計法，減低某些偏離一般迴歸模型情況的影響。','How does the estimated relationship change under an appropriate robust regression estimator?','採用合適的穩健迴歸估計法後，估計關係如何改變？'],
  ['mediation','pathways','Represents an indirect association from X to Y through an intervening variable M; causal interpretation needs additional design assumptions.','表達X透過中介變量M與Y的間接關聯；因果解讀需要額外的設計假設。','Is an association between X and Y represented by an indirect pathway through M?','X與Y的關聯是否包含透過M的間接路徑？'],
  ['moderation','pathways','Includes an interaction to examine whether the association between X and Y changes with W.','納入交互作用，檢視X與Y的關聯是否隨W改變。','Does the association of X with Y differ across values of W?','X與Y的關聯是否隨W的數值而不同？'],
  ['conditional','pathways','Combines indirect pathways and interactions to estimate an indirect association at specified moderator values.','結合間接路徑與交互作用，估計在指定調節變量數值下的間接關聯。','Does the indirect association through M vary with a moderator?','透過M的間接關聯是否隨調節變量改變？'],
  ['efa','constructs','Explores common latent factors that may account for covariance among observed indicators.','探索可解釋觀察指標共變關係的共同潛在因素。','What latent dimensions could account for covariance among the indicators?','哪些潛在維度可解釋指標之間的共變關係？'],
  ['cfa','constructs','Tests a prespecified pattern of relationships between indicators and latent factors.','檢驗事先設定的指標與潛在因素之間的關係模式。','Is a prespecified factor structure compatible with the indicator responses?','事先設定的因素結構是否與指標反應相容？'],
  ['pca','constructs','Reduces observed variables to weighted components that summarise variance; components are not automatically latent constructs.','把觀察變量縮減為概括變異的加權主成分；主成分不會自動等同潛在構念。','Can a smaller set of weighted components summarise many observed variables?','較少的加權主成分能否概括多個觀察變量？'],
  ['sem','constructs','Estimates a system of structural relationships and, in latent-variable SEM, a measurement model for the constructs.','估計一組結構關係；潛在變量SEM亦包含構念的測量模型。','Are the hypothesised measurement and structural relationships compatible with the data?','假設的測量及結構關係是否與資料相容？'],
  ['invariance','constructs','Compares measurement models across groups or occasions to assess whether specific parameters can be treated as equal.','比較不同組別或時點的測量模型，評估指定參數能否視為相等。','Are the measurement properties sufficiently comparable across groups or occasions?','不同組別或時點的測量特性是否具有足夠可比性？'],
  ['reliability','constructs','Evaluates score consistency or agreement with a coefficient matched to the measurement design.','使用配合測量設計的係數，評估分數的一致性或評分一致程度。','How consistent or reproducible are scores under the intended measurement conditions?','在預定的測量條件下，分數有多一致或可重現？'],
  ['irt','constructs','Models item-response probabilities as functions of a latent trait and item parameters.','把項目反應機率建模為潛在特質與項目參數的函數。','How do response probabilities vary with a latent trait and item characteristics?','反應機率如何隨潛在特質及項目特徵改變？'],
  ['cluster','profiles','Groups cases by a specified similarity or distance rule; results depend on scaling and the clustering algorithm.','按指定的相似性或距離規則分組；結果受尺度及分群算法影響。','Which cases have similar patterns across several variables?','哪些個案在多個變量上呈現相似模式？'],
  ['lpa','profiles','Fits a mixture model to continuous indicators to estimate latent profiles and membership probabilities.','對連續指標擬合混合模型，估計潛在剖面及群體歸屬機率。','What latent groups are suggested by patterns across continuous indicators?','連續指標的模式提示哪些潛在群體？'],
  ['lca','profiles','Fits a mixture model to categorical indicators to estimate latent classes and class-specific response probabilities.','對類別指標擬合混合模型，估計潛在類別及各類別的反應機率。','What latent groups are suggested by patterns across categorical indicators?','類別指標的模式提示哪些潛在群體？'],
  ['repeated','change','Compares means across repeated occasions and, in a mixed ANOVA, examines group-by-occasion interactions.','比較重複時點的平均數；混合設計ANOVA亦檢視組別與時點的交互作用。','Do mean outcomes change across occasions, and does change differ by group?','平均結果是否隨時點改變？變化是否因組別而異？'],
  ['growth','change','Models an average trajectory and individual differences in starting level and change over time.','分析平均變化軌跡，以及起始水平與變化速率的個體差異。','What is the average trajectory over time, and how do trajectories vary between individuals?','平均時間軌跡如何？個體之間的軌跡有何差異？'],
  ['clpm','change','Models lagged associations between repeated variables while adjusting for their prior values.','調整變量的先前數值後，分析重複測量變量之間的滯後關聯。','Does an earlier value of X relate to a later value of Y after prior-value adjustment?','調整先前數值後，較早的X是否與較後的Y有關？'],
  ['riclpm','change','Separates stable between-person differences from within-person deviations before modelling lagged associations.','先區分穩定的個體間差異與個體內偏離，再分析滯後關聯。','Do within-person deviations in X relate to later within-person deviations in Y?','X的個體內偏離是否與其後Y的個體內偏離有關？'],
  ['timeseries','change','Examines observations ordered in time for patterns such as trends, cycles and serial dependence.','檢視按時間排列的觀察，包括趨勢、週期及序列依賴等模式。','What trends, fluctuations or serial dependence occur in an ordered time series?','按時間排列的序列呈現哪些趨勢、波動或序列依賴？'],
  ['survival','change','Models time to an event while accommodating observations whose event time is censored.','分析事件發生前的時間，並處理事件時間被設限的觀察。','How long until an event occurs, and how is event timing related to predictors?','事件發生前需多久？事件時間與預測變量有何關係？'],
  ['mixed','dependence','Combines fixed effects and random effects to represent repeated, nested or crossed observations.','結合固定效應與隨機效應，表達重複、巢套或交叉觀察。','How do relationships vary within and between clusters or individuals?','關係在群集或個體內與其之間如何變化？'],
  ['gee','dependence','Estimates population-average relationships while allowing for correlation among observations in a cluster.','在容許群集內觀察相關的情況下，估計母體平均關係。','What is the population-average association when observations within clusters are correlated?','當群集內觀察相關時，母體平均關聯如何？'],
  ['network','networks','Represents variables as nodes and modelled conditional associations as edges in a system.','以節點表達變量，以邊表達系統中模型化的條件關聯。','Which variables are conditionally associated after accounting for the other variables?','考慮其他變量後，哪些變量仍存在條件關聯？'],
  ['forest','prediction','Combines decision trees to predict continuous or categorical outcomes; performance is evaluated on held-out data.','結合決策樹預測連續或類別結果；以保留資料評估表現。','How well can an ensemble of decision trees predict an unseen outcome?','決策樹集成模型能多準確地預測未見過的結果？'],
  ['svm','prediction','Fits a margin-based classifier or regression function, with tuning assessed separately from final evaluation.','擬合以間隔為基礎的分類或迴歸函數，並把調參與最終評估分開。','Can a fitted decision boundary or regression function predict new cases accurately?','擬合的決策邊界或迴歸函數能否準確預測新個案？'],
  ['neural','prediction','Learns layered transformations of input variables to predict outcomes, requiring validation and control of overfitting.','學習輸入變量的多層轉換以預測結果，並須驗證表現及控制過度擬合。','Can a neural network predict continuous or categorical outcomes on new cases?','神經網絡能否預測新個案的連續或類別結果？'],
  ['meta','synthesis','Combines comparable effect estimates while modelling sampling uncertainty and between-study heterogeneity.','統合可比較的效果估計，同時分析抽樣不確定性及研究間異質性。','What is the combined effect across comparable studies, and how heterogeneous are the effects?','可比較研究的綜合效果如何？效果有多大異質性？'],
  ['metareg','synthesis','Relates study effect estimates to study-level characteristics within a meta-analytic model.','在統合分析模型中，分析研究效果估計與研究層面特徵的關係。','Which study characteristics are associated with variation in effect estimates?','哪些研究特徵與效果估計的差異有關？'],
  ['multimeta','synthesis','Accounts for dependence among effect estimates through a multilevel model or a justified robust variance approach.','以多層模型或有理據的穩健變異數方法，處理效果估計之間的依賴。','How can dependent effect estimates from the same studies be combined?','如何統合同一研究中互相依賴的效果估計？'],
  ['bayes','support','Combines a prior distribution and likelihood to obtain a posterior distribution for model parameters.','結合先驗分佈與似然，取得模型參數的後驗分佈。','How do the data and prior assumptions update uncertainty about model parameters?','資料與先驗假設如何更新模型參數的不確定性？'],
  ['resampling','support','Uses repeated resampling to approximate a statistic’s sampling behaviour under an appropriate resampling design.','按合適設計反覆重抽樣，近似統計量的抽樣表現。','How uncertain is an estimate under a resampling scheme that respects the data structure?','在保留資料結構的重抽樣方案下，估計有多大不確定性？'],
];

const lpa = rawMethods.find(m=>m.id==='lpa')!;
const additionalMethods = [
  {
    ...lpa, id:'lca', family:'profiles', name:'Latent class analysis (LCA)', zh:'潛在類別分析（LCA）',
    data:'Categorical indicators, an explicit mixture specification and justified within-class dependence assumptions.',
    output:'Class proportions, item-response probabilities, fit comparisons, replicated solutions and posterior membership probabilities.',
    calculation:'For two classes, let π₁=.40, π₂=.60 and P(Y=1|C=1)=.80, P(Y=1|C=2)=.20. Then P(Y=1)=.40×.80+.60×.20=.44. For this single response, P(C=1|Y=1)=.32/.44=.727.',
    interpretation:'Under these supplied parameters, the event probability is .44; a positive response raises the posterior probability of class 1 to about .73. A full model uses the complete response pattern.',
    caution:'Class count, local dependence, solution stability and classification uncertainty need examination. Classes are model-dependent summaries rather than proven natural types.',
    sourceTitle:'Mplus User’s Guide, Chapter 7: latent class models',doi:'',evidenceState:'General method reference',
    symbols:'π = class proportion; C = latent class; Y = observed indicator; P(A|B) = probability of A conditional on B.',symbolsZh:'π=類別比例；C=潛在類別；Y=觀察指標；P(A|B)=在B條件下A的機率。',
    translated:{...lpa.translated,
      data:'類別指標、明確的混合模型設定，以及有理據的類別內依賴假設。',
      output:'類別比例、項目反應機率、擬合比較、解的重現及後驗歸屬機率。',
      calculation:'兩類模型：π₁=.40、π₂=.60；P(Y=1|C=1)=.80、P(Y=1|C=2)=.20。因此P(Y=1)=.40×.80+.60×.20=.44。只用這個反應，P(C=1|Y=1)=.32/.44=.727。',
      interpretation:'在指定參數下，事件機率為.44；正向反應使屬於類別1的後驗機率升至約.73。完整模型使用整組反應模式。',
      caution:'須檢視類別數、局部依賴、解的穩定性及分類不確定性。類別是依賴模型的摘要，而非已證實的自然類型。'},
  },
  {
    ...lpa, id:'growth', family:'change', name:'Latent growth curve modelling', zh:'潛在成長曲線模型',
    data:'Repeated continuous outcomes at enough occasions to identify the specified trajectory; explicit time scores and missing-data assumptions.',
    output:'Mean intercept and slope, their variances and covariance, model fit and uncertainty.',
    calculation:'For a linear trajectory, E(Yₜ)=μᵢ+μₛt. With μᵢ=10, μₛ=2 and time scores 0, 1, 2, expected outcomes are 10, 12 and 14. If Var(slope)=.25, the slope SD is √.25=.50.',
    interpretation:'The supplied model starts at an average of 10 and increases by 2 outcome units per time unit; a slope SD of .50 represents between-person variation in rates of change.',
    caution:'Time coding defines the intercept and slope units. Check trajectory form, identification, fit, missingness and measurement comparability; an average increase does not establish an intervention effect.',
    sourceTitle:'lavaan: growth curve models',doi:'',evidenceState:'General method reference',
    symbols:'E(Yₜ) = expected outcome at time t; μᵢ = mean intercept; μₛ = mean slope; Var = variance; SD = standard deviation.',symbolsZh:'E(Yₜ)=時間t的結果期望值；μᵢ=截距平均數；μₛ=斜率平均數；Var=變異數；SD=標準差。',
    translated:{...lpa.translated,
      data:'足以識別指定軌跡的多時點連續結果，並交代時間編碼及缺失資料假設。',
      output:'截距與斜率平均數、其變異數及共變數、模型擬合與不確定性。',
      calculation:'線性軌跡E(Yₜ)=μᵢ+μₛt。若μᵢ=10、μₛ=2，時間編碼為0、1、2，預期結果為10、12、14。若斜率變異數=.25，斜率標準差=√.25=.50。',
      interpretation:'指定模型的平均起點為10，每一時間單位平均增加2個結果單位；斜率標準差.50表達個體間變化速率的差異。',
      caution:'時間編碼決定截距及斜率的單位。須檢查軌跡形式、識別、擬合、缺失及測量可比性；平均上升不能確立干預效果。'},
  },
];
const byId = new Map([...rawMethods,...additionalMethods].map(m=>[m.id,m]));
const names: Record<string,[string,string]> = {
  count:['Count regression (Poisson / negative binomial)','計數迴歸（Poisson／負二項）'],
  gam:['Generalised additive models (GAMs)','廣義加性模型（GAM）'],
  network:['Network analysis: conditional-association models','網絡分析：條件關聯模型'],
  neural:['Neural networks for prediction','神經網絡預測'],
  timeseries:['Time-series analysis','時間序列分析'],
};
export const methods = introductions.map(([id,family,overview,overviewZh,question,questionZh])=> {
  const m=byId.get(id);
  if(!m) throw new Error(`Missing quantitative teaching method: ${id}`);
  const category: Record<string,string> = {chi:'categorical',logistic:'categorical',ordinal:'categorical',count:'count',manova:'multivariate',sem:'pathways',survival:'survival'};
  return {...m,family:category[id]||family,name:names[id]?.[0]||m.name,zh:names[id]?.[1]||m.zh,
    overview,overviewZh,question,translated:{...m.translated,question:questionZh},
    sourceUrl:id==='lca'?'https://www.statmodel.com/HTML_UG/chapter7V8.htm':id==='growth'?'https://lavaan.ugent.be/tutorial/growth.html':'',
  };
});
