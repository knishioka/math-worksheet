import React, { useState, useCallback } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  icon?: string;
  badge?: number;
  children: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 初期展開するアイテムのID */
  defaultOpen?: string[];
  /** 外部から展開状態を制御する場合 */
  expandedIds?: string[];
  /** 展開状態が変わった時のコールバック */
  onExpandChange?: (expandedIds: string[]) => void;
  /** 複数同時展開を許可するか（デフォルト: true） */
  allowMultiple?: boolean;
  className?: string;
}

/**
 * アコーディオンコンポーネント
 * カテゴリごとにパターンを折りたたみ表示
 */
export function Accordion({
  items,
  defaultOpen = [],
  expandedIds: controlledExpandedIds,
  onExpandChange,
  allowMultiple = true,
  className = '',
}: AccordionProps): React.ReactElement {
  const [internalExpandedIds, setInternalExpandedIds] =
    useState<string[]>(defaultOpen);

  // 制御モードか非制御モードかを判定
  const isControlled = controlledExpandedIds !== undefined;
  const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds;

  const toggleItem = useCallback(
    (itemId: string) => {
      const newExpandedIds = expandedIds.includes(itemId)
        ? expandedIds.filter((id) => id !== itemId)
        : allowMultiple
          ? [...expandedIds, itemId]
          : [itemId];

      if (!isControlled) {
        setInternalExpandedIds(newExpandedIds);
      }
      onExpandChange?.(newExpandedIds);
    },
    [expandedIds, allowMultiple, isControlled, onExpandChange]
  );

  if (items.length === 0) {
    return <div className={className} />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isExpanded={expandedIds.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
}

interface AccordionItemComponentProps {
  item: AccordionItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function AccordionItemComponent({
  item,
  isExpanded,
  onToggle,
}: AccordionItemComponentProps): React.ReactElement {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/50 overflow-hidden">
      {/* ヘッダー（クリック可能） */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-inset"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span className="font-medium text-slate-800">{item.title}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-medium rounded-full bg-sky-100 text-sky-700">
              {item.badge}
            </span>
          )}
        </div>
        {/* シェブロンアイコン */}
        <svg
          className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* コンテンツ（展開時のみ表示） */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 border-t border-slate-100">
          {item.children}
        </div>
      </div>
    </div>
  );
}
