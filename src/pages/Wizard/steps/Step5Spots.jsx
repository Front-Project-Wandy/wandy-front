import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabBar from '../../../components/common/TabBar';
import { useFavoriteStore } from '../../../features/member/hooks/useFavoriteStore';
import PlaceSearchPanel from '../../../features/search/components/PlaceSearchPanel';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import AddSpotModal from '../spots/AddSpotModal';
import FavoriteSpots from '../spots/FavoriteSpots';
import SelectedSpots from '../spots/SelectedSpots';
import { findSpot, putSpot, removeSpot } from '../spots/spotList';
import { useSpotPlaces } from '../spots/useSpotPlaces';
import { getTripDays } from '../tripDays';
import WizardNav from '../WizardNav';

// STEP5 가고 싶은 장소 (27). 검색·추천(B파트 PlaceSearchPanel)이나 찜에서 장소를 고르고, DAY를 정해 담는다.
// 담은 장소는 wizardStore draft.spots에 { placeId, dayIndex }로만 바로 저장한다 (중간 저장, 약관).
// [건너뛰기]는 아무것도 안 담았을 때만 보인다 — 담은 게 있으면 [다음]과 같고, 지우면 고른 장소를 잃는다.
export default function Step5Spots({ onPrev, onNext }) {
  const { t } = useTranslation();
  const draft = useWizardStore((state) => state.draft);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  const favoriteCount = useFavoriteStore((state) => state.ids.length);
  const spots = draft.spots;
  const days = getTripDays(draft.startDate, draft.endDate);
  const placesById = useSpotPlaces(spots.map((spot) => spot.placeId));

  const [tab, setTab] = useState('search');
  const [targetPlace, setTargetPlace] = useState(null);
  const [hasError, setHasError] = useState(false);
  const targetSpot = targetPlace ? findSpot(spots, targetPlace.id) : null;

  const saveSpots = (nextSpots) => {
    updateDraft({ spots: nextSpots });
    setHasError(false);
  };

  const handleSubmit = (dayIndex) => {
    saveSpots(putSpot(spots, targetPlace.id, dayIndex));
    setTargetPlace(null);
  };

  const handleRemoveTarget = () => {
    saveSpots(removeSpot(spots, targetPlace.id));
    setTargetPlace(null);
  };

  const handleNext = () => {
    if (spots.length === 0) {
      setHasError(true);
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <SelectedSpots
        spots={spots}
        days={days}
        placesById={placesById}
        isGoogle={draft.country === 'JP'}
        onEdit={(placeId) => setTargetPlace(placesById[placeId].place)}
        onRemove={(placeId) => saveSpots(removeSpot(spots, placeId))}
      />

      <div className="flex flex-col gap-4">
        <TabBar
          tabs={[
            { key: 'search', label: t('wizard.spots.tab.search') },
            { key: 'favorites', label: t('wizard.spots.tab.favorites', { count: favoriteCount }) },
          ]}
          activeKey={tab}
          onChange={setTab}
        />
        {tab === 'search' ? (
          <PlaceSearchPanel
            country={draft.country}
            city={draft.city}
            onSelectPlace={setTargetPlace}
          />
        ) : (
          <FavoriteSpots city={draft.city} onSelectPlace={setTargetPlace} />
        )}
      </div>

      {hasError && (
        <p role="alert" className="text-body-sm text-error">
          {t('wizard.spots.error')}
        </p>
      )}
      <WizardNav
        onPrev={onPrev}
        onSkip={spots.length === 0 ? onNext : undefined}
        onNext={handleNext}
      />

      <AddSpotModal
        key={targetPlace?.id ?? 'closed'}
        place={targetPlace}
        days={days}
        currentDayIndex={targetSpot?.dayIndex ?? null}
        onSubmit={handleSubmit}
        onRemove={handleRemoveTarget}
        onClose={() => setTargetPlace(null)}
      />
    </div>
  );
}
