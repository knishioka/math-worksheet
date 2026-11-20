import React from 'react';
import { GRADES, GRADE_LABELS, getGradeProblemType } from '../../config/grades';
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
      if (grade === 0) {
        // 幼児はなぞり書きのみ
        return type === 'number-tracing';
      }
      if (type === 'number-tracing') {
        return false; // 幼児以外では提供しない
      }
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

  // If current problem type is not available for the new grade, switch to default
  React.useEffect(() => {
    if (!isProblemTypeAvailable(problemType)) {
      onProblemTypeChange(getGradeProblemType(grade));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, problemType, isProblemTypeAvailable]);

  return (
    <section aria-labelledby="grade-selector-heading">
      <div>
        <p className="text-xs font-semibold tracking-wide text-teal-600">
          STEP 1
        </p>
        <label
          id="grade-selector-heading"
          htmlFor="grade-select"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          学年を選ぶ
        </label>
        <select
          id="grade-select"
          value={grade}
          onChange={(e) => onGradeChange(Number(e.target.value) as Grade)}
          className="w-full rounded-xl border border-teal-200 bg-white/80 px-4 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-300"
        >
          {GRADES.map((value) => (
            <option value={value} key={value}>
              {GRADE_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};
