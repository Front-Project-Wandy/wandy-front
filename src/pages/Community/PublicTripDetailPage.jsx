import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Loading from '../../components/common/Loading';
import MapView from '../../features/map/components/MapView';
import GoogleAttribution from '../../features/search/components/GoogleAttribution';
import CopyTripModal from './CopyTripModal';
import LikeButton from './LikeButton';
import PublicTripDayList from './PublicTripDayList';
import { findPublicTrip, getTripNights } from './publicTripUtils';
import { usePublicTripPlaces } from './usePublicTripPlaces';

const BACK_LINK_CLASS =
  'inline-flex items-center gap-1 rounded-xl py-2 text-body-sm font-bold text-link focus-visible:outline-2 focus-visible:outline-primary';

// /community/:id — 공개 일정 상세 (105). DAY별 장소 목록과 지도 동선, 좋아요.
// PC(lg)에서는 플래너처럼 목록·지도를 좌우로 나누고, 지도는 스크롤해도 따라온다.
export default function PublicTripDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const trip = findPublicTrip(id);
  const { placesById, mapDays, isPending, isError, refetch } = usePublicTripPlaces(trip);
  const [selectedId, setSelectedId] = useState(null);
  const [isCopyOpen, setIsCopyOpen] = useState(false);

  if (!trip) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
        <EmptyState
          title={t('community.detail.notFound.title')}
          description={t('community.detail.notFound.description')}
          action={
            <Link to="/community" className={BACK_LINK_CLASS}>
              {t('community.detail.back')}
            </Link>
          }
        />
      </main>
    );
  }

  const nights = getTripNights(trip);
  const hasLoaded = Object.keys(placesById).length > 0;

  const renderPlaces = () => {
    if (isError) return <ErrorState message={t('community.detail.error')} onRetry={refetch} />;
    if (isPending && !hasLoaded) return <Loading text={t('community.detail.loading')} />;
    return (
      <PublicTripDayList
        trip={trip}
        placesById={placesById}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    );
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 lg:px-6 lg:py-10">
      <div className="flex flex-col gap-4">
        <Link to="/community" className={`${BACK_LINK_CLASS} self-start`}>
          <span aria-hidden="true">←</span> {t('community.detail.back')}
        </Link>
        <p className="text-caption font-bold tracking-widest text-primary">
          {t(`common.city.${trip.city}`)} ·{' '}
          {t('community.card.nightsDays', { nights, days: nights + 1 })}
        </p>
        <h1 className="text-title font-bold break-keep lg:text-display">{trip.title}</h1>
        <p className="max-w-2xl text-body text-text/80">{trip.summary}</p>
        <p className="text-body-sm text-text/60">
          {t('community.detail.meta', {
            author: trip.author,
            companion: t(`wizard.style.companion.${trip.companion}`),
            people: trip.people,
            style: t(`wizard.style.style.${trip.style}.title`),
          })}
        </p>
        <div className="flex flex-wrap gap-3">
          <LikeButton trip={trip} />
          {/* 장소를 다 불러오기 전에 복사하면 빠진 장소가 생겨서, 다 불러온 뒤에 누를 수 있다. */}
          <Button disabled={isPending || isError} onClick={() => setIsCopyOpen(true)}>
            {t('community.copy.open')}
          </Button>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3">
          {renderPlaces()}
          {trip.country === 'JP' && hasLoaded ? <GoogleAttribution /> : null}
        </div>
        <MapView
          country={trip.country}
          city={trip.city}
          days={mapDays}
          selectedId={selectedId}
          onSelectMarker={setSelectedId}
          className="lg:sticky lg:top-6"
        />
      </div>
      {isCopyOpen ? (
        <CopyTripModal trip={trip} placesById={placesById} onClose={() => setIsCopyOpen(false)} />
      ) : null}
    </main>
  );
}
