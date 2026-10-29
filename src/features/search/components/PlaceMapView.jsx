import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import GoogleMap from '../../map/components/GoogleMap';
import NaverMap from '../../map/components/NaverMap';
import { CITY_CENTERS, DEFAULT_ZOOM, MAP_PROVIDERS } from '../../map/constants';
import { useMapSdk } from '../../map/hooks/useMapSdk';
import PlaceCard from './PlaceCard';

// 검색 결과는 순서가 동선이 아니라서 선 없이 마커만 그린다. 장소마다 점 하나짜리 경로로 넘기면
// 지도 컴포넌트가 선을 긋지 않는다. 번호는 결과 목록 순서와 같고 색은 DAY1 색 하나로 둔다.
const toMarkerRoutes = (places) =>
  places.flatMap((place, index) =>
    Number.isFinite(place.lat) && Number.isFinite(place.lng)
      ? [
          {
            dayIndex: 0,
            points: [{ id: place.id, lat: place.lat, lng: place.lng, number: index + 1 }],
          },
        ]
      : [],
  );

// /places 지도 보기 (74). 검색 결과 전체를 마커로 그리고, 사용자가 지도를 움직이면 [이 지역에서 검색]을 띄운다.
// 마커는 범위로 좁히기 전 결과를 그대로 둔다 — 좁힐 때마다 지도가 결과에 맞춰 다시 움직이면 보던 자리를 잃는다.
// 지도 SDK가 없거나(키 없음) 실패하면 플래너 지도와 같은 안내를 보여 주고, 아래 결과 목록은 그대로 쓸 수 있다.
export default function PlaceMapView({ country, city, places, onSearchArea, onSelectPlace }) {
  const { t } = useTranslation();
  const provider = MAP_PROVIDERS[country];
  const center = CITY_CENTERS[city];
  const { status, retry } = useMapSdk(provider);
  const routes = useMemo(() => toMarkerRoutes(places), [places]);
  const [selectedId, setSelectedId] = useState(null);
  // 결과가 바뀌면(검색어·카테고리) 지도가 새 결과에 맞춰 움직이므로, 그 전에 잡아 둔 범위는 버린다.
  const [moved, setMoved] = useState({ places: null, bounds: null });
  const movedBounds = moved.places === places ? moved.bounds : null;
  // 결과에 맞춰 지도가 스스로 움직일 때도 idle이 와서, 손으로 움직였을 때만 버튼을 띄우려고 표시해 둔다.
  const userMovedRef = useRef(false);
  const selectedPlace = places.find((place) => place.id === selectedId) ?? null;

  const handleUserMove = () => {
    userMovedRef.current = true;
  };

  const handleBoundsChange = (bounds) => {
    if (!userMovedRef.current) return;
    userMovedRef.current = false;
    setMoved({ places, bounds });
  };

  const handleSearchArea = () => {
    onSearchArea(movedBounds);
    setMoved({ places: null, bounds: null });
  };

  const renderState = () => {
    if (!provider || !center)
      return (
        <EmptyState
          title={t('map.state.unsupported.title')}
          description={t('map.state.unsupported.description')}
        />
      );
    if (status === 'noKey')
      return (
        <EmptyState
          title={t('map.state.noKey.title')}
          description={t('map.state.noKey.description')}
        />
      );
    if (status === 'loading') return <Loading text={t('map.state.loading')} />;
    if (status === 'error') return <ErrorState message={t('map.state.error')} onRetry={retry} />;
    return null;
  };

  const state = renderState();
  const MapComponent = provider === 'google' ? GoogleMap : NaverMap;

  return (
    <div className="space-y-3">
      <section
        aria-label={t('places.mapView.label')}
        className="relative h-80 overflow-hidden rounded-2xl bg-bg-soft lg:h-112"
      >
        {state ? (
          <div className="flex h-full items-center justify-center">{state}</div>
        ) : (
          <>
            {/* 끌기·휠·키보드는 지도 SDK 안에서 처리돼서, 감싼 상자에서 「손으로 움직였다」만 기록한다. */}
            <div
              className="size-full"
              onPointerDown={handleUserMove}
              onWheel={handleUserMove}
              onKeyDown={handleUserMove}
            >
              <MapComponent
                center={center}
                zoom={DEFAULT_ZOOM}
                routes={routes}
                selectedId={selectedId}
                onSelectMarker={setSelectedId}
                onBoundsChange={handleBoundsChange}
              />
            </div>
            {movedBounds ? (
              <button
                type="button"
                onClick={handleSearchArea}
                className="absolute top-3 left-1/2 inline-flex h-10 -translate-x-1/2 items-center gap-1 rounded-full bg-background px-4 text-body-sm font-bold whitespace-nowrap text-link shadow-md motion-press focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span aria-hidden="true">↻</span>
                {t('places.mapView.searchArea')}
              </button>
            ) : null}
          </>
        )}
      </section>
      {selectedPlace ? (
        <ul aria-label={t('places.mapView.selected')}>
          <PlaceCard place={selectedPlace} onSelect={onSelectPlace} />
        </ul>
      ) : null}
    </div>
  );
}
