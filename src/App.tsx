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
      <div className="min-h-screen bg-gray-50 no-print">
        <Header />
        <main className="py-8">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Settings Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                  <h2 className="text-xl font-semibold mb-6">設定</h2>

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
                      <div className="inline-flex items-center px-4 py-2 text-sm text-blue-600">
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
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          表示オプション
                        </span>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            解答表示
                          </span>
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
