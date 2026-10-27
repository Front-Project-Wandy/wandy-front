import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferenceStore } from '../../features/member/hooks/usePreferenceStore';
import { createPreferredTripDraft } from '../../features/member/utils/createPreferredTripDraft';
import { useWizardStore } from '../../store/wizard/wizardStore';

// 홈에서 새 여행을 시작할 때 쓰는 훅 ([플래너 시작], 인기 도시 카드).
// startDraft는 작성 중이던 값을 새 값으로 바꿔 버려서, 작성 중인 여행이 있으면 바로 시작하지 않고
// 확인 창을 띄울 수 있게 기다리는 값(pendingValues)으로 둔다.
export function useStartTrip() {
  const navigate = useNavigate();
  const startDraft = useWizardStore((state) => state.startDraft);
  const preferences = usePreferenceStore((state) => state.preferences);
  const [pendingValues, setPendingValues] = useState(null);

  const start = (values) => {
    // 프로필의 스타일·카테고리를 새 여행 기본값으로 넣는다 (65). 이어서 만들기에는 적용하지 않는다.
    startDraft(createPreferredTripDraft(values, preferences));
    navigate('/plan/new');
  };

  const requestStart = (values) => {
    // 한 줄로 탭처럼 AI 응답을 기다렸다 부르는 경우 그사이 초안이 생겼을 수 있어서, 화면을 그릴 때 값이 아니라
    // 부르는 순간의 store 값으로 확인한다
    const hasDraft = useWizardStore.getState().updatedAt !== null;
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
