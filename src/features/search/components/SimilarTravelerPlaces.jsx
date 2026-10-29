import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { useSimilarTravelerPlaces } from '../hooks/useSimilarTravelerPlaces';
import GoogleAttribution from './GoogleAttribution';
import PlaceCard from './PlaceCard';

// 「비슷한 여행자 인기」 목록 (요구사항 102). 마법사 STEP5의 탭에서 쓰고, 카드를 누르면 검색 결과와 똑같이 담는다.
// 카드마다 왜 추천했는지(비슷한 여행자 몇 명 중 몇 명이 다녀갔는지)를 붙인다.
// 1단계는 가상 여행자 데이터라 그렇다고 작게 알린다.
export default function SimilarTravelerPlaces({
  country,
  city,
  profile,
  excludePlaceIds,
  onSelectPlace,
}) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch } = useSimilarTravelerPlaces({
    country,
    city,
    profile,
    excludePlaceIds,
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (data.items.length === 0) {
    return (
      <EmptyState
        title={t('search.similar.emptyTitle')}
        description={t('search.similar.emptyDescription')}
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-body-sm text-text/70">
        {t(`search.similar.intro.${data.mode}`, { count: data.neighborCount })}
      </p>
      <div className="space-y-3">
        {data.items.map(({ place, visitedCount }) => (
          <div key={place.id}>
            <ul>
              <PlaceCard place={place} onSelect={onSelectPlace} />
            </ul>
            <p className="mt-1 px-3 text-caption text-text/70">
              {t(`search.similar.reason.${data.mode}`, {
                count: visitedCount,
                total: data.neighborCount,
              })}
            </p>
          </div>
        ))}
      </div>
      {data.items.some(({ place }) => place.source === 'google') ? <GoogleAttribution /> : null}
      <p className="text-caption text-text/60">{t('search.similar.mockNote')}</p>
    </div>
  );
}
