import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 찜한 장소 (43). 구글 장소는 place_id만 저장할 수 있어서(약관) 장소 정보가 아니라 Place.id만 남기고,
// 보여 줄 때 placeService로 다시 불러온다. 로그인·서버 저장이 생기기 전까지는 이 기기(localStorage)에만 둔다.
// 마법사 STEP5(A)의 "찜 목록에서 고르기"도 ids를 읽어 쓰면 된다.
export const useFavoriteStore = create(
  persist(
    (set) => ({
      ids: [],
      // 찜이면 빼고, 아니면 맨 앞에 넣는다 (최근에 찜한 곳이 목록 위로).
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((item) => item !== id)
            : [id, ...state.ids],
        })),
    }),
    { name: 'wandy.favorites' },
  ),
);
