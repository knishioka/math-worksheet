# Print Functionality Manual Test Guide

## Overview
This document provides step-by-step instructions for manually testing the print functionality of the math worksheet application.

## Prerequisites
- Development server running at http://localhost:5174/
- Modern browser (Chrome, Firefox, Safari, or Edge)

## Test Procedure

### Test 1: Basic Print Functionality (2nd Grade Hissan)

#### Steps:
1. **Navigate to the application**
   - Open http://localhost:5174/ in your browser
   - Verify the page loads successfully

2. **Select Grade**
   - Locate the grade selector (学年)
   - Select "2年生" (2nd grade)
   - Expected: UI updates to show appropriate problem types

3. **Select Problem Type**
   - Click on "2桁のたし算の筆算" button
   - Expected: Button appears selected/highlighted

4. **Generate Problems**
   - Click the "問題を生成" (Generate Problems) button
   - Expected: Problems appear in the preview area
   - Verify: Problems are displayed in a grid layout
   - Verify: Problems show hissan (vertical calculation) format

5. **Initiate Print**
   - Locate the green "印刷" (Print) button
   - Click the print button
   - Expected: Browser print dialog opens

6. **Verify Print Preview**
   - In the print preview dialog, check:
     - [ ] A4 page size is used
     - [ ] Problems are properly formatted
     - [ ] Page margins are appropriate (15mm sides, dynamic top/bottom)
     - [ ] Header section is visible (name, grade, score fields)
     - [ ] All problems are visible
     - [ ] No content is cut off

7. **Cancel Print**
   - Click Cancel in the print dialog
   - Expected: Dialog closes, application returns to normal state
   - Verify: Problems are still visible
   - Verify: No JavaScript errors in console

### Test 2: Print Multiple Problem Types

#### Steps:
1. Test print functionality with different problem types:
   - [ ] 基本計算 (Basic calculations)
   - [ ] 分数 (Fractions)
   - [ ] 小数 (Decimals)
   - [ ] 帯分数 (Mixed numbers)
   - [ ] 文章問題 (Word problems)
   - [ ] English Word Problems
   - [ ] 筆算 (Hissan)

2. For each problem type:
   - Generate problems
   - Click print button
   - Verify print preview appears correctly
   - Verify all mathematical notation renders properly
   - Cancel print

### Test 3: Print with Answers

#### Steps:
1. Generate problems (any type)
2. Toggle "答えを表示" (Show answers) checkbox
3. Click print button
4. In print preview, verify:
   - [ ] Answers are displayed in red
   - [ ] Answers are properly formatted
   - [ ] Footer section appears with "答え" heading

### Test 4: Multi-Column Layout

#### Steps:
1. Test printing with different column counts:
   - [ ] 1 column layout
   - [ ] 2 column layout
   - [ ] 3 column layout

2. For each layout:
   - Generate appropriate number of problems
   - Click print button
   - Verify grid layout in print preview
   - Verify problems don't overflow page

### Test 5: A4 Overflow Warning

#### Steps:
1. Select a problem type
2. Generate more problems than recommended (e.g., 20+ for hissan)
3. Verify:
   - [ ] Red warning appears: "A4サイズを超えています"
   - [ ] Warning shows estimated height
   - [ ] Preview has red border
4. Click print button
5. Verify:
   - [ ] Print still works
   - [ ] Warning is not included in print output

## Expected Results

### ✅ Success Criteria
- Print dialog opens when print button is clicked
- Print preview shows properly formatted worksheet
- A4 page size is maintained
- Mathematical notation (MathML) renders correctly in print
- Page breaks are avoided within problems
- Headers and footers are properly positioned
- No JavaScript errors in console

### ❌ Failure Indicators
- Print dialog doesn't open
- Print preview is blank or malformed
- Mathematical notation doesn't render
- Content overflows page boundaries
- JavaScript errors in console
- Page doesn't return to normal after canceling print

## Browser-Specific Notes

### Chrome
- Print preview should show MathML natively
- Ctrl/Cmd+P should also work

### Firefox
- MathML rendering is native
- Check print scaling is set to 100%

### Safari
- Verify MathML rendering in print preview
- May need to adjust print margins

### Edge
- Should behave like Chrome
- Verify Chromium-based version

## Troubleshooting

### Print Dialog Doesn't Open
1. Check browser console for errors
2. Verify `window.print()` is not blocked
3. Check if popup blocker is interfering
4. Try different browser

### Print Preview Looks Wrong
1. Verify CSS print styles are loading
2. Check `@media print` rules in DevTools
3. Inspect `@page` size settings
4. Check if content is hidden unintentionally

### MathML Not Rendering
1. Verify browser supports MathML (93.9% do)
2. Check if fallback CSS is working
3. Inspect MathML elements in print preview

## Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Version: ___________

Test 1: Basic Print (Hissan) .............. [ PASS / FAIL ]
Test 2: Multiple Problem Types ........... [ PASS / FAIL ]
Test 3: Print with Answers ............... [ PASS / FAIL ]
Test 4: Multi-Column Layout .............. [ PASS / FAIL ]
Test 5: A4 Overflow Warning .............. [ PASS / FAIL ]

Notes:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

## Automation

To run automated tests with Playwright:

```bash
# Install Playwright if not already installed
npm install -D @playwright/test

# Run the print functionality test
npx playwright test tests/print-functionality.spec.ts

# Run with headed browser to see the test
npx playwright test tests/print-functionality.spec.ts --headed

# Generate test report
npx playwright test tests/print-functionality.spec.ts --reporter=html
```

## Related Files

- `/src/components/Export/MultiPrintButton.tsx` - Main print logic
- `/src/components/Preview/ProblemList.tsx` - Preview component
- `/src/config/print-templates.ts` - Print layout templates
- `/tests/print-functionality.spec.ts` - Automated test suite
