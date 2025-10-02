import React from 'react';

interface PrintWarningDialogProps {
  isOpen: boolean;
  warnings: string[];
  recommendations: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const PrintWarningDialog: React.FC<PrintWarningDialogProps> = ({
  isOpen,
  warnings,
  recommendations,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#d97706',
          }}
        >
          ⚠️ 印刷レイアウトの警告
        </h2>

        {/* 警告メッセージ */}
        {warnings.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#dc2626',
              }}
            >
              問題点：
            </h3>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: '24px',
                marginBottom: '0',
              }}
            >
              {warnings.map((warning, index) => (
                <li
                  key={index}
                  style={{ marginBottom: '4px', color: '#374151' }}
                >
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 推奨事項 */}
        {recommendations.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#2563eb',
              }}
            >
              推奨設定：
            </h3>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: '24px',
                marginBottom: '0',
              }}
            >
              {recommendations.map((recommendation, index) => (
                <li
                  key={index}
                  style={{ marginBottom: '4px', color: '#374151' }}
                >
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ボタン */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            このまま印刷する
          </button>
        </div>
      </div>
    </div>
  );
};
