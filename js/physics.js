function isProvided(value) {
  return Number.isFinite(value);
}

function validateNormalForce(normalForce) {
  if (!isProvided(normalForce) || normalForce <= 0) {
    throw new Error("La fuerza normal debe ser mayor que cero.");
  }
}

function validateNonNegative(value, label) {
  if (value !== null && value !== undefined && !Number.isFinite(value)) {
    throw new Error(`${label} debe ser un número.`);
  }
  if (isProvided(value) && value < 0) {
    throw new Error(`${label} no puede ser negativa.`);
  }
}

export function calculateStaticFrictionCoefficient(force, normalForce) {
  validateNormalForce(normalForce);
  if (!isProvided(force)) {
    throw new Error("Se necesita la fuerza límite o el coeficiente estático.");
  }
  validateNonNegative(force, "La fuerza aplicada");
  return force / normalForce;
}

/**
 * Resuelve el caso con la fuerza límite o con μs.
 * Como mínimo se necesita N y uno de esos dos datos.
 */
export function calculateScenario({ force, normalForce, coefficient, kineticCoefficient = null }) {
  validateNormalForce(normalForce);
  validateNonNegative(force, "La fuerza aplicada");
  validateNonNegative(coefficient, "El coeficiente de fricción estática");
  validateNonNegative(kineticCoefficient, "El coeficiente de fricción cinética");

  if (!isProvided(force) && !isProvided(coefficient)) {
    throw new Error("Cada caso necesita la fuerza límite o el coeficiente estático.");
  }

  const resolvedCoefficient = isProvided(coefficient)
    ? coefficient
    : force / normalForce;
  const resolvedForce = isProvided(force)
    ? force
    : resolvedCoefficient * normalForce;

  if (isProvided(force) && isProvided(coefficient)) {
    const expectedForce = coefficient * normalForce;
    const tolerance = Math.max(0.01, Math.abs(expectedForce) * 0.01);
    if (Math.abs(force - expectedForce) > tolerance) {
      throw new Error("La fuerza límite y μs no son consistentes con la fuerza normal.");
    }
  }

  return {
    force: resolvedForce,
    normalForce,
    coefficient: resolvedCoefficient,
    kineticCoefficient: isProvided(kineticCoefficient) ? kineticCoefficient : null,
    maxStaticFriction: resolvedCoefficient * normalForce,
    kineticFriction: isProvided(kineticCoefficient) ? kineticCoefficient * normalForce : null,
  };
}

export function calculateAllScenarios({ normalForce, forceCase1, forceCase2, coefficientCase1, coefficientCase2, kineticCase1, kineticCase2 }) {
  const hasStaticData = (force, coefficient) => isProvided(force) || isProvided(coefficient);

  return {
    case1: hasStaticData(forceCase1, coefficientCase1)
      ? calculateScenario({
          force: forceCase1,
          normalForce,
          coefficient: coefficientCase1,
          kineticCoefficient: kineticCase1,
        })
      : null,
    case2: hasStaticData(forceCase2, coefficientCase2)
      ? calculateScenario({
          force: forceCase2,
          normalForce,
          coefficient: coefficientCase2,
          kineticCoefficient: kineticCase2,
        })
      : null,
  };
}
