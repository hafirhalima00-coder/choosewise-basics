import {
  calculateWeightedAverage,
  calculateContributions,
  sortContributions,
  classifyResult,
  calculateTradeOffs
} from '../calculations'

describe('calculateWeightedAverage', () => {
  it('computes weighted average with full precision', () => {
    // Offer A: Salary weight=5, rating=8; Work-Life weight=4, rating=6
    // score = (5*8 + 4*6) / (5+4) = (40+24)/9 = 64/9 ≈ 7.111...
    const result = calculateWeightedAverage([8, 6], [5, 4])
    expect(result).toBeCloseTo(7.111, 3)
  })

  it('returns 0 when total weight is 0', () => {
    expect(calculateWeightedAverage([5, 3], [0, 0])).toBe(0)
  })
})

describe('calculateContributions', () => {
  it('computes per-criterion contributions', () => {
    // Two criteria, total weight = 9
    // Criterion 1: weight=5, ratings differ by 2 → contribution = 5*2/9 = 10/9
    // Criterion 2: weight=4, ratings differ by 1 → contribution = 4*1/9 = 4/9
    const criteria = [
      { weight: 5, ratingA: 8, ratingB: 6, order: 0 },
      { weight: 4, ratingA: 7, ratingB: 6, order: 1 }
    ]
    const totalWeight = 9
    const contributions = calculateContributions(criteria, totalWeight)

    expect(contributions[0].contribution).toBeCloseTo(10 / 9, 5)
    expect(contributions[1].contribution).toBeCloseTo(4 / 9, 5)
    expect(contributions[0].order).toBe(0)
    expect(contributions[1].order).toBe(1)
  })
})

describe('sortContributions', () => {
  it('sorts by absolute value descending, tie-broken by input order', () => {
    const contributions = [
      { contribution: 0.5, order: 2 },
      { contribution: -0.8, order: 0 },
      { contribution: 0.3, order: 1 }
    ]
    const sorted = sortContributions(contributions)
    expect(sorted[0].contribution).toBe(-0.8) // largest absolute
    expect(sorted[1].contribution).toBe(0.5) // second largest
    expect(sorted[2].contribution).toBe(0.3) // smallest
  })

  it('preserves input order for equal absolute contributions', () => {
    const contributions = [
      { contribution: 0.5, order: 0 },
      { contribution: -0.5, order: 1 },
      { contribution: 0.2, order: 2 }
    ]
    const sorted = sortContributions(contributions)
    // Both 0.5 and -0.5 have equal absolute value;
    // tie-broken by input order: order 0 comes before order 1
    expect(sorted[0].contribution).toBe(0.5)
    expect(sorted[1].contribution).toBe(-0.5)
  })
})

describe('classifyResult', () => {
  it('returns tie when scores are exactly equal', () => {
    expect(classifyResult(7.0, 7.0)).toBe('tie')
  })

  it('returns close when difference ≤ 0.5', () => {
    expect(classifyResult(6.8, 7.2)).toBe('close')   // diff = 0.4
    expect(classifyResult(7.0, 7.5)).toBe('close')   // diff = 0.5
    expect(classifyResult(7.5, 7.0)).toBe('close')   // diff = -0.5
  })

  it('returns lead when difference > 0.5', () => {
    expect(classifyResult(7.0, 7.6)).toBe('lead')   // diff = -0.6
    expect(classifyResult(8.0, 7.0)).toBe('lead')   // diff = 1.0
    expect(classifyResult(7.0, 8.0)).toBe('lead')   // diff = -1.0
  })
})

describe('calculateTradeOffs', () => {
  it('identifies advantages for each option', () => {
    const criteria = [
      { weight: 5, ratingA: 8, ratingB: 6, order: 0 },
      { weight: 4, ratingA: 5, ratingB: 7, order: 1 }
    ]
    const result = calculateTradeOffs(criteria)
    expect(result.optionAAdvantages.length).toBe(1)
    expect(result.optionBAdvantages.length).toBe(1)
    expect(result.neutral).toBe(false)
  })

  it('returns neutral when all ratings are equal', () => {
    const criteria = [
      { weight: 5, ratingA: 7, ratingB: 7, order: 0 }
    ]
    const result = calculateTradeOffs(criteria)
    expect(result.optionAAdvantages.length).toBe(0)
    expect(result.optionBAdvantages.length).toBe(0)
    expect(result.neutral).toBe(true)
  })
})