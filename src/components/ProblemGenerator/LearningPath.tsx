import { useState, type ReactNode } from 'react';
import type { CalculationPattern, Grade } from '../../types';
import { PATTERN_LABELS, PATTERN_DESCRIPTIONS } from '../../types';
import { getLearningStages } from '../../config/learning-paths';

const STORAGE_KEY = 'math-worksheet-practice-v1';
function readPractice(): string[] {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '[]'
    );
    return Array.isArray(saved)
      ? saved.filter((v): v is string => typeof v === 'string')
      : [];
  } catch {
    return [];
  }
}

interface Props {
  grade: Grade;
  pattern?: CalculationPattern;
  onSelect: (pattern: CalculationPattern) => void;
}
export function LearningPath({ grade, pattern, onSelect }: Props): ReactNode {
  const stages = getLearningStages(grade);
  const currentStage = stages.findIndex(
    (stage) => pattern && stage.patterns.includes(pattern)
  );
  const [browsingStage, setBrowsingStage] = useState<number | null>(null);
  const [practiced, setPracticed] = useState(readPractice);
  const [storageNotice, setStorageNotice] = useState('');
  const stageIndex = browsingStage ?? Math.max(0, currentStage);
  const stage = stages[stageIndex];
  if (!stage) return null;
  const allPatterns = stages.flatMap((s) => s.patterns);
  const practicedCount = allPatterns.filter((p) =>
    practiced.includes(`${grade}:${p}`)
  ).length;
  const currentIndex = pattern ? allPatterns.indexOf(pattern) : -1;
  const next = currentIndex >= 0 ? allPatterns[currentIndex + 1] : undefined;
  const togglePractice = (): void => {
    if (!pattern) return;
    const key = `${grade}:${pattern}`;
    const updated = practiced.includes(key)
      ? practiced.filter((p) => p !== key)
      : [...practiced, key];
    setPracticed(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      setStorageNotice(
        'このブラウザでは記録を保存できません。画面を閉じるまで有効です。'
      );
    }
  };

  return (
    <section className="learning-path" aria-labelledby="learning-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">LEARNING PATH</p>
          <h2
            id="learning-heading"
            className="mt-1 text-xl font-bold text-slate-900"
          >
            {grade}年生の学習の道すじ
          </h2>
        </div>
        <div className="text-right text-xs text-slate-600">
          <p>
            練習した教材{' '}
            <strong className="text-teal-800">
              {practicedCount} / {allPatterns.length}
            </strong>
          </p>
          <p className="mt-1">記録はこのブラウザに保存</p>
        </div>
      </div>
      <div className="path-stages" role="group" aria-label="学習段階">
        {stages.map((item, index) => (
          <button
            type="button"
            key={item.title}
            aria-pressed={stageIndex === index}
            onClick={() => setBrowsingStage(index)}
            className="path-stage"
          >
            <span className="stage-number">0{index + 1}</span>
            <span>
              <span className="block text-xs mb-1">
                {['はじめる', '身につける', '使ってみる'][index]}
              </span>
              <strong>{item.title}</strong>
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <p className="font-medium text-slate-800">{stage.goal}</p>
        <p className="text-xs text-slate-500">
          教材を選ぶとプリントを自動作成します
        </p>
      </div>
      <div className="path-lessons" role="group" aria-label={stage.title}>
        {stage.patterns.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={pattern === item}
            className="path-lesson"
            onClick={() => {
              setBrowsingStage(null);
              onSelect(item);
            }}
            title={PATTERN_DESCRIPTIONS[item]}
          >
            <span
              className="lesson-check"
              aria-label={
                practiced.includes(`${grade}:${item}`) ? '練習済み' : '未記録'
              }
            >
              {practiced.includes(`${grade}:${item}`) ? '✓' : '○'}
            </span>
            {PATTERN_LABELS[item]}
          </button>
        ))}
      </div>
      <div className="path-reflection">
        <p>
          <strong>ふりかえり</strong>
          <span className="ml-3">{stage.check}</span>
        </p>
        {currentIndex >= 0 && currentStage === stageIndex && (
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <button
              type="button"
              className="secondary-button"
              aria-pressed={practiced.includes(`${grade}:${pattern}`)}
              onClick={togglePractice}
            >
              {practiced.includes(`${grade}:${pattern}`)
                ? '✓ 練習済み（取り消す）'
                : 'この教材を「練習した」にする'}
            </button>
            {next && (
              <button
                type="button"
                className="text-teal-800 font-semibold text-xs hover:underline"
                onClick={() => {
                  setBrowsingStage(null);
                  onSelect(next);
                }}
              >
                次の教材：{PATTERN_LABELS[next]} →
              </button>
            )}
            {!next && (
              <span className="text-xs text-slate-600">
                道すじの最後です。苦手だった教材をもう一度練習しましょう。
              </span>
            )}
          </div>
        )}
        {storageNotice && (
          <p role="status" className="mt-2">
            {storageNotice}
          </p>
        )}
      </div>
    </section>
  );
}
