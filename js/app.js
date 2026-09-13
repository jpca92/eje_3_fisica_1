import { DEFAULTS } from "./constants.js";
import { calculateAllScenarios } from "./physics.js";
import { readInputs, renderResults, renderScenarioHeader, setValidationMessage } from "./ui.js";
import { FrictionAnimator } from "./animation.js";

const normalForceInput = document.querySelector("#normalForce");
const forceCase1Input = document.querySelector("#forceCase1");
const forceCase2Input = document.querySelector("#forceCase2");
const coefficientCase1Input = document.querySelector("#coefficientCase1");
const coefficientCase2Input = document.querySelector("#coefficientCase2");
const kineticCase1Input = document.querySelector("#kineticCase1");
const kineticCase2Input = document.querySelector("#kineticCase2");
const scenarioSelect = document.querySelector("#scenarioSelect");

const animator = new FrictionAnimator({
  bottleGroup: document.querySelector("#bottleGroup"),
  forceVector: document.querySelector("#forceVector"),
  frictionVector: document.querySelector("#frictionVector"),
  appliedBar: document.querySelector("#appliedBar"),
  frictionBar: document.querySelector("#frictionBar"),
  forceLabel: document.querySelector("#forceLabel"),
  frictionLabel: document.querySelector("#frictionLabel"),
  appliedCurrentValue: document.querySelector("#appliedCurrentValue"),
  frictionCurrentValue: document.querySelector("#frictionCurrentValue"),
});

let results;

function validate(values) {
  if (!Number.isFinite(values.normalForce) || values.normalForce <= 0) {
    throw new Error("La fuerza normal debe ser mayor que cero.");
  }
}

function selectedScenario() {
  const key = scenarioSelect.value;
  return { key, data: results[key] };
}

function recalculate(resetAnimation = true) {
  try {
    const values = readInputs();
    validate(values);
    results = calculateAllScenarios(values);
    renderResults(results);
    const selected = selectedScenario();
    if (!selected.data) {
      if (resetAnimation) animator.reset();
      throw new Error("El caso seleccionado necesita la fuerza límite o el coeficiente estático.");
    }
    renderScenarioHeader(selected.key, selected.data);
    if (resetAnimation) animator.loadScenario(selected.data);
    setValidationMessage("");
    return true;
  } catch (error) {
    setValidationMessage(error.message);
    return false;
  }
}

function restoreDefaults() {
  normalForceInput.value = DEFAULTS.normalForce;
  forceCase1Input.value = DEFAULTS.forceCase1;
  forceCase2Input.value = DEFAULTS.forceCase2;
  coefficientCase1Input.value = "";
  coefficientCase2Input.value = "";
  kineticCase1Input.value = "";
  kineticCase2Input.value = "";
  scenarioSelect.value = "case1";
  recalculate(true);
}

document.querySelector("#startBtn").addEventListener("click", () => {
  if (!recalculate(true)) return;
  animator.start();
});

document.querySelector("#pauseBtn").addEventListener("click", () => animator.pause());
document.querySelector("#resetBtn").addEventListener("click", () => animator.reset());
document.querySelector("#defaultsBtn").addEventListener("click", restoreDefaults);

scenarioSelect.addEventListener("change", () => recalculate(false));
[
  normalForceInput,
  forceCase1Input,
  forceCase2Input,
  coefficientCase1Input,
  coefficientCase2Input,
  kineticCase1Input,
  kineticCase2Input,
].forEach((input) => {
  input.addEventListener("input", () => recalculate(false));
});

restoreDefaults();
