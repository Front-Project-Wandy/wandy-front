import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { useStayAreaRecommendation } from './useStayAreaRecommendation';

const METERS_PER_KM = 1000;

// 추천 숙소 위치 (75). 지역 칩 위에 "이 지역에 묵으면 이동이 편해요"를 보여 주고, 누르면 그 지역을 고른다.
// 고르는 건 사용자 몫이라 자동으로 골라 두지 않는다 (지역 칩은 처음에 아무것도 고르지 않는 규칙, StayAreaChips).
// trip: { country, city, spotPlaceIds, preferredCategories }
export default function StayAreaRecommendation({ trip, selectedArea, onSelect }) {
  const { t } = useTranslation();
  const { recommendation, basis, placeCount, isPending, isError, refetch } =
    useStayAreaRecommendation(trip);

  if (isPending) return <Loading text={t('wizard.stay.recommend.loading')} />;
  if (isError) return <ErrorState message={t('wizard.stay.recommend.error')} onRetry={refetch} />;
  // 도시에 지역이나 장소 데이터가 없으면 추천할 근거가 없어서 그리지 않는다.
  if (!recommendation) return null;

  const { area, averageMeters } = recommendation;
  const areaName = t(`wizard.stay.area.${area.key}`);
  const isSelected = selectedArea === area.key;

  return (
    <section
      aria-labelledby="stay-recommend-title"
      className="flex flex-col gap-3 rounded-2xl bg-bg-soft p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h3 id="stay-recommend-title" className="flex items-center gap-2 text-body font-bold">
          {/* point 배경 위 글자는 테마와 상관없이 진한 ink (홈 D-day 배지와 같은 규칙) */}
          <span className="shrink-0 rounded-full bg-point px-2 py-0.5 text-caption font-bold text-ink">
            {t('wizard.stay.recommend.badge')}
          </span>
          {t('wizard.stay.recommend.title', { area: areaName })}
        </h3>
        <p className="text-body-sm text-text/70 break-keep">
          {t(`wizard.stay.recommend.reason.${basis}`, {
            count: placeCount,
            categories: trip.preferredCategories
              .map((category) => t(`common.category.${category}`))
              .join(', '),
            city: t(`common.city.${trip.city}`),
            distance: (averageMeters / METERS_PER_KM).toFixed(1),
          })}
        </p>
      </div>
      {isSelected ? (
        <p className="shrink-0 text-body-sm font-bold">{t('wizard.stay.recommend.selected')}</p>
      ) : (
        <Button variant="secondary" size="sm" className="shrink-0" onClick={() => onSelect(area)}>
          {t('wizard.stay.recommend.action', { area: areaName })}
        </Button>
      )}
    </section>
  );
}
