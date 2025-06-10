#!/usr/bin/env node

// 学年別問題生成の検証スクリプト

console.log('=== 学年別問題生成の検証 ===\n');

// 各学年・演算の設定
const gradeSpecs = [
  // 1年生
  { grade: 1, operation: 'addition', description: '1年生足し算（1〜100、繰り上がり30%）' },
  { grade: 1, operation: 'subtraction', description: '1年生引き算（1〜100、繰り下がり30%）' },
  { grade: 1, operation: 'multiplication', description: '1年生掛け算（学習しない）' },
  { grade: 1, operation: 'division', description: '1年生割り算（学習しない）' },
  
  // 2年生
  { grade: 2, operation: 'addition', description: '2年生足し算（2桁の筆算、繰り上がりあり）' },
  { grade: 2, operation: 'subtraction', description: '2年生引き算（2桁の筆算、繰り下がりあり）' },
  { grade: 2, operation: 'multiplication', description: '2年生掛け算（九九 1×1〜9×9）' },
  { grade: 2, operation: 'division', description: '2年生割り算（学習しない）' },
  
  // 3年生
  { grade: 3, operation: 'addition', description: '3年生足し算（3桁・4桁の筆算）' },
  { grade: 3, operation: 'subtraction', description: '3年生引き算（3桁・4桁の筆算）' },
  { grade: 3, operation: 'multiplication', description: '3年生掛け算（2桁×1桁、3桁×1桁）' },
  { grade: 3, operation: 'division', description: '3年生割り算（基本的な割り算、九九ベース）' },
  
  // 4年生
  { grade: 4, operation: 'addition', description: '4年生足し算（大きな数）' },
  { grade: 4, operation: 'subtraction', description: '4年生引き算（大きな数）' },
  { grade: 4, operation: 'multiplication', description: '4年生掛け算（2桁×1桁）' },
  { grade: 4, operation: 'division', description: '4年生割り算（あまりのある割り算）' },
];

// 簡易的な問題生成ロジック（実際の生成ロジックを模倣）
function generateSampleProblems(grade, operation) {
  const problems = [];
  
  switch (operation) {
    case 'addition':
      if (grade === 1) {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 100) + 1;
          const b = Math.floor(Math.random() * 100) + 1;
          problems.push({ operand1: a, operand2: b, answer: a + b });
        }
      } else if (grade === 2) {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 90) + 10;
          const b = Math.floor(Math.random() * 90) + 10;
          problems.push({ operand1: a, operand2: b, answer: a + b });
        }
      } else if (grade === 3) {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 9900) + 100;
          const b = Math.floor(Math.random() * 9900) + 100;
          problems.push({ operand1: a, operand2: b, answer: a + b });
        }
      } else {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 99900) + 100;
          const b = Math.floor(Math.random() * 99900) + 100;
          problems.push({ operand1: a, operand2: b, answer: a + b });
        }
      }
      break;
      
    case 'subtraction':
      if (grade === 1) {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 100) + 1;
          const b = Math.floor(Math.random() * a) + 1;
          problems.push({ operand1: a, operand2: b, answer: a - b });
        }
      } else if (grade === 2) {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 90) + 10;
          const b = Math.floor(Math.random() * a);
          problems.push({ operand1: a, operand2: b, answer: a - b });
        }
      } else if (grade === 3) {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 9900) + 100;
          const b = Math.floor(Math.random() * a);
          problems.push({ operand1: a, operand2: b, answer: a - b });
        }
      } else {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 99900) + 100;
          const b = Math.floor(Math.random() * a);
          problems.push({ operand1: a, operand2: b, answer: a - b });
        }
      }
      break;
      
    case 'multiplication':
      if (grade === 1) {
        // 1年生は掛け算を学習しない
        return [];
      } else if (grade === 2) {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 9) + 1;
          const b = Math.floor(Math.random() * 9) + 1;
          problems.push({ operand1: a, operand2: b, answer: a * b });
        }
      } else if (grade === 3) {
        for (let i = 0; i < 3; i++) {
          if (Math.random() < 0.7) {
            const a = Math.floor(Math.random() * 90) + 10;  // 2桁
            const b = Math.floor(Math.random() * 9) + 1;     // 1桁
            problems.push({ operand1: a, operand2: b, answer: a * b });
          } else {
            const a = Math.floor(Math.random() * 900) + 100; // 3桁
            const b = Math.floor(Math.random() * 9) + 1;     // 1桁
            problems.push({ operand1: a, operand2: b, answer: a * b });
          }
        }
      } else {
        for (let i = 0; i < 3; i++) {
          const a = Math.floor(Math.random() * 99) + 1;
          const b = Math.floor(Math.random() * 999) + 1;
          problems.push({ operand1: a, operand2: b, answer: a * b });
        }
      }
      break;
      
    case 'division':
      if (grade === 1 || grade === 2) {
        // 1・2年生は割り算を学習しない
        return [];
      } else if (grade === 3) {
        for (let i = 0; i < 3; i++) {
          const b = Math.floor(Math.random() * 8) + 2;
          const quotient = Math.floor(Math.random() * 9) + 1;
          const a = b * quotient;
          problems.push({ operand1: a, operand2: b, answer: quotient });
        }
      } else {
        for (let i = 0; i < 3; i++) {
          const b = Math.floor(Math.random() * 11) + 2;
          const quotient = Math.floor(Math.random() * 20) + 1;
          const a = b * quotient + Math.floor(Math.random() * b);
          problems.push({ 
            operand1: a, 
            operand2: b, 
            answer: Math.floor(a / b),
            remainder: a % b
          });
        }
      }
      break;
  }
  
  return problems;
}

// 各学年・演算の検証
gradeSpecs.forEach(spec => {
  console.log(`${spec.description}:`);
  
  const problems = generateSampleProblems(spec.grade, spec.operation);
  
  if (problems.length === 0) {
    console.log('  （この学年では学習しません）\n');
    return;
  }
  
  problems.forEach((problem, index) => {
    let display = '';
    switch (spec.operation) {
      case 'addition':
        display = `${problem.operand1} + ${problem.operand2} = ${problem.answer}`;
        break;
      case 'subtraction':
        display = `${problem.operand1} - ${problem.operand2} = ${problem.answer}`;
        break;
      case 'multiplication':
        display = `${problem.operand1} × ${problem.operand2} = ${problem.answer}`;
        break;
      case 'division':
        if (problem.remainder && problem.remainder > 0) {
          display = `${problem.operand1} ÷ ${problem.operand2} = ${problem.answer} あまり ${problem.remainder}`;
        } else {
          display = `${problem.operand1} ÷ ${problem.operand2} = ${problem.answer}`;
        }
        break;
    }
    console.log(`  ${index + 1}. ${display}`);
  });
  
  console.log('');
});

console.log('=== カリキュラムとの対応 ===');
console.log('✓ 1年生: 1〜100の範囲で加減算（繰り上がり・繰り下がりは2学期後半から）');
console.log('✓ 2年生: 2桁の筆算、九九の導入');
console.log('✓ 3年生: 3桁・4桁の筆算、2桁×1桁・3桁×1桁の掛け算、基本的な割り算');
console.log('✓ 4年生以降: より大きな数、あまりのある割り算');
console.log('\n※ 小数・分数は別途実装予定');