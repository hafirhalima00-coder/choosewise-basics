---
doc: prd
status: approved
---
<!-- `status` is the progress state every skill reads. Write `draft` when you first save this file,
     and change it to `approved` when the learner clearly approves the displayed plan ("looks good" counts).
     Do not request a second sign-off. Never skip the draft save —
     an unsaved draft dies with the conversation. -->

<!-- This is the complete product definition: the scope sketch, filled in. Adapt it
     to the product. Drop any section that doesn't apply, and add sections this product
     needs. Completeness is the standard, not length — a short PRD for a small product
     is correct. Keep it inside the approved POC boundary.

     Keep heading names stable and descriptive: `4-spec` and `5-build` reference
     them by name. -->

# ChooseWise — Product Requirements

A calm, transparent decision-making tool that helps overthinkers compare two options by scoring them against personal priorities — then explains *why* one scores higher without making the choice for them.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`

## The Core Journey

1. **Arrival** — User opens ChooseWise. Sees a clean decision workspace: app name, tagline ("Less overthinking. More clarity."), brief explanation, two editable option fields ("Option A", "Option B") with placeholders, "What matters to you?" section with "Add criterion" button, and a disabled "Compare my options" button.
2. **Enter choices** — User types names for both options (e.g., "Job Offer A", "Job Offer B").
3. **Add criteria** — User clicks "Add criterion" one or more times. Each criterion gets a name (e.g., "Salary"), importance weight (1–10), and two ratings (1–10 each for Option A and Option B).
4. **Validate** — "Compare my options" enables only when: both option names are non-empty, at least one criterion is complete (name + weight + both ratings), and no invalid/incomplete criteria remain in the list.
5. **Compare** — User clicks "Compare my options." Results appear below the form on the same page.
6. **See score summary** — Side-by-side cards show each option's name, weighted-average score out of 10 (1 decimal), the numerical difference, and a neutral summary ("Option A scores slightly higher..." / "It's a tie..." / "Options are closely matched").
7. **Read "Why this score?"** — Dynamically generated explanation ranking criteria by contribution to the score difference, showing weight, both ratings, and direction/size of each criterion's contribution.
8. **See trade-offs** — "Option A's strengths" and "Option B's strengths" list criteria where each option rates higher, with rating difference and importance. Equal ratings shown as neutral.
9. **Reflect** — "What could change my mind?" card with multiline text area. User may leave blank or write thoughts. Does not affect calculations.
10. **Edit & re-compare** — "Edit my comparison" returns to form with all inputs preserved. Changes recalculate and replace results.
11. **Success** — User completes a realistic comparison in 60–90 seconds, verifies arithmetic, edits a rating, sees explanation update.

## Screens and Layout

**Single page, two vertical sections:**

**Top section (always visible): Input Form**
- Header: ChooseWise name + logo + tagline + brief explanation
- Two choice cards side by side (stack on mobile): editable name fields with placeholders
- "What matters to you?" section: dynamic list of criteria rows
  - Each row: criterion name input, weight input (1–10), Option A rating (1–10), Option B rating (1–10), remove button
  - "Add criterion" button adds a new empty row
  - Validation messages inline for incomplete/invalid rows
- Primary "Compare my options" button (disabled until valid)

**Bottom section (appears after Compare): Results**
- Score summary: two side-by-side cards with option names, scores (1 decimal), difference, neutral summary text
- "Why this score?": ranked list of criteria by contribution magnitude, each showing weight, both ratings, contribution to difference
- Trade-offs: two columns/cards — "Option A's strengths", "Option B's strengths" with advantage details
- "What could change my mind?": reflection card with heading, question, multiline text area
- "Edit my comparison" button (returns to form, preserves all inputs)

**Responsive:** Stacks vertically on screens < 768px; side-by-side on wider screens. No horizontal scrolling.

## Look and Feel

- **Palette:** Soft lavender (#E6E0F8), pastel purple (#C8B8E8), white (#FFFFFF), subtle dark gray text (#333333)
- **Typography:** Sans-serif, slightly rounded friendly character — Inter or Nunito. Headings slightly more expressive, readability first.
- **Spacing:** Generous whitespace, consistent vertical rhythm
- **Cards:** White background, rounded corners (12–16px), subtle borders (1px, #E8E0F0), restrained shadows (0 2px 8px rgba(0,0,0,0.04))
- **Buttons:** Primary — lavender background, white text, rounded; Disabled — muted opacity, not clickable
- **Inputs:** Clean borders, focus state with lavender ring, clear validation states
- **Overall:** Calm, thoughtful, premium — not childish or overly decorative. Polished, original interface.
- **Reference aesthetic:** Notion's calm minimalism meets a well-designed calculator.

## Features and Behavior

### Enter Choices
- Two editable text fields labeled "Option A" and "Option B"
- Placeholders: "Job Offer A", "Job Offer B" (or similar examples)
- Entered names carry into results and persist on edit
- **Acceptance criteria:**
  - [ ] Both fields visible and editable on load
  - [ ] Placeholders shown when empty
  - [ ] Names appear correctly in results
  - [ ] Empty/whitespace-only names prevent comparison

### Add and Manage Criteria
- "Add criterion" button appends a new criterion row
- Each row: name (text), weight (number 1–10), Option A rating (number 1–10), Option B rating (number 1–10), remove button
- Users can add multiple criteria; remove any criterion
- **Acceptance criteria:**
  - [ ] Users can add and remove criteria
  - [ ] Each criterion has name, weight (1–10), two ratings (1–10)
  - [ ] Values outside 1–10 rejected or flagged inline
  - [ ] Removing a criterion updates form and subsequent calculations
  - [ ] At least one complete criterion required for Compare

### Validate and Enable Compare
- Compare button disabled until: both option names non-empty, ≥1 complete criterion, **and no invalid/incomplete criteria remain in the list**
- A criterion is **complete** only when it has: non-empty name, valid integer weight 1–10, valid integer ratings 1–10 for both options
- Incomplete criteria may stay in the editable form but block comparison until completed or removed
- Inline validation messages for missing/invalid fields
- Defensive validation on click (even if disabled state bypassed)
- **Acceptance criteria:**
  - [ ] Compare disabled until all validity conditions met
  - [ ] Missing/invalid values clearly identified inline
  - [ ] Button enables only when every criterion in list is complete
  - [ ] Defensive click validation prevents invalid calculation
  - [ ] Incomplete criteria never silently included in calculation

### Calculate Weighted Averages
- Formula for each option: `score = sum(weight × rating) / sum(weights)` (weighted average out of 10)
- Calculated with full precision internally; displayed rounded to 1 decimal
- Recalculates on every Compare click
- **Per-criterion contribution to score difference:**
  `contribution = weight × (ratingA − ratingB) / sumOfAllWeights`
  - Positive → favors Option A; negative → favors Option B
  - Used for ranking in "Why this score?" and shown in score points (1 decimal)
- **Acceptance criteria:**
  - [ ] Both scores match formula exactly
  - [ ] Displayed to 1 decimal place, out of 10
  - [ ] Changing weight/rating and re-comparing updates correctly
  - [ ] Internal precision preserved; rounding only for display
  - [ ] Per-criterion contributions computed with formula above
  - [ ] Contributions ranked by absolute value descending

### Show Score Summary
- Two cards side by side: option name, weighted-average score (1 decimal)
- Numerical difference shown (based on displayed rounded scores)
- Neutral summary text determined by **full-precision weighted scores** (not rounded display):
  1. **Tie:** If full-precision scores are exactly equal → "It's a tie based on your current ratings."
  2. **Close:** Else if absolute difference ≤ 0.5 → "Options are closely matched."
  3. **Lead:** Else → "Option A scores higher based on your ratings." (or Option B)
- Never presents higher score as objectively best choice
- **Acceptance criteria:**
  - [ ] Both names and scores appear side by side
  - [ ] Difference numerically correct
  - [ ] Summary uses neutral language
  - [ ] Tie detected on full-precision equality
  - [ ] Close detected on full-precision difference ≤ 0.5
  - [ ] Lead message for larger differences

### Generate "Why This Score?" Explanation
- Dynamically generated from actual input data (never hardcoded)
- **Contribution formula per criterion:** `weight × (ratingA − ratingB) / sumOfAllWeights`
  - Positive → favors Option A; negative → favors Option B
  - Represents the criterion's effect on the overall score difference in points out of 10
- Criteria ranked by absolute contribution descending
- Each entry shows: criterion name, weight, Option A rating, Option B rating, which option benefits, contribution magnitude (1 decimal)
- Criteria with equal ratings (contribution = 0) not described as differentiators
- Explanation consistent with displayed scores and full-precision calculations
- **Acceptance criteria:**
  - [ ] Uses actual input data only
  - [ ] Contributions computed with precise formula above
  - [ ] Criteria ranked by absolute contribution descending
  - [ ] Identifies benefiting option and contribution size (1 decimal)
  - [ ] Zero-contribution criteria not described as differentiators
  - [ ] Consistent with displayed scores

### Show Trade-offs
- Two sections: "Option A's strengths", "Option B's strengths"
- Each lists criteria where that option's rating is **strictly higher** than the other's
- Each entry shows: criterion name, rating gap (e.g., "+3"), importance weight
- **Normalized weighted contribution** (from "Why this score?") also shown so users distinguish raw rating gap from actual score effect
- Equal ratings → not listed as strengths (neutral)
- If neither option has a higher rating on any criterion: "Neither option has an advantage under the current ratings."
- **Acceptance criteria:**
  - [ ] Each option's strengths list only criteria where it rates strictly higher
  - [ ] Entries show rating gap and weight
  - [ ] Normalized weighted contribution shown alongside
  - [ ] Equal ratings not listed as strengths
  - [ ] Clear message when no advantages exist

### "What Could Change My Mind?" Reflection
- Reflection card appears in results with heading, question, multiline text area
- Placeholder: "If Option B offered more flexibility, I might reconsider…"
- User can type, edit, leave blank
- **Does not affect calculations, explanations, or trade-offs**
- Text preserved during edit/re-compare within session
- **Acceptance criteria:**
  - [ ] Heading, question, and multiline field appear in results
  - [ ] User can type, edit, or leave blank
  - [ ] Reflection does not affect calculations, explanations, or trade-offs
  - [ ] Text persists while editing and re-comparing

### Edit and Re-compare
- "Edit my comparison" button in results returns to form
- All inputs preserved: option names, criteria (names, weights, ratings), reflection text
- New Compare recalculates and replaces explanation/trade-offs
- **Acceptance criteria:**
  - [ ] Edit returns to form with all inputs preserved
  - [ ] Changes reflected in new results
  - [ ] Old explanations/trade-offs replaced by updated ones
  - [ ] No input loss during edit cycle

## States and Boundaries

- **First visit / empty state** — Empty form with placeholders, Compare disabled, no results shown
- **Incomplete criterion** — Users may add/edit partial criteria, but only complete criteria (non-empty name + integer weight 1–10 + integer ratings 1–10 for both options) count toward valid comparison. Subtle inline validation for missing fields. Compare requires ≥1 complete criterion and **no invalid/incomplete criteria in the list** (must complete or remove them).
- **All equal ratings** — Full-precision scores equal; message "It's a tie based on your current ratings." Why: "Neither option scores higher because both received identical ratings across all criteria." Trade-offs: "Neither option has an advantage under the current ratings."
- **Single criterion** — Works normally. Explanation identifies it as sole differentiator or explains tie. Trade-offs reflect actual ratings.
- **Editing after comparison** — All inputs preserved including reflection. Re-compare recalculates and replaces results.
- **No criteria added** — Compare disabled; defensive click validation prevents calculation.
- **Mobile layout** — Vertical stack < 768px; side-by-side ≥ 768px. Readability prioritized, no horizontal scroll.
- **Persistence** — None required for POC (session only). Local storage deferred.

## Product Decisions

- **Weighted-average out of 10** — Not raw weighted sum. Reason: intuitive, comparable, matches mental model of "score out of 10."
- **Dynamic explanation ranked by contribution** — Not static template. Reason: the kernel is transparent explanation from actual data.
- **Neutral language always** — No "winner," "better," "recommended." Reason: kernel is understanding, not deciding for user.
- **Single page, no navigation** — Form and results on one page. Reason: reduces friction, keeps context visible, demo-friendly.
- **Partial criteria allowed in list but not in calculation** — Reason: lets users build gradually; clear validation prevents silent errors.
- **Reflection is free-text, non-functional** — Reason: encourages thinking, doesn't pretend to be analytical.
- **Responsive breakpoint ~768px** — Reason: conventional, works for side-by-side cards.
- **No local storage in POC** — Reason: scope cuts it to Later; keeps build focused.

## What We're Building

Everything in `scope.md > The POC Boundary > In`, fully specified above:
- Two-choice comparison with criteria (name, weight 1–10, two ratings 1–10)
- Weighted-average calculation (sum w×r / sum w) displayed to 1 decimal
- Score summary with neutral language for lead/close/tie
- "Why this score?" dynamic explanation ranked by contribution
- Trade-offs breakdown (strengths per option, neutral for equal)
- "What could change my mind?" free-text reflection
- Edit/re-compare preserving all inputs
- Calm lavender/white responsive design (Inter/Nunito, rounded cards, subtle shadows)
- Pure client-side, no backend, no auth, no AI API

## Deferred From the POC

- **Local storage to save/load comparisons** — Worth doing, adds continuity. Out for now because it adds persistence complexity without proving the core kernel.
- **Saved comparisons list/history** — Depends on local storage. Out for same reason.

## Possible Later Enhancements

- Export comparison as text/PDF
- Shareable link for a comparison
- More than two options (n-ary comparison)
- Pre-built templates for common decisions (jobs, majors, purchases)
- Dark mode

## Non-Goals

- User accounts, backend, database — adds complexity, not core value
- AI-assisted scoring/suggestions — contradicts the "you decide" kernel
- Multiple decision types (n-ary, yes/no) — binary is the sharp kernel
- Collaboration, sharing, export — out of scope for proof of concept
- Historical analytics — not needed to demonstrate the core loop
- Mobile app — responsive web covers it

## Open Questions

None — all consequential decisions resolved. Ready for `4-spec`.