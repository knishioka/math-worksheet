# Pull Request Messaging Guidelines

To keep our review process smooth and highlight the educational value of each change, compose pull request descriptions with the following structure:

## 1. Background / Context
- Summarize the learner or teacher problem the change addresses.
- Mention any prior incidents, regression reports, or feedback that motivated the work.
- Link to relevant specs, planning documents, or issues from the `docs/` tree when they provide additional detail.

## 2. Value Delivered
- Explain how the change improves worksheet quality, UI clarity, or authoring workflow.
- Call out any measurable impact (e.g., new coverage by verification scripts, reduced error states).
- Describe how the change preserves accessibility and grade-level appropriateness.

## 3. Implementation Highlights
- Briefly note the main components, utilities, or scripts touched.
- Mention noteworthy design decisions or trade-offs reviewers should be aware of.

## 4. Quality Gates
- List every lint, test, or verification command executed (e.g., `npm run lint`, `npm test -- --run`, `node verify-generation.mjs`).
- Include any manual QA steps, especially for worksheet rendering or MathML output.

## 5. Related Issues / Tasks
- Reference related GitHub issues using the `Closes #123` syntax when the PR resolves them.
- For exploratory work linked to ongoing investigations, note the issue number without closing it (e.g., `Related to #456`).

## 6. Additional Notes
- Highlight follow-up work if the change is part of a multi-step rollout.
- Mention documentation updates or newly added assets reviewers should consult.

Following this outline ensures reviewers understand the motivation, the educational value delivered, and the verification steps performed for every pull request.
