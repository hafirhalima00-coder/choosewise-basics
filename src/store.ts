/**
 * Small pub/sub state store for ChooseWise form state.
 * Keeps option names, criteria list, and reflection text.
 * Subscribers are notified when state changes; they re-render accordingly.
 */

// Store state interface
interface State {
  optionAName: string
  optionBName: string
  criteria: Array<{
    id: string
    name: string
    weight: number
    ratingA: number
    ratingB: number
    order: number
  }>
  reflection: string
}

// Subscriber type
type Subscriber = (state: State) => void

class Store {
  private state: State
  private subscribers: Set<Subscriber>

  constructor(initialState: Partial<State>) {
    this.subscribers = new Set()
    this.state = {
      optionAName: initialState.optionAName || '',
      optionBName: initialState.optionBName || '',
      criteria: initialState.criteria || [],
      reflection: initialState.reflection || ''
    }
  }

  /** Subscribe to state changes */
  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback)
    // Immediately notify with current state
    callback(this.state)
    return () => this.subscribers.delete(callback)
  }

  /** Get current state */
  getState(): State {
    return this.state
  }

  /** Update state and notify subscribers */
  setState(partial: Partial<State>) {
    this.state = { ...this.state, ...partial }
    for (const subscriber of this.subscribers) {
      subscriber(this.state)
    }
  }

  /** Add a new criterion */
  addCriterion(criterion: {
    name: string
    weight: number
    ratingA: number
    ratingB: number
  }) {
    const id = crypto.randomUUID()
    const order = this.state.criteria.length
    this.setState({
      criteria: [...this.state.criteria, { id, name: criterion.name, weight: criterion.weight, ratingA: criterion.ratingA, ratingB: criterion.ratingB, order }]
    })
  }

  /** Remove a criterion by id */
  removeCriterion(id: string) {
    this.setState({
      criteria: this.state.criteria.filter(c => c.id !== id)
    })
  }

  /** Update option A name */
  setOptionAName(name: string) {
    this.setState({ optionAName: name })
  }

  /** Update option B name */
  setOptionBName(name: string) {
    this.setState({ optionBName: name })
  }

  /** Update reflection text */
  setReflection(text: string) {
    this.setState({ reflection: text })
  }
}

// Export a factory function for creating the store
export function createStore(initialState: Partial<State> = {}) {
  return new Store(initialState)
}