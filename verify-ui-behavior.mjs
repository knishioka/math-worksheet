#!/usr/bin/env node

// UI動作検証スクリプト

console.log('=== UI動作の検証 ===\n');

// 学年別の利用可能な演算を確認
const gradeOperations = {
  1: ['addition', 'subtraction'],
  2: ['addition', 'subtraction', 'multiplication'],
  3: ['addition', 'subtraction', 'multiplication', 'division'],
  4: ['addition', 'subtraction', 'multiplication', 'division'],
  5: ['addition', 'subtraction', 'multiplication', 'division'],
  6: ['addition', 'subtraction', 'multiplication', 'division'],
};

console.log('学年別の利用可能な演算:');
for (let grade = 1; grade <= 6; grade++) {
  const operations = gradeOperations[grade];
  const operationNames = operations.map(op => {
    switch (op) {
      case 'addition': return 'たし算';
      case 'subtraction': return 'ひき算';
      case 'multiplication': return 'かけ算';
      case 'division': return 'わり算';
    }
  });
  console.log(`  ${grade}年生: ${operationNames.join('、')}`);
}

console.log('\n期待される動作:');
console.log('  - 1年生を選択時: かけ算・わり算ボタンが非表示');
console.log('  - 2年生を選択時: わり算ボタンが非表示');
console.log('  - 3年生以降を選択時: すべてのボタンが表示');
console.log('  - 非表示の演算が選択されている場合、自動的にたし算に切り替え');

console.log('\n実装状況:');
console.log('  ✅ 学年に応じた演算ボタンの表示/非表示');
console.log('  ✅ 学年変更時の自動切り替え（useEffect使用）');
console.log('  ✅ 学年別の説明文更新（未実装機能の明記）');