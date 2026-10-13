// ChooseWise — Main Application Entry Point
// Pure client-side, no framework, Vite + TypeScript + Vitest

import { createStore } from './utils/store'
import { createForm } from './components/Form'
import { createResults } from './components/Results'

// Initialize store with empty state
const store = createStore()

// Get form and results elements
const formEl = document.getElementById('chooseWiseForm') as HTMLFormElement
const resultsEl = document.querySelector('.results-section') as HTMLDivElement

// Initialize form and results, tied to the store
const form = createForm(store)
form.init(formEl)

const results = createResults(store, resultsEl)

// Store references on window for inline event handlers
(window as any).chooseWiseForm = {
  // Form handlers
  handleOptionAChange: (event: Event) => {
    const name = (event.target as HTMLInputElement).value
    store.setOptionAName(name)
    persistState(store.getState())
  },
  handleOptionBChange: (event: Event) => {
    const name = (event.target as HTMLInputElement).value
    store.setOptionBName(name)
    persistState(store.getState())
  },
  handleCriterionNameChange: (event: Event, index: number) => {
    const name = (event.target as HTMLInputElement).value
    const state = store.getState()
    const criteria = [...state.criteria]
    criteria[index].name = name
    store.setState({ criteria })
    persistState(store.getState())
  },
  handleCriterionWeightChange: (event: Event, index: number) => {
    const weight = Number((event.target as HTMLInputElement).value)
    const state = store.getState()
    const criteria = [...state.criteria]
    criteria[index].weight = weight
    store.setState({ criteria })
    persistState(store.getState())
  },
  handleCriterionRatingAChange: (event: Event, index: number) => {
    const rating = Number((event.target as HTMLInputElement).value)
    const state = store.getState()
    const criteria = [...state.criteria]
    criteria[index].ratingA = rating
    store.setState({ criteria })
    persistState(store.getState())
  },
  handleCriterionRatingBChange: (event: Event, index: number) => {
    const rating = Number((event.target as HTMLInputElement).value)
    const state = store.getState()
    const criteria = [...state.criteria]
    criteria[index].ratingB = rating
    store.setState({ criteria })
    persistState(store.getState())
  },
  handleReflectionChange: (event: Event) => {
    const text = (event.target as HTMLTextAreaElement).value
    store.setReflection(text)
    persistState(store.getState())
  },
  addCriterion: () => {
    const state = store.getState()
    const criterion: CriterionFormValues = {
      name: '',
      weight: 5,
      ratingA: 5,
      ratingB: 5
    }
    store.addCriterion(criterion)
    persistState(store.getState())
  },
  removeCriterion: (index: number) => {
    const state = store.getState()
    const criteria = state.criteria.filter((_, i) => i !== index)
    store.setState({ criteria })
    persistState(store.getState())
  },
  compareOptions: (event: Event) => {
    event.preventDefault()
    const state = store.getState()

    // Validate form
    const criteriaForValidation = state.criteria.map(c => ({
      name: c.name,
      weight: c.weight,
      ratingA: c.ratingA,
      ratingB: c.ratingB
    }))

    const validation = validateForm(state.optionAName, state.optionBName, criteriaForValidation)

    if (!validation.valid) {
      // Show inline message
      ;(document.querySelector('.validation-message') as HTMLParagraphElement).textContent =
        validation.message || 'Invalid form'
      return
    }

    // Show comparing state
    store.setState({ isComparing: true })
    persistState(store.getState())

    // Calculate
    const weights = state.criteria.map(c => c.weight)
    const ratingsA = state.criteria.map(c => c.ratingA)
    const ratingsB = state.criteria.map(c => c.ratingB)
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)

    const scoreA = calculateWeightedAverage(ratingsA, weights)
    const scoreB = calculateWeightedAverage(ratingsB, weights)

    // Contributions with original-input-order tie-breaking
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

    const reflectionText = state.reflection

    // Store results
    const resultData = {
      scoreA: Number(scoreA.toFixed(1)),
      scoreB: Number(scoreB.toFixed(1)),
      difference,
      classification,
      contributions,
      tradeOffs,
      reflectionText
    }

    store.setState({ ...state, showResults: true, lastResult: resultData })
    persistState(store.getState())
  },
  editComparison: () => {
    // Return to form with all inputs preserved including reflection
    const state = store.getState()
    // The form already has the state; just switch back to form view
    store.setState({
      showResults: false,
      isComparing: false
    })
    persistState(store.getState())
  }
}

// Persist state to localStorage on every change
function persistState(state: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chooseWise_state', JSON.stringify(state))
  }
}

// Initial render
form.render()
results.render()

// Form submit handler
formEl.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault()
  ;(window as any).chooseWiseForm.compareOptions(event)
})