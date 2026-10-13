/**
 * Results component for ChooseWise.
 * Renders the results section with score summary, "Why this score?" explanation,
 * trade-offs, reflection, and Edit button.
 * Receives computed data from the Form component via the store state.
 */
import { createStore } from '../store'
import {
  calculateWeightedAverage,
  calculateContributions,
  sortContributions,
  classifyResult,
  calculateTradeOffs
} from '../utils/calculations'

interface ResultData {
  scoreA: number
  scoreB: number
  difference: number
  classification: 'tie' | 'close' | 'lead'
  contributions: Array<{
    criterionName: string
    contribution: number
    benefits: 'A' | 'B'
  }>
  tradeOffs: {
    optionAAdvantages: Array<{ name: string; gap: number; weight: number }>
    optionBAdvantages: Array<{ name: string; gap: number; weight: number }>
    neutral: boolean
  }
  reflectionText: string
}

export function createResults(store: ReturnType<typeof createStore>, resultsEl: HTMLDivElement) {
  /** Render the results HTML */
  function render() {
    const state = store.getState()

    if (!state.showResults || state.criteria.length === 0) {
      resultsEl.innerHTML = ''
      return
    }

    // Calculate weighted averages with full precision
    const weights = state.criteria.map(c => c.weight)
    const ratingsA = state.criteria.map(c => c.ratingA)
    const ratingsB = state.criteria.map(c => c.ratingB)
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)

    const scoreA = calculateWeightedAverage(ratingsA, weights)
    const scoreB = calculateWeightedAverage(ratingsB, weights)

    // Calculate contributions and sort by absolute value with input-order tie-breaker
    const rawContributions = calculateContributions(state.criteria, totalWeight)
    const sorted = sortContributions(rawContributions)

    const contributions = sorted.map(c => ({
      criterionName: c.name,
      contribution: Number(c.contribution.toFixed(1)),
      benefits: c.contribution > 0 ? 'A' : c.contribution < 0 ? 'B' : 'neutral'
    }))

    // Classification using full-precision scores
    const classification = classifyResult(scoreA, scoreB)
    const difference = Number((scoreA - scoreB).toFixed(1))

    // Trade-offs
    const tradeOffs = calculateTradeOffs(state.criteria.map(c => ({
      weight: c.weight,
      ratingA: c.ratingA,
      ratingB: c.ratingB,
      order: c.order
    })))

    const resultData: ResultData = {
      scoreA: Number(scoreA.toFixed(1)),
      scoreB: Number(scoreB.toFixed(1)),
      difference,
      classification,
      contributions,
      tradeOffs,
      reflectionText: state.reflection
    }

    let contributionsHTML = ''
    if (contributions.length > 0) {
      contributionsHTML = `
        <div class="contributions-section">
          <h3>Why this score?</h3>
          <p>This score difference is driven by the following criteria (ranked by contribution):</p>
          <ul>
            ${contributions.map(c => `<li>${c.criterionName}: ${c.contribution > 0 ? 'favors Option A' : c.contribution < 0 ? 'favors Option B' : 'no effect'} by ${Math.abs(
        c.contribution
      ).toFixed(1)} points</li>`).join('')}
          </ul>
        </div>
      `
    }

    let tradeOffsHTML = ''
    if (tradeOffs.neutral) {
      tradeOffsHTML = `
        <div class="trade-offs-section">
          <p>Neither option has an advantage under the current ratings.</p>
        </div>
      `
    } else {
      tradeOffsHTML = `
        <div class="trade-offs-section">
          <div class="trade-off-column">
            <h4>Option A's strengths</h4>
            ${tradeOffs.optionAAdvantages.length > 0 ?
              tradeOffs.optionAAdvantages.map(a => `<p>• ${a.name}: rates +${a.gap} higher (weight ${a.weight})</p>`).join('') :
              ''}
          </div>
          <div class="trade-off-column">
            <h4>Option B's strengths</h4>
            ${tradeOffs.optionBAdvantages.length > 0 ?
              tradeOffs.optionBAdvantages.map(b => `<p>• ${b.name}: rates +${b.gap} higher (weight ${b.weight})</p>`).join('') :
              ''}
          </div>
        </div>
      `
    }

    const classificationLabels: Record<'tie' | 'close' | 'lead', string> = {
      tie: "It's a tie based on your current ratings.",
      close: 'Options are closely matched.',
      lead: "Option A scores higher based on your ratings."
    }

    // Neutral lead text for Option B
    const leadLabel = classification === 'lead' ?
      (resultData.scoreA > resultData.scoreB ? "Option A scores higher based on your ratings." :
        "Option B scores higher based on your ratings.") :
      ''

    const resultsHTML = `
      <div class="results-section">
        <div class="score-summary">
          <div class="score-card option-a">
            <span class="option-name">${state.optionAName || 'Option A'}</span>
            <span class="score-value">${resultData.scoreA}</span>
          </div>
          <div class="score-difference">
            ${resultData.difference >= 0 ? `+${resultData.difference}` : `-${Math.abs(resultData.difference)}`}
          </div>
          <div class="score-card option-b">
            <span class="option-name">${state.optionBName || 'Option B'}</span>
            <span class="score-value">${resultData.scoreB}</span>
          </div>
          <p class="neutral-summary">${classificationLabels[resultData.classification]}</p>
        </div>

        ${contributionsHTML}

        ${tradeOffsHTML}

        <div class="reflection-section">
          <h3>What could change your mind?</h3>
          <p class="reflection-placeholder">If Option B offered more flexibility, I might reconsider…</p>
          <textarea
            readonly
            readonlyText="${state.reflection}"
            oninput="window.chooseWiseForm.handleReflectionChange(event)"
            class="reflection-textarea"
          >${state.reflection}</textarea>
        </div>

        <button
          class="edit-btn"
          onclick="window.chooseWiseForm.editComparison()"
        >
          Edit my comparison
        </button>
      </div>
    `

    resultsEl.innerHTML = resultsHTML
  }

  function init() {
    store.subscribe(render)
    render()
  }

  return { init, render }
}