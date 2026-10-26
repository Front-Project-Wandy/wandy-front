import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/common/Input';
import { formatShortDate } from '../../../features/member/utils/tripDates';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import { fitSpotsToDays } from '../spots/spotList';
import { useSpotPlaces } from '../spots/useSpotPlaces';
import ReplaceTripModal from '../summary/ReplaceTripModal';
import { saveWizardTrip } from '../summary/saveWizardTrip';
import SummaryDays from '../summary/SummaryDays';
import { getTripDays } from '../tripDays';
import WizardNav from '../WizardNav';

// STEP7 요약·저장 (29). 지금까지 고른 걸 보여주고, [저장]하면 플랜 store(C)에 넣고 플래너로 간다.
// 구간별 이동 시간·요금은 교통 계산(C)이 생기면 붙인다. 지금은 STEP4에서 고른 이동 방식만 보여준다.
export default function Step7Summary({ onPrev }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const draft = useWizardStore((state) => state.draft);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  const resetWizard = useWizardStore((state) => state.resetWizard);
  const previousTrip = usePlanStore((state) => state.trip);
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);

  const days = getTripDays(draft.startDate, draft.endDate);
  const spots = fitSpotsToDays(draft.spots, days.length);
  const placesById = useSpotPlaces(spots.map((spot) => spot.placeId));
  const isLoadingPlaces = Object.values(placesById).some((item) => item.isPending);

  const cityName = t(`common.city.${draft.city}`);
  const defaultTitle = t('wizard.summary.defaultTitle', { city: cityName });
  const transportLabel = draft.transportMode
    ? t(`wizard.transport.mode.${draft.transportMode}.title`)
    : t('wizard.summary.transportNone');

  const save = () => {
    const tripId = saveWizardTrip({
      draft,
      spots,
      title: draft.title.trim() || defaultTitle,
      placesById,
    });
    navigate(`/trip/${tripId}`);
    // 저장이 끝난 마법사는 비워서 홈의 "이어서 만들기"에 남지 않게 한다.
    resetWizard();
  };

  const handleSave = () => {
    if (previousTrip) setIsReplaceOpen(true);
    else save();
  };

  return (
    <div className="flex flex-col gap-6">
      <Input
        label={t('wizard.summary.titleLabel')}
        value={draft.title}
        placeholder={defaultTitle}
        maxLength={40}
        onChange={(event) => updateDraft({ title: event.target.value })}
      />

      <p className="rounded-2xl bg-bg-soft p-4 text-body-sm">
        {t('wizard.summary.info', {
          city: cityName,
          start: formatShortDate(draft.startDate, i18n.language),
          end: formatShortDate(draft.endDate, i18n.language),
          people: draft.people,
          transport: transportLabel,
        })}
      </p>

      <SummaryDays
        days={days}
        spots={spots}
        placesById={placesById}
        isGoogle={draft.country === 'JP'}
      />

      <WizardNav
        onPrev={onPrev}
        onNext={handleSave}
        nextLabel={t('wizard.nav.save')}
        nextLoading={isLoadingPlaces}
      />

      <ReplaceTripModal
        open={isReplaceOpen}
        previousTitle={previousTrip?.title || t('wizard.summary.untitled')}
        onConfirm={save}
        onClose={() => setIsReplaceOpen(false)}
      />
    </div>
  );
}
