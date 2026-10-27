import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import TabBar from '../../../components/common/TabBar';
import GoogleAttribution from '../../../features/search/components/GoogleAttribution';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import DayTimeline from '../nearby/DayTimeline';
import NearbyRestaurantModal from '../nearby/NearbyRestaurantModal';
import { fitSpotsToDays, insertSpotAfter, removeSpot } from '../spots/spotList';
import { useSpotPlaces } from '../spots/useSpotPlaces';
import { toStayOrigin } from '../stay/stayOptions';
import { getTripDays } from '../tripDays';
import WizardNav from '../WizardNav';

// STEP6 주변 식당 + 다음 교통 (28). DAY마다 담은 장소 사이 이동(C파트 TransportLeg)을 보여주고,
// 장소마다 [근처 식당]으로 B파트 NearbyRestaurants를 열어 고른 식당을 그 장소 바로 다음에 넣는다.
// 이동은 보여주기만 한다 — 플래너가 같은 함수로 다시 계산해서 따로 저장하지 않는다.
// 고르지 않아도 넘어갈 수 있는 "확인하고 더 담는" 단계라 [다음]만 둔다.
export default function Step6Nearby({ onPrev, onNext }) {
  const { t } = useTranslation();
  const draft = useWizardStore((state) => state.draft);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  const days = getTripDays(draft.startDate, draft.endDate);
  const spots = fitSpotsToDays(draft.spots, days.length);
  const placesById = useSpotPlaces(spots.map((spot) => spot.placeId));
  const [activeDay, setActiveDay] = useState(0);
  const [anchorPlace, setAnchorPlace] = useState(null);

  const anchorSpot = anchorPlace ? spots.find((spot) => spot.placeId === anchorPlace.id) : null;

  const handleSelectRestaurant = (restaurant) => {
    updateDraft({
      spots: insertSpotAfter(spots, anchorPlace.id, restaurant.id, anchorSpot.dayIndex),
    });
    setAnchorPlace(null);
  };

  if (spots.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <EmptyState
          title={t('wizard.nearby.emptyTitle')}
          description={t('wizard.nearby.emptyDescription')}
          className="rounded-2xl bg-bg-soft"
        />
        <WizardNav onPrev={onPrev} onNext={onNext} />
      </div>
    );
  }

  const dayPlaces = spots
    .filter((spot) => spot.dayIndex === activeDay)
    .map(({ placeId }) => ({ placeId, place: placesById[placeId]?.place ?? null }));

  return (
    <div className="flex flex-col gap-5">
      <p className="text-body-sm text-text/70 break-keep">{t('wizard.nearby.hint')}</p>
      <TabBar
        tabs={days.map(({ dayIndex }) => ({
          key: String(dayIndex),
          label: t('wizard.nearby.dayTab', { day: dayIndex + 1 }),
        }))}
        activeKey={String(activeDay)}
        onChange={(key) => setActiveDay(Number(key))}
      />
      <DayTimeline
        dayIndex={activeDay}
        places={dayPlaces}
        stay={toStayOrigin(draft.stay)}
        country={draft.country}
        transportMode={draft.transportMode}
        onOpenRestaurants={setAnchorPlace}
        onRemove={(placeId) => updateDraft({ spots: removeSpot(spots, placeId) })}
      />
      {draft.country === 'JP' && dayPlaces.length > 0 && <GoogleAttribution />}
      <p className="text-caption text-text/70">{t('wizard.nearby.estimateNotice')}</p>

      <WizardNav onPrev={onPrev} onNext={onNext} />

      <NearbyRestaurantModal
        place={anchorPlace}
        onSelect={handleSelectRestaurant}
        onClose={() => setAnchorPlace(null)}
      />
    </div>
  );
}
