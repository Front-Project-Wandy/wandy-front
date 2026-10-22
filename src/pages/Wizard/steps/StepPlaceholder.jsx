import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import WizardNav from '../WizardNav';

// 아직 만들지 않은 STEP 4~7 자리. 단계 이동은 되게 해 두고, 내용은 단계별 PR에서 채운다.
// (STEP5·6은 B파트 장소 검색·식당과 C파트 교통, STEP7 저장은 C파트 플랜 store가 필요하다)
export default function StepPlaceholder({ stepKey, onPrev, onNext, nextLabel }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5">
      <EmptyState
        title={t(`wizard.step.${stepKey}.title`)}
        description={t('wizard.placeholder.description')}
        className="rounded-2xl bg-bg-soft"
      />
      <WizardNav onPrev={onPrev} onSkip={onNext} onNext={onNext} nextLabel={nextLabel} />
    </div>
  );
}
