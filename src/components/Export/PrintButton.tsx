import React from 'react';

interface PrintButtonProps {
  disabled?: boolean;
  worksheetTitle?: string;
  elementId?: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  disabled = false,
  worksheetTitle = '計算プリント',
  elementId,
}) => {
  const handlePrint = (): void => {
    // Set document title for printing
    const originalTitle = document.title;
    document.title = worksheetTitle;

    if (elementId) {
      // Hide all elements except the target element for printing
      const allElements = document.body.querySelectorAll('body > *');
      const targetElement = document.getElementById(elementId);

      if (targetElement) {
        // Create a temporary container
        const printContent = targetElement.cloneNode(true) as HTMLElement;
        const printContainer = document.createElement('div');
        printContainer.id = 'print-container';
        printContainer.appendChild(printContent);

        // Add print-specific styles
        const styleEl = document.createElement('style');
        styleEl.textContent = `
          @media print {
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
            #print-container {
              width: 100%;
            }
          }
        `;
        document.head.appendChild(styleEl);

        // Hide all body children
        allElements.forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });

        // Add print container
        document.body.appendChild(printContainer);

        // Print
        window.print();

        // Restore visibility
        allElements.forEach((el) => {
          (el as HTMLElement).style.display = '';
        });

        // Remove print container and style
        printContainer.remove();
        styleEl.remove();
      } else {
        window.print();
      }
    } else {
      // Trigger print dialog normally
      window.print();
    }

    // Restore original title
    document.title = originalTitle;
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      disabled={disabled}
      className={`w-full px-4 py-2 text-sm font-medium rounded-md border ${
        disabled
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      } transition-colors duration-200`}
    >
      <div className="flex items-center justify-center">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
        印刷
      </div>
    </button>
  );
};
