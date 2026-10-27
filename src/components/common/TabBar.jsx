import { useRef } from 'react';

// 가로 탭 (DAY 1·2·3, 상품 카테고리, 예정/지난 여행).
// tabs = [{ key, label }], 선택된 탭은 부모가 activeKey로 정하고, 바뀌면 onChange(key)로 알린다.
// 탭 묶음은 Tab 키로 한 번만 들어가고, 안에서는 ←/→ 키로 옮겨 다니는 것이 웹 접근성 표준 방식이다.
export default function TabBar({ tabs, activeKey, onChange, className = '' }) {
  const tabRefs = useRef([]);
  const hasActive = tabs.some((tab) => tab.key === activeKey);

  const handleKeyDown = (event, index) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    // 끝에서 →를 누르면 처음으로, 처음에서 ←를 누르면 끝으로 돈다.
    const nextIndex = (index + step + tabs.length) % tabs.length;
    onChange(tabs[nextIndex].key);
    tabRefs.current[nextIndex]?.focus();
  };

  // 회색 밑줄은 바깥 div에, 가로 스크롤은 안쪽 div에 따로 준다.
  // 한 div에 같이 주면 선택 밑줄을 겹치려고 내린 1px 때문에 세로 스크롤바까지 생긴다.
  // 스크롤바는 손가락으로 밀면 되는 모바일에서 밑줄을 가려서 숨긴다.
  return (
    <div className={`border-b border-text/10 ${className}`}>
      <div role="tablist" className="flex overflow-x-auto [scrollbar-width:none]">
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeKey;
          // 선택된 탭이 없으면 첫 탭이라도 Tab 키로 들어갈 수 있게 한다.
          const isFocusable = isActive || (!hasActive && index === 0);

          return (
            <button
              key={tab.key}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isFocusable ? 0 : -1}
              onClick={() => onChange(tab.key)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`h-11 shrink-0 border-b-2 px-4 text-body font-bold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text/60 hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
