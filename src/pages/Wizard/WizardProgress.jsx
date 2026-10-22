import { useTranslation } from 'react-i18next';
import { WIZARD_STEPS } from './wizardSteps';

// 지난 단계 / 지금 단계 / 앞으로 할 단계 / 아직 없는 단계(추가 기능)를 색으로 나눈다.
// 흰 글자는 primary 위에서만 쓰는 규칙이라 지금 단계만 흰 글자다.
const getCircleClass = ({ step, enabled }, currentStep) => {
  if (step === currentStep) return 'border-primary bg-primary text-white';
  if (!enabled) return 'border-dashed border-text/20 text-text/30';
  if (step < currentStep) return 'border-primary/30 bg-primary/10 text-primary';
  return 'border-text/20 bg-background text-text/70';
};

// 마법사 진행 표시줄 (24). 1 — 2 — … — 7.
// 순서가 있는 목록이라 <ol>을 쓰고, 지금 단계에 aria-current="step"을 줘서 화면 낭독기가 "현재 단계"로 읽는다.
export default function WizardProgress({ currentStep }) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('wizard.progress.label')}>
      <ol className="flex items-center">
        {WIZARD_STEPS.map((item, index) => (
          <li key={item.step} className="flex flex-1 items-center last:flex-none">
            <span
              aria-current={item.step === currentStep ? 'step' : undefined}
              className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-body-sm font-bold ${getCircleClass(item, currentStep)}`}
            >
              {item.step}
              <span className="sr-only">
                {t(`wizard.step.${item.key}.title`)}
                {!item.enabled && ` (${t('wizard.progress.notReady')})`}
              </span>
            </span>
            {index < WIZARD_STEPS.length - 1 && (
              <span aria-hidden="true" className="mx-1 h-0.5 flex-1 rounded-full bg-text/10" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
