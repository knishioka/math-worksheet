/**
 * Print DOM Builder - XSS-safe DOM construction utilities
 * Replaces innerHTML with safe DOM API methods
 */

import type {
  Problem,
  BasicProblem,
  FractionProblem,
  DecimalProblem,
  MixedNumberProblem,
  HissanProblem,
  WordProblem,
  WordProblemEn,
  WorksheetSettings,
  LayoutColumns,
} from '../../types';
import {
  getOperationName,
  getOperatorSymbol,
} from './formatting';
import {
  calculateMissingOperand1,
  calculateMissingOperand2,
  calculateMissingAnswer,
} from './missing-number-calculator';

// Helper to create element with styles
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  styles?: Partial<CSSStyleDeclaration>,
  className?: string
): HTMLElementTagNameMap[K] {
  const elem = document.createElement(tag);
  if (styles) {
    Object.assign(elem.style, styles);
  }
  if (className) {
    elem.className = className;
  }
  return elem;
}

// Helper to create text node
function txt(content: string | number): Text {
  return document.createTextNode(String(content));
}

// Helper to create span with text
function span(
  content: string | number,
  styles?: Partial<CSSStyleDeclaration>
): HTMLSpanElement {
  const s = el('span', styles);
  s.appendChild(txt(content));
  return s;
}

/**
 * Create print header element
 */
export function createPrintHeader(settings: WorksheetSettings): HTMLDivElement {
  const header = el('div', {
    borderBottom: '1px solid #ccc',
    paddingBottom: '12px',
    marginBottom: '16px',
  });

  const grid = el('div', {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginBottom: '12px',
  });

  // Name field
  const nameDiv = el('div', { fontSize: '14px' });
  nameDiv.appendChild(txt('名前：'));
  nameDiv.appendChild(el('span', {
    display: 'inline-block',
    width: '128px',
    borderBottom: '1px solid black',
    marginLeft: '4px',
  }));
  grid.appendChild(nameDiv);

  // Title
  const titleDiv = el('div', { fontSize: '14px', textAlign: 'center' });
  titleDiv.appendChild(txt(
    `${settings.grade}年生 ${getOperationName(settings.operation, settings.calculationPattern)}`
  ));
  grid.appendChild(titleDiv);

  // Score field
  const scoreDiv = el('div', { fontSize: '14px', textAlign: 'right' });
  scoreDiv.appendChild(txt('点数：'));
  scoreDiv.appendChild(el('span', {
    display: 'inline-block',
    width: '64px',
    borderBottom: '1px solid black',
    marginLeft: '4px',
  }));
  scoreDiv.appendChild(txt('点'));
  grid.appendChild(scoreDiv);

  header.appendChild(grid);
  return header;
}

/**
 * Create answer underline element
 */
function createAnswerUnderline(width = '64px'): HTMLSpanElement {
  return el('span', {
    display: 'inline-block',
    width,
    borderBottom: '1px solid black',
    marginLeft: '4px',
  });
}

/**
 * Create missing number box element
 */
function createMissingBox(): HTMLSpanElement {
  return el('span', {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    border: '1.5px solid #333',
    backgroundColor: '#f9f9f9',
    verticalAlign: 'text-bottom',
  });
}

/**
 * Create answer span with red color
 */
function createAnswerSpan(content: string | number): HTMLSpanElement {
  return span(content, { color: 'red', fontWeight: 'bold' });
}

/**
 * Create fraction using MathML (safe element creation)
 */
function createFractionMathML(numerator: number, denominator: number, isAnswer = false): Element {
  const math = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'math');
  const mfrac = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mfrac');

  const mn1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn');
  mn1.textContent = String(numerator);
  if (isAnswer) {
    mn1.setAttribute('style', 'color: red; font-weight: bold;');
  }

  const mn2 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn');
  mn2.textContent = String(denominator);
  if (isAnswer) {
    mn2.setAttribute('style', 'color: red; font-weight: bold;');
  }

  mfrac.appendChild(mn1);
  mfrac.appendChild(mn2);
  math.appendChild(mfrac);
  return math;
}

