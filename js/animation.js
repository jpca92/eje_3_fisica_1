import { ANIMATION } from "./constants.js";
import { updateBadge, updateProgress } from "./ui.js";

export class FrictionAnimator {
  constructor({ bottleGroup, forceVector, frictionVector, appliedBar, frictionBar, forceLabel, frictionLabel, appliedCurrentValue, frictionCurrentValue }) {
    this.bottleGroup = bottleGroup;
    this.forceVector = forceVector;
    this.frictionVector = frictionVector;
    this.appliedBar = appliedBar;
    this.frictionBar = frictionBar;
    this.forceLabel = forceLabel;
    this.frictionLabel = frictionLabel;
    this.appliedCurrentValue = appliedCurrentValue;
    this.frictionCurrentValue = frictionCurrentValue;
    this.rafId = null;
    this.state = "idle";
    this.startTimestamp = null;
    this.elapsedBeforePause = 0;
    this.scenario = null;
  }

  loadScenario(scenario) {
    this.scenario = scenario;
    this.reset();
  }

  start() {
    if (!this.scenario || ["pulling", "threshold", "moving"].includes(this.state)) return;
    if (["finished", "finishedThreshold"].includes(this.state)) this.reset();
    this.startTimestamp = null;
    this.state = "pulling";
    this.rafId = requestAnimationFrame(this.#tick);
  }

  pause() {
    if (["idle", "paused", "finished", "finishedThreshold"].includes(this.state)) return;
    if (this.startTimestamp !== null) {
      this.elapsedBeforePause += performance.now() - this.startTimestamp;
    }
    this.startTimestamp = null;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.state = "paused";
    updateBadge("paused");
  }

  reset() {
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.state = "idle";
    this.startTimestamp = null;
    this.elapsedBeforePause = 0;
    this.bottleGroup.setAttribute("transform", "translate(0 0)");
    this.#renderForces(0, 0, "fₛ");
    updateProgress(0);
    updateBadge("idle");
  }

  #setVectorLengths(appliedProgress, frictionProgress) {
    const applied = Math.max(0, Math.min(1, appliedProgress));
    const friction = Math.max(0, Math.min(1, frictionProgress));
    this.forceVector.setAttribute("x2", 302 + 143 * applied);
    this.frictionVector.setAttribute("x2", 158 - 80 * friction);
  }

  #renderForces(appliedForce, frictionForce, frictionType) {
    const maxApplied = this.scenario?.force ?? 0;
    const maxStatic = this.scenario?.maxStaticFriction ?? 0;
    const appliedProgress = maxApplied > 0 ? appliedForce / maxApplied : 0;
    const frictionProgress = maxStatic > 0 ? frictionForce / maxStatic : 0;
    this.#setVectorLengths(appliedProgress, frictionProgress);
    this.appliedBar.setAttribute("width", ANIMATION.maxBarWidthPx * Math.max(0, Math.min(1, appliedProgress)));
    this.frictionBar.setAttribute("width", ANIMATION.maxBarWidthPx * Math.max(0, Math.min(1, frictionProgress)));
    this.forceLabel.textContent = `f aplicada = ${appliedForce.toFixed(2)} N`;
    this.frictionLabel.textContent = `${frictionType} = ${frictionForce.toFixed(2)} N`;
    this.appliedCurrentValue.textContent = `${appliedForce.toFixed(2)} N`;
    this.frictionCurrentValue.textContent = `${frictionForce.toFixed(2)} N`;
  }

  #tick = (timestamp) => {
    if (this.startTimestamp === null) this.startTimestamp = timestamp;
    const elapsed = this.elapsedBeforePause + (timestamp - this.startTimestamp);

    const pullEnd = ANIMATION.pullDurationMs;
    const thresholdEnd = pullEnd + ANIMATION.thresholdDurationMs;
    const canSimulateSliding = this.scenario.kineticCoefficient !== null;
    const total = thresholdEnd + (canSimulateSliding ? ANIMATION.slideDurationMs : 0);
    updateProgress(elapsed / total);

    if (elapsed <= pullEnd) {
      this.state = "pulling";
      updateBadge("pulling");
      const p = elapsed / pullEnd;
      const currentForce = this.scenario.force * p;
      this.#renderForces(currentForce, currentForce, "fₛ");
    } else if (elapsed <= thresholdEnd) {
      this.state = "threshold";
      updateBadge("threshold");
      this.#renderForces(this.scenario.force, this.scenario.maxStaticFriction, "fₛ,max");
    } else if (canSimulateSliding) {
      this.state = "moving";
      updateBadge("moving");
      this.#renderForces(this.scenario.force, this.scenario.kineticFriction, "fₖ");
      const slideProgress = Math.min((elapsed - thresholdEnd) / ANIMATION.slideDurationMs, 1);
      const eased = 1 - Math.pow(1 - slideProgress, 3);
      const netForce = this.scenario.force - this.scenario.kineticFriction;
      const motionFactor = this.scenario.force > 0
        ? Math.max(0, Math.min(1, netForce / this.scenario.force))
        : 0;
      const x = ANIMATION.maxBottleTranslationPx * motionFactor * eased;
      this.bottleGroup.setAttribute("transform", `translate(${x} 0)`);
    }

    if (elapsed >= total) {
      this.state = canSimulateSliding ? "finished" : "finishedThreshold";
      updateBadge(this.state);
      updateProgress(1);
      this.elapsedBeforePause = 0;
      return;
    }

    this.rafId = requestAnimationFrame(this.#tick);
  };
}
