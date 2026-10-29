import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PlaceSearchPanel from '../../features/search/components/PlaceSearchPanel';
import { CITIES_BY_COUNTRY, COUNTRIES, getPlacePath } from '../../features/search/place';
import PlacesHero from './PlacesHero';

const DEFAULT_COUNTRY = 'KR';

// /places — 장소 탐색 (7·8·9). 여행 계획 없이 도시를 골라 장소를 찾아보고, 누르면 상세로 간다.
// 나라·도시는 주소(?country=&city=)에 둬서 상세에 갔다가 뒤로 와도 고른 도시가 남는다.
// 도시 사진과 탐색 필터를 분리한 히어로를 사용한다.
export default function PlacesPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const country = COUNTRIES.includes(params.get('country'))
    ? params.get('country')
    : DEFAULT_COUNTRY;
  const cities = CITIES_BY_COUNTRY[country];
  const city = cities.includes(params.get('city')) ? params.get('city') : cities[0];
  // 소개 문구가 없는 도시가 늘어나도 키가 그대로 보이지 않게 기본 설명으로 돌아간다.
  const introKey = `places.hero.intro.${city}`;
  const intro = i18n.exists(introKey) ? t(introKey) : t('places.page.description');

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-6 lg:space-y-14 lg:px-6 lg:py-10">
      <PlacesHero country={country} city={city} intro={intro} onChange={setParams} />
      {/* 도시를 바꾸면 검색어·카테고리를 처음으로 되돌린다 — 이전 도시의 검색어로 0곳이 나오는 걸 막는다. */}
      <PlaceSearchPanel
        key={`${country}-${city}`}
        country={country}
        city={city}
        layout="grid"
        onSelectPlace={(place) => navigate(getPlacePath(place))}
      />
    </main>
  );
}
