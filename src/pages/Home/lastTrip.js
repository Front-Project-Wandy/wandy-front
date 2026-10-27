import { PLACE_CATEGORIES } from '../../features/search/place';
import { getLocalDateString, getTripStatus } from '../../features/member/utils/tripDates';

// 「지난 여행처럼 다시 떠나기」(67)에 넘길 카테고리 개수. STEP5 추천이 이 카테고리를 앞으로 올리는데,
// 너무 많으면 앞으로 올리는 의미가 없어서 많이 간 것 몇 개만 고른다.
export const LAST_TRIP_CATEGORY_LIMIT = 3;

// 끝난 여행 중 가장 최근에 끝난 여행 하나. 없으면 null.
// 날짜는 'YYYY-MM-DD' 문자열이라 글자 비교로 앞뒤를 정한다 (pickUpcomingTrip과 같은 방식).
export function pickLastTrip(trips, today = getLocalDateString()) {
  return trips
    .filter((trip) => getTripStatus(trip, today) === 'past')
    .reduce((best, trip) => (!best || trip.endDate > best.endDate ? trip : best), null);
}

// 여행에 담은 장소의 카테고리를 많이 담은 순서로. 개수가 같으면 PLACE_CATEGORIES 순서를 따른다.
// trip에는 STEP5에서 고른 선호 카테고리가 저장되지 않아서, 실제로 담은 장소(myCategory)로 취향을 읽는다.
export function getTripCategories(trip, limit = LAST_TRIP_CATEGORY_LIMIT) {
  const counts = new Map();
  (trip.days ?? []).forEach((day) =>
    day.items.forEach((item) => {
      if (PLACE_CATEGORIES.includes(item.myCategory)) {
        counts.set(item.myCategory, (counts.get(item.myCategory) ?? 0) + 1);
      }
    }),
  );
  return PLACE_CATEGORIES.filter((category) => counts.has(category))
    .sort((a, b) => counts.get(b) - counts.get(a))
    .slice(0, limit);
}

// 새 여행 초안에 옮길 값. 날짜는 새로 정해야 해서 넘기지 않는다 (마법사 STEP1에서 고른다).
// 장소·항공·숙소도 그 여행에만 맞는 값이라 옮기지 않는다.
// 담은 장소가 없으면 카테고리를 넘기지 않는다. 빈 배열을 넘기면 "고른 게 없음"으로 보고 프로필 기본값(65)을 덮어서다.
export function createAgainTripValues(trip) {
  const categories = getTripCategories(trip);
  return {
    country: trip.country,
    city: trip.city,
    people: trip.people,
    style: trip.style,
    transportMode: trip.transportMode ?? null,
    ...(categories.length > 0 ? { preferredCategories: categories } : {}),
  };
}
