import { useEffect, useState } from 'react';

// index.html의 테마 스크립트와 같은 키. 둘 중 하나만 바꾸면 새로고침 때 테마가 엇갈린다.
export const THEME_STORAGE_KEY = 'wandy.theme';

const readSavedTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
};

// 다크모드 (89). 기기 설정과 상관없이 라이트가 기본이고, 헤더 버튼으로 고르면 localStorage에 남긴다.
// 첫 화면 테마는 index.html 스크립트가 이미 <html data-theme>에 넣어 두어서, 여기서는 그 값을 이어받는다.
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme ?? readSavedTheme() ?? 'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 저장이 막혀도(사생활 보호 모드 등) 이번 방문 동안은 바뀐 테마로 보여준다.
    }
  };

  return { theme, toggleTheme };
}
