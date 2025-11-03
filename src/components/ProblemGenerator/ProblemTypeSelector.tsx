import React from 'react';
import type { Grade, Operation, ProblemType } from '../../types';

interface ProblemTypeSelectorProps {
  grade: Grade;
  operation: Operation;
  problemType: ProblemType;
  onGradeChange: (grade: Grade) => void;
  onOperationChange: (operation: Operation) => void;
  onProblemTypeChange: (type: ProblemType) => void;
}

export const ProblemTypeSelector: React.FC<ProblemTypeSelectorProps> = ({
  grade,
  operation,
  problemType,
  onGradeChange,
  onOperationChange,
  onProblemTypeChange,
}) => {
  // 基本計算のみ表示し、演算選択は計算パターンで行う
  const showBasicOnly = true;
  // Check which operations are available for the current grade
  const isOperationAvailable = React.useCallback(
    (op: Operation): boolean => {
      if (grade === 1 && (op === 'multiplication' || op === 'division')) {
        return false;
      }
      if (grade === 2 && op === 'division') {
        return false;
      }
      return true;
    },
    [grade]
  );

  // Check which problem types are available for the current grade
  const isProblemTypeAvailable = React.useCallback(
    (type: ProblemType): boolean => {
      if (type === 'fraction') {
        return grade >= 2; // 2年生以降で分数を学習
      }
      if (type === 'decimal') {
        return grade >= 3; // 3年生以降で小数を学習
      }
      return true;
    },
    [grade]
  );

  // If current operation is not available for the new grade, switch to addition
  React.useEffect(() => {
    if (!isOperationAvailable(operation)) {
      onOperationChange('addition');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, operation, isOperationAvailable]);

  // If current problem type is not available for the new grade, switch to basic
  React.useEffect(() => {
    if (!isProblemTypeAvailable(problemType)) {
      onProblemTypeChange('basic');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, problemType, isProblemTypeAvailable]);

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          学年
        </label>
        <select
          value={grade}
          onChange={(e) => onGradeChange(Number(e.target.value) as Grade)}
          className="w-full rounded-xl border border-sky-200 bg-white/80 px-4 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
        >
          <option value={1}>1年生</option>
          <option value={2}>2年生</option>
          <option value={3}>3年生</option>
          <option value={4}>4年生</option>
          <option value={5}>5年生</option>
          <option value={6}>6年生</option>
        </select>
      </div>

      {!showBasicOnly && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            計算の種類
          </label>
          <p className="text-sm text-gray-600 mb-4">
            基本計算を選択して、次のステップで詳細な計算パターンを選んでください。
          </p>
        </div>
      )}


      <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
        <h4 className="mb-2 text-sm font-semibold text-sky-900">
          {grade}年生 {getProblemTypeDescription(problemType)}
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          {getGradeProblemTypeDescription(grade, problemType, operation)}
        </p>
      </div>
    </div>
  );
};

function getProblemTypeDescription(problemType: ProblemType): string {
  switch (problemType) {
    case 'basic':
      return '基本計算';
    case 'fraction':
      return '分数';
    case 'decimal':
      return '小数';
    case 'mixed':
      return '帯分数';
    case 'hissan':
      return '筆算';
    case 'missing':
      return '虫食い算';
    case 'word':
      return '文章題';
    default:
      return '計算';
  }
}

function getGradeProblemTypeDescription(
  grade: Grade,
  problemType: ProblemType,
  operation: Operation
): string {
  if (problemType === 'fraction') {
    const fractionDescriptions: Record<Grade, string> = {
      1: '（この学年では分数を学習しません）',
      2: '簡単な分数の概念（1/2、1/3、1/4など）を学習します。',
      3: '同分母分数の加減算を学習します。',
      4: '同分母分数の加減、真分数・仮分数・帯分数を学習します。',
      5: '異分母分数の加減、約分・通分を学習します。',
      6: '分数の乗除、複雑な分数計算を学習します。',
    };
    return fractionDescriptions[grade];
  }

  if (problemType === 'decimal') {
    const decimalDescriptions: Record<Grade, string> = {
      1: '（この学年では小数を学習しません）',
      2: '（この学年では小数を学習しません）',
      3: '0.1の位までの小数、小数のたし算・ひき算を学習します。',
      4: '整数×小数、整数÷小数の計算を学習します。',
      5: '小数×小数、小数÷小数の計算を学習します。',
      6: 'より複雑な小数計算を学習します。',
    };
    return decimalDescriptions[grade];
  }

  // 従来の基本計算の説明
  return getGradeOperationDescription(grade, operation);
}

function getGradeOperationDescription(
  grade: Grade,
  operation: Operation
): string {
  const descriptions: Record<Grade, Partial<Record<Operation, string>>> = {
    1: {
      addition:
        '1〜100の範囲でのたし算。繰り上がりのある計算は2学期後半から学習します。',
      subtraction:
        '1〜100の範囲でのひき算。繰り下がりのある計算は2学期後半から学習します。',
    },
    2: {
      addition: '2桁の数の筆算。繰り上がりのある計算を含みます。',
      subtraction: '2桁の数の筆算。繰り下がりのある計算を含みます。',
      multiplication: '九九（1×1〜9×9）を覚えて、かけ算の基礎を固めます。',
    },
    3: {
      addition: '3桁・4桁の数の筆算。より大きな数での計算を学習します。',
      subtraction: '3桁・4桁の数の筆算。より大きな数での計算を学習します。',
      multiplication: '2桁×1桁、3桁×1桁の筆算を学習します。',
      division: '九九を使った基本的な割り算を学習します。',
    },
    4: {
      addition: '大きな数のたし算。※小数・分数は現在未実装です。',
      subtraction: '大きな数のひき算。※小数・分数は現在未実装です。',
      multiplication: '2桁×1桁の筆算を学習します。※小数は現在未実装です。',
      division: 'あまりのある割り算を学習します。※小数は現在未実装です。',
    },
    5: {
      addition: '大きな数のたし算。※小数・分数は現在未実装です。',
      subtraction: '大きな数のひき算。※小数・分数は現在未実装です。',
      multiplication: '多桁数のかけ算を学習します。※小数は現在未実装です。',
      division: '多桁数の割り算を学習します。※小数は現在未実装です。',
    },
    6: {
      addition: '大きな数のたし算。※小数・分数は現在未実装です。',
      subtraction: '大きな数のひき算。※小数・分数は現在未実装です。',
      multiplication: '多桁数のかけ算を学習します。※分数は現在未実装です。',
      division: '多桁数の割り算を学習します。※分数は現在未実装です。',
    },
  };

  return descriptions[grade][operation] || '（この学年では学習しません）';
}