/**
 * Create mixed number using MathML
 */
function createMixedNumberMathML(
  whole: number,
  numerator: number,
  denominator: number,
  isAnswer = false
): Element {
  const math = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'math');
  const mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');

  const mnWhole = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn');
  mnWhole.textContent = String(whole);
  if (isAnswer) {
    mnWhole.setAttribute('style', 'color: red; font-weight: bold;');
  }
  mrow.appendChild(mnWhole);

  const mfrac = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mfrac');
  const mn1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn');
  mn1.textContent = String(numerator);
  if (isAnswer) {
    mn1.setAttribute('style', 'color: red; font-weight: bold;');
  }
  const mn2 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn');
  mn2.textContent = String(denominator);
  if (isAnswer) {
    mn2.setAttribute('style', 'color: red; font-weight: bold;');
  }
  mfrac.appendChild(mn1);
  mfrac.appendChild(mn2);
  mrow.appendChild(mfrac);

  math.appendChild(mrow);
  return math;
}

/**
 * Create decimal number using MathML
 */
function createDecimalMathML(value: number, isAnswer = false): Element {
  const math = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'math');
  const mn = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn');
  mn.textContent = String(value);
  if (isAnswer) {
    mn.setAttribute('style', 'color: red; font-weight: bold;');
  }
  math.appendChild(mn);
  return math;
}

/**
 * Create word problem element
 */
function createWordProblemElement(
  problem: WordProblem,
  showAnswers: boolean,
  fontSize: string
): HTMLDivElement {
  const container = el('div');

  // Problem text
  const textDiv = el('div', { fontSize, lineHeight: '1.3' });
  textDiv.appendChild(txt(problem.problemText));
  container.appendChild(textDiv);

  // Answer section
  const answerDiv = el('div', { marginTop: '6px' });
  if (showAnswers) {
    const answerSpan = createAnswerSpan(`答え: ${problem.answer}${problem.unit || ''}`);
    answerDiv.appendChild(answerSpan);
  } else {
    answerDiv.appendChild(txt('答え: '));
    answerDiv.appendChild(el('span', {
      display: 'inline-block',
      width: '96px',
      borderBottom: '1px solid black',
      margin: '0 4px',
    }));
    if (problem.unit) {
      answerDiv.appendChild(span(problem.unit, { fontSize: '14px' }));
    }
  }
  container.appendChild(answerDiv);

  return container;
}

/**
 * Create English word problem element
 */
function createWordEnProblemElement(
  problem: WordProblemEn,
  originalNumber: number,
  showAnswers: boolean,
  fontSize: string
): HTMLDivElement {
  const container = el('div', {
    display: 'flex',
    gap: '8px',
    fontSize,
    lineHeight: '1.4',
    color: '#000',
    textAlign: 'left',
  });

  // Problem number
  const numDiv = el('div', { fontSize: '12px', color: '#666', flexShrink: '0' });
  numDiv.appendChild(txt(`(${originalNumber})`));
  container.appendChild(numDiv);

  // Content
  const contentDiv = el('div', { flex: '1' });

  const textDiv = el('div', { marginBottom: '4px' });
  textDiv.appendChild(txt(problem.problemText));
  contentDiv.appendChild(textDiv);

  if (problem.category === 'word-story') {
    const answerRow = el('div', {
      marginTop: '4px',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '6px',
    });

    answerRow.appendChild(span('Answer:', { color: '#000', fontSize: '14px' }));

    const answerBox = el('div', {
      borderBottom: '1.5px solid #000',
      minWidth: '3.5rem',
      padding: '0 6px',
      height: '1.2em',
    });

    if (showAnswers) {
      let answerText = String(problem.answer);
      if (problem.unit) {
        answerText += ` ${problem.unit}`;
      }
      answerBox.appendChild(span(answerText, { fontWeight: '500', color: '#000' }));
    }

    answerRow.appendChild(answerBox);
    contentDiv.appendChild(answerRow);
  }

  container.appendChild(contentDiv);
  return container;
}

