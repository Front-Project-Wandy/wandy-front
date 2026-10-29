import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import { usePreferenceStore } from '../../member/hooks/usePreferenceStore';
import { buildDayRegenerateConditions } from '../utils/buildDayRegenerateConditions';
import { buildFillConditions } from '../utils/buildFillConditions';
import AiFillDialog from './AiFillDialog';

// 「AI로 빈 날 채우기」 버튼. 누르면 AI 일정 채우기 창이 열린다.
// 플래너(55): <AiFillButton trip={trip} onApply={(days) => ...} />
// 플래너 DAY 다시 짜기(79): <AiFillButton trip={trip} dayIndex={i} onApply={(days) => ...} />
//   그 DAY만 새로 골라 준다. 넣을 때 그 DAY의 기존 장소를 빼고 넣는 건 플래너가 한다.
// 마법사(54): <AiFillButton conditions={buildWizardFillConditions({ draft, days, flight })} onApply={...} />
// days: [{ dayIndex, items: [{ place, startTime, stayMinutes }] }] — 어디에 넣을지는 부르는 쪽이 정한다.
export default function AiFillButton({ trip, conditions, dayIndex, onApply, className = '' }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // 플래너는 마법사에서 고른 이번 여행 카테고리(trip.preferredCategories, 회의 필요 16번)를 먼저 쓴다.
  // 빈 배열도 "고른 게 없음"이라는 이번 여행 값이라 그대로 쓰고(마법사 AI 채우기와 같게),
  // 이 칸이 생기기 전에 저장한 여행(undefined)만 마이페이지 프로필 값을 쓴다.
  // 마법사는 STEP1에서 고른 이번 여행 카테고리를 conditions에 담아 넘긴다.
  const profileCategories = usePreferenceStore((state) => state.preferences.categories);
  const isRegenerate = Number.isInteger(dayIndex);
  const getConditions = () => {
    if (conditions) return conditions;
    const categories = trip.preferredCategories ?? profileCategories;
    return isRegenerate
      ? buildDayRegenerateConditions(trip, dayIndex, categories)
      : buildFillConditions(trip, categories);
  };

  return (
    <>
      <Button
        variant="secondary"
        className={className}
        // DAY마다 같은 글자의 버튼이 생겨서, 낭독기가 어느 DAY인지 알 수 있게 번호를 붙인다
        aria-label={
          isRegenerate ? t('ai.fill.regenerateDayLabel', { number: dayIndex + 1 }) : undefined
        }
        onClick={() => setIsOpen(true)}
      >
        {t(isRegenerate ? 'ai.fill.regenerateDay' : 'ai.fill.button')}
      </Button>
      {/* 닫혀 있을 때는 그리지 않아서, 다시 열면 이전 결과 없이 처음부터 시작한다 */}
      {isOpen ? (
        <AiFillDialog
          conditions={getConditions()}
          isRegenerate={isRegenerate}
          onApply={onApply}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}
