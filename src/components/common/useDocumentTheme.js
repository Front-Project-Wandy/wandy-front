import { useSyncExternalStore } from 'react';

// 지금 화면 테마('light' | 'dark')를 읽고, 헤더 버튼으로 바뀌면 바로 다시 그린다.
// useTheme은 버튼이 쓰는 상태라 다른 컴포넌트에는 알려 주지 않아서, <html data-theme> 값을 직접 지켜본다.
const subscribe = (onChange) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

const getTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

export function useDocumentTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'light');
}
