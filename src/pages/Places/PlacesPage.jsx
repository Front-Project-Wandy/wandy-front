import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PlaceSearchPanel from '../../features/search/components/PlaceSearchPanel';
import { CITIES_BY_COUNTRY, COUNTRIES, getPlacePath } from '../../features/search/place';
import DestinationPicker from './DestinationPicker';

const DEFAULT_COUNTRY = 'KR';

// /places — 장소 탐색 (7·8·9). 여행 계획 없이 도시를 골라 장소를 찾아보고, 누르면 상세로 간다.
// 나라·도시는 주소(?country=&city=)에 둬서 상세에 갔다가 뒤로 와도 고른 도시가 남는다.
export default function PlacesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const country = COUNTRIES.includes(params.get('country'))
    ? params.get('country')
    : DEFAULT_COUNTRY;
  const cities = CITIES_BY_COUNTRY[country];
  const city = cities.includes(params.get('city')) ? params.get('city') : cities[0];

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6 lg:px-6">
      <header>
        <h1 className="text-title font-bold">{t('places.page.title')}</h1>
        <p className="mt-1 text-body-sm text-text/70">{t('places.page.description')}</p>
      </header>
      <DestinationPicker country={country} city={city} onChange={setParams} />
      {/* 도시를 바꾸면 검색어·카테고리를 처음으로 되돌린다 — 이전 도시의 검색어로 0곳이 나오는 걸 막는다. */}
      <PlaceSearchPanel
        key={`${country}-${city}`}
        country={country}
        city={city}
        onSelectPlace={(place) => navigate(getPlacePath(place))}
      />
    </main>
  );
}
