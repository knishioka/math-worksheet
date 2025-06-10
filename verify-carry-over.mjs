import { generateProblems, generateCustomProblems } from './src/lib/generators/index.ts';

// Test settings for each operation
const operations = ['addition', 'subtraction', 'multiplication', 'division'];

console.log('Testing includeCarryOver behavior for each operation:\n');

operations.forEach(operation => {
  console.log(`\n=== Testing ${operation.toUpperCase()} ===`);
  
  // Test with includeCarryOver: true
  const settingsWithCarry = {
    grade: 2,
    problemType: 'basic',
    operation,
    problemCount: 10,
    layoutColumns: 2,
    includeCarryOver: true,
    minNumber: 10,
    maxNumber: 99,
  };
  
  try {
    // Test custom problems (which respect includeCarryOver)
    console.log('\nUsing generateCustomProblems with includeCarryOver: true');
    const customProblems = generateCustomProblems(settingsWithCarry, {
      minNumber: 10,
      maxNumber: 99,
      includeCarryOver: true,
      operation
    });
    
    const problemsWithCarry = customProblems.filter(p => p.carryOver === true);
    console.log(`Generated ${customProblems.length} problems, ${problemsWithCarry.length} have carryOver`);
    
    // Show some examples
    if (customProblems.length > 0) {
      console.log('First 3 problems:');
      customProblems.slice(0, 3).forEach(p => {
        console.log(`  ${p.operand1} ${getOperationSymbol(p.operation)} ${p.operand2} = ${p.answer} (carryOver: ${p.carryOver || false})`);
      });
    }
    
    // Test grade-based problems (which don't use includeCarryOver from settings)
    console.log('\nUsing generateProblems (grade-based):');
    const gradeProblems = generateProblems(settingsWithCarry);
    const gradeWithCarry = gradeProblems.filter(p => p.carryOver === true);
    console.log(`Generated ${gradeProblems.length} problems, ${gradeWithCarry.length} have carryOver`);
    
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

function getOperationSymbol(operation) {
  switch (operation) {
    case 'addition': return '+';
    case 'subtraction': return '-';
    case 'multiplication': return '×';
    case 'division': return '÷';
    default: return '?';
  }
}