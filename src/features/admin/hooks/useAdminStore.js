import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 상품·추천 목록 관리 (85). 서버가 없는 1단계라 관리자 설정도 이 기기(localStorage)에만 남는다.
// 2단계에서 서버 저장으로 바꾸면 productService가 거른 목록을 서버에서 받으므로 이 store는 관리 화면만 쓴다.
// hiddenProductIds: 사용자 화면에서 뺄 상품 / pinnedProductIds: 「추천 고정」, 배열 순서가 곧 보여 줄 순서
// hiddenPlaceIds: 홈 테마·시즌 추천(81·82)에서 뺄 장소 (Place.id)
// 회원 탈퇴(68)가 개인 기록을 지울 때 이 키는 남긴다 (서비스 설정이라 개인 기록이 아니다).
export const ADMIN_STORAGE_KEY = 'wandy.admin';

const INITIAL_STATE = { hiddenProductIds: [], pinnedProductIds: [], hiddenPlaceIds: [] };

const without = (ids, id) => ids.filter((item) => item !== id);

export const useAdminStore = create(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      // 숨김과 고정은 같이 걸 수 없다 — 숨긴 상품을 고정해 봐야 보이지 않아서, 한쪽을 켜면 다른 쪽을 끈다.
      toggleHidden: (id) =>
        set((state) =>
          state.hiddenProductIds.includes(id)
            ? { hiddenProductIds: without(state.hiddenProductIds, id) }
            : {
                hiddenProductIds: [...state.hiddenProductIds, id],
                pinnedProductIds: without(state.pinnedProductIds, id),
              },
        ),
      // 새로 고정한 상품은 고정 순서 맨 뒤에 붙는다.
      togglePinned: (id) =>
        set((state) =>
          state.pinnedProductIds.includes(id)
            ? { pinnedProductIds: without(state.pinnedProductIds, id) }
            : {
                pinnedProductIds: [...state.pinnedProductIds, id],
                hiddenProductIds: without(state.hiddenProductIds, id),
              },
        ),
      // direction: 'up' | 'down'. 맨 앞·맨 뒤에서 더 옮기려 하면 그대로 둔다.
      movePinned: (id, direction) =>
        set((state) => {
          const ids = [...state.pinnedProductIds];
          const from = ids.indexOf(id);
          const to = from + (direction === 'up' ? -1 : 1);
          if (from < 0 || to < 0 || to >= ids.length) return state;
          [ids[from], ids[to]] = [ids[to], ids[from]];
          return { pinnedProductIds: ids };
        }),
      toggleHiddenPlace: (id) =>
        set((state) => ({
          hiddenPlaceIds: state.hiddenPlaceIds.includes(id)
            ? without(state.hiddenPlaceIds, id)
            : [...state.hiddenPlaceIds, id],
        })),
      reset: () => set(INITIAL_STATE),
    }),
    { name: ADMIN_STORAGE_KEY },
  ),
);
