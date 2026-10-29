import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Loading from '../../components/common/Loading';
import GoogleAttribution from '../../features/search/components/GoogleAttribution';
import PlaceCard from '../../features/search/components/PlaceCard';
import { getCurationItems } from './curation/curationList';
import { useCurationPlaces } from './curation/useCurationPlaces';
import PhotoCredits from './PhotoCredits';
import { CURATION_PHOTOS } from './curation/placePhotos';
import StartTripConfirmModal from './StartTripConfirmModal';
import { useStartTrip } from './useStartTrip';

// 홈 "테마로 골라 보는 여행" (81 테마 큐레이션 · 82 시즌 추천).
// 칩 하나를 고르면 그 테마(또는 이번 계절)의 장소 4곳을 보여 주고, 그 도시·카테고리로 여행을 바로 시작할 수 있다.
// 첫 칩은 이번 달의 계절이라 처음 들어오면 시즌 추천이 먼저 보인다.
export default function CurationSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestStart, isConfirmOpen, confirmStart, continueDraft, cancelStart } = useStartTrip();
  // 달이 바뀌는 순간까지 따라갈 필요는 없어서, 처음 그릴 때 한 번만 만든다.
  const [items] = useState(() => getCurationItems());
  const [selectedKey, setSelectedKey] = useState(items[0].key);
  const selected = items.find((item) => item.key === selectedKey);
  const { places, isPending, isError, refetch } = useCurationPlaces(selected);
  const cityName = t(`common.city.${selected.city}`);

  const renderPlaces = () => {
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={refetch} />;
    if (places.length === 0) return <EmptyState title={t('home.curation.empty')} />;
    return (
      <>
        {/* grid-cols-1을 꼭 쓴다: 열을 정하지 않으면 칸 너비가 긴 주소 글자만큼 늘어 좁은 폰에서 카드가 넘친다. */}
        <ul key={selectedKey} className="motion-results grid grid-cols-1 gap-3 sm:grid-cols-2">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              imageUrl={CURATION_PHOTOS[place.id]?.src ?? place.imageUrl}
              onSelect={() => navigate(`/place/${encodeURIComponent(place.id)}`)}
            />
          ))}
        </ul>
        {places.some((place) => place.source === 'google') && <GoogleAttribution />}
        <PhotoCredits places={places} />
      </>
    );
  };

  return (
    <section aria-labelledby="curation-title" className="flex flex-col gap-5">
      <div className="mb-2">
        <p className="mb-3 text-caption font-bold tracking-widest text-link">
          {t('home.editorial.curationEyebrow')}
        </p>
        <h2 id="curation-title" className="text-title font-bold lg:text-display">
          {t('home.curation.title')}
        </h2>
        <p className="mt-3 text-body-sm text-text/60">{t('home.editorial.curationDescription')}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {items.map((item) => (
          <Chip
            key={item.key}
            label={t(`home.curation.${item.type}.${item.key}.chip`)}
            selected={item.key === selectedKey}
            onClick={() => setSelectedKey(item.key)}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="overflow-hidden rounded-2xl bg-bg-soft">
          <img
            src={`/images/home/${selected.city}.jpg`}
            alt={t(`home.editorial.${selected.city}.alt`)}
            loading="lazy"
            className="aspect-video w-full object-cover lg:aspect-square"
          />
          <div className="p-6">
            <p className="text-caption font-bold text-primary">
              {t(`common.country.${selected.country}`)}
            </p>
            <h3 className="mt-2 text-title font-bold">{cityName}</h3>
            <p className="mt-3 text-body-sm leading-relaxed text-text/70">
              {t(`home.curation.${selected.type}.${selected.key}.description`, { city: cityName })}
            </p>
            <Button
              variant="secondary"
              className="mt-6 w-full"
              onClick={() =>
                requestStart({
                  country: selected.country,
                  city: selected.city,
                  preferredCategories: selected.categories,
                })
              }
            >
              {t('home.curation.start', { city: cityName })}
            </Button>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">{renderPlaces()}</div>
      </div>
      <StartTripConfirmModal
        open={isConfirmOpen}
        onConfirm={confirmStart}
        onContinue={continueDraft}
        onClose={cancelStart}
      />
    </section>
  );
}
