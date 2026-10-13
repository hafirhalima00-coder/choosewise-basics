/**
 * Validation for criterion inputs:
 - name: non-empty string
 - weight: integer 1-10
 - ratingA: integer 1-10
 - ratingB: integer 1-10
 */
export function isValidWeight(w: unknown): w is number {
  return Number.isInteger(w) && w >= 1 && w <= 10
}

export function isValidRating(r: unknown): r is number {
  return Number.isInteger(r) && r >= 1 && r <= 10
}

export function isCompleteCriterion(
  name: unknown,
  weight: unknown,
  ratingA: unknown,
  ratingB: unknown
): boolean {
  return (
    typeof name === 'string' && name.trim().length > 0 &&
    isValidWeight(weight) &&
    isValidRating(ratingA) &&
    isValidRating(ratingB)
  )
}

/**
 * Validate the entire form state:
 - Both option names non-empty
 - At least one complete criterion
 - No incomplete or invalid criteria block the comparison
 */
export interface ValidationResult {
  valid: boolean
  message: string
  incompleteCriterionIndex?: number
}

export function validateForm(
  optionAName: string,
  optionBName: string,
  criteria: Array<{ name: string; weight: number; ratingA: number; ratingB: number }>
): ValidationResult {
  // Check option names
  if (!optionAName || !optionAName.trim()) {
    return { valid: false, message: 'Option A name is required' }
  }
  if (!optionBName || !optionBName.trim()) {
    return { valid: false, message: 'Option B name is required' }
  }

  // Find first incomplete criterion
  for (let i = 0; i < criteria.length; i++) {
    if (!isCompleteCriterion(criteria[i].name, criteria[i].weight, criteria[i].ratingA, criteria[i].ratingB)) {
      return { valid: false, message: 'Please complete or remove incomplete criteria', incompleteCriterionIndex: i }
    }
  }

  // Check that at least one criterion exists
  if (criteria.length === 0) {
    return { valid: false, message: 'Add at least one criterion' }
  }

  // All criteria are complete and valid
  return { valid: true, message: 'Valid' }
}