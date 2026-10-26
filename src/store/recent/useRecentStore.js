import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 최근 본 장소·상품 (83, A파트). 구글 장소는 place_id만 저장할 수 있어서(약관) 내용이 아니라
// { type, id }만 남기고, 보여줄 때 다시 불러온다 (찜하기와 같은 방식). 이 기기(localStorage)에만 둔다.
const MAX_ITEMS = 8;

export const useRecentStore = create(
  persist(
    (set) => ({
      items: [],
      // 같은 걸 다시 보면 맨 앞으로 옮긴다. 오래된 건 MAX_ITEMS를 넘으면 버린다.
      add: (type, id) =>
        set((state) => ({
          items: [
            { type, id },
            ...state.items.filter((item) => !(item.type === type && item.id === id)),
          ].slice(0, MAX_ITEMS),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'wandy.recent' },
  ),
);
