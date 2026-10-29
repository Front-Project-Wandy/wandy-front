// 다녀온 장소 평가(97)를 추천 순서에 반영한다. 좋았던 곳은 앞으로, 별로였던 곳은 뒤로 보내고 빼지는 않는다.
// 같은 그룹 안에서는 기존 순서(선호 카테고리 정렬 포함)를 유지하고, 원본 배열은 바꾸지 않는다 (Query 캐시 공유).
// ratings: { [Place.id]: 'like' | 'dislike' }
export function applyPlaceRatings(places, ratings) {
  if (!ratings || Object.keys(ratings).length === 0) return places;

  const liked = [];
  const others = [];
  const disliked = [];
  for (const place of places) {
    const rating = ratings[place.id];
    (rating === 'like' ? liked : rating === 'dislike' ? disliked : others).push(place);
  }
  return [...liked, ...others, ...disliked];
}

// 평가에서 한쪽 값을 받은 Place.id 목록
export const getRatedPlaceIds = (ratings, rating) =>
  Object.keys(ratings ?? {}).filter((id) => ratings[id] === rating);
