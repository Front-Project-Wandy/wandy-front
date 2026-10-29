import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import TabBar from '../../components/common/TabBar';
import { TRAVEL_STYLES } from '../Wizard/tripStyleOptions';
import MyActivity from './MyActivity';
import PublicTripCard from './PublicTripCard';
import PublicTripFilters from './PublicTripFilters';
import {
  COMMUNITY_CITIES,
  filterPublicTrips,
  getPublicTrips,
  TRIP_LENGTHS,
} from './publicTripUtils';

const BROWSE_TAB = 'browse';
const ACTIVITY_TAB = 'activity';
const FILTER_OPTIONS = { city: COMMUNITY_CITIES, length: TRIP_LENGTHS, style: TRAVEL_STYLES };

// 주소에 적힌 값 중 정해진 선택지만 쓴다 (잘못된 값은 「전체」).
const readFilters = (params) =>
  Object.fromEntries(
    Object.entries(FILTER_OPTIONS).map(([name, options]) => [
      name,
      options.includes(params.get(name)) ? params.get(name) : null,
    ]),
  );

// /community — 다른 여행자의 공개 일정 둘러보기와 내 활동 (105).
// 탭과 필터는 주소(?tab=&city=&length=&style=)에 둬서 상세에 갔다가 뒤로 와도 그대로 남는다 (장소 탐색과 같은 방식).
export default function CommunityPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === ACTIVITY_TAB ? ACTIVITY_TAB : BROWSE_TAB;
  const filters = readFilters(params);
  const trips = filterPublicTrips(getPublicTrips(), filters);

  const updateParam = (name, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: true });
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 lg:px-6 lg:py-10">
      <header>
        <p className="mb-3 text-caption font-bold tracking-widest text-primary">
          {t('community.page.eyebrow')}
        </p>
        <h1 className="text-title font-bold break-keep lg:text-display">
          {t('community.page.title')}
        </h1>
        <p className="mt-3 text-body-sm text-text/70">{t('community.page.description')}</p>
      </header>
      <TabBar
        tabs={[BROWSE_TAB, ACTIVITY_TAB].map((key) => ({ key, label: t(`community.tab.${key}`) }))}
        activeKey={tab}
        onChange={(key) => updateParam('tab', key === ACTIVITY_TAB ? key : null)}
      />
      {tab === ACTIVITY_TAB ? (
        <MyActivity onBrowse={() => updateParam('tab', null)} />
      ) : (
        <>
          <PublicTripFilters filters={filters} onChange={updateParam} />
          <section aria-labelledby="community-list-title" className="flex flex-col gap-4">
            <h2 id="community-list-title" className="text-body font-bold">
              {t('community.list.count', { count: trips.length })}
            </h2>
            {trips.length === 0 ? (
              <EmptyState
                title={t('community.list.empty.title')}
                description={t('community.list.empty.description')}
                action={
                  <Button variant="secondary" onClick={() => setParams({}, { replace: true })}>
                    {t('community.list.empty.reset')}
                  </Button>
                }
              />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {trips.map((trip) => (
                  <li key={trip.id}>
                    <PublicTripCard trip={trip} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
