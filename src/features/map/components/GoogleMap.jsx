import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FIT_PADDING,
  GOOGLE_MARKER_SCALE,
  GOOGLE_MARKER_SCALE_SELECTED,
  MARKER_FONT_SIZE,
  MARKER_RING_WEIGHT,
  ROUTE_STROKE_OPACITY,
  ROUTE_STROKE_WEIGHT,
  SELECTED_MIN_ZOOM,
  SELECTED_Z_INDEX,
  SINGLE_POINT_ZOOM,
  STAY_MARKER_Z_INDEX,
} from '../constants';
import { getDayColor, getThemeColor } from '../utils/getDayColor';

// 구글 기본 기호에는 사각형이 없어서 -1~1 정사각형을 직접 그린다. scale이 반지름이라 번호 원과 같은 크기가 된다.
const SQUARE_PATH = 'M -1,-1 L 1,-1 L 1,1 L -1,1 z';

// 일본 지도 (구글). SDK가 준비된 뒤에만 그려진다. routes는 DAY별 번호 마커와 동선 선이다 (14).
// NOTE: 마커는 기존 google.maps.Marker를 쓴다. 새 AdvancedMarkerElement는 Map ID 발급이 필요해서 보류했다.
// selectedId의 마커를 강조하고, 마커를 누르면 onSelectMarker(id)를 부른다 (15).
// onBoundsChange를 넘기면 지도가 멈출 때마다 보이는 범위 { south, west, north, east }를 알린다 (74).
export default function GoogleMap({
  center,
  zoom,
  routes = [],
  stay = null,
  selectedId = null,
  onSelectMarker,
  onBoundsChange,
}) {
  const { t } = useTranslation();
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  // 마커 id → { marker, icon }. 선택이 바뀔 때 마커를 다시 그리지 않고 모양만 바꾸려고 둔다.
  const markersRef = useRef(new Map());
  // 마커를 다시 그릴 때(장소가 바뀔 때) 지금 선택된 것을 처음부터 강조하고, 클릭 처리는 항상 최신 함수를 부른다
  const selectedIdRef = useRef(selectedId);
  const onSelectRef = useRef(onSelectMarker);
  const onBoundsChangeRef = useRef(onBoundsChange);
  useEffect(() => {
    selectedIdRef.current = selectedId;
    onSelectRef.current = onSelectMarker;
    onBoundsChangeRef.current = onBoundsChange;
  });

  // 지도는 한 번만 만들고 이후에는 중심만 옮긴다. 다시 만들면 같은 자리에 지도가 겹쳐 쌓인다.
  useEffect(() => {
    const position = { lat: center.lat, lng: center.lng };
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(elementRef.current, { center: position, zoom });
    } else {
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // idle은 끌기·확대·맞추기가 다 끝난 뒤 한 번 온다. 위에서 만든 지도에 붙여야 해서 지도 만들기 다음에 둔다.
  // 처음 그려지기 전에는 getBounds()가 비어 있어서 건너뛴다.
  useEffect(() => {
    const map = mapRef.current;
    const listener = map.addListener('idle', () => {
      const bounds = map.getBounds();
      if (bounds) onBoundsChangeRef.current?.(bounds.toJSON());
    });
    return () => listener.remove();
  }, []);

  // 장소가 바뀔 때마다 마커·선을 지우고 다시 그린 뒤 모든 장소가 보이도록 지도를 맞춘다
  useEffect(() => {
    const map = mapRef.current;
    const { maps } = window.google;
    const overlays = [];
    const markers = markersRef.current;
    const bounds = new maps.LatLngBounds();
    const fillColor = getThemeColor('background');
    const textColor = getThemeColor('text');
    let pointCount = 0;

    routes.forEach(({ dayIndex, points }) => {
      const dayColor = getDayColor(dayIndex);
      const path = points.map(({ lat, lng }) => ({ lat, lng }));
      if (path.length > 1) {
        overlays.push(
          new maps.Polyline({
            map,
            path,
            strokeColor: dayColor,
            strokeWeight: ROUTE_STROKE_WEIGHT,
            strokeOpacity: ROUTE_STROKE_OPACITY,
          }),
        );
      }
      points.forEach(({ id, number }, index) => {
        const isSelected = id === selectedIdRef.current;
        const icon = {
          path: maps.SymbolPath.CIRCLE,
          scale: GOOGLE_MARKER_SCALE,
          fillColor,
          fillOpacity: 1,
          strokeColor: dayColor,
          strokeWeight: MARKER_RING_WEIGHT,
        };
        const marker = new maps.Marker({
          map,
          position: path[index],
          zIndex: isSelected ? SELECTED_Z_INDEX : 0,
          icon: isSelected ? { ...icon, scale: GOOGLE_MARKER_SCALE_SELECTED } : icon,
          label: {
            text: String(number),
            color: textColor,
            fontWeight: 'bold',
            fontSize: MARKER_FONT_SIZE,
          },
        });
        marker.addListener('click', () => onSelectRef.current?.(id));
        markers.set(id, { marker, icon });
        overlays.push(marker);
        bounds.extend(path[index]);
        pointCount += 1;
      });
    });

    if (stay) {
      const position = { lat: stay.lat, lng: stay.lng };
      overlays.push(
        new maps.Marker({
          map,
          position,
          title: t('map.stay.title', { name: stay.name }),
          zIndex: STAY_MARKER_Z_INDEX,
          icon: {
            path: SQUARE_PATH,
            scale: GOOGLE_MARKER_SCALE,
            fillColor: textColor,
            fillOpacity: 1,
            strokeWeight: 0,
          },
          label: {
            text: t('map.stay.mark'),
            color: fillColor,
            fontWeight: 'bold',
            fontSize: MARKER_FONT_SIZE,
          },
        }),
      );
      bounds.extend(position);
      pointCount += 1;
    }

    if (pointCount === 0) {
      map.setCenter({ lat: center.lat, lng: center.lng });
      map.setZoom(zoom);
    } else if (pointCount === 1) {
      map.setCenter(bounds.getCenter());
      map.setZoom(SINGLE_POINT_ZOOM);
    } else {
      map.fitBounds(bounds, FIT_PADDING);
    }

    return () => {
      overlays.forEach((overlay) => overlay.setMap(null));
      markers.clear();
    };
  }, [routes, stay, center, zoom, t]);

  // 선택이 바뀌면 마커 모양만 바꾸고, 선택된 장소로 지도를 옮긴다 (경로가 바뀐 경우는 위에서 이미 맞췄다)
  useEffect(() => {
    const map = mapRef.current;
    markersRef.current.forEach(({ marker, icon }, id) => {
      const isSelected = id === selectedId;
      marker.setIcon(isSelected ? { ...icon, scale: GOOGLE_MARKER_SCALE_SELECTED } : icon);
      marker.setZIndex(isSelected ? SELECTED_Z_INDEX : 0);
    });
    const selected = markersRef.current.get(selectedId);
    if (selected) {
      map.panTo(selected.marker.getPosition());
      if ((map.getZoom() ?? 0) < SELECTED_MIN_ZOOM) map.setZoom(SELECTED_MIN_ZOOM);
    }
  }, [selectedId]);

  return <div ref={elementRef} className="size-full" />;
}
