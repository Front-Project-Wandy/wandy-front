import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabBar from '../../../components/common/TabBar';
import EntryGuide from './EntryGuide';
import HolidayList from './HolidayList';
import PackingChecklist from './PackingChecklist';

const TAB_KEYS = ['packing', 'entry', 'holiday'];

// 플래너 위쪽의 접이식 「여행 준비」 (요구사항 #92): 준비물 · 입국 안내 · 공휴일·행사. 회화 카드가 이어서 들어온다.
export default function TripPrepPanel({ trip }) {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('packing');
  const tabs = TAB_KEYS.map((key) => ({ key, label: t(`planner.prep.tab.${key}`) }));

  const renderTab = () => {
    if (activeKey === 'entry') return <EntryGuide country={trip.country} />;
    if (activeKey === 'holiday') return <HolidayList trip={trip} />;
    return <PackingChecklist key={trip.id} tripId={trip.id} country={trip.country} />;
  };

  return (
    <details className="rounded-2xl bg-bg-soft p-4">
      <summary className="cursor-pointer text-body font-bold">{t('planner.prep.title')}</summary>
      <TabBar tabs={tabs} activeKey={activeKey} onChange={setActiveKey} className="mt-3" />
      <div role="tabpanel" className="mt-4">
        {renderTab()}
      </div>
    </details>
  );
}
