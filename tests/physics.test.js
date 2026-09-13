import test from "node:test";
import assert from "node:assert/strict";
import { calculateAllScenarios, calculateScenario, calculateStaticFrictionCoefficient } from "../js/physics.js";

test("calcula los dos casos originales del ejercicio", () => {
  const result = calculateAllScenarios({
    normalForce: 210,
    forceCase1: 42,
    forceCase2: 21,
    coefficientCase1: null,
    coefficientCase2: null,
    kineticCase1: null,
    kineticCase2: null,
  });

  assert.equal(result.case1.coefficient, 0.2);
  assert.equal(result.case2.coefficient, 0.1);
  assert.equal(result.case1.maxStaticFriction, 42);
  assert.equal(result.case2.maxStaticFriction, 21);
});

test("resuelve la fuerza límite cuando solo se proporciona μs", () => {
  const result = calculateScenario({ normalForce: 210, force: null, coefficient: 0.2 });

  assert.equal(result.force, 42);
  assert.equal(result.maxStaticFriction, 42);
});

test("permite dejar un caso sin datos y resolver el otro", () => {
  const result = calculateAllScenarios({
    normalForce: 210,
    forceCase1: 42,
    forceCase2: null,
    coefficientCase1: null,
    coefficientCase2: null,
    kineticCase1: null,
    kineticCase2: null,
  });

  assert.equal(result.case1.coefficient, 0.2);
  assert.equal(result.case2, null);
});

test("calcula la fricción cinética cuando se proporciona μk", () => {
  const result = calculateScenario({ normalForce: 210, force: 42, coefficient: null, kineticCoefficient: 0.1 });

  assert.equal(result.kineticFriction, 21);
  assert.equal(result.kineticCoefficient, 0.1);
});

test("rechaza un coeficiente cinético mayor que el estático", () => {
  assert.throws(
    () => calculateScenario({ normalForce: 210, force: 42, coefficient: null, kineticCoefficient: 0.3 }),
    /cinético no puede ser mayor que el estático/,
  );
});

test("exige la fuerza límite o el coeficiente estático", () => {
  assert.throws(
    () => calculateScenario({ normalForce: 210, force: null, coefficient: null }),
    /fuerza límite o el coeficiente estático/,
  );
});

test("rechaza datos incompatibles", () => {
  assert.throws(
    () => calculateScenario({ normalForce: 210, force: 42, coefficient: 0.1 }),
    /no son consistentes/,
  );
});

test("rechaza una fuerza normal no válida", () => {
  assert.throws(
    () => calculateStaticFrictionCoefficient(42, 0),
    /mayor que cero/,
  );
});
