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
  // Check which operations are available for the current grade
  const isOperationAvailable = (op: Operation): boolean => {
    if (grade === 1 && (op === 'multiplication' || op === 'division')) {
      return false;
    }
    if (grade === 2 && op === 'division') {
      return false;
    }
    return true;
  };

  // If current operation is not available for the new grade, switch to addition
  React.useEffect(() => {
    if (!isOperationAvailable(operation)) {
      onOperationChange('addition');
    }
  }, [grade, operation]);
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          学年
        </label>
        <select
          value={grade}
          onChange={(e) => onGradeChange(Number(e.target.value) as Grade)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={1}>1年生</option>
          <option value={2}>2年生</option>
          <option value={3}>3年生</option>
          <option value={4}>4年生</option>
          <option value={5}>5年生</option>
          <option value={6}>6年生</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          計算の種類
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOperationChange('addition')}
            className={`px-4 py-2 text-sm font-medium rounded-md border ${
              operation === 'addition'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            たし算
          </button>
          <button
            type="button"
            onClick={() => onOperationChange('subtraction')}
            className={`px-4 py-2 text-sm font-medium rounded-md border ${
              operation === 'subtraction'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            ひき算
          </button>
          {isOperationAvailable('multiplication') && (
            <button
              type="button"
              onClick={() => onOperationChange('multiplication')}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${
                operation === 'multiplication'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              かけ算
            </button>
          )}
          {isOperationAvailable('division') && (
            <button
              type="button"
              onClick={() => onOperationChange('division')}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${
                operation === 'division'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              わり算
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          問題の形式
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="basic"
              checked={problemType === 'basic'}
              onChange={(e) => onProblemTypeChange(e.target.value as ProblemType)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">基本計算</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="hissan"
              checked={problemType === 'hissan'}
              onChange={(e) => onProblemTypeChange(e.target.value as ProblemType)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">筆算</span>
          </label>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          {grade}年生 {getOperationName(operation)}の特徴
        </h4>
        <p className="text-sm text-blue-700">
          {getGradeOperationDescription(grade, operation)}
        </p>
      </div>
    </div>
  );
};

function getOperationName(operation: Operation): string {
  switch (operation) {
    case 'addition':
      return 'たし算';
    case 'subtraction':
      return 'ひき算';
    case 'multiplication':
      return 'かけ算';
    case 'division':
      return 'わり算';
  }
}

function getGradeOperationDescription(grade: Grade, operation: Operation): string {
  const descriptions: Record<Grade, Partial<Record<Operation, string>>> = {
    1: {
      addition: '1〜100の範囲でのたし算。繰り上がりのある計算は2学期後半から学習します。',
      subtraction: '1〜100の範囲でのひき算。繰り下がりのある計算は2学期後半から学習します。',
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