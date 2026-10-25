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
  // STEP4 현지 교통 방식: 'transit' | 'taxi' | 'car' | 'mixed'. 건너뛰면 null로 두고, 계산할 때 혼합으로 본다.
  transportMode: null,
  // STEP5 담은 장소: [{ placeId, dayIndex }]. 약관 때문에 장소 내용은 저장하지 않고, 보여줄 때 placeId로 다시 불러온다.
  spots: [],
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
      // 마법사 안에서 칸 하나를 바꿀 때마다 부른다. 바로 저장돼서 나갔다 와도 그대로 남는다 (30).
      updateDraft: (patch) =>
        set((state) => ({ draft: { ...state.draft, ...patch }, updatedAt: Date.now() })),
      setStep: (step) => set({ step, updatedAt: Date.now() }),
      resetWizard: () => set({ draft: INITIAL_DRAFT, step: 1, updatedAt: null }),
    }),
    {
      name: 'wandy.wizard',
      // 저장된 draft를 기본값 위에 덮어서 불러온다. 기본 동작은 draft를 통째로 바꿔서,
      // 단계를 새로 만들며 draft에 칸이 늘면(예: STEP4 transportMode) 예전 데이터에는 그 칸이 아예 없다(undefined).
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        draft: { ...current.draft, ...persisted?.draft },
      }),
    },
  ),
);
