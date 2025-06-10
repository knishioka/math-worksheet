import React from 'react';

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onGenerate,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || isLoading}
        className={`w-full px-6 py-3 text-base font-medium rounded-md shadow-sm ${
          disabled || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        } transition-colors duration-200`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            問題を生成中...
          </div>
        ) : (
          '問題を生成'
        )}
      </button>

      <p className="text-xs text-gray-500 mt-2 text-center">
        設定に基づいて計算問題を自動生成します
      </p>
    </div>
  );
};