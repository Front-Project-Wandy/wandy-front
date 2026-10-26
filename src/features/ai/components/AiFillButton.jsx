import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import AiFillDialog from './AiFillDialog';

// 플래너에 붙이는 「AI로 빈 날 채우기」 버튼 (55). 누르면 AI 일정 채우기 창이 열린다.
// 쓰는 쪽: <AiFillButton trip={trip} onApply={(days) => ...} />
// days: [{ dayIndex, items: [{ place, startTime, stayMinutes }] }] — 플랜 store에 넣는 건 부르는 쪽이 한다.
export default function AiFillButton({ trip, onApply, className = '' }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" className={className} onClick={() => setIsOpen(true)}>
        {t('ai.fill.button')}
      </Button>
      {/* 닫혀 있을 때는 그리지 않아서, 다시 열면 이전 결과 없이 처음부터 시작한다 */}
      {isOpen ? (
        <AiFillDialog trip={trip} onApply={onApply} onClose={() => setIsOpen(false)} />
      ) : null}
    </>
  );
}
