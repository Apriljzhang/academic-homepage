# DEDC02 Topic 8: SPSS procedure source check

Verified against IBM documentation on 21 October 2026. These guides describe documented desktop procedures; no live SPSS GUI session was executed. The sample CSV contains 36 generated fictional records, not raw data from the four reading papers.

## Placement and scope

Each method’s third page directly presents its bilingual SPSS guide. The fourth page combines the published result table, interpretation and full-paper links. The t-test guide has separate independent and paired workflows. Header buttons navigate to the corresponding SPSS page without adding or renumbering slides. The slides retain the essential menu path, variable choices, settings and output tables, with one brief check per procedure. Detailed saving/exporting and repeated setup tables are omitted.

## Primary sources

- Independent t-test and optional homogeneity control: https://www.ibm.com/docs/en/spss-statistics/31.0.0?topic=tests-independent-samples-t-test
- Group codes: https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=test-independent-samples-t-define-groups
- Output tables: https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=test-overview-t-command
- Paired t-test and standardisers: https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=tests-paired-samples-t-test
- Paired options: https://www.ibm.com/docs/en/spss-statistics/32.0.0?topic=test-paired-samples-t-options
- Version 31 release notes (Compare Means and Proportions label; optional homogeneity checkbox): https://www.ibm.com/docs/en/spss-statistics/31.0.0?topic=overview-whats-new-in-spss-statistics
- Bivariate correlations: https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=features-bivariate-correlations
- Missing-data options: https://www.ibm.com/docs/en/spss-statistics/32.0.0?topic=correlations-bivariate-options
- Correlation CI: https://www.ibm.com/docs/en/spss-statistics/32.0.0?topic=correlations-bivariate-confidence-interval
- Correlation CI added in 27.0.1: https://community.ibm.com/community/user/blogs/brent-gardiner/2020/11/03/whats-new-in-spss-statistics-27010?hlmlt=VT
- Scatterplot: https://www.ibm.com/docs/en/spss-statistics/32.0.0?topic=data-effects-transformations
- One-way ANOVA: https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=features-one-way-anova
- ANOVA options: https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=anova-one-way-options
- Post hoc procedures: https://www.ibm.com/docs/en/spss-statistics/31.0.0?topic=anova-one-way-post-hoc-tests
- Crosstabs workflow: https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=relationships-running-analysis
- Crosstabs statistics: https://www.ibm.com/docs/en/spss-statistics/30.0.0?topic=crosstabs-statistics
- Cell display: https://www.ibm.com/docs/en/spss-statistics/32.0.0?topic=crosstabs-cell-display
- Exact methods: https://www.ibm.com/docs/en/spss-statistics/32.0.0?topic=tests-obtaining-exact
- CSV and data controls: https://www.ibm.com/docs/SSLVMB_29.0.0/pdf/IBM_SPSS_Statistics_Core_System_User_Guide.pdf
- Pasting syntax: https://www.ibm.com/docs/en/spss-statistics/32.0.0?topic=syntax-pasting
- Export output: https://www.ibm.com/docs/en/spss-statistics/32.0.0?topic=classic-export-output

Some direct IBM Docs fetches returned HTTP 403; full indexed IBM documentation passages were used. Procedure pages and release notes differ in menu naming, so the guide explicitly gives both names. Sources for options introduced in later versions are labelled as conditional rather than assumed universal.

## Practice-file checks

- Seven numeric columns, 36 unique learners and no missing cells.
- Three study groups of 12. Independent t-test explicitly uses codes 1 and 2 (24 people); ANOVA uses all three.
- Paired data stay on each learner's row; after is entered first, so the contrast is after minus before.
- Correlation uses the two measurements from the same 36 learners.
- Crosstabs is 3 by 2: observed video/text counts 9/3, 6/6, 3/9; all expected counts are 6, df = 2.
- Welch output is distinguished from the pooled t/ANOVA output; Levene's p is never presented as the mean-difference p.
- A paired-samples correlation is not presented as the test of mean change.
- ANOVA effect sizes are not relabelled as Welch-specific effects.
- The standalone exporter embeds CSV downloads so practice data remain available offline.
