import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import ErrorState from '../../../components/common/ErrorState';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import { formatDuration } from '../../transport/utils/formatTransport';
import { useGapSuggestions } from '../hooks/useGapSuggestions';
import { SUGGEST_STAY_MINUTES } from '../utils/findGapSuggestions';

// DAY 제목 아래의 빈 시간대 추천 (요구사항 #77). 두 장소 사이에 한 곳을 더 넣을 수 있을 만큼 비어 있을 때만 보인다.
// 「추가」는 그 틈 바로 뒤에 넣고 시작 시각을 이동 시간에 맞춰 정한다. 되돌리기 한 번으로 돌아오게 한 단계로 묶는다.
export default function GapSuggestions({ dayIndex }) {
  const { t } = useTranslation();
  const { gaps, isEnabled, isLoading, isError, refetch } = useGapSuggestions(dayIndex);
  if (!isEnabled) return null;

  const handleAdd = (gap, suggestion) => {
    const { addItem, moveItem, batchChanges } = usePlanStore.getState();
    batchChanges(() => {
      addItem(dayIndex, suggestion.place, {
        startTime: suggestion.startTime,
        stayMinutes: SUGGEST_STAY_MINUTES,
      });
      const lastIndex = usePlanStore.getState().trip.days[dayIndex].items.length - 1;
      moveItem({ dayIndex, index: lastIndex }, { dayIndex, index: gap.afterIndex + 1 });
    });
  };

  if (isLoading) {
    return <p className="text-body-sm text-text/70">{t('planner.gap.loading')}</p>;
  }
  if (isError) {
    return <ErrorState message={t('planner.gap.error')} onRetry={refetch} className="py-4" />;
  }
  if (gaps.length === 0) return null;

  const hasGooglePlace = gaps.some((gap) =>
    gap.suggestions.some(({ place }) => place.source === 'google'),
  );

  return (
    <section aria-label={t('planner.gap.title')} className="space-y-3 rounded-2xl bg-bg-soft p-4">
      {gaps.map((gap) => (
        <div key={gap.afterIndex} className="space-y-2">
          <p className="text-body-sm font-bold">
            {t('planner.gap.gapTitle', {
              start: gap.gapStart,
              end: gap.gapEnd,
              duration: formatDuration(t, gap.gapMinutes),
            })}
          </p>
          <ul className="space-y-2">
            {gap.suggestions.map((suggestion) => (
              <li key={suggestion.place.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-body-sm">{suggestion.place.name}</p>
                  <p className="text-caption text-text/70">
                    {t('planner.gap.detail', {
                      category: t(`common.category.${suggestion.place.category}`),
                      time: suggestion.startTime,
                      minutes: suggestion.travelInMinutes,
                    })}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  aria-label={t('planner.gap.addLabel', { name: suggestion.place.name })}
                  onClick={() => handleAdd(gap, suggestion)}
                >
                  {t('planner.gap.add')}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-caption text-text/70">{t('planner.gap.note')}</p>
      {hasGooglePlace ? <GoogleAttribution /> : null}
    </section>
  );
}
