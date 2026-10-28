import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDuration } from '../../transport/utils/formatTransport';
import { useItemName } from '../hooks/useItemName';
import { formatClock } from '../utils/buildTimeline';
import NumberBadge from './NumberBadge';

// 타임라인의 장소 한 곳: 번호·시작~끝 시각·이름·체류와, 다음 장소까지의 이동·여유 시간 (80).
// 누르면 지도에서 그 장소가 선택된다 (목록 보기와 같은 선택). 편집·삭제·끌기는 목록 보기에서만 한다.
// 여유가 음수면 이동 시간까지 넣었을 때 모자란다는 뜻이라 굵은 글씨로 알려 주기만 한다.
export default function TimelineItem({ entry, number, dayIndex, isLast, isSelected, onSelect }) {
  const { t } = useTranslation();
  const { item, startMinutes, endMinutes, endsNextDay, leg, isNextEarlier, slackMinutes } = entry;
  const name = useItemName(item);
  const itemRef = useRef(null);

  // 지도에서 마커를 눌렀을 때 타임라인에서 그 장소가 보이는 곳으로 가져온다 (목록 보기와 같은 방식).
  useEffect(() => {
    if (!isSelected) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    itemRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [isSelected]);

  const timeRange =
    startMinutes === null
      ? item.startTime
      : `${formatClock(startMinutes)} ~ ${formatClock(endMinutes)}`;
  const legText = leg
    ? t('planner.transport.leg', {
        mode: t(`planner.transport.mode.${leg.mode}`),
        duration: formatDuration(t, leg.minutes),
      })
    : null;

  return (
    <li ref={itemRef} className="flex gap-3">
      <div className="flex flex-col items-center">
        <NumberBadge number={number} dayIndex={dayIndex} />
        {isLast ? null : <span aria-hidden="true" className="w-0.5 flex-1 bg-text/20" />}
      </div>
      <div className="min-w-0 flex-1 pb-4">
        <button
          type="button"
          aria-pressed={isSelected}
          onClick={() => onSelect?.(item.id)}
          className={`block w-full rounded-2xl border p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isSelected ? 'border-primary bg-bg-soft' : 'border-text/10 bg-background'}`}
        >
          <span className="block text-body-sm text-text/70">
            {timeRange}
            {endsNextDay ? ` (${t('planner.timeline.nextDay')})` : ''}
            {' · '}
            {t('planner.item.stay', { minutes: item.stayMinutes })}
          </span>
          <span className="block truncate text-body font-bold">{name}</span>
        </button>
        {legText || isNextEarlier || slackMinutes !== null ? (
          <div className="mt-2 space-y-0.5 pl-1 text-body-sm text-text/70">
            {legText ? <p>{legText}</p> : null}
            {isNextEarlier ? (
              <p className="font-bold text-text">{t('planner.item.timeOrderWarning')}</p>
            ) : null}
            {slackMinutes !== null && slackMinutes > 0 ? (
              <p>{t('planner.timeline.slack', { duration: formatDuration(t, slackMinutes) })}</p>
            ) : null}
            {slackMinutes !== null && slackMinutes < 0 ? (
              <p className="font-bold text-text">
                {t('planner.timeline.shortage', { duration: formatDuration(t, -slackMinutes) })}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}
