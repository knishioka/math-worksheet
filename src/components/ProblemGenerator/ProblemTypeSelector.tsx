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
  const descriptions: Record<Grade, Record<Operation, string>> = {
    1: {
      addition: '1桁の数のたし算。繰り上がりのある計算も含みます。',
      subtraction: '1桁の数のひき算。繰り下がりのある計算も含みます。',
      multiplication: 'かけ算の基本的な概念を学習します。',
      division: 'わり算の基本的な概念を学習します。',
    },
    2: {
      addition: '2桁の数のたし算。筆算での計算方法を学習します。',
      subtraction: '2桁の数のひき算。筆算での計算方法を学習します。',
      multiplication: '九九を覚えて、かけ算の基礎を固めます。',
      division: 'わり算の基本的な計算を学習します。',
    },
    3: {
      addition: '3桁・4桁の数のたし算。より大きな数での計算を学習します。',
      subtraction: '3桁・4桁の数のひき算。より大きな数での計算を学習します。',
      multiplication: '2桁×1桁、3桁×1桁の筆算を学習します。',
      division: 'わり算の筆算の基礎を学習します。',
    },
    4: {
      addition: '小数のたし算も含めて、より複雑な計算を学習します。',
      subtraction: '小数のひき算も含めて、より複雑な計算を学習します。',
      multiplication: '2桁×2桁の筆算や小数のかけ算を学習します。',
      division: '2桁÷1桁の筆算や小数のわり算を学習します。',
    },
    5: {
      addition: '分数のたし算や小数のたし算を学習します。',
      subtraction: '分数のひき算や小数のひき算を学習します。',
      multiplication: '小数×小数の計算を学習します。',
      division: '小数÷小数の計算を学習します。',
    },
    6: {
      addition: '分数と小数の混合計算を学習します。',
      subtraction: '分数と小数の混合計算を学習します。',
      multiplication: '分数×分数の計算を学習します。',
      division: '分数÷分数の計算を学習します。',
    },
  };

  return descriptions[grade][operation];
}