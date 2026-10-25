import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizardStore } from '../../store/wizard/wizardStore';

// 홈에서 새 여행을 시작할 때 쓰는 훅 ([플래너 시작], 인기 도시 카드).
// startDraft는 작성 중이던 값을 새 값으로 바꿔 버려서, 작성 중인 여행이 있으면 바로 시작하지 않고
// 확인 창을 띄울 수 있게 기다리는 값(pendingValues)으로 둔다.
export function useStartTrip() {
  const navigate = useNavigate();
  const startDraft = useWizardStore((state) => state.startDraft);
  const hasDraft = useWizardStore((state) => state.updatedAt !== null);
  const [pendingValues, setPendingValues] = useState(null);

  const start = (values) => {
    startDraft(values);
    navigate('/plan/new');
  };

  const requestStart = (values) => {
    if (hasDraft) setPendingValues(values);
    else start(values);
  };

  return {
    requestStart,
    isConfirmOpen: pendingValues !== null,
    // 확인 창의 [새로 시작]
    confirmStart: () => start(pendingValues),
    // 확인 창의 [이어서 만들기] — 새 값은 버리고 작성 중이던 여행으로
    continueDraft: () => navigate('/plan/new'),
    cancelStart: () => setPendingValues(null),
  };
}
