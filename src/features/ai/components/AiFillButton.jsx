import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import { usePreferenceStore } from '../../member/hooks/usePreferenceStore';
import { buildFillConditions } from '../utils/buildFillConditions';
import AiFillDialog from './AiFillDialog';

// 「AI로 빈 날 채우기」 버튼. 누르면 AI 일정 채우기 창이 열린다.
// 플래너(55): <AiFillButton trip={trip} onApply={(days) => ...} />
// 마법사(54): <AiFillButton conditions={buildWizardFillConditions({ draft, days, flight })} onApply={...} />
// days: [{ dayIndex, items: [{ place, startTime, stayMinutes }] }] — 어디에 넣을지는 부르는 쪽이 정한다.
export default function AiFillButton({ trip, conditions, onApply, className = '' }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // 플래너 trip에는 선호 카테고리가 없어서(회의 필요 9번) 마이페이지 프로필 값을 쓴다.
  // 마법사는 STEP1에서 고른 이번 여행 카테고리를 conditions에 담아 넘긴다.
  const profileCategories = usePreferenceStore((state) => state.preferences.categories);
  const fillConditions = conditions ?? buildFillConditions(trip, profileCategories);

  return (
    <>
      <Button variant="secondary" className={className} onClick={() => setIsOpen(true)}>
        {t('ai.fill.button')}
      </Button>
      {/* 닫혀 있을 때는 그리지 않아서, 다시 열면 이전 결과 없이 처음부터 시작한다 */}
      {isOpen ? (
        <AiFillDialog
          conditions={fillConditions}
          onApply={onApply}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}
