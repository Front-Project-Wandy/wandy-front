import curations from '../../../mocks/curations.json';

// 홈 테마·시즌 추천 (81·82) 목록. 데이터는 src/mocks/curations.json (컴포넌트에 직접 쓰지 않는다).
// 시즌: 계절마다 도시 하나와 고른 장소 id 4개(placeIds). 이번 달에 맞는 계절 하나만 보여 준다.
// 테마: 도시와 카테고리만 정하고, 장소는 그 도시 장소 중 카테고리가 맞는 것을 불러와 채운다.
// categories는 [이 테마로 여행 시작] 때 마법사 선호 카테고리로도 넘긴다 (STEP5 추천 순서, #52).

export const CURATION_PLACE_LIMIT = 4;

// month: 1~12. 맞는 계절이 없으면(데이터 실수) 첫 계절을 쓴다.
export function getSeasonForMonth(month) {
  return curations.seasons.find((season) => season.months.includes(month)) ?? curations.seasons[0];
}

// 칩 순서: 이번 계절이 맨 앞, 그다음 테마들. type으로 번역 키(home.curation.season/theme)를 고른다.
export function getCurationItems(month = new Date().getMonth() + 1) {
  return [
    { ...getSeasonForMonth(month), type: 'season' },
    ...curations.themes.map((theme) => ({ ...theme, type: 'theme' })),
  ];
}

// 도시 장소 전체에서 테마 카테고리에 맞는 것만 앞에서부터 고른다.
export function pickThemePlaces(places, categories) {
  return places
    .filter((place) => categories.includes(place.category))
    .slice(0, CURATION_PLACE_LIMIT);
}
