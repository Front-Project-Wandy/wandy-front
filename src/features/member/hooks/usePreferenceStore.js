import { create } from 'zustand';
import { loadPreferences, savePreferences } from '../utils/preferences.js';

// 회원 계정과 연결되기 전에는 이 브라우저에만 저장한다. 마법사 자동 적용(65)은 별도 작업이다.
export const usePreferenceStore = create((set) => ({
  preferences: loadPreferences(),
  save: (value) => {
    try {
      // 실제 저장이 성공한 뒤에만 공유 상태를 바꿔 저장 실패를 성공처럼 보여 주지 않는다.
      const preferences = savePreferences(value);
      set({ preferences });
      return true;
    } catch {
      return false;
    }
  },
}));
