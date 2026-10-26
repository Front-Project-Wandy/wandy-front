import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import TabBar from '../../components/common/TabBar';
import OneLineTripForm from '../../features/ai/components/OneLineTripForm';
import StartTripConfirmModal from './StartTripConfirmModal';
import TripStartForm from './TripStartForm';
import { useStartTrip } from './useStartTrip';

// 홈 "내 여행 만들기" 카드 (23 + 56). 새 여행을 시작하는 두 방법을 탭으로 나눈다.
// [직접 입력]: 나라·도시·날짜·인원 / [한 줄로]: "2박3일 도쿄 먹방" 같은 문장 (B파트 OneLineTripForm)
// 두 폼이 각자 <form>이라 안에 겹쳐 넣을 수 없어서, 고른 탭 하나만 그린다.
// 둘 다 같은 requestStart를 써서, 작성 중인 여행이 있으면 같은 확인 창을 거친다 (확인 창은 여기서 하나만).
export default function StartTripCard() {
  const { t } = useTranslation();
  const { requestStart, isConfirmOpen, confirmStart, continueDraft, cancelStart } = useStartTrip();
  const [tab, setTab] = useState('direct');

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-6">
      <h2 className="text-subtitle font-bold">{t('home.start.title')}</h2>
      <TabBar
        tabs={[
          { key: 'direct', label: t('home.start.tab.direct') },
          { key: 'oneLine', label: t('home.start.tab.oneLine') },
        ]}
        activeKey={tab}
        onChange={setTab}
      />
      {tab === 'direct' ? (
        <TripStartForm onStart={requestStart} />
      ) : (
        <OneLineTripForm onStart={requestStart} />
      )}
      <StartTripConfirmModal
        open={isConfirmOpen}
        onConfirm={confirmStart}
        onContinue={continueDraft}
        onClose={cancelStart}
      />
    </Card>
  );
}
