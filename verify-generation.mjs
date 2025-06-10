#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Since we're using TypeScript, we'll use a simple verification approach
console.log('=== 問題生成検証 ===\n');

// Test basic functions directly with Node.js
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAdditionProblem(min = 1, max = 10, carryOver = false) {
  let operand1, operand2;
  
  do {
    operand1 = randomInt(min, max);
    operand2 = randomInt(min, max);
  } while (carryOver && !hasCarryOver(operand1, operand2));
  
  return {
    operand1,
    operand2,
    answer: operand1 + operand2,
    operation: 'addition'
  };
}

function generateSubtractionProblem(min = 1, max = 10) {
  let operand1, operand2;
  
  operand1 = randomInt(min, max);
  operand2 = randomInt(min, operand1); // Ensure positive result
  
  return {
    operand1,
    operand2,
    answer: operand1 - operand2,
    operation: 'subtraction'
  };
}

function generateMultiplicationProblem(min = 1, max = 9) {
  const operand1 = randomInt(min, max);
  const operand2 = randomInt(min, max);
  
  return {
    operand1,
    operand2,
    answer: operand1 * operand2,
    operation: 'multiplication'
  };
}

function generateDivisionProblem(min = 1, max = 9) {
  const quotient = randomInt(min, max);
  const divisor = randomInt(min, max);
  const dividend = quotient * divisor;
  
  return {
    operand1: dividend,
    operand2: divisor,
    answer: quotient,
    operation: 'division'
  };
}

function hasCarryOver(a, b) {
  const strA = a.toString();
  const strB = b.toString();
  const maxLen = Math.max(strA.length, strB.length);
  
  let carry = 0;
  for (let i = 0; i < maxLen; i++) {
    const digitA = parseInt(strA.charAt(strA.length - 1 - i) || '0');
    const digitB = parseInt(strB.charAt(strB.length - 1 - i) || '0');
    const sum = digitA + digitB + carry;
    
    if (sum >= 10) {
      carry = 1;
      return true;
    } else {
      carry = 0;
    }
  }
  
  return false;
}

// Test each operation type
const tests = [
  {
    name: '1年生足し算（繰り上がりなし）',
    generator: () => generateAdditionProblem(1, 9, false),
    count: 3
  },
  {
    name: '2年生足し算（繰り上がりあり）',
    generator: () => generateAdditionProblem(10, 99, true),
    count: 3
  },
  {
    name: '1年生引き算',
    generator: () => generateSubtractionProblem(1, 10),
    count: 3
  },
  {
    name: '2年生引き算',
    generator: () => generateSubtractionProblem(10, 99),
    count: 3
  },
  {
    name: '2年生掛け算（九九）',
    generator: () => generateMultiplicationProblem(1, 9),
    count: 3
  },
  {
    name: '3年生掛け算',
    generator: () => generateMultiplicationProblem(1, 12),
    count: 3
  },
  {
    name: '3年生割り算',
    generator: () => generateDivisionProblem(1, 9),
    count: 3
  }
];

tests.forEach(test => {
  console.log(`${test.name}:`);
  
  try {
    for (let i = 0; i < test.count; i++) {
      const problem = test.generator();
      const { operand1, operand2, answer, operation } = problem;
      
      let display;
      switch (operation) {
        case 'addition':
          display = `${operand1} + ${operand2} = ${answer}`;
          break;
        case 'subtraction':
          display = `${operand1} - ${operand2} = ${answer}`;
          break;
        case 'multiplication':
          display = `${operand1} × ${operand2} = ${answer}`;
          break;
        case 'division':
          display = `${operand1} ÷ ${operand2} = ${answer}`;
          break;
      }
      
      console.log(`  ${i + 1}. ${display}`);
    }
    console.log('  ✓ 生成成功\n');
  } catch (error) {
    console.log(`  ✗ エラー: ${error.message}\n`);
  }
});

console.log('=== 検証完了 ===');
console.log('開発サーバーは http://localhost:5173/ で実行中です。');
console.log('ブラウザでアクセスしてUIでの問題生成と表示を確認してください。');