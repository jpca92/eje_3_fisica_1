export const DEFAULTS = Object.freeze({
  normalForce: 210,
  forceCase1: 42,
  forceCase2: 21,
});

export const ANIMATION = Object.freeze({
  pullDurationMs: 2400,
  thresholdDurationMs: 900,
  slideDurationMs: 2200,
  thresholdNudgePx: 90,
  maxBarWidthPx: 220,
  // Parámetros físicos del deslizamiento (movimiento uniformemente acelerado).
  // La masa se deriva de la normal en cada caso: m = N / g (se asume N = P).
  gravity: 9.8,
  // Escala visual metros → píxeles.
  metersToPx: 110,
  // Tope de traslación para no salir del viewBox del SVG (el suelo llega a x≈940).
  maxTravelPx: 630,
});
