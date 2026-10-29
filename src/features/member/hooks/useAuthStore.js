import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_STORAGE_KEY } from '../constants';

// 로그인한 사용자 (M01). 헤더처럼 여러 화면이 같이 읽어서 Zustand에 둔다.
// user = { id, name, provider } | null. provider는 'kakao' | 'naver' | 'google' | 'local'.
// 1단계는 가짜 로그인이라 이 기기(localStorage)에만 남고, 2단계에서 서버가 준 로그인 정보로 바꾼다.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: AUTH_STORAGE_KEY },
  ),
);
