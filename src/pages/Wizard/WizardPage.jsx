import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../components/common/setPageTitle';
import SkipLink from '../../components/common/SkipLink';
import { isRouteChange } from '../../components/common/useRouteFocus';
import { useScrollToTop } from '../../components/common/useScrollToTop';
import { useWizardStore } from '../../store/wizard/wizardStore';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2Flight from './steps/Step2Flight';
import Step3Stay from './steps/Step3Stay';
import Step4Transport from './steps/Step4Transport';
import Step5Spots from './steps/Step5Spots';
import Step6Nearby from './steps/Step6Nearby';
import Step7Summary from './steps/Step7Summary';
import { hasBasicInfoErrors } from './validateBasicInfo';
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
  const heading = t('wizard.step.heading', { step: current, title: t(`wizard.step.${key}.title`) });
  const headingRef = useRef(null);
  useScrollToTop();

  // 「이어서 만들기」로 들어오면 저장된 단계부터 열려서 STEP1 검사를 다시 거치지 않는다.
  // 그사이 출발일이 지났거나 기본 정보가 잘못됐으면 STEP1로 돌려보낸다 (STEP1은 그 에러를 바로 보여 준다).
  // 처음 열 때 한 번만 본다 — 단계마다 보면 STEP1에서 고치는 도중에도 끌려간다.
  useEffect(() => {
    const { step: savedStep, draft } = useWizardStore.getState();
    if (savedStep > 1 && hasBasicInfoErrors(draft)) setStep(1);
  }, [setStep]);

  // 단계가 바뀌거나 다른 화면에서 들어오면 탭 제목을 바꾸고 포커스를 단계 제목으로 옮긴다 (90 접근성).
  // [다음]을 눌러도 포커스가 아래 버튼 자리에 남으면 화면 낭독기가 새 단계를 읽어 주지 않는다.
  // 단계도 화면 하나로 쳐서 isRouteChange에 기록한다 — 처음 열 때는 옮기지 않고, 홈으로 돌아가면 홈이 알아챈다.
  // 스크롤은 goTo가 맨 위로 올려 두어서 preventScroll로 그대로 둔다.
  useEffect(() => {
    setPageTitle(t, t('common.pageTitle.wizard', { step: heading }));
    if (isRouteChange(`/plan/new?step=${current}`)) {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [current, heading, t]);

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
      <SkipLink />
      <div className="border-b border-text/10">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 lg:px-6">
          <Link
            to="/"
            aria-label={t('common.header.homeLabel')}
            className="rounded-xl text-subtitle font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('common.header.logo')}
          </Link>
          <p className="text-body-sm font-bold text-text/70">{t('wizard.page.title')}</p>
        </div>
      </div>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 lg:px-6">
        <WizardProgress currentStep={current} />
        {/* tabIndex -1: 코드로만 포커스를 받는다. 포커스 테두리는 키보드 이동이 아니라서 그리지 않는다. */}
        <h1 ref={headingRef} tabIndex={-1} className="text-title font-bold outline-none">
          {heading}
        </h1>
        <StepScreen onPrev={handlePrev} onNext={handleNext} />
      </main>
    </>
  );
}
