import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { estimatePopularTimes } from '../utils/popularTimes';

// 막대 높이는 혼잡도 단계(0~4)마다 정해 둔 클래스로 그린다 (인라인 style 금지 규칙).
const LEVEL_HEIGHT_CLASSES = ['h-1', 'h-6', 'h-12', 'h-18', 'h-24'];
// 아래 시각 눈금은 3시간마다
const LABEL_EVERY = 3;
const isWeekendToday = () => [0, 6].includes(new Date().getDay());

// 장소 상세 「붐비는 시간」 (99). 카테고리로 추정한 값이라 화면에 그렇게 적는다 (utils/popularTimes 주석).
// 막대 그래프는 눈으로 보는 용도라 낭독기에는 숨기고, 가장 붐비는 시간을 문장으로 알려 준다.
export default function PopularTimes({ category }) {
  const { t } = useTranslation();
  const titleId = useId();
  const [isWeekend, setIsWeekend] = useState(isWeekendToday);
  const estimate = estimatePopularTimes(category, isWeekend);
  if (!estimate) return null;

  const period = t(isWeekend ? 'place.popular.weekend' : 'place.popular.weekday');
  const isPeak = (hour) => hour >= estimate.peak.from && hour < estimate.peak.to;

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={titleId} className="text-title font-bold">
          {t('place.popular.title')}
        </h2>
        <div role="group" aria-label={t('place.popular.periodLabel')} className="flex gap-2">
          <Chip
            label={t('place.popular.weekday')}
            selected={!isWeekend}
            onClick={() => setIsWeekend(false)}
          />
          <Chip
            label={t('place.popular.weekend')}
            selected={isWeekend}
            onClick={() => setIsWeekend(true)}
          />
        </div>
      </div>
      <div className="space-y-5 rounded-2xl bg-bg-soft p-5 sm:p-6">
        <p className="text-body font-bold break-keep">
          {t('place.popular.peak', { period, from: estimate.peak.from, to: estimate.peak.to })}
        </p>
        <div aria-hidden="true">
          <div className="flex h-24 items-end gap-1">
            {estimate.hours.map(({ hour, level }) => (
              <span
                key={hour}
                className={`flex-1 rounded-t-full ${LEVEL_HEIGHT_CLASSES[level]} ${isPeak(hour) ? 'bg-primary' : 'bg-primary/30'}`}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-1 text-caption text-text/70">
            {estimate.hours.map(({ hour }) => (
              <span key={hour} className="flex-1 text-center">
                {hour % LABEL_EVERY === 0 ? hour : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-caption text-text/70 break-keep">{t('place.popular.estimated')}</p>
    </section>
  );
}
