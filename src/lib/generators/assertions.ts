/**
 * Runtime assertions for problem generators.
 * These catch bugs (duplicate names, invalid answers, empty text) at generation time
 * rather than waiting for visual review.
 */

// Matches "{Name} has N more/fewer than {Name}" where the comparison subject = object.
// Does NOT span sentences — restricts to a single clause with [^.]*
const SELF_REFERENCE_RE =
  /\b([A-Z][a-z]+)\b has \d+[^.]*?(?:more than|fewer than|times as many as) \1\b/;

/**
 * Assert that a problem's answer is a finite, positive number.
 * Throws if the answer is NaN, Infinity, negative, or zero.
 */
export function assertValidAnswer(
  answer: number | string,
  context: string
): void {
  if (typeof answer === 'string') {
    return; // String answers (e.g. "3/4") are validated differently
  }
  if (!Number.isFinite(answer)) {
    throw new Error(
      `Invalid answer: ${answer} is not a finite number (${context})`
    );
  }
  if (answer <= 0) {
    throw new Error(`Invalid answer: ${answer} must be positive (${context})`);
  }
}

/**
 * Assert that a two-person problem does not use the same name for both people.
 */
export function assertNoDuplicateNames(
  problemText: string,
  context: string
): void {
  if (SELF_REFERENCE_RE.test(problemText)) {
    throw new Error(
      `Self-referential name detected in problem text: "${problemText}" (${context})`
    );
  }
}

/**
 * Assert that problem text is non-empty and contains meaningful content.
 */
export function assertNonEmptyText(problemText: string, context: string): void {
  if (!problemText || problemText.trim().length === 0) {
    throw new Error(`Empty problem text (${context})`);
  }
}

/**
 * Validate a generated problem with all applicable assertions.
 */
export function assertValidProblem(
  problem: {
    problemText: string;
    answer: number | string;
  },
  context: string
): void {
  assertNonEmptyText(problem.problemText, context);
  assertValidAnswer(problem.answer, context);
  assertNoDuplicateNames(problem.problemText, context);
}
