import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAllTrips } from '../../store/plan/useAllTrips';
import { formatDateRange } from './formatDraft';
import { createAgainTripValues, getTripCategories, pickLastTrip } from './lastTrip';
import StartTripConfirmModal from './StartTripConfirmModal';
import { useStartTrip } from './useStartTrip';

// 지난 여행처럼 다시 떠나기 (67). 가장 최근에 끝난 여행의 도시·인원·스타일·자주 담은 장소 종류로
// 새 여행을 시작한다. 1단계에서는 로그인 없이 이 브라우저에 저장한 여행(보관함 포함)에서 고른다.
// 작성 중인 여행이 있으면 다른 시작 버튼과 같은 확인 창을 거친다 (useStartTrip).
export default function LastTripBanner() {
  const { t } = useTranslation();
  const { requestStart, isConfirmOpen, confirmStart, continueDraft, cancelStart } = useStartTrip();
  const lastTrip = pickLastTrip(useAllTrips());

  // 끝난 여행이 없으면 보여 줄 게 없어서 그리지 않는다.
  if (!lastTrip) return null;

  const cityName = t(`common.city.${lastTrip.city}`);
  const tags = [
    t(`wizard.style.style.${lastTrip.style ?? 'normal'}.title`),
    ...getTripCategories(lastTrip).map((category) => t(`common.category.${category}`)),
  ];

  return (
    <section aria-labelledby="last-trip-title" className="flex flex-col gap-3">
      <h2 id="last-trip-title" className="text-subtitle font-bold">
        {t('home.again.title')}
      </h2>
      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-body font-bold">
              {lastTrip.title || t('home.upcoming.cityTrip', { city: cityName })}
            </p>
            <p className="text-body-sm text-text/70">
              {formatDateRange(lastTrip.startDate, lastTrip.endDate)}
            </p>
          </div>
          <ul aria-label={t('home.again.tagsLabel')} className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-bg-soft px-3 py-1 text-caption">
                {tag}
              </li>
            ))}
          </ul>
          <p className="text-body-sm text-text/70 break-keep">{t('home.again.description')}</p>
        </div>
        <Button
          onClick={() => requestStart(createAgainTripValues(lastTrip))}
          aria-label={t('home.again.actionLabel', { city: cityName })}
          className="w-full shrink-0 sm:w-auto"
        >
          {t('home.again.action')}
        </Button>
      </Card>
      <StartTripConfirmModal
        open={isConfirmOpen}
        onConfirm={confirmStart}
        onContinue={continueDraft}
        onClose={cancelStart}
      />
    </section>
  );
}
