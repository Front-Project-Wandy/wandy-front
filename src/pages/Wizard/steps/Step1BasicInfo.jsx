import { useState } from 'react';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import BasicInfoFields from '../BasicInfoFields';
import { fitSpotsToDays } from '../spots/spotList';
import { getTripDays } from '../tripDays';
import TripStyleFields from '../TripStyleFields';
import { syncCompanionPeople } from '../tripStyleOptions';
import { clearFieldErrors, validateBasicInfo } from '../validateBasicInfo';
import WizardNav from '../WizardNav';

// 여행지(나라·도시)에 딸린 값. 여행지가 바뀌면 그대로 두면 안 되는 것들이라 비운다.
// (도쿄 항공편·숙소·장소가 서울 여행에 저장되지 않게) 날짜·인원·교통 방식·제목은 여행지와 상관없어서 남긴다.
const DESTINATION_DATA_RESET = { flight: null, stay: null, spots: [] };

// STEP1 여행지·날짜·인원 (25) + 여행 스타일 (46, 선택). 홈 카드와 같은 입력칸을 쓰지만, 값은 wizardStore에 바로 저장한다 (30 중간 저장).
// 필수 단계라 건너뛰기가 없고, [다음]을 누를 때 홈과 같은 검사를 한다.
export default function Step1BasicInfo({ onNext }) {
  const draft = useWizardStore((state) => state.draft);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  // 날짜까지 채워진 초안으로 들어오면(이어서 만들기에서 돌려보낸 경우 등) 문제를 바로 보여 준다.
  // 날짜가 비어 있으면 아직 입력 중이라 [다음]을 누를 때까지 에러를 띄우지 않는다.
  const [errors, setErrors] = useState(() =>
    draft.startDate && draft.endDate ? validateBasicInfo(draft) : {},
  );

  const handleChange = (changed) => {
    const patch = syncCompanionPeople(changed, draft);
    const isDestinationChanged =
      ('country' in patch && patch.country !== draft.country) ||
      ('city' in patch && patch.city !== draft.city);
    updateDraft(isDestinationChanged ? { ...patch, ...DESTINATION_DATA_RESET } : patch);
    setErrors((prev) => clearFieldErrors(prev, patch));
  };

  const handleNext = () => {
    const nextErrors = validateBasicInfo(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // 입력 중에는 칸을 비울 수 있게 인원을 글자로 두지만, 다음 단계로 넘길 때는 숫자로 맞춘다.
    // (홈에서 넘어온 값은 숫자라, 나중에 플랜 store로 넘길 때 섞이지 않게)
    // 날짜를 줄였다면 없어진 DAY에 담긴 장소를 마지막 DAY로 옮겨 저장한다 (STEP7에서 없는 DAY에 넣지 않게).
    const dayCount = getTripDays(draft.startDate, draft.endDate).length;
    updateDraft({
      people: Number(draft.people),
      spots: fitSpotsToDays(draft.spots, dayCount),
    });
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <BasicInfoFields values={draft} errors={errors} onChange={handleChange} />
      {/* 「혼자」를 고르면 인원도 1로 바뀌어서, 인원 에러 지우기까지 같은 handleChange를 거친다. */}
      <TripStyleFields values={draft} onChange={handleChange} />
      <WizardNav onNext={handleNext} />
    </div>
  );
}
