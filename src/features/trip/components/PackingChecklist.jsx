import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import packingList from '../../../mocks/packingList.json';
import { usePackingChecks } from '../hooks/usePackingChecks';
import { countPrepProgress } from '../utils/prepChecks';

// 나라별 준비물 체크리스트 (요구사항 #92). 체크한 것은 이 기기에 여행별로 저장된다.
export default function PackingChecklist({ tripId, country }) {
  const { t } = useTranslation();
  const { checkedIds, toggle, clear } = usePackingChecks(tripId);
  const groups = packingList[country] ?? [];

  if (groups.length === 0) {
    return <EmptyState title={t('planner.prep.packing.empty')} />;
  }

  const { total, checked } = countPrepProgress(groups, checkedIds);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-sm font-bold" aria-live="polite">
          {t('planner.prep.packing.progress', { checked, total })}
        </p>
        <Button variant="ghost" size="sm" disabled={checked === 0} onClick={clear}>
          {t('planner.prep.packing.clear')}
        </Button>
      </div>
      {groups.map((group) => (
        <fieldset key={group.id} className="space-y-2">
          <legend className="mb-1 text-body-sm font-bold">{group.title}</legend>
          {group.items.map((item) => (
            <label key={item.id} className="flex items-start gap-2 text-body-sm">
              <input
                type="checkbox"
                checked={checkedIds.includes(item.id)}
                onChange={() => toggle(item.id)}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span className="break-keep">{item.label}</span>
            </label>
          ))}
        </fieldset>
      ))}
    </div>
  );
}