/**
 * Create fraction problem element
 */
function createFractionProblemElement(
  problem: FractionProblem,
  showAnswers: boolean
): HTMLDivElement {
  const container = el('div');
  const operator = getOperatorSymbol(problem.operation);

  // First fraction
  container.appendChild(createFractionMathML(problem.numerator1, problem.denominator1));
  container.appendChild(txt(` ${operator} `));

  // Second fraction
  if (problem.numerator2 !== undefined && problem.denominator2 !== undefined) {
    container.appendChild(createFractionMathML(problem.numerator2, problem.denominator2));
  }

  container.appendChild(txt(' = '));

  // Answer
  if (showAnswers) {
    container.appendChild(createFractionMathML(
      problem.answerNumerator,
      problem.answerDenominator,
      true
    ));
  } else {
    container.appendChild(createAnswerUnderline());
  }

  return container;
}

/**
 * Create decimal problem element
 */
function createDecimalProblemElement(
  problem: DecimalProblem,
  showAnswers: boolean
): HTMLDivElement {
  const container = el('div');
  const operator = getOperatorSymbol(problem.operation);

  container.appendChild(createDecimalMathML(problem.operand1));
  container.appendChild(txt(` ${operator} `));
  container.appendChild(createDecimalMathML(problem.operand2));
  container.appendChild(txt(' = '));

  if (showAnswers) {
    container.appendChild(createDecimalMathML(problem.answer, true));
  } else {
    container.appendChild(createAnswerUnderline());
  }

  return container;
}

/**
 * Create mixed number problem element
 */
function createMixedProblemElement(
  problem: MixedNumberProblem,
  showAnswers: boolean
): HTMLDivElement {
  const container = el('div');
  const operator = getOperatorSymbol(problem.operation);

  // First mixed number
  container.appendChild(createMixedNumberMathML(
    problem.whole1,
    problem.numerator1,
    problem.denominator1
  ));
  container.appendChild(txt(` ${operator} `));

  // Second mixed number
  if (
    problem.whole2 !== undefined &&
    problem.numerator2 !== undefined &&
    problem.denominator2 !== undefined
  ) {
    container.appendChild(createMixedNumberMathML(
      problem.whole2,
      problem.numerator2,
      problem.denominator2
    ));
  }

  container.appendChild(txt(' = '));

  // Answer
  if (showAnswers) {
    container.appendChild(createMixedNumberMathML(
      problem.answerWhole,
      problem.answerNumerator,
      problem.answerDenominator,
      true
    ));
  } else {
    container.appendChild(createAnswerUnderline());
  }

  return container;
}

/**
 * Create hissan (written calculation) problem element
 */
