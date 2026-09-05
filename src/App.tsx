import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Container } from './components/Layout/Container';
import { ProblemTypeSelector } from './components/ProblemGenerator/ProblemTypeSelector';
import { CalculationPatternSelector } from './components/ProblemGenerator/CalculationPatternSelector';
import { LearningPath } from './components/ProblemGenerator/LearningPath';
import { SettingsPanel } from './components/ProblemGenerator/SettingsPanel';
import { WorksheetPreview } from './components/Preview/WorksheetPreview';
import { useProblemStore } from './stores/problemStore';
import { generateProblems } from './lib/generators';
import {
  syncUrlFromSettings,
  getOperationFromPattern,
} from './lib/utils/url-state';
import { getLearningStages } from './config/learning-paths';
import type { CalculationPattern, WorksheetData } from './types';

function App(): React.ReactElement {
  const { settings, updateSettings, setProblems, getWorksheetData } =
    useProblemStore();
  const [worksheetData, setWorksheetData] = useState<WorksheetData>();
  const [showAnswers, setShowAnswers] = useState(false);
  const [error, setError] = useState('');
  const [showPath, setShowPath] = useState(true);
  const hasPatternSelectionStep = settings.problemType === 'basic';
  const selectPattern = (calculationPattern: CalculationPattern): void => {
    setShowAnswers(false);
    updateSettings({
      calculationPattern,
      problemType: 'basic',
      operation: getOperationFromPattern(calculationPattern),
    });
  };
  const handleGenerate = useCallback(() => {
    try {
      setProblems(generateProblems(settings));
      setWorksheetData(getWorksheetData());
      setError('');
    } catch {
      setWorksheetData(undefined);
      setError(
        '問題を作成できませんでした。別の教材を選ぶか、もう一度作成してください。'
      );
    }
  }, [settings, setProblems, getWorksheetData]);

  useEffect(() => {
    handleGenerate();
    syncUrlFromSettings(settings);
  }, [handleGenerate, settings]);

  return (
    <div className="app-shell min-h-screen no-print">
      <a className="skip-link" href="#worksheet-settings">
        プリント設定へ移動
      </a>
      <Header />
      <main id="main" className="py-7 md:py-10">
        <Container className="space-y-6">
          <section className="intro-row">
            <div>
              <p className="eyebrow">少しずつ、わかるをふやそう</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                今日の学びを、一枚に。
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                学年から、今の「ちょうどいい」を選ぶ。練習して、確かめて、次の一歩へ。
              </p>
            </div>
            <div className="intro-steps" aria-label="使い方">
              <span>
                <b>01</b> 教材を選ぶ
              </span>
              <span>
                <b>02</b> 解いて確かめる
              </span>
              <span>
                <b>03</b> ふりかえる
              </span>
            </div>
          </section>
          <div className="grade-bar">
            <ProblemTypeSelector
              grade={settings.grade}
              operation={settings.operation}
              problemType={settings.problemType}
              onGradeChange={(grade) => {
                setShowAnswers(false);
                updateSettings({
                  grade,
                  problemType: grade === 0 ? 'number-tracing' : 'basic',
                  calculationPattern: getLearningStages(grade)[0]?.patterns[0],
                  operation: 'addition',
                });
              }}
              onOperationChange={(operation) => updateSettings({ operation })}
              onProblemTypeChange={(problemType) =>
                updateSettings({ problemType })
              }
            />
            <div className="text-sm text-slate-600">
              <strong className="block text-slate-800 mb-1">
                学年はいつでも行き来できます
              </strong>
              得意なところは先へ。むずかしいときは、前の学年から。
            </div>
            {settings.grade > 0 && (
              <button
                type="button"
                className="secondary-button"
                aria-expanded={showPath}
                aria-controls="learning-path-panel"
                onClick={() => setShowPath(!showPath)}
              >
                {showPath ? '道すじを閉じる' : '学習の道すじを見る'}
              </button>
            )}
          </div>
          <a href="#worksheet-preview" className="secondary-button lg:hidden">
            プリントを見る ↓
          </a>
          {settings.grade > 0 && showPath && (
            <div id="learning-path-panel">
              <LearningPath
                key={settings.grade}
                grade={settings.grade}
                pattern={settings.calculationPattern}
                onSelect={selectPattern}
              />
            </div>
          )}
          <div className="workspace-grid">
            <aside id="worksheet-settings" className="settings-card">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  プリントを整える
                </h2>
                <span className="text-xs text-slate-500">自動プレビュー</span>
              </div>
              {hasPatternSelectionStep && (
                <CalculationPatternSelector
                  grade={settings.grade}
                  selectedPattern={settings.calculationPattern}
                  onPatternChange={selectPattern}
                />
              )}
              <div className="border-t border-slate-100 pt-5">
                <SettingsPanel
                  problemCount={settings.problemCount}
                  layoutColumns={settings.layoutColumns}
                  grade={settings.grade}
                  problemType={settings.problemType}
                  calculationPattern={settings.calculationPattern}
                  showEquationLine={settings.showEquationLine}
                  stepNumber={hasPatternSelectionStep ? 3 : 2}
                  onProblemCountChange={(problemCount) =>
                    updateSettings({ problemCount })
                  }
                  onLayoutColumnsChange={(layoutColumns) =>
                    updateSettings({ layoutColumns })
                  }
                  onShowEquationLineChange={(showEquationLine) =>
                    updateSettings({ showEquationLine })
                  }
                />
              </div>
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <label className="flex items-center justify-between text-sm font-medium text-slate-700">
                  解答表示
                  <input
                    type="checkbox"
                    checked={showAnswers}
                    onChange={(e) => setShowAnswers(e.target.checked)}
                    className="h-5 w-5 accent-teal-700"
                  />
                </label>
                <button
                  type="button"
                  className="secondary-button w-full"
                  onClick={handleGenerate}
                >
                  同じ教材で問題を作り直す ↻
                </button>
                <p className="text-xs text-slate-500 leading-relaxed">
                  まずは答えを見ずに解いてみましょう。丸つけの後は、まちがえた問題をもう一度。
                </p>
              </div>
            </aside>
            <div className="min-w-0" id="worksheet-preview">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-rose-50 p-4 mb-4 text-rose-800"
                >
                  {error}
                </div>
              )}
              <WorksheetPreview
                worksheetData={worksheetData}
                showAnswers={showAnswers}
              />
            </div>
          </div>
          <footer className="app-footer">
            <p>まいにち算数 · ご家庭と教室のための学習プリント</p>
            <p>印刷設定：A4・倍率100%・ヘッダーとフッターなし</p>
          </footer>
        </Container>
      </main>
    </div>
  );
}
export default App;
