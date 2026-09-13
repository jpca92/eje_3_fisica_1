export function formatNumber(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function readOptionalNumber(selector) {
  const rawValue = document.querySelector(selector).value.trim();
  return rawValue === "" ? null : Number(rawValue);
}

export function readInputs() {
  return {
    normalForce: Number(document.querySelector("#normalForce").value),
    forceCase1: readOptionalNumber("#forceCase1"),
    forceCase2: readOptionalNumber("#forceCase2"),
    coefficientCase1: readOptionalNumber("#coefficientCase1"),
    coefficientCase2: readOptionalNumber("#coefficientCase2"),
    kineticCase1: readOptionalNumber("#kineticCase1"),
    kineticCase2: readOptionalNumber("#kineticCase2"),
  };
}

export function renderResults(results) {
  const { case1, case2 } = results;

  const renderCase = (scenario, prefix) => {
    document.querySelector(`#${prefix}ForceEquation`).textContent = scenario ? formatNumber(scenario.force, 2) : "—";
    document.querySelector(`#${prefix}NormalEquation`).textContent = scenario ? formatNumber(scenario.normalForce, 2) : "—";
    document.querySelector(`#mu${prefix === "case1" ? "Case1" : "Case2"}`).textContent = scenario
      ? formatNumber(scenario.coefficient, 3)
      : "—";
    document.querySelector(`#${prefix}KineticResult`).textContent = !scenario
      ? "Sin datos suficientes para resolver este caso."
      : scenario.kineticCoefficient === null
    ? "μₖ no especificado: la animación termina en el umbral."
    : `μₖ = ${formatNumber(scenario.kineticCoefficient, 3)} · fₖ = ${formatNumber(scenario.kineticFriction, 2)} N`;
  };

  renderCase(case1, "case1");
  renderCase(case2, "case2");

  const interpretation = document.querySelector("#interpretationText");
  if (!case1 || !case2) {
    interpretation.textContent = "Completa ambos casos para comparar sus coeficientes; basta con completar el caso que quieras animar.";
  } else if (Math.abs(case1.coefficient - case2.coefficient) < 1e-12) {
    interpretation.textContent = "Ambos casos producen el mismo coeficiente de fricción estática.";
  } else if (case1.coefficient > case2.coefficient) {
    interpretation.textContent = `El caso 1 requiere un coeficiente mayor (${formatNumber(case1.coefficient, 3)}) que el caso 2 (${formatNumber(case2.coefficient, 3)}).`;
  } else {
    interpretation.textContent = `El caso 2 requiere un coeficiente mayor (${formatNumber(case2.coefficient, 3)}) que el caso 1 (${formatNumber(case1.coefficient, 3)}).`;
  }
}

export function renderScenarioHeader(scenarioKey, scenario) {
  const n = scenarioKey === "case1" ? "1" : "2";
  document.querySelector("#simulationSubtitle").textContent =
    `Caso ${n} · f = ${formatNumber(scenario.force, 2)} N · N = ${formatNumber(scenario.normalForce, 2)} N`;
  document.querySelector("#normalLabel").textContent = `N = ${formatNumber(scenario.normalForce, 2)} N`;
  document.querySelector("#weightLabel").textContent = `P = ${formatNumber(scenario.normalForce, 2)} N`;
}

export function updateBadge(state) {
  const badge = document.querySelector("#motionBadge");
  const map = {
    idle: ["En reposo", "idle"],
    pulling: ["Aumentando fuerza", "pulling"],
    threshold: ["Umbral de movimiento", "threshold"],
    moving: ["Deslizándose", "moving"],
    paused: ["Pausada", "paused"],
    finished: ["Simulación terminada", "idle"],
    finishedThreshold: ["Umbral alcanzado", "threshold"],
  };
  const [label, cssClass] = map[state] ?? map.idle;
  badge.textContent = label;
  badge.className = `badge ${cssClass}`;
}

export function updateProgress(progress) {
  const p = Math.max(0, Math.min(1, progress));
  document.querySelector("#progressFill").style.width = `${p * 100}%`;
  document.querySelector("#progressValue").textContent = `${Math.round(p * 100)}%`;
}

export function setValidationMessage(message = "") {
  document.querySelector("#validationMessage").textContent = message;
}
