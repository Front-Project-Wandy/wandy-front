import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import WizardNav from '../WizardNav';

// 값 이름은 플랜 store(C)의 구간 이동 수단(transportToNext.mode)과 맞췄다. mixed만 마법사에서 새로 쓰는 값.
const TRANSPORT_MODES = ['transit', 'taxi', 'car', 'mixed'];

// STEP4 현지 교통 방식 (26). 고른 값은 이후 장소 사이 이동 계산의 기본값이 된다.
// 진짜 라디오 버튼을 카드 모양으로 꾸며서, ↑/↓ 키 이동과 "4개 중 1번째, 선택됨" 읽기는 브라우저가 해 준다.
// [다음]은 하나를 골라야 넘어가고, [건너뛰기]는 고르지 않은 채(null) 넘어간다.
export default function Step4Transport({ onPrev, onNext }) {
  const { t } = useTranslation();
  const transportMode = useWizardStore((state) => state.draft.transportMode);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  const [hasError, setHasError] = useState(false);
  const groupName = useId();
  const errorId = `${groupName}-error`;

  const handleSelect = (mode) => {
    updateDraft({ transportMode: mode });
    setHasError(false);
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
      <fieldset aria-describedby={hasError ? errorId : undefined}>
        <legend className="text-body font-bold">{t('wizard.transport.question')}</legend>
        <div className="mt-3 flex flex-col gap-3">
          {TRANSPORT_MODES.map((mode) => {
            const isSelected = transportMode === mode;
            return (
              <label
                key={mode}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                  isSelected ? 'border-primary bg-bg-soft' : 'border-text/20 hover:bg-bg-soft'
                }`}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={mode}
                  checked={isSelected}
                  onChange={() => handleSelect(mode)}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-body font-bold">
                    {t(`wizard.transport.mode.${mode}.title`)}
                  </span>
                  <span className="text-body-sm text-text/70">
                    {t(`wizard.transport.mode.${mode}.description`)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {hasError && (
          <p id={errorId} role="alert" className="mt-2 text-body-sm text-error">
            {t('wizard.transport.error')}
          </p>
        )}
      </fieldset>

      <p className="text-body-sm text-text/70">{t('wizard.transport.hint')}</p>
      <WizardNav onPrev={onPrev} onSkip={onNext} onNext={handleNext} />
    </div>
  );
}
