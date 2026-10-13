---
doc: spec
status: approved
---

# ChooseWise — Technical Spec

A calm, transparent decision-making tool that helps overthinkers compare two options by scoring them against personal priorities — then explains *why* one scores higher without making the choice for them.

Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`, `prd.md > The Core Journey`

## How This Works, In Plain Language

The app is a single-page form where the user enters two options and scores them against personal criteria. After clicking "Compare my options," the app calculates weighted-average scores out of 10 for each option using full internal precision, then rounds to 1 decimal for display. It then shows:

- A score summary with neutral language (lead/close/tie), using full-precision scores for tie/close detection
- A "Why this score?" explanation ranking criteria by absolute contribution magnitude descending, with a deterministic tie-breaker (original input order)
- Trade-offs showing where each option rates higher
- A "What could change my mind?" reflection

All calculations are pure client-side math — no backend, no auth, no AI API. The heaviest idea is the weighted-average formula and contribution ranking, which drives the kernel's transparent explanation.

**Formula summary** (for reference, displayed in developer notes):
- Weighted average per option: `score = sum(weight × rating) / sum(weights)`, full precision internally, rounded 1 decimal for display
- Per-criterion contribution: `contribution = weight × (ratingA − ratingB) / sum(weights)`, ranked by absolute value descending, tie-broken by original input order (first criterion added appears first)
- Tie: full-precision scores exactly equal → "It's a tie based on your current ratings."
- Close: absolute full-precision difference ≤ 0.5 → "Options are closely matched."
- Lead: otherwise → "Option A scores higher based on your ratings." (or Option B)

## The Core Journey Through the System

The PRD's Core Journey, traced step by step through the pieces above:

1. User opens ChooseWise → sees clean workspace with app name, tagline, explanation, two option fields, criteria area, disabled Compare button
2. User enters two option names → names carry into results and persist on edit
3. User adds criteria one by one → each criterion gets name, weight (1–10), Option A rating (1–10), Option B rating (1–10)
4. User clicks "Compare my options" → button enables only when both names are non-empty, ≥1 complete criterion exists, and every criterion is complete and valid: non-empty name, integer weight 1–10, integer ratings 1–10 for both options. Incomplete or invalid criteria block comparison until completed or removed.
5. Results appear below the form → score summary cards, "Why this score?" explanation, trade-offs, reflection
6. User reads "Why this score?" → dynamically generated explanation ranking criteria by absolute contribution magnitude
7. User sees trade-offs → Option A's strengths and Option B's lists criteria where each rates strictly higher
8. User reflects → types "What could change my mind?" in multiline text area; does not affect calculations
9. User clicks "Edit my comparison" → returns to form with all inputs preserved; new Compare recalculates and replaces results
10. User verifies arithmetic and edits ratings → re-comparing updates explanation and trade-offs
11. User completes comparison in 60–90 seconds, confirms the calculation is correct

PRD ref: `prd.md > The Core Journey`.

## Stack

- **Language:** TypeScript
- **Build tool:** Vite
- **Runtime:** Browser (pure client-side)
- **State management:** Small pub/sub store (custom, no framework)
- **Testing:** Vitest
- **CSS:** Single global CSS file, vanilla CSS with CSS variables for theming
- **No frameworks** — vanilla TS for maximum control and simplicity

Documentation links:
- Vite: https://vitejs.dev/
- Vitest: https://vitest.dev/

Rationale: The learner has solid TS experience and wants to practice plan-first workflow without framework overhead. Pure client-side math is sufficient for the kernel; no backend complexity needed.

## Where It Runs and How Someone Tries It

Runtime: Browser (any modern browser). No server, no deployment required for the POC.

To try it locally:
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the Vite dev server
3. Open the local URL (typically http://localhost:5173) in a browser
4. The app loads with the empty form, Compare disabled

Submission requires both a short demo video and a public GitHub repository. The local app is sufficient for the video recording — no deployment needed unless the learner chooses otherwise.

## Look and Feel

- **Palette:** Soft lavender (#E6E0F8), pastel purple (#C8B8E8), white (#FFFFFF), dark gray text (#333333)
- **Typography:** Inter, sans-serif, slightly rounded friendly character
- **Spacing:** Generous whitespace, consistent vertical rhythm
- **Cards:** White background, 12–16px rounded corners, 1px #E8E0F0 borders, subtle shadows (0 2px 8px rgba(0,0,0,0.04))
- **Buttons:** Primary — lavender background, white text, rounded; Disabled — muted opacity
- **Inputs:** Clean borders, focus state with lavender ring, clear validation states
- **Overall:** Calm, thoughtful, premium — Notion's calm minimalism meets a well-designed calculator

Must be consistent with the Stack: vanilla TS/CSS, no framework-imposed styling constraints.

## Components

### Form

What it does: Renders the input form with two option fields, dynamic criteria rows, and the Compare button. Handles input validation, state updates, and enables Compare when valid. Uses accessible labels (element-associated labels), full keyboard operability (Tab order: option A → option B → Add criterion → first criteria row → Compare), and responsive layout (stacks vertically < 768px, side-by-side ≥ 768px).

PRD ref: `prd.md > Enter Choices`, `prd.md > Add and Manage Criteria`, `prd.md > Validate and Enable Compare`

### Results

What it does: Renders the results section with score summary, "Why this score?" explanation, trade-offs, reflection, and Edit button. Receives computed data from Form component.

PRD ref: `prd.md > See score summary`, `prd.md > Generate "Why This Score?" Explanation`, `prd.md > Show Trade-offs`, `prd.md > "What Could Change My Mind?" Reflection`, `prd.md > Edit and Re-compare`

### Pub/Sub Store

What it does: Small global state store for option names, criteria list, and reflection text. Subscribers re-render when state changes.

PRD ref: `prd.md > States and Boundaries` (form state, incomplete criterion handling, all equal ratings, editing after comparison)

## Data Model

State shape:

```typescript
{
  optionAName: string;         // e.g., "Job Offer A"
  optionBName: string;         // e.g., "Job Offer B"
  criteria: Criterion[];
  reflection: string;          // "What could change my mind?" text
}

interface Criterion {
  id: string;                  // unique identifier
  name: string;                // e.g., "Salary"
  weight: number;             // 1–10
  ratingA: number;            // 1–10 for option A
  ratingB: number;            // 1–10 for option B
  complete: boolean;          // true when name + valid weight + valid ratings
}
```

Where data lives: entirely in the browser's memory (pub/sub store). No persistence beyond the session. On page reload, form resets (POC boundary decision).

When user leaves and comes back: form resets — local storage deferred per POC boundary.

## File Structure

```
chooseWise/
├── src/
│   ├── main.ts              // App entry, Vite rendering
│   ├── store.ts             // Pub/sub state store
│   ├── components/
│   │   ├── Form.tsx         // Input form component
│   │   └── Results.tsx      // Results display component
│   ├── utils/
│   │   ├── calculations.ts  // Weighted average, contribution ranking
│   │   └── validation.ts    // Input validation
│   └── styles/
│       └── global.css       // Single CSS file with variables
├── devpost/
│   ├── scope.md
│   ├── prd.md
│   └── spec.md              // This specification
├── index.html               // HTML entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The learner should be able to read the tree and know where everything lives. Generated dependency contents (node_modules) needn't be enumerated.

## External Services and Dependencies

Everything is pure client-side — no external APIs, databases, or hosting required for the POC.

Dependencies (devOnly):
- vitest: testing framework
- TypeScript: type safety

No API keys, no accounts, no rate limits, no cost.

## Important Failure Modes

1. **Calculation error with zero weights** — If sum of weights is 0, display "Add at least one criterion with a weight" instead of crashing. Fallback: show form again with error message.

2. **Empty form on Compare click** — Defensive validation prevents calculation when no complete criteria exist. Fallback: show inline message "At least one complete criterion required."

3. **Invalid input values** — Out-of-range weights or ratings are flagged inline; incomplete criteria are excluded from calculation. Fallback: user completes or removes invalid criteria.

## What Was Simplified and Why

- **No local storage** — Instead of persisting comparisons, the form resets on page reload. This keeps the build focused on the core kernel without persistence complexity. (`scope.md > Later: Local storage to save/load multiple comparisons`)
- **No backend** — All calculations are client-side. A backend would add infrastructure complexity without proving the kernel. (`prd.md > Deferred From the POC`)
- **No AI API** — Scores and explanations are purely user-driven. An AI API would contradict the "you decide" kernel. (`prd.md > Non-Goals`)
- **Binary comparison only** — Only two options are supported. N-ary comparison would expand scope beyond the POC boundary. (`scope.md > Explicitly Cut: Multiple decision types`)

## Testing and Build Verification

- **Automated tests (Vitest):** Unit tests for calculation functions (`calculation.ts`), validation logic (`validation.ts`), and component behavior. Test coverage includes weighted-average formula, per-criterion contributions, tie/close/lead detection, validation of incomplete/invalid criteria, and trade-offs edge cases. Run with `npm run test`.
- **Production build verification:** `npm run build` generates static assets in `dist/`. The build is verified by checking that the app serves correctly and all calculation logic executes without errors. No external dependencies or API keys required.
- **Accessibility testing:** Form labels are element-associated; focus order follows logical Tab sequence; color contrast meets minimum AA requirements against the lavender/purple palette against white background.

## Decisions and Open Issues

- **Technical decisions made:** Vite + TypeScript + vanilla CSS + pub/sub store + Vitest. All accepted by learner per profile.
- **Uncertainty identified:** None — all consequential decisions resolved from PRD and scope review.
- **Open questions carried from PRD:** None — PRD's "Open Questions: None" section.

Anything still unresolved from `prd.md > Open Questions`: None.

---

Save as soon as a first draft exists, with `status: draft`. Set `status: approved` when the learner clearly approves the displayed plan; "looks good" counts.

<review>
Show in the learner's Review Format. Does every PRD behavior have a home, are the stack choices sensible for this learner, is it sized to a small proof of concept, is the file structure real? Create devpost/spec.html with meaningful architecture diagrams (Mermaid or inline SVG) and a journey stepper tied to PRD behaviors. Markdown stays canonical; regenerate after revisions.

Give two to four sentences of honest feedback. Invite a careful read and ask once: "Does this look good, or would you change anything?" A clear "looks good" is approval: set `status: approved` and move on. If they request changes, resolve them, show the updated plan, and ask whether it looks right.
</review>