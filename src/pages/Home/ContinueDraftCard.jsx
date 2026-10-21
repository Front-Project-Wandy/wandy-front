import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useWizardStore } from '../../store/wizard/wizardStore';
import { formatDateRange, formatSavedAgo } from './formatDraft';

// 작성 중인 플랜 이어서 만들기 (31). 마법사에서 저장한 값이 없으면 아무것도 그리지 않는다.
// 마법사는 wizardStore의 step을 읽어 마지막 STEP부터 다시 보여준다.
export default function ContinueDraftCard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const draft = useWizardStore((state) => state.draft);
  const step = useWizardStore((state) => state.step);
  const updatedAt = useWizardStore((state) => state.updatedAt);

  if (!updatedAt) return null;

  return (
    <section aria-labelledby="continue-draft-title" className="flex flex-col gap-3">
      <h2 id="continue-draft-title" className="text-subtitle font-bold">
        {t('home.continue.title')}
      </h2>
      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-body font-bold">
            {t('home.continue.tripTitle', { city: t(`common.city.${draft.city}`) })}
            <span className="ml-2 font-normal text-text/70">
              {formatDateRange(draft.startDate, draft.endDate)}
            </span>
          </p>
          <p className="text-body-sm text-text/70">
            {t('home.continue.progress', { step })} ·{' '}
            {t('home.continue.savedAt', { time: formatSavedAgo(updatedAt, i18n.language) })}
          </p>
        </div>
        <Button onClick={() => navigate('/plan/new')} className="w-full sm:w-auto">
          {t('home.continue.action')}
        </Button>
      </Card>
    </section>
  );
}
