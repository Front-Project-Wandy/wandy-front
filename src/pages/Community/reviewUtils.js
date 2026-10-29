import mockReviews from '../../mocks/placeReviews.json';

// 장소 후기 (105). 다른 사람 후기는 src/mocks/placeReviews.json, 내 후기는 커뮤니티 store(이 기기)에서 온다.
// 두 곳의 모양을 화면용 하나로 맞춘다: { id, placeId, author, rating, text, createdAt, updatedAt, isMine }

export const MAX_RATING = 5;
export const REVIEW_MAX_LENGTH = 300;

const toMyReview = (review) => ({
  id: review.id,
  placeId: review.placeId,
  author: review.authorName,
  rating: review.rating,
  text: review.text,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
  isMine: true,
});

// 한 장소의 후기를 최신순으로. 내 후기는 같은 날이면 위에 둔다.
export function getPlaceReviews(placeId, myReviews) {
  const mine = myReviews.filter((review) => review.placeId === placeId).map(toMyReview);
  const others = mockReviews
    .filter((review) => review.placeId === placeId)
    .map((review) => ({ ...review, updatedAt: null, isMine: false }));
  return [...mine, ...others].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// 평균 별점(소수 첫째 자리)과 개수. 후기가 없으면 average는 null.
export function summarizeReviews(reviews) {
  if (reviews.length === 0) return { average: null, count: 0 };
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return { average: Math.round((total / reviews.length) * 10) / 10, count: reviews.length };
}
