# Math Worksheet Generator Difficulty Analysis Report

## Overview
This report analyzes the current difficulty settings across all grade levels (1-6) in the math worksheet generator and compares them with the curriculum specification.

## Grade 1 Analysis

### Curriculum Specification
- **Number Range**: 1-100
- **Addition**: Single digit + single digit, with/without carry-over
- **Subtraction**: Single digit - single digit, with/without borrowing
- **Note**: Carry-over/borrowing introduced in late 2nd semester

### Current Implementation

#### Addition (generateGradeAdditionProblems)
```typescript
case 1:
  // Range: 1-100
  // 30% probability of carry-over
  minNumber: 1,
  maxNumber: 100,
  includeCarryOver: Math.random() < 0.3
```

#### Subtraction (generateGradeSubtractionProblems)
```typescript
case 1:
  // Range: 1-100
  // 30% probability of borrowing
  minNumber: 1,
  maxNumber: 100,
  includeBorrow: Math.random() < 0.3
```

### Issues with Grade 1
1. **Number range too wide**: The specification mentions "single digit + single digit" but implementation allows numbers up to 100
2. **Difficulty too high**: Problems like 87 + 56 are too advanced for Grade 1
3. **Carry-over probability**: 30% might be too high for early Grade 1

## Grade 2 Analysis

### Curriculum Specification
- **Number Range**: 100+
- **Addition/Subtraction**: 2-digit written calculation with carry-over/borrowing
- **Multiplication**: Times tables (1×1 to 9×9)
- **Fractions**: Simple fraction concepts (1/2, 1/3)

### Current Implementation

#### Addition
```typescript
case 2:
  // 2-digit with carry-over
  minNumber: 10,
  maxNumber: 99,
  includeCarryOver: true,
  digitCount: 2
```

#### Subtraction
```typescript
case 2:
  // 2-digit with borrowing
  minNumber: 10,
  maxNumber: 99,
  includeBorrow: true,
  digitCount: 2
```

#### Multiplication
```typescript
case 2:
  // Times tables 1×1 to 9×9
  minNumber: 1,
  maxNumber: 9,
  // 50% chance to focus on specific table
  timesTableFocus: Math.random() < 0.5 ? randomInt(2, 9) : undefined
```

### Grade 2 Assessment
- ✅ Addition/Subtraction settings are appropriate
- ✅ Multiplication correctly implements times tables
- ❌ Missing fraction support

## Grade 3 Analysis

### Curriculum Specification
- **Addition/Subtraction**: 3-digit, 4-digit written calculation
- **Multiplication**: 2-digit × 1-digit, 3-digit × 1-digit
- **Division**: Basic division introduction
- **Decimals**: Up to 0.1 place, decimal addition/subtraction
- **Fractions**: Unit fractions, simple same-denominator addition/subtraction

### Current Implementation

#### Addition/Subtraction
```typescript
case 3:
  // 3-4 digit calculations
  minNumber: 100,
  maxNumber: 9999,
  includeCarryOver/includeBorrow: true
```

#### Multiplication
```typescript
case 3:
  // 70% chance: 2-digit × 1-digit
  // 30% chance: 3-digit × 1-digit
  use2Digit = Math.random() < 0.7
  if (use2Digit) {
    operand1: randomInt(10, 99),  // 2-digit
    operand2: randomInt(1, 9)      // 1-digit
  } else {
    operand1: randomInt(100, 999), // 3-digit
    operand2: randomInt(1, 9)       // 1-digit
  }
```

#### Division
```typescript
case 3:
  // Basic division, times table based
  minDividend: 6,
  maxDividend: 81,
  minDivisor: 2,
  maxDivisor: 9,
  exactDivisionOnly: true
```

### Grade 3 Assessment
- ✅ Addition/Subtraction range is correct
- ✅ Multiplication correctly implements 2-digit × 1-digit and 3-digit × 1-digit
- ✅ Division is appropriately limited to times table range
- ❌ Missing decimal support
- ❌ Missing fraction support

## Grade 4 Analysis

### Curriculum Specification
- **Decimals**: Integer × decimal, integer ÷ decimal
- **Fractions**: Same-denominator addition/subtraction, proper/improper/mixed fractions
- **Four operations**: Order of operations with parentheses
- **Inverse operations**: Equations with □

### Current Implementation

#### Multiplication
```typescript
case 4:
  // 2-digit × 1-digit (seems incorrect for Grade 4)
  minNumber: 1,
  maxNumber: 99,
  maxAnswer: 999
```

