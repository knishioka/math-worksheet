# AGENT Guidelines for math-worksheet

This repository hosts a React + TypeScript application that generates printable MathML worksheets for the Japanese elementary-school curriculum. Its primary goal is to produce accurate, scaffolded practice material that reinforces calculation skills while remaining accessible for teachers to distribute. Follow the practices below to keep contributions aligned with both the project’s conventions and its educational mission.

## Repository Snapshot
- UI code lives in `src/` and relies on React 18, Zustand, and Tailwind for state and styling.
- Worksheet generation logic is primarily under `src/features/` and `src/utils/`.
- Tests use Vitest with the Testing Library stack (happy-dom environment).
- Validation scripts such as `verify-generation.mjs`, `verify-carry-over.mjs`, and `verify-ui-behavior.mjs` provide focused regression checks for worksheet content.

## Required Quality Gates
- Run ESLint before every commit: `npm run lint`.
- Run the Vitest suite in non-watch mode before every commit: `npm test -- --run`.
- When touching worksheet-generation logic, also run the relevant verification scripts (e.g., `node verify-generation.mjs`). Mention any extra checks executed in the final report.
- When changes may influence MathML structure, layout, or carrying explanations, run the associated verification script(s) (`verify-ui-behavior.mjs`, `verify-carry-over.mjs`, etc.) so exported worksheets remain classroom ready.

## Development Workflow
- Practice TDD: update or add failing tests under `src/**/*.test.{ts,tsx}` (or adjacent `__tests__` folders) **before** implementing fixes/features.
- Prefer React Testing Library for UI behavior and plain Vitest assertions for pure utilities.
- Keep changes minimal—only touch files directly related to the task. Avoid introducing temporary scripts, exploratory tests, or documentation unless explicitly required.
- Remove any debugging scaffolding prior to finalizing the change.
- Use realistic worksheet scenarios (e.g., mixed addition/subtraction for grade-specific levels) when creating fixtures or tests so failures highlight learner-facing issues early.
- Prioritize clear naming that reflects the learning objective (e.g., `carryOverHint`, `gradeLevelConstraints`) to help future contributors maintain the educational framing.

## Communication Expectations
- Summaries must highlight user-facing effects (UI, worksheet content, or tooling) and cite the modified files.
- Always report the exact lint/test/verification commands executed, noting any failures.
- Surface any implications to the student learning flow (e.g., altered difficulty progression or hint visibility) in the final report so reviewers can assess educational impact.
- Ensure the PR title/body created via automation reflects both the functional changes and the quality gates you ran. When drafting
  the description, follow the structure in `docs/technical/pr-guidelines.md` so reviewers understand the background, delivered
  value, and linked issues.
