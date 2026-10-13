---
doc: scope
status: approved
---
<!-- `status` is the progress state every skill reads. Write `draft` when you first save this file,
     and change it to `approved` when the learner clearly approves the displayed plan ("looks good" counts).
     Do not request a second sign-off. Never skip the draft save —
     an unsaved draft dies with the conversation. -->

<!-- Scope is a rough sketch of the heart of the idea — NOT the detailed
     product definition. Resist the urge to fill this out exhaustively: features, screens,
     and behavior belong in the PRD, which comes next. Capture what makes this
     project distinctive and what belongs in a coherent proof of concept.
     Add a section if the conversation surfaced something important that
     doesn't fit below. Keep it short and readable. -->

# ChooseWise

A calm, transparent decision-making tool that helps overthinkers compare two options by scoring them against personal priorities — then explains *why* one scores higher without making the choice for them.

## The Unique Kernel

**Transparent explanation without deciding for the user.** ChooseWise calculates a **weighted-average score out of 10** (sum of weight × rating ÷ sum of weights), then breaks down *which criteria drove the difference*, highlights trade-offs where each option wins, and includes a **"What could change my mind?"** reflection — turning a score into understanding, not an answer. Explanations are generated dynamically from actual scores, ranking criteria by their contribution to the difference. Language stays neutral; close scores are explained carefully; the calculation is never presented as an objectively correct decision.

## Who It's For

A student choosing between two majors, a job seeker comparing offers, a freelancer picking between projects, or anyone facing a binary decision who keeps second-guessing themselves. Today they make spreadsheets, ask friends, or ruminate — all of which add noise instead of clarity.

## The Core Loop

Open ChooseWise → enter two choices → add 3–5 criteria with importance weights → score both options → see side-by-side comparison with explanation and trade-offs → complete "What could change my mind?" reflection → decide with confidence. They come back when the next decision feels stuck.

## Inspiration & Identity

Calm, minimal, trustworthy. Soft lavender, pastel purple, and white palette. Generous whitespace, clear cards, readable typography. Feels like a thinking tool, not a productivity app. No gamification, no urgency. Reference aesthetic: Notion's calm minimalism meets a well-designed calculator.

## Why This Matters to the Learner

Practicing plan-first, spec-driven workflow with an AI agent on a real project — turning an idea into clear requirements, making intentional technical decisions, building and testing step by step, and finishing with a working app I understand well enough to explain confidently to hackathon judges.

## What "Working" Looks Like

Open the app in a browser. Enter "Job Offer A" and "Job Offer B." Add criteria: Salary (weight 5), Work-Life Balance (weight 4), Career Growth (weight 3), Commute (weight 2). Score each 1–10. See real-time **weighted-average scores out of 10** (e.g., Offer A: 7.8, Offer B: 6.5). Read the explanation: "Offer A scores higher by 1.3 points, driven most by Salary (+0.7) and Career Growth (+0.3); Offer B wins on Work-Life Balance (+0.4) and Commute (+0.2)." Trade-offs are explicit. Close scores are noted: "The difference is small — your preference on Work-Life Balance could flip the result." Complete the reflection: "If Offer B matched the salary, I'd choose it." The whole demo takes 60–90 seconds.

## The POC Boundary

**In:**
- Two-choice comparison (binary only)
- Criteria with importance weights (1–10) and scores (1–10)
- Real-time **weighted-average calculation** (sum of weight × rating ÷ sum of weights), displayed as scores out of 10
- Side-by-side results view with both weighted-average scores
- **Kernel:** "Why this score" explanation generated dynamically, ranking criteria by contribution to the score difference
- **Kernel:** Trade-offs breakdown showing where each option wins
- **Kernel:** "What could change my mind?" free-text reflection
- Neutral language: close scores explained carefully; calculation never presented as objectively correct
- Tie/incomplete handling with clear messaging
- Calm lavender/white responsive design
- Pure client-side (HTML/CSS/JS or lightweight framework), no backend, no auth, no AI API

## Later

- Local storage to save/load multiple comparisons
- Saved comparisons list/history

## Explicitly Cut

- User accounts, backend, database — adds complexity, not core value
- AI-assisted scoring/suggestions — contradicts the "you decide" kernel
- Multiple decision types (n-ary, yes/no) — binary is the sharp kernel
- Collaboration, sharing, export — out of scope for proof of concept
- Historical analytics — not needed to demonstrate the core loop
- Mobile app — responsive web covers it