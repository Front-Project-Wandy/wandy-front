import { useState } from 'react';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import BasicInfoFields from '../BasicInfoFields';
import { clearFieldErrors, validateBasicInfo } from '../validateBasicInfo';
import WizardNav from '../WizardNav';

// STEP1 여행지·날짜·인원 (25). 홈 카드와 같은 입력칸을 쓰지만, 값은 wizardStore에 바로 저장한다 (30 중간 저장).
// 필수 단계라 건너뛰기가 없고, [다음]을 누를 때 홈과 같은 검사를 한다.
export default function Step1BasicInfo({ onNext }) {
  const draft = useWizardStore((state) => state.draft);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  const [errors, setErrors] = useState({});

  const handleChange = (patch) => {
    updateDraft(patch);
    setErrors((prev) => clearFieldErrors(prev, patch));
  };

  const handleNext = () => {
    const nextErrors = validateBasicInfo(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // 입력 중에는 칸을 비울 수 있게 인원을 글자로 두지만, 다음 단계로 넘길 때는 숫자로 맞춘다.
    // (홈에서 넘어온 값은 숫자라, 나중에 플랜 store로 넘길 때 섞이지 않게)
    updateDraft({ people: Number(draft.people) });
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <BasicInfoFields values={draft} errors={errors} onChange={handleChange} />
      <WizardNav onNext={handleNext} />
    </div>
  );
}