function createHissanProblemElement(
  problem: HissanProblem,
  showAnswers: boolean
): HTMLDivElement {
  const container = el('div', {
    fontFamily: "'Courier New', monospace",
    display: 'inline-block',
    textAlign: 'right',
    lineHeight: '1.2',
    margin: '10px 0',
  });

  const operator = getOperatorSymbol(problem.operation);
  const digits1 = problem.operand1.toString().split('');
  const digits2 = problem.operand2.toString().split('');
  const maxLength = Math.max(digits1.length, digits2.length);

  // Padding
  const paddedDigits1: string[] = [];
  for (let i = 0; i < maxLength - digits1.length; i++) {
    paddedDigits1.push('\u00A0');
  }
  paddedDigits1.push(...digits1);

  const paddedDigits2: string[] = [];
  for (let i = 0; i < maxLength - digits2.length; i++) {
    paddedDigits2.push('\u00A0');
  }
  paddedDigits2.push(...digits2);

  // First number row
  const row1 = el('div', { whiteSpace: 'nowrap' });
  paddedDigits1.forEach(d => {
    row1.appendChild(span(d, {
      display: 'inline-block',
      width: '30px',
      textAlign: 'center',
    }));
  });
  container.appendChild(row1);

  // Operator and second number row
  const row2 = el('div', { whiteSpace: 'nowrap' });
  // Operator padding
  for (let i = 0; i < maxLength - digits2.length; i++) {
    row2.appendChild(span('\u00A0', {
      display: 'inline-block',
      width: '30px',
      textAlign: 'center',
    }));
  }
  row2.appendChild(span(operator, {
    display: 'inline-block',
    width: '30px',
    textAlign: 'center',
  }));
  paddedDigits2.forEach(d => {
    row2.appendChild(span(d, {
      display: 'inline-block',
      width: '30px',
      textAlign: 'center',
    }));
  });
  container.appendChild(row2);

  // Answer box count and total width calculation
  const answerBoxCount = maxLength + 1;
  const boxWidth = 30;
  const boxGap = 4; // gap between boxes
  const totalAnswerWidth = answerBoxCount * boxWidth + (answerBoxCount - 1) * boxGap;

  // Horizontal line (aligned with answer boxes)
  const line = el('div', {
    borderTop: '2px solid black',
    margin: '2px 0',
    width: `${totalAnswerWidth}px`,
  });
  container.appendChild(line);

  // Answer row
  const answerRow = el('div', {
    whiteSpace: 'nowrap',
    display: 'flex',
    gap: `${boxGap}px`,
    justifyContent: 'flex-end',
  });
  if (showAnswers && problem.answer) {
    const answerDigits = problem.answer.toString().split('');
    const paddedAnswer: string[] = [];
    for (let i = 0; i < answerBoxCount - answerDigits.length; i++) {
      paddedAnswer.push('\u00A0');
    }
    paddedAnswer.push(...answerDigits);

    paddedAnswer.forEach(d => {
      answerRow.appendChild(span(d, {
        display: 'inline-block',
        width: `${boxWidth}px`,
        textAlign: 'center',
        color: 'red',
        fontWeight: 'bold',
      }));
    });
  } else {
    for (let i = 0; i < answerBoxCount; i++) {
      answerRow.appendChild(el('span', {
        display: 'inline-block',
        width: `${boxWidth}px`,
        height: `${boxWidth}px`,
        border: '1px solid #ccc',
      }));
    }
  }
  container.appendChild(answerRow);

  return container;
}

/**
 * Create basic problem element
 */
function createBasicProblemElement(
  problem: BasicProblem,
  showAnswers: boolean
): HTMLDivElement {
  const container = el('div');
  const operator = getOperatorSymbol(problem.operation);

  // Operand 1
  if (problem.operand1 !== null) {
    container.appendChild(txt(problem.operand1));
  } else if (showAnswers) {
    container.appendChild(createAnswerSpan(calculateMissingOperand1(problem)));
  } else {
    container.appendChild(createMissingBox());
  }

  container.appendChild(txt(` ${operator} `));

  // Operand 2
  if (problem.operand2 !== null) {
    container.appendChild(txt(problem.operand2));
  } else if (showAnswers) {
    container.appendChild(createAnswerSpan(calculateMissingOperand2(problem)));
  } else {
    container.appendChild(createMissingBox());
  }

  container.appendChild(txt(' = '));

  // Answer
  if (problem.missingPosition === 'answer') {
    if (showAnswers) {
      container.appendChild(createAnswerSpan(calculateMissingAnswer(problem)));
    } else {
      container.appendChild(createMissingBox());
    }
  } else if (showAnswers && problem.missingPosition) {
    container.appendChild(span(problem.answer ?? '', {
      fontFamily: 'monospace',
      fontSize: '18px',
    }));
  } else if (showAnswers && problem.answer !== null) {
    container.appendChild(createAnswerSpan(problem.answer));
  } else {
    container.appendChild(createAnswerUnderline());
  }

  return container;
}

