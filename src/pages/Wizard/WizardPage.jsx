import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useWizardStore } from '../../store/wizard/wizardStore';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2Flight from './steps/Step2Flight';
import Step3Stay from './steps/Step3Stay';
import Step4Transport from './steps/Step4Transport';
import Step5Spots from './steps/Step5Spots';
import Step6Nearby from './steps/Step6Nearby';
import Step7Summary from './steps/Step7Summary';
import { getNextStep, getPrevStep, getStepInfo } from './wizardSteps';
import WizardProgress from './WizardProgress';

// 단계별 화면. 단계 번호(wizardSteps.js)로 고른다.
const STEP_SCREENS = {
  1: Step1BasicInfo,
  2: Step2Flight,
  3: Step3Stay,
  4: Step4Transport,
  5: Step5Spots,
  6: Step6Nearby,
  7: Step7Summary,
};

// W01~W07 플랜 마법사 (A파트). 지금 단계는 wizardStore.step에 있어서, 나갔다 와도 그 단계부터 다시 보인다 (30·31).
// 와이어프레임에 사이트 헤더가 없어서 App.jsx 레이아웃 밖에 있고, 나가는 길로 로고만 둔다.
export default function WizardPage() {
  const { t } = useTranslation();
  const step = useWizardStore((state) => state.step);
  const setStep = useWizardStore((state) => state.setStep);
  const { step: current, key } = getStepInfo(step);
  const StepScreen = STEP_SCREENS[current];

  // 단계를 바꾸면 화면 맨 위(진행 표시줄)부터 보이게 한다.
  const goTo = (target) => {
    setStep(target);
    window.scrollTo(0, 0);
  };
  const prev = getPrevStep(current);
  const next = getNextStep(current);
  const handlePrev = prev ? () => goTo(prev) : undefined;
  const handleNext = next ? () => goTo(next) : undefined;

  return (
    <>
      <div className="border-b border-text/10">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 lg:px-6">
          <Link
            to="/"
            aria-label={t('common.header.homeLabel')}
            className="text-subtitle font-bold text-primary"
          >
            {t('common.header.logo')}
          </Link>
          <p className="text-body-sm font-bold text-text/70">{t('wizard.page.title')}</p>
        </div>
      </div>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 lg:px-6">
        <WizardProgress currentStep={current} />
        <h1 className="text-title font-bold">
          {t('wizard.step.heading', { step: current, title: t(`wizard.step.${key}.title`) })}
        </h1>
        <StepScreen onPrev={handlePrev} onNext={handleNext} />
      </main>
    </>
  );
}
