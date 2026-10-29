import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toDateString } from '../plan/planDays';

// 공개 일정 좋아요와 내가 쓴 장소 후기 (105, A파트).
// 1단계는 서버가 없어서 이 기기(localStorage)에만 남는다. 2단계에서 함수 이름은 두고 안쪽만 API 호출로 바꾼다.
// 후기는 placeId만 들고 장소 내용은 저장하지 않는다 (구글 장소는 place_id만 저장할 수 있는 약관).
// review = { id, placeId, authorName, rating(1~5), text, createdAt, updatedAt }
const createReviewId = () =>
  `my-review-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const today = () => toDateString(new Date());

export const useCommunityStore = create(
  persist(
    (set) => ({
      likedTripIds: [],
      reviews: [],
      toggleLike: (tripId) =>
        set((state) => ({
          likedTripIds: state.likedTripIds.includes(tripId)
            ? state.likedTripIds.filter((id) => id !== tripId)
            : [tripId, ...state.likedTripIds],
        })),
      // 최신 후기가 위에 오도록 앞에 넣는다.
      addReview: ({ placeId, authorName, rating, text }) =>
        set((state) => ({
          reviews: [
            {
              id: createReviewId(),
              placeId,
              authorName,
              rating,
              text,
              createdAt: today(),
              updatedAt: null,
            },
            ...state.reviews,
          ],
        })),
      updateReview: (reviewId, { rating, text }) =>
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId ? { ...review, rating, text, updatedAt: today() } : review,
          ),
        })),
      removeReview: (reviewId) =>
        set((state) => ({ reviews: state.reviews.filter((review) => review.id !== reviewId) })),
    }),
    { name: 'wandy.community' },
  ),
);
