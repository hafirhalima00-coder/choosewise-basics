/**
 * Form component for ChooseWise.
 * Renders the input form with two option fields, dynamic criteria rows,
 * and the Compare button. Handles input validation, state updates,
 * and enables Compare when valid.
 * Uses accessible labels (element-associated), full keyboard operability,
 * and responsive layout (stacks vertically < 768px, side-by-side ≥ 768px).
 */
import { createStore } from '../store'
import { validateForm, isCompleteCriterion } from '../utils/validation'
import {
  calculateWeightedAverage,
  calculateContributions,
  sortContributions,
  classifyResult,
  calculateTradeOffs
} from '../utils/calculations'

interface CriterionFormValues {
  name: string
  weight: number
  ratingA: number
  ratingB: number
}

interface FormState {
  optionAName: string
  optionBName: string
  criteria: CriterionFormValues[]
  reflection: string
  isComparing: boolean
  showResults: boolean
  lastResult?: {
    scoreA: number
    scoreB: number
    difference: number
    classification: 'tie' | 'close' | 'lead'
    contributions: { criterionName: string; contribution: number; benefits: 'A' | 'B' }[]
    tradeOffs: {
      optionAAdvantages: { name: string; gap: number; weight: number }[]
      optionBAdvantages: { name: string; gap: number; weight: number }[]
      neutral: boolean
    }
    reflectionText: string
  }
}

/** Element-associated label HTML */
function labelHTML(forId: string, children: string) {
  return `<label for="${forId}">${children}</label>`
}

export function createForm(store: ReturnType<typeof createStore>) {
  let unsubscribe: () => void

  /** Render the form HTML */
  function render(formEl: HTMLFormElement) {
    const state = store.getState()
    const criteriaHTML = state.criteria.map((c, i) => `
      <div class="criterion-row" data-order="${i}">
        <div class="criterion-row-inner">
          <div class="criterion-row-left">
            ${labelHTML(`criterion-name-${i}`, c.name)}
            <input
              type="text"
              id="criterion-name-${i}"
              value="${c.name}"
              onchange="window.chooseWiseForm.handleCriterionNameChange(event, ${i})"
              placeholder="Criterion name"
              class="criterion-input"
            />
          </div>
          <div class="criterion-row-center">
            ${labelHTML(`criterion-weight-${i}`, `Weight: ${c.weight}`)}
            <input
              type="number"
              id="criterion-weight-${i}"
              value="${c.weight}"
              min="1" max="10"
              onchange="window.chooseWiseForm.handleCriterionWeightChange(event, ${i})"
              class="criterion-input"
            />
          </div>
          <div class="criterion-row-right">
            ${labelHTML(`criterion-ratingA-${i}`, `A: ${c.ratingA}`)}
            <input
              type="number"
              id="criterion-ratingA-${i}"
              value="${c.ratingA}"
              min="1" max="10"
              onchange="window.chooseWiseForm.handleCriterionRatingAChange(event, ${i})"
              class="criterion-input"
            />
            ${labelHTML(null, `B: ${c.ratingB}`)}
            <input
              type="number"
              id="criterion-ratingB-${i}"
              value="${c.ratingB}"
              min="1" max="10"
              onchange="window.chooseWiseForm.handleCriterionRatingBChange(event, ${i})"
              class="criterion-input"
            />
          </div>
          <button type="button" class="remove-criterion" onclick="window.chooseWiseForm.removeCriterion(${i})">×</button>
        </div>
      </div>
    `).join('')

    let compareDisabled = true
    let compareMessage = ''

    // Validation: both names non-empty, ≥1 complete criterion, no incomplete/invalid
    if (state.optionAName.trim() && state.optionBName.trim()) {
      let allComplete = true
      let incompleteFound = false

      for (let i = 0; i < state.criteria.length; i++) {
        const c = state.criteria[i]
        if (!isCompleteCriterion(c.name, c.weight, c.ratingA, c.ratingB)) {
          allComplete = false
          incompleteFound = true
          compareDisabled = true
          compareMessage = 'Please complete or remove incomplete criteria'
          break
        }
      }

      if (allComplete && state.criteria.length > 0) {
        compareDisabled = false
        compareMessage = 'Compare my options'
      }
    }

    const formHTML = `
      <header class="form-header">
        <h1>ChooseWise</h1>
        <p class="tagline">Less overthinking. More clarity.</p>
      </header>

      <form id="chooseWiseForm" class="form-section">
        <div class="choice-row">
          ${labelHTML('optionA', 'Option A:')}
          <input
            type="text"
            id="optionA"
            value="${state.optionAName}"
            onchange="window.chooseWiseForm.handleOptionAChange(event)"
            placeholder="Job Offer A"
            class="option-input ${state.optionAName === '' ? 'placeholder' : ''}"
          />
          ${labelHTML('optionB', 'Option B:')}
          <input
            type="text"
            id="optionB"
            value="${state.optionBName}"
            onchange="window.chooseWiseForm.handleOptionBChange(event)"
            placeholder="Job Offer B"
            class="option-input ${state.optionBName === '' ? 'placeholder' : ''}"
          />
        </div>

        <div class="criteria-section">
          <button type="button" class="add-criterion-btn" onclick="window.chooseWiseForm.addCriterion()">Add criterion</button>

          ${criteriaHTML.length > 0 ? criteriaHTML : '<p class="empty-criteria">Add criteria to begin</p>'}
        </div>

        <button
          type="submit"
          class="compare-btn ${compareDisabled ? 'disabled' : ''}"
          ${compareDisabled ? 'disabled' : ''}
          onclick="window.chooseWiseForm.compareOptions(event)"
        >
          ${compareDisabled ? 'Compare my options' : 'Compare my options'}
        </button>

        ${compareDisabled ? `<p class="validation-message">${compareMessage}</p>` : ''}
      </form>
    `

    formEl.innerHTML = formHTML
  }

  /** Initialize form with the given form element */
  function init(formEl: HTMLFormElement) {
    unsubscribe = store.subscribe(() => render(formEl))
    render(formEl)
  }

  return { init, render }
}