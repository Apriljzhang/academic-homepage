export function initTirfScenarioChoices(root) {
 root.querySelectorAll('[data-scenario-scope]').forEach(scope=>{
  scope.querySelectorAll('[data-scenario-select]').forEach(button=>button.addEventListener('click',()=>{
   const scenario=button.dataset.scenarioSelect;
   root.querySelectorAll('[data-scenario-scope]').forEach(model=>model.dataset.selectedScenario=scenario);
   root.querySelectorAll('[data-scenario-select]').forEach(choice=>choice.setAttribute('aria-pressed',String(choice.dataset.scenarioSelect===scenario)));
   root.querySelectorAll('[data-model-scenario]').forEach(panel=>panel.hidden=panel.dataset.modelScenario!==scenario);
   root.querySelectorAll('.scenario-prompts .status').forEach(status=>status.textContent='');
  }));
 });
}
