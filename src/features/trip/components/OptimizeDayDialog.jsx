import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { reorderItems } from '../../../store/plan/reorderItems';
import { formatDistance, formatDuration } from '../../transport/utils/formatTransport';
import { summarizeDayTransport } from '../../transport/utils/summarizeDayTransport';
import { optimizeRoute } from '../utils/optimizeRoute';
import OptimizeOrderItem from './OptimizeOrderItem';

// 한 DAY의 동선을 가장 짧은 순서로 바꿀지 비교해서 보여 주는 창 (69). 보고 나서 「적용」을 눌러야 바뀐다.
// 이동 거리·시간은 적용 전과 후를 나란히 보여 주고, 이미 가장 짧으면 적용할 수 없다고 알려 준다.
// 시간은 재배치한 순서에 각 자리의 시작 시각을 그대로 붙여서 구한다(실제로 적용될 결과와 같다).
export default function OptimizeDayDialog({
  open,
  onClose,
  day,
  dayIndex,
  country,
  transportMode,
  onApply,
}) {
  const { t } = useTranslation();
  const result = useMemo(() => optimizeRoute(day.items), [day.items]);
  const reordered = useMemo(
    () => reorderItems(day.items, result.orderedIds) ?? day.items,
    [day.items, result.orderedIds],
  );
  const beforeTime = summarizeDayTransport({ items: day.items, country, transportMode });
  const afterTime = summarizeDayTransport({ items: reordered, country, transportMode });

  const handleApply = () => {
    onApply(dayIndex, result.orderedIds);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('planner.optimize.title', { number: dayIndex + 1 })}
    >
      <div className="space-y-4">
        <p className="text-body">
          {t('planner.optimize.distance', {
            before: formatDistance(result.beforeMeters),
            after: formatDistance(result.afterMeters),
          })}
        </p>
        {beforeTime && afterTime ? (
          <p className="text-body">
            {t('planner.optimize.time', {
              before: formatDuration(t, beforeTime.minutes),
              after: formatDuration(t, afterTime.minutes),
            })}
          </p>
        ) : null}
        {result.isImproved ? (
          <>
            <p className="text-body-sm text-text/70">{t('planner.optimize.note')}</p>
            <ol className="space-y-2">
              {reordered.map((item, index) => (
                <OptimizeOrderItem
                  key={item.id}
                  item={item}
                  number={index + 1}
                  dayIndex={dayIndex}
                />
              ))}
            </ol>
          </>
        ) : (
          <p className="font-bold">{t('planner.optimize.alreadyShortest')}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t('planner.optimize.cancel')}
          </Button>
          <Button disabled={!result.isImproved} onClick={handleApply}>
            {t('planner.optimize.apply')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
