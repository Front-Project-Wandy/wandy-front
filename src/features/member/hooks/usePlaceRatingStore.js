import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 다녀온 장소 평가 (97). Place.id → 'like' | 'dislike'. 구글 장소도 place_id만 남는다 (약관, 찜하기와 같은 방식).
// 로그인·서버 저장이 생기기 전까지는 이 기기(localStorage)에만 둔다.
// 추천 반영: 좋았던 곳은 도시별 추천·AI 일정에서 앞으로, 별로였던 곳은 추천에서 뒤로 보내고 AI 일정에는 넣지 않는다.
export const PLACE_RATINGS = ['like', 'dislike'];

export const usePlaceRatingStore = create(
  persist(
    (set) => ({
      ratings: {},
      // 같은 평가를 다시 누르면 평가를 지운다.
      rate: (placeId, rating) =>
        set((state) => {
          const { [placeId]: current, ...rest } = state.ratings;
          return {
            ratings:
              current === rating || !PLACE_RATINGS.includes(rating)
                ? rest
                : { ...rest, [placeId]: rating },
          };
        }),
    }),
    { name: 'wandy.placeRatings' },
  ),
);
