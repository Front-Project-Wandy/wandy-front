import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import TabBar from '../../components/common/TabBar';
import OneLineTripForm from '../../features/ai/components/OneLineTripForm';
import StartTripConfirmModal from './StartTripConfirmModal';
import TripStartForm from './TripStartForm';
import { useStartManualTrip } from './useStartManualTrip';
import { useStartTrip } from './useStartTrip';

// 홈 "내 여행 만들기" 카드 (23 + 56). 새 여행을 시작하는 두 방법을 탭으로 나눈다.
// [직접 입력]: 나라·도시·날짜·인원 / [한 줄로]: "2박3일 도쿄 먹방" 같은 문장 (B파트 OneLineTripForm)
// 두 폼이 각자 <form>이라 안에 겹쳐 넣을 수 없어서, 고른 탭 하나만 그린다.
// 둘 다 같은 requestStart를 써서, 작성 중인 여행이 있으면 같은 확인 창을 거친다 (확인 창은 여기서 하나만).
export default function StartTripCard() {
  const { t } = useTranslation();
  const { requestStart, isConfirmOpen, confirmStart, continueDraft, cancelStart } = useStartTrip();
  // [직접 짤게요]는 마법사 초안을 건드리지 않아서 작성 중인 여행 확인 창을 거치지 않는다 (53)
  const startManual = useStartManualTrip();
  const [tab, setTab] = useState('direct');
  // [한 줄로]는 AI가 장소를 고르는 동안 기다렸다가 onStart를 부른다. 그사이 탭을 바꾸거나 홈을 떠나면
  // 폼은 사라져도 늦게 온 결과가 새 여행을 덮어쓰므로, 지금 떠 있는 폼의 번호와 같을 때만 시작한다.
  const [formVersion, setFormVersion] = useState(0);
  const activeFormVersion = useRef(null);

  useEffect(() => {
    activeFormVersion.current = formVersion;
    return () => {
      activeFormVersion.current = null;
    };
  }, [formVersion]);

  const handleTabChange = (key) => {
    if (key === tab) return;
    setTab(key);
    setFormVersion((version) => version + 1);
  };

  const handleFormStart = (values) => {
    if (activeFormVersion.current === formVersion) requestStart(values);
  };

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-6">
      <h2 className="text-subtitle font-bold">{t('home.start.title')}</h2>
      <TabBar
        tabs={[
          { key: 'direct', label: t('home.start.tab.direct') },
          { key: 'oneLine', label: t('home.start.tab.oneLine') },
        ]}
        activeKey={tab}
        onChange={handleTabChange}
      />
      {tab === 'direct' ? (
        <TripStartForm onStart={handleFormStart} onStartManual={startManual} />
      ) : (
        <OneLineTripForm onStart={handleFormStart} />
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