#### Division
```typescript
case 4:
  // Division with remainder
  minDividend: 10,
  maxDividend: 100,
  minDivisor: 2,
  maxDivisor: 12,
  allowRemainder: true
```

### Grade 4 Issues
- ❌ Multiplication settings seem too basic (should include larger numbers)
- ❌ Missing decimal operations
- ❌ Missing fraction operations
- ❌ Missing parentheses/order of operations

## Grade 5-6 Analysis

### Grade 5 Specification
- **Fractions**: Different denominator addition/subtraction, simplification
- **Decimals**: Decimal × decimal, decimal ÷ decimal
- **Percentage**: Percentages, rates
- **Proportion**: Basic proportional relationships

### Grade 6 Specification
- **Fractions**: Fraction multiplication/division, mixed calculations
- **Ratios**: Ratio calculations
- **Algebraic**: Expressions with x, y
- **Applications**: Speed, proportion/inverse proportion

### Current Implementation (Grades 5-6)

#### Addition/Subtraction
```typescript
case 4:
case 5:
case 6:
  // Large numbers
  minNumber: 100,
  maxNumber: 99999,
  includeCarryOver/includeBorrow: true
```

#### Multiplication/Division
```typescript
case 5:
case 6:
  // Multi-digit multiplication
  minNumber: 1,
  maxNumber: 999,
  maxAnswer: 9999
  // Division
  minDividend: 100,
  maxDividend: 999,
  minDivisor: 2,
  maxDivisor: 25
```

### Grade 5-6 Assessment
- ✅ Basic integer operations are appropriately scaled
- ❌ Missing decimal × decimal, decimal ÷ decimal
- ❌ Missing fraction multiplication/division
- ❌ Missing percentage/ratio calculations
- ❌ Missing algebraic expressions

## Recommendations

### Immediate Fix for Grade 1
```typescript
case 1:
  // Early semester: single digit only
  if (isEarlySemester) {
    minNumber: 1,
    maxNumber: 9,
    excludeCarryOver: true
  } else {
    // Late semester: up to 20 with some carry-over
    minNumber: 1,
    maxNumber: 20,
    includeCarryOver: Math.random() < 0.2  // 20% carry-over
  }
```

### Grade-Specific Improvements

1. **Grade 1**:
   - Limit to single-digit operations initially
   - Gradually introduce numbers up to 20
   - Reduce carry-over probability to 20%

2. **Grade 2**:
   - Current settings are mostly appropriate
   - Add simple fraction concept problems

3. **Grade 3**:
   - Current integer operations are good
   - Need to add decimal support (0.1 place)
   - Need to add simple fraction operations

4. **Grade 4**:
   - Fix multiplication to include larger numbers
   - Add decimal multiplication/division
   - Add fraction operations
   - Add parentheses support

5. **Grades 5-6**:
   - Add advanced decimal operations
   - Add fraction multiplication/division
   - Add percentage/ratio support
   - Add algebraic expression support

### Carry-over/Borrowing Probability Guidelines

| Grade | Operation | Probability | Notes |
|-------|-----------|-------------|-------|
| 1 | Addition | 0-20% | Start with 0%, increase to 20% by year end |
| 1 | Subtraction | 0-20% | Start with 0%, increase to 20% by year end |
| 2 | Addition | 100% | Always include for 2-digit practice |
| 2 | Subtraction | 100% | Always include for 2-digit practice |
| 3+ | All | 100% | Always include for multi-digit |

### Missing Features Priority

1. **High Priority**:
   - Fix Grade 1 difficulty (too hard currently)
   - Add decimal number support (Grades 3-6)
   - Add fraction support (Grades 2-6)

2. **Medium Priority**:
   - Add parentheses/order of operations (Grade 4+)
   - Add percentage calculations (Grade 5)
   - Add ratio calculations (Grade 6)

3. **Low Priority**:
   - Add algebraic expressions (Grade 6)
   - Add word problems
   - Add inverse operations (□ equations)

## Conclusion

The current implementation has a solid foundation for basic integer operations but is missing several key features required by the curriculum specification:

1. **Grade 1 is too difficult** - needs immediate adjustment
2. **Decimal operations** are completely missing despite being required from Grade 3
3. **Fraction operations** are missing despite being introduced in Grade 2
4. **Advanced features** (percentages, ratios, algebra) are not implemented

The most urgent fix is adjusting Grade 1 difficulty to match age-appropriate expectations, followed by implementing decimal and fraction support across the relevant grades.