import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PlaceSearchPanel from '../../features/search/components/PlaceSearchPanel';
import { CITIES_BY_COUNTRY, COUNTRIES, getPlacePath } from '../../features/search/place';
import DestinationPicker from './DestinationPicker';

const DEFAULT_COUNTRY = 'KR';

// /places — 장소 탐색 (7·8·9). 여행 계획 없이 도시를 골라 장소를 찾아보고, 누르면 상세로 간다.
// 나라·도시는 주소(?country=&city=)에 둬서 상세에 갔다가 뒤로 와도 고른 도시가 남는다.
// 위쪽 히어로는 쓸 수 있는 사진이 없어서 도시 이름 글자와 색 원으로만 꾸민다.
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
      <section
        aria-labelledby="places-hero-title"
        className="relative isolate overflow-hidden rounded-3xl bg-bg-soft px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-20"
      >
        <span
          aria-hidden="true"
          className="absolute -top-20 -right-20 -z-10 size-64 rounded-full bg-brand/20 sm:size-96"
        />
        <span
          aria-hidden="true"
          className="absolute -right-12 -bottom-24 -z-10 size-40 rounded-full bg-point/15 sm:right-48 sm:-bottom-16"
        />
        <p className="text-caption font-bold tracking-widest text-primary">
          {t('places.page.title')} · {t(`common.country.${country}`)}
        </p>
        <h1 id="places-hero-title" className="mt-3 text-display font-bold">
          {t(`common.city.${city}`)}
        </h1>
        <p className="mt-3 max-w-md text-body text-text/70 break-keep">{intro}</p>
        <div className="mt-8">
          <DestinationPicker country={country} city={city} onChange={setParams} />
        </div>
      </section>
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
