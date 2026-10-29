import { useTranslation } from 'react-i18next';
import PackingChecklist from './PackingChecklist';

// 플래너 위쪽의 접이식 「여행 준비」 (요구사항 #92). 지금은 준비물만 있고, 입국 안내·공휴일·회화 카드가 이어서 들어온다.
export default function TripPrepPanel({ trip }) {
  const { t } = useTranslation();

  return (
    <details className="rounded-2xl bg-bg-soft p-4">
      <summary className="cursor-pointer text-body font-bold">{t('planner.prep.title')}</summary>
      <div className="mt-4">
        <h2 className="mb-3 text-body-sm font-bold text-text/70">
          {t('planner.prep.packing.title')}
        </h2>
        <PackingChecklist key={trip.id} tripId={trip.id} country={trip.country} />
      </div>
    </details>
  );
}
