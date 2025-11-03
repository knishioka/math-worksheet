import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Container } from './components/Layout/Container';
import { ProblemTypeSelector } from './components/ProblemGenerator/ProblemTypeSelector';
import { CalculationPatternSelector } from './components/ProblemGenerator/CalculationPatternSelector';
import { SettingsPanel } from './components/ProblemGenerator/SettingsPanel';
import { WorksheetPreview } from './components/Preview/WorksheetPreview';
import { useProblemStore } from './stores/problemStore';
import { generateProblems } from './lib/generators';
import type { WorksheetData, CalculationPattern, Operation } from './types';

// 計算パターンから演算タイプを判定する関数
function getOperationFromPattern(pattern: CalculationPattern): Operation {
  if (pattern.includes('add')) return 'addition';
  if (pattern.includes('sub')) return 'subtraction';
  if (pattern.includes('mult')) return 'multiplication';
  if (pattern.includes('div')) return 'division';
  return 'addition'; // デフォルト
}

function App(): React.ReactElement {
  const { settings, updateSettings, setProblems, getWorksheetData } =
    useProblemStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheetData, setWorksheetData] = useState<
    WorksheetData | undefined
  >();
  const [showAnswers, setShowAnswers] = useState(false);

  const handleGenerate = useCallback(async (): Promise<void> => {
    try {
      setIsGenerating(true);

      const generatedProblems = generateProblems(settings);
      setProblems(generatedProblems);

      const newWorksheetData = getWorksheetData();
      setWorksheetData(newWorksheetData);
    } catch (error) {
      console.error('Failed to generate problems:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [settings, setProblems, getWorksheetData]);

  // 設定変更時に自動で問題を生成
  useEffect(() => {
    if (settings.grade && settings.operation && settings.problemCount > 0) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.grade,
    settings.operation,
    settings.problemType,
    settings.calculationPattern,
    settings.problemCount,
    settings.layoutColumns,
  ]);

  return (
    <>
      <div className="relative min-h-screen no-print">
        <Header />
        <main className="relative z-10 py-12">
          <Container className="space-y-10">
            <section className="relative overflow-hidden rounded-3xl bg-white/80 px-6 py-8 shadow-xl ring-1 ring-blue-100 backdrop-blur">
              <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-sky-200/50 blur-3xl" aria-hidden="true"></div>
              <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-emerald-200/60 blur-3xl" aria-hidden="true"></div>
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">設定を選んで、あなただけのプリントを作成</h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    学年・計算の種類・レイアウトを組み合わせると、お子さまの学習状況にぴったりのプリントが完成します。
                    プレビューを確認しながら、納得のいく構成に仕上げてください。
                  </p>
                </div>
                <div className="flex flex-col gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2 rounded-full bg-sky-100/80 px-4 py-2 shadow-sm">
                    <span className="text-lg">🧭</span>
                    <span>ステップごとに案内するやさしいガイド</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-2 shadow-sm">
                    <span className="text-lg">⏱️</span>
                    <span>自動生成で準備の時間を短縮</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Settings Panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6 rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-blue-100 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">設定</h2>
                    <span className="text-xs font-medium text-sky-600">STEP 1</span>
                  </div>

                  {/* Problem Type Selection */}
                  <div className="mb-6">
                    <ProblemTypeSelector
                      grade={settings.grade}
                      operation={settings.operation}
                      problemType={settings.problemType}
                      onGradeChange={(grade) =>
                        updateSettings({ grade, calculationPattern: undefined })
                      }
                      onOperationChange={(operation) =>
                        updateSettings({ operation })
                      }
                      onProblemTypeChange={(problemType) =>
                        updateSettings({ problemType })
                      }
                    />
                  </div>

                  {/* Calculation Pattern Selection */}
                  {settings.problemType === 'basic' && (
                    <div className="mb-6">
                      <CalculationPatternSelector
                        grade={settings.grade}
                        selectedPattern={settings.calculationPattern}
                        onPatternChange={(calculationPattern) => {
                          const operation =
                            getOperationFromPattern(calculationPattern);
                          updateSettings({ calculationPattern, operation });
                        }}
                      />
                    </div>
                  )}

                  {/* Layout and Count Settings */}
                  <div className="mb-6">
                    <SettingsPanel
                      problemCount={settings.problemCount}
                      layoutColumns={settings.layoutColumns}
                      problemType={settings.problemType}
                      calculationPattern={settings.calculationPattern}
                      onProblemCountChange={(problemCount) =>
                        updateSettings({ problemCount })
                      }
                      onLayoutColumnsChange={(layoutColumns) =>
                        updateSettings({ layoutColumns })
                      }
                    />
                  </div>

                  {isGenerating && (
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-600 shadow-inner">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        問題を生成中...
                      </div>
                    </div>
                  )}

                  {/* Export Controls */}
                  {worksheetData && (
                    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-sky-900">
                          表示オプション
                        </span>
                        <label className="flex items-center text-sm text-slate-600">
                          <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="h-4 w-4 rounded border-sky-300 text-sky-500 focus:ring-sky-400"
                          />
                          <span className="ml-2">解答表示</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-2">
                <WorksheetPreview
                  worksheetData={worksheetData}
                  showAnswers={showAnswers}
                />
              </div>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
}

export default App;
