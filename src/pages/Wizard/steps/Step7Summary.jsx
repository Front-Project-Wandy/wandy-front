import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/common/Input';
import { formatShortDate } from '../../../features/member/utils/tripDates';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import { toPlanFlight } from '../flight/flightOptions';
import { fitSpotsToDays } from '../spots/spotList';
import { toPlanStay } from '../stay/stayOptions';
import { useSpotPlaces } from '../spots/useSpotPlaces';
import { saveWizardTrip } from '../summary/saveWizardTrip';
import { scheduleSpots } from '../summary/scheduleSpots';
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

  const days = getTripDays(draft.startDate, draft.endDate);
  const spots = fitSpotsToDays(draft.spots, days.length);
  const placesById = useSpotPlaces(spots.map((spot) => spot.placeId));
  const isLoadingPlaces = Object.values(placesById).some((item) => item.isPending);

  const cityName = t(`common.city.${draft.city}`);
  const defaultTitle = t('wizard.summary.defaultTitle', { city: cityName });
  // 항공(STEP2)은 시각이 다 있을 때만 저장·표시한다.
  const planFlight = toPlanFlight(draft.flight, draft);
  const planStay = toPlanStay(draft.stay, draft);
  // 장소 시각 (48·51). 화면에 보여 준 시각 그대로 저장하려고 여기서 한 번만 계산해 둘 다 넘긴다.
  // 항공·숙소는 저장되는 것(planFlight·planStay가 있을 때)만 기준으로 쓴다.
  const { schedule, departLimit } = scheduleSpots({
    spots,
    dayCount: days.length,
    flight: planFlight ? draft.flight : null,
    stay: planStay ? draft.stay : null,
    style: draft.style,
  });
  const transportLabel = draft.transportMode
    ? t(`wizard.transport.mode.${draft.transportMode}.title`)
    : t('wizard.summary.transportNone');

  // 이전 여행은 보관함에 남아서(#59) "바꿔서 저장" 확인 없이 바로 저장한다.
  const handleSave = () => {
    const tripId = saveWizardTrip({
      draft,
      spots,
      schedule,
      title: draft.title.trim() || defaultTitle,
      placesById,
    });
    navigate(`/trip/${tripId}`);
    // 저장이 끝난 마법사는 비워서 홈의 "이어서 만들기"에 남지 않게 한다.
    resetWizard();
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

      <div className="flex flex-col gap-1 rounded-2xl bg-bg-soft p-4 text-body-sm">
        <p>
          {t('wizard.summary.info', {
            city: cityName,
            start: formatShortDate(draft.startDate, i18n.language),
            end: formatShortDate(draft.endDate, i18n.language),
            people: draft.people,
            transport: transportLabel,
          })}
        </p>
        {planFlight && (
          <p>
            {t('wizard.summary.flight', {
              arrive: draft.flight.arriveTime,
              depart: draft.flight.departTime,
              flightNo: planFlight.flightNo ?? t('wizard.summary.flightNoUnknown'),
            })}
          </p>
        )}
        {planStay && (
          <p>
            {t('wizard.summary.stay', {
              name: planStay.name,
              checkIn: draft.stay.checkInTime,
              checkOut: draft.stay.checkOutTime,
            })}
          </p>
        )}
      </div>

      <SummaryDays
        days={days}
        spots={spots}
        schedule={schedule}
        departLimit={departLimit}
        placesById={placesById}
        isGoogle={draft.country === 'JP'}
      />

      <WizardNav
        onPrev={onPrev}
        onNext={handleSave}
        nextLabel={t('wizard.nav.save')}
        nextLoading={isLoadingPlaces}
      />
    </div>
  );
}
