import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { CITY_CENTERS, DEFAULT_ZOOM, MAP_PROVIDERS } from '../constants';
import { useMapSdk } from '../hooks/useMapSdk';
import { useRoutes } from '../hooks/useRoutes';
import GoogleMap from './GoogleMap';
import NaverMap from './NaverMap';

// 나라에 맞는 지도(KR 네이버 / JP 구글)를 보여주고, days의 장소를 DAY별 번호 마커·동선 선으로 그린다 (6, 14), 선택한 장소를 강조한다 (15).
// 지도가 아닌 상태(키 없음·불러오는 중·실패)는 같은 상자 안에 가운데 정렬로 보여준다.
export default function MapView({
  country,
  city,
  days = [],
  selectedId = null,
  onSelectMarker,
  className = '',
}) {
  const { t } = useTranslation();
  const provider = MAP_PROVIDERS[country];
  const center = CITY_CENTERS[city];
  const { status, retry } = useMapSdk(provider);
  const routes = useRoutes(days);

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
    <section
      aria-label={t('map.label')}
      className={`h-96 overflow-hidden rounded-2xl bg-bg-soft ${className}`}
    >
      {state ? (
        <div className="flex h-full items-center justify-center">{state}</div>
      ) : (
        <MapComponent
          center={center}
          zoom={DEFAULT_ZOOM}
          routes={routes}
          selectedId={selectedId}
          onSelectMarker={onSelectMarker}
        />
      )}
    </section>
  );
}
