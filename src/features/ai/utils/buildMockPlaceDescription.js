// 장소 한 줄 설명 1단계 가짜 AI (78). 2단계에서는 서버의 Gemini가 같은 모양의 JSON을 돌려준다.
// 문구는 번역 키(ai.placeDescription.*) 템플릿으로 만든다. t는 i18next의 t — 밖에서 받아서 Node에서도 돌려 볼 수 있다.
// 돌려주는 모양: { description: '도쿄 아사쿠사의 대표 관광 명소, 평점 4.5' }
// 장소 이름은 문장에 넣지 않는다 — 화면에서 바로 위 제목에 이름이 있다.
import { PLACE_CATEGORIES } from '../../search/place';

// 평점이 이만큼 높으면 「대표」·「인기」를 붙인다. 평점은 구글(JP)에만 있어서 한국 장소는 붙지 않는다.
const TOP_RATING = 4.5;
const POPULAR_RATING = 4.0;

// 주소에서 동네 이름을 찾는다. 「일본 도쿄도 다이토구 아사쿠사 2-3-1」 → 아사쿠사, 「서울특별시 종로구 사직로 161」 → 종로구.
// 일본 주소는 구 다음 동네 이름이 더 잘 알려져 있고, 한국 주소는 구 다음이 도로 이름이라 구까지만 쓴다.
// 번지가 붙은 말(니시신주쿠2-8-1)은 동네 이름으로 쓰지 않는다.
export function findArea(place) {
  const words = (place.address ?? '').split(/\s+/).filter(Boolean);
  const wardIndex = words.findIndex((word) => /.구$/.test(word));
  if (wardIndex === -1) return null;
  const next = words[wardIndex + 1];
  if (place.country === 'JP' && next && !/\d/.test(next)) return next;
  return words[wardIndex];
}

const getKind = (place, t) => {
  const kind = PLACE_CATEGORIES.includes(place.category)
    ? t(`ai.placeDescription.kind.${place.category}`)
    : t('ai.placeDescription.kind.other');
  if (place.rating >= TOP_RATING) return t('ai.placeDescription.top', { kind });
  if (place.rating >= POPULAR_RATING) return t('ai.placeDescription.popular', { kind });
  return kind;
};

// place: Place (search/place.js). 이름·주소를 저장하지 않고 그 자리에서 문장만 만든다.
export function buildMockPlaceDescription(place, t) {
  if (!place) throw new Error('MISSING_PLACE');
  const city = t(`common.city.${place.city}`, { defaultValue: '' });
  const area = findArea(place);
  const location = [city, area].filter(Boolean).join(' ');
  const kind = getKind(place, t);
  const hasRating = typeof place.rating === 'number';

  if (!location) return { description: kind };
  const description = hasRating
    ? t('ai.placeDescription.withRating', { location, kind, rating: place.rating.toFixed(1) })
    : t('ai.placeDescription.sentence', { location, kind });
  return { description };
}
