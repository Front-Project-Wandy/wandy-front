import publicTrips from '../../mocks/publicTrips.json';
import { getPlacePhoto } from '../../services/placePhotoService';

// 공개 일정 (105). 1단계는 서버가 없어서 src/mocks/publicTrips.json을 그대로 읽는다.
// 2단계에서 서버 목록 API로 바꾸면 이 파일의 함수만 고친다.

export const COMMUNITY_CITIES = ['seoul', 'tokyo'];

// 일수 필터: 짧게(1박 2일 이하) / 길게(2박 3일 이상). 일정 수가 적어서 두 묶음이면 충분하다.
export const TRIP_LENGTHS = ['short', 'long'];
const SHORT_TRIP_MAX_DAYS = 2;

export const getPublicTrips = () => publicTrips;

export const findPublicTrip = (tripId) => publicTrips.find((trip) => trip.id === tripId) ?? null;

export const getTripNights = (trip) => trip.days.length - 1;

export const getTripPlaceCount = (trip) => trip.days.reduce((sum, day) => sum + day.length, 0);

const matchesLength = (trip, length) => {
  if (!length) return true;
  const isShort = trip.days.length <= SHORT_TRIP_MAX_DAYS;
  return length === 'short' ? isShort : !isShort;
};

// filters = { city, length, style } — null이면 그 조건은 거르지 않는다. 좋아요 많은 순으로 보여 준다.
export function filterPublicTrips(trips, { city = null, length = null, style = null }) {
  return trips
    .filter((trip) => !city || trip.city === city)
    .filter((trip) => matchesLength(trip, length))
    .filter((trip) => !style || trip.style === style)
    .sort((a, b) => b.likes - a.likes);
}

// 카드 대표 사진: 일정의 대표 장소(coverPlaceId) 사진. 출처 표시가 필요해서 작가·라이선스도 같이 준다.
// 사진이 없으면 null이고, 카드는 홈의 도시 사진을 쓴다. 구글 장소 사진이 아니라 직접 고른 Wikimedia 사진이다.
export const getTripCover = (trip) => getPlacePhoto(trip.coverPlaceId);

export const getTripCoverSrc = (trip) => getTripCover(trip)?.src ?? `/images/home/${trip.city}.jpg`;

// 화면에 보이는 좋아요 수. 더미 숫자에 내가 누른 1을 더한다 (서버가 없어서 남의 좋아요는 늘지 않는다).
export const getLikeCount = (trip, isLiked) => trip.likes + (isLiked ? 1 : 0);
