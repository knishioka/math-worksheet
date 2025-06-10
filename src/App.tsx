import React, { useState, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { Container } from './components/Layout/Container';
import { ProblemTypeSelector } from './components/ProblemGenerator/ProblemTypeSelector';
import { SettingsPanel } from './components/ProblemGenerator/SettingsPanel';
import { GenerateButton } from './components/ProblemGenerator/GenerateButton';
import { WorksheetPreview } from './components/Preview/WorksheetPreview';
import { useProblemStore } from './stores/problemStore';
import { generateProblems } from './lib/generators';
import type { WorksheetData } from './types';

function App(): React.ReactElement {
  const {
    settings,
    updateSettings,
    setProblems,
    getWorksheetData,
  } = useProblemStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheetData, setWorksheetData] = useState<WorksheetData | undefined>();
  const [showAnswers, setShowAnswers] = useState(false);

  const handleGenerate = useCallback(async (): Promise<void> => {
    try {
      setIsGenerating(true);
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const generatedProblems = generateProblems(settings);
      setProblems(generatedProblems);
      
      const newWorksheetData = getWorksheetData();
      setWorksheetData(newWorksheetData);
    } catch (error) {
      console.error('Failed to generate problems:', error);
      // TODO: Add error handling UI
    } finally {
      setIsGenerating(false);
    }
  }, [settings, setProblems, getWorksheetData]);

  const canGenerate = settings.grade && settings.operation && settings.problemCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
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
                    onGradeChange={(grade) => updateSettings({ grade })}
                    onOperationChange={(operation) => updateSettings({ operation })}
                    onProblemTypeChange={(problemType) => updateSettings({ problemType })}
                  />
                </div>

                {/* Layout and Count Settings */}
                <div className="mb-6">
                  <SettingsPanel
                    problemCount={settings.problemCount}
                    layoutColumns={settings.layoutColumns}
                    includeCarryOver={settings.includeCarryOver}
                    minNumber={settings.minNumber}
                    maxNumber={settings.maxNumber}
                    onProblemCountChange={(problemCount) => updateSettings({ problemCount })}
                    onLayoutColumnsChange={(layoutColumns) => updateSettings({ layoutColumns })}
                    onIncludeCarryOverChange={(includeCarryOver) => updateSettings({ includeCarryOver })}
                    onMinNumberChange={(minNumber) => updateSettings({ minNumber })}
                    onMaxNumberChange={(maxNumber) => updateSettings({ maxNumber })}
                  />
                </div>

                {/* Generate Button */}
                <GenerateButton
                  onGenerate={handleGenerate}
                  isLoading={isGenerating}
                  disabled={!canGenerate}
                />

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
                        <span className="ml-2 text-sm text-gray-600">解答表示</span>
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
  );
}

function getOperationName(operation: string): string {
  switch (operation) {
    case 'addition':
      return 'たし算';
    case 'subtraction':
      return 'ひき算';
    case 'multiplication':
      return 'かけ算';
    case 'division':
      return 'わり算';
    default:
      return '計算';
  }
}

export default App;