/**
 * Create a single problem element
 */
export function createProblemElement(
  problem: Problem,
  originalNumber: number,
  showAnswers: boolean,
  fontSize: string
): HTMLDivElement {
  const problemMargin = problem.type === 'word-en' ? '6px' : '12px';
  const wrapper = el('div', { marginBottom: problemMargin });

  // For word-en, special handling (number inline with content)
  if (problem.type === 'word-en') {
    wrapper.appendChild(createWordEnProblemElement(
      problem as WordProblemEn,
      originalNumber,
      showAnswers,
      fontSize
    ));
    return wrapper;
  }

  // Problem number
  const numDiv = el('div', { fontSize: '12px', color: '#666' });
  numDiv.appendChild(txt(`(${originalNumber})`));
  wrapper.appendChild(numDiv);

  // Problem content
  const contentDiv = el('div', {
    fontFamily: 'monospace',
    fontSize,
    marginTop: '4px',
  });

  switch (problem.type) {
    case 'word':
      contentDiv.appendChild(createWordProblemElement(
        problem as WordProblem,
        showAnswers,
        fontSize
      ));
      break;
    case 'fraction':
      contentDiv.appendChild(createFractionProblemElement(
        problem as FractionProblem,
        showAnswers
      ));
      break;
    case 'decimal':
      contentDiv.appendChild(createDecimalProblemElement(
        problem as DecimalProblem,
        showAnswers
      ));
      break;
    case 'mixed':
      contentDiv.appendChild(createMixedProblemElement(
        problem as MixedNumberProblem,
        showAnswers
      ));
      break;
    case 'hissan':
      contentDiv.appendChild(createHissanProblemElement(
        problem as HissanProblem,
        showAnswers
      ));
      break;
    case 'basic':
    default:
      contentDiv.appendChild(createBasicProblemElement(
        problem as BasicProblem,
        showAnswers
      ));
      break;
  }

  wrapper.appendChild(contentDiv);
  return wrapper;
}

/**
 * Create problems grid container
 */
export function createProblemsContainer(
  problems: Problem[],
  columns: LayoutColumns,
  rowGap: string,
  colGap: string,
  fontSize: string,
  showAnswers: boolean
): HTMLDivElement {
  const outer = el('div', { marginTop: '24px' });

  const grid = el('div', {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    rowGap,
    columnGap: colGap,
  });

  // Reorder problems for vertical reading order
  const rowCount = Math.ceil(problems.length / columns);
  const reorderedProblems: (Problem | null)[] = [];

  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rowCount; row++) {
      const originalIndex = row + col * rowCount;
      const newIndex = row * columns + col;

      if (originalIndex < problems.length) {
        reorderedProblems[newIndex] = problems[originalIndex];
      } else {
        reorderedProblems[newIndex] = null;
      }
    }
  }

  reorderedProblems.forEach((problem, index) => {
    if (!problem) {
      grid.appendChild(el('div', { marginBottom: '12px' }));
      return;
    }

    // Calculate original number (vertical order)
    const col = index % columns;
    const row = Math.floor(index / columns);
    const originalNumber = col * rowCount + row + 1;

    grid.appendChild(createProblemElement(problem, originalNumber, showAnswers, fontSize));
  });

  outer.appendChild(grid);
  return outer;
}

/**
 * Create footer element (for answer sheets)
 */
export function createPrintFooter(
  showAnswers: boolean,
  pageInfo?: { current: number; total: number }
): HTMLDivElement | null {
  if (!showAnswers) return null;

  const footer = el('div', {
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '2px solid #ccc',
  });

  const title = el('h3', {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  });
  title.appendChild(txt('答え'));
  footer.appendChild(title);

  if (pageInfo) {
    const pageP = el('p', { fontSize: '14px', color: '#666' });
    pageP.appendChild(txt(`ページ ${pageInfo.current} / ${pageInfo.total}`));
    footer.appendChild(pageP);
  }

  return footer;
}
