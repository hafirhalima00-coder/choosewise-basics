/**
 * Weighted average calculation for a single option.
 * score = sum(weight × rating) / sum(weights)
 * Full precision internally; caller rounds to 1 decimal for display.
 */
export function calculateWeightedAverage(
  ratings: number[],
  weights: number[]
): number {
  const weightedSum = ratings.reduce((sum, rating, i) => sum + weights[i] * rating, 0)
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  if (totalWeight === 0) return 0
  return weightedSum / totalWeight
}

/**
 * Per-criterion contribution to the score difference.
 * contribution = weight × (ratingA − ratingB) / sum(weights)
 * Ranked by absolute value descending, tie-broken by original input order
 * (first criterion added appears first in the explanation list).
 */
export function calculateContributions(
  criteria: {
    weight: number
    ratingA: number
    ratingB: number
    order: number
  }[],
  totalWeight: number
) {
  return criteria.map((criterion, order) => {
    const contribution = (criterion.weight * (criterion.ratingA - criterion.ratingB)) / totalWeight
    return {
      ...criterion,
      contribution,
      order: order // preserve input order for tie-breaking
    }
  })
}

/**
 * Sort contributions by absolute value descending, then by input order ascending
 * for deterministic tie-breaking (original form order).
 */
export function sortContributions(
  contributions: { contribution: number; order: number }[]
) {
  return [...contributions].sort((a, b) => {
    const absA = Math.abs(a.contribution)
    const absB = Math.abs(b.contribution)
    if (absA !== absB) return absB - absA // descending by absolute value
    return a.order - b.order // tie-breaker: original input order
  })
}

/**
 * Classify the comparison result based on full-precision scores.
 * Tie: exact equality of full-precision scores
 * Close: absolute difference ≤ 0.5
 * Lead: otherwise
 */
export function classifyResult(
  scoreA: number,
  scoreB: number
): 'tie' | 'close' | 'lead' {
  const diff = scoreA - scoreB
  if (diff === 0) return 'tie'
  if (Math.abs(diff) <= 0.5) return 'close'
  return 'lead'
}

/**
 * Determine trade-offs: criteria where one option rates strictly higher than the other.
 * Returns { optionAAdvantages: Criterion[], optionBAdvantages: Criterion[], neutral: boolean }
 */
export function calculateTradeOffs(
  criteria: {
    weight: number
    ratingA: number
    ratingB: number
    order: number
  }[]
) {
  const optionAAdvantages: typeof criteria = []
  const optionBAdvantages: typeof criteria = []
  let hasAdvantage = false

  for (const c of criteria) {
    if (c.ratingA > c.ratingB) {
      optionAAdvantages.push(c)
      hasAdvantage = true
    } else if (c.ratingB > c.ratingA) {
      optionBAdvantages.push(c)
      hasAdvantage = true
    }
  }

  return {
    optionAAdvantages,
    optionBAdvantages,
    neutral: !hasAdvantage
  }
}

export type { calculateWeightedAverage, calculateContributions, sortContributions, classifyResult, calculateTradeOffs }