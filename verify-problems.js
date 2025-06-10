#!/usr/bin/env node

// Node.js script to verify problem generation
import { generateProblems } from './src/lib/generators/index.js';

const settings = [
  {
    operation: 'addition',
    grade: 1,
    description: '1年生足し算（繰り上がりなし）'
  },
  {
    operation: 'addition',
    grade: 2,
    description: '2年生足し算（繰り上がりあり）'
  },
  {
    operation: 'subtraction',
    grade: 1,
    description: '1年生引き算（繰り下がりなし）'
  },
  {
    operation: 'subtraction',
    grade: 2,
    description: '2年生引き算（繰り下がりあり）'
  },
  {
    operation: 'multiplication',
    grade: 2,
    description: '2年生掛け算（九九）'
  },
  {
    operation: 'multiplication',
    grade: 3,
    description: '3年生掛け算'
  },
  {
    operation: 'division',
    grade: 3,
    description: '3年生割り算'
  }
];

console.log('=== 問題生成検証開始 ===\n');

settings.forEach(({ operation, grade, description }) => {
  console.log(`${description}:`);
  
  try {
    const worksheetSettings = {
      grade,
      problemType: 'basic',
      operation,
      problemCount: 3,
      layoutColumns: 1
    };
    
    const problems = generateProblems(worksheetSettings);
    
    problems.forEach((problem, index) => {
      const { operand1, operand2, answer } = problem;
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
          const remainder = problem.remainder || 0;
          display = remainder > 0 
            ? `${operand1} ÷ ${operand2} = ${answer} 余り ${remainder}`
            : `${operand1} ÷ ${operand2} = ${answer}`;
          break;
      }
      
      console.log(`  ${index + 1}. ${display}`);
    });
    
    console.log('  ✓ 生成成功\n');
    
  } catch (error) {
    console.log(`  ✗ エラー: ${error.message}\n`);
  }
});

console.log('=== 検証完了 ===');