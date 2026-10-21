import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 마법사 진행 상태 (A파트). 저장 전까지는 '작성 중'인 값이라 플랜 store(C파트)와 따로 둔다.
// persist로 localStorage에 남겨서, 나갔다 와도 홈의 "이어서 만들기"로 돌아올 수 있다 (30, 31).
const INITIAL_DRAFT = {
  country: null,
  city: null,
  startDate: '',
  endDate: '',
  people: 2,
};

export const useWizardStore = create(
  persist(
    (set) => ({
      draft: INITIAL_DRAFT,
      step: 1,
      updatedAt: null,

      // 홈 시작 영역에서 새 여행을 시작할 때. 이전에 작성하던 값은 새 값으로 바뀐다.
      startDraft: (basicInfo) =>
        set({ draft: { ...INITIAL_DRAFT, ...basicInfo }, step: 1, updatedAt: Date.now() }),
      setStep: (step) => set({ step, updatedAt: Date.now() }),
      resetWizard: () => set({ draft: INITIAL_DRAFT, step: 1, updatedAt: null }),
    }),
    { name: 'wandy.wizard' },
  ),
);
