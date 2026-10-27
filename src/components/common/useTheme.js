import { useEffect, useState } from 'react';

// index.html의 테마 스크립트와 같은 키. 둘 중 하나만 바꾸면 새로고침 때 테마가 엇갈린다.
export const THEME_STORAGE_KEY = 'wandy.theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const readSavedTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
};

const getSystemTheme = () => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light');

// 다크모드 (89). 직접 고른 적이 없으면 기기 설정을 따르고, 고르면 localStorage에 남긴다.
// 첫 화면 테마는 index.html 스크립트가 이미 <html data-theme>에 넣어 두어서, 여기서는 그 값을 이어받는다.
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme ?? readSavedTheme() ?? getSystemTheme(),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // 직접 고르기 전에는 기기 설정이 바뀌면(예: 밤에 자동 다크) 같이 바꾼다.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const handleChange = () => {
      if (!readSavedTheme()) setTheme(getSystemTheme());
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

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
