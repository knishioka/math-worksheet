# Playwright MCP Integration for AI-Assisted Verification

How to use Playwright MCP with Claude Code (or other AI coding agents) for interactive visual verification of math worksheet problems.

## Overview

The verification loop:

1. **Generate** - AI agent implements or modifies a problem generator
2. **Render** - AI navigates to the app via Playwright MCP, selects the pattern
3. **Screenshot** - AI captures the rendered output
4. **Review** - AI analyzes the screenshot for visual correctness
5. **Fix** - AI fixes any issues found and repeats

This replaces manual browser inspection and catches bugs like self-referential names, incorrect answers, and grade-level mismatches.

## Prerequisites

- Playwright MCP configured in `.mcp.json` (already set up in this project)
- Development server running: `npm run dev`

## Interactive Verification with Playwright MCP

### Step 1: Navigate to the app

```
mcp__playwright__browser_navigate → url: "http://localhost:5174/"
```

### Step 2: Inspect available controls

```
mcp__playwright__browser_snapshot
```

This returns the accessibility tree with element refs (e.g., `e5` for grade selector, `e10` for pattern radio buttons).

### Step 3: Select grade and pattern

```
# Select grade 3
mcp__playwright__browser_select_option → ref: "<grade-select-ref>", values: ["3"]

# Click a pattern radio button
mcp__playwright__browser_click → ref: "<pattern-radio-ref>"
```

### Step 4: Verify rendered problems

```
# Take a screenshot
mcp__playwright__browser_take_screenshot

# Or inspect the DOM
mcp__playwright__browser_snapshot
```

### Step 5: Toggle answer visibility

```
# Find the answer toggle checkbox
mcp__playwright__browser_snapshot

# Click to show/hide answers
mcp__playwright__browser_click → ref: "<answer-toggle-ref>"

# Screenshot with answers visible
mcp__playwright__browser_take_screenshot
```

## What to Check

### For all problem types

- Problems render (no blank screen)
- Problem text is non-empty and readable
- Answer toggle works (shows/hides answers)

### For Singapore Math problems

- **Name uniqueness**: No "Noah has 4 more than Noah" (self-referential)
- **Grade constraints**: Grade 2 comparison uses "more/fewer", Grade 3+ uses "times as many"
- **Diagram correctness**: Bar models show segments, number bonds show parts
- **Answer math**: Multi-step fraction answers match reverse calculation

### For word problems

- Problem text is grammatically correct English
- Numbers in the problem are appropriate for the grade level
- Answer makes sense in context

## Automated Verification Script

For batch verification without interactive inspection:

```bash
# All patterns (local dev server)
npm run verify:playwright:dev

# Singapore patterns only (faster)
npm run verify:singapore

# Specific pattern
node scripts/verify-playwright.mjs --pattern=word-en

# Against production build (run in separate terminals)
# Terminal 1:
npm run build && npm run preview
# Terminal 2:
npm run verify:playwright:preview
```

The script captures screenshots to `artifacts/playwright-verify/` and validates:

- Problems render for each grade/pattern combo
- No self-referential names
- Grade-appropriate comparison language
- Multi-step answer correctness

## Runtime Assertions

The generators also include runtime assertions (`src/lib/generators/assertions.ts`) that catch issues at generation time:

- `assertValidAnswer` - Answer must be a finite positive number
- `assertNoDuplicateNames` - No self-referential names in problem text
- `assertNonEmptyText` - Problem text must not be empty

These assertions throw immediately during generation, preventing malformed problems from reaching the UI.

## Property-Based Tests

Run `npm test -- --run src/lib/generators/property-tests.test.ts` for comprehensive property-based testing:

- 200+ samples per generator/grade combination
- Name uniqueness across all two-person problems
- Mathematical correctness (reverse-calculated from problem text)
- Grade-level constraint verification
- Diagram math consistency (parts sum = whole, etc.)
