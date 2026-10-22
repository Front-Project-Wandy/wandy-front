import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import { useWizardStore } from '../../store/wizard/wizardStore';

// 마법사 아래쪽 이동 버튼 (24) + 중간 저장 안내 (30).
// onPrev·onSkip이 없으면 그 버튼은 비활성/숨김 (첫 단계는 이전 없음, 필수 단계는 건너뛰기 없음).
// onNext가 없으면 다음 버튼을 비활성으로 둔다 (STEP7 저장은 플랜 store가 생기면 연결).
export default function WizardNav({ onPrev, onSkip, onNext, nextLabel }) {
  const { t } = useTranslation();
  const isSaved = useWizardStore((state) => state.updatedAt !== null);

  return (
    <div className="flex flex-col gap-3 border-t border-text/10 pt-4">
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={!onPrev} onClick={onPrev}>
          {t('wizard.nav.prev')}
        </Button>
        {onSkip && (
          <Button variant="ghost" onClick={onSkip}>
            {t('wizard.nav.skip')}
          </Button>
        )}
        <Button className="ml-auto" disabled={!onNext} onClick={onNext}>
          {nextLabel ?? t('wizard.nav.next')}
        </Button>
      </div>
      {isSaved && (
        <p className="text-caption text-text/70">
          <span aria-hidden="true">✓ </span>
          {t('wizard.nav.saved')}
        </p>
      )}
    </div>
  );
}
