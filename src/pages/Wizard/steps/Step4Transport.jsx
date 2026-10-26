import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import RadioCardGroup from '../RadioCardGroup';
import WizardNav from '../WizardNav';

// 값 이름은 플랜 store(C)의 구간 이동 수단(transportToNext.mode)과 맞췄다. mixed만 마법사에서 새로 쓰는 값.
const TRANSPORT_MODES = ['transit', 'taxi', 'car', 'mixed'];

// STEP4 현지 교통 방식 (26). 고른 값은 이후 장소 사이 이동 계산의 기본값이 된다.
// [다음]은 하나를 골라야 넘어가고, [건너뛰기]는 고르지 않은 채(null) 넘어간다.
export default function Step4Transport({ onPrev, onNext }) {
  const { t } = useTranslation();
  const transportMode = useWizardStore((state) => state.draft.transportMode);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  const [hasError, setHasError] = useState(false);

  const handleSelect = (mode) => {
    updateDraft({ transportMode: mode });
    setHasError(false);
  };

  // 건너뛰기 = "정하지 않음". 앞에서 골라 둔 값이 있어도 지워야 null(계산할 때 혼합)로 돌아간다.
  // 라디오는 선택을 해제할 방법이 없어서, 여기서 지우지 않으면 고른 값이 계속 남는다.
  const handleSkip = () => {
    updateDraft({ transportMode: null });
    setHasError(false);
    onNext();
  };

  const handleNext = () => {
    if (!transportMode) {
      setHasError(true);
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <RadioCardGroup
        legend={t('wizard.transport.question')}
        options={TRANSPORT_MODES.map((mode) => ({
          value: mode,
          title: t(`wizard.transport.mode.${mode}.title`),
          description: t(`wizard.transport.mode.${mode}.description`),
        }))}
        value={transportMode}
        onChange={handleSelect}
        error={hasError ? t('wizard.transport.error') : null}
      />
      <p className="text-body-sm text-text/70">{t('wizard.transport.hint')}</p>
      <WizardNav onPrev={onPrev} onSkip={handleSkip} onNext={handleNext} />
    </div>
  );
}
