import { useEffect, useRef } from 'react';
import {
  FIT_PADDING,
  GOOGLE_MARKER_SCALE,
  MARKER_FONT_SIZE,
  MARKER_RING_WEIGHT,
  ROUTE_STROKE_OPACITY,
  ROUTE_STROKE_WEIGHT,
  SINGLE_POINT_ZOOM,
} from '../constants';
import { getDayColor, getThemeColor } from '../utils/getDayColor';

// 일본 지도 (구글). SDK가 준비된 뒤에만 그려진다. routes는 DAY별 번호 마커와 동선 선이다 (14).
// NOTE: 마커는 기존 google.maps.Marker를 쓴다. 새 AdvancedMarkerElement는 Map ID 발급이 필요해서 보류했다.
export default function GoogleMap({ center, zoom, routes = [] }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);

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

  // 장소가 바뀔 때마다 마커·선을 지우고 다시 그린 뒤 모든 장소가 보이도록 지도를 맞춘다
  useEffect(() => {
    const map = mapRef.current;
    const { maps } = window.google;
    const overlays = [];
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
      points.forEach(({ number }, index) => {
        overlays.push(
          new maps.Marker({
            map,
            position: path[index],
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: GOOGLE_MARKER_SCALE,
              fillColor,
              fillOpacity: 1,
              strokeColor: dayColor,
              strokeWeight: MARKER_RING_WEIGHT,
            },
            label: {
              text: String(number),
              color: textColor,
              fontWeight: 'bold',
              fontSize: MARKER_FONT_SIZE,
            },
          }),
        );
        bounds.extend(path[index]);
        pointCount += 1;
      });
    });

    if (pointCount === 0) {
      map.setCenter({ lat: center.lat, lng: center.lng });
      map.setZoom(zoom);
    } else if (pointCount === 1) {
      map.setCenter(bounds.getCenter());
      map.setZoom(SINGLE_POINT_ZOOM);
    } else {
      map.fitBounds(bounds, FIT_PADDING);
    }

    return () => overlays.forEach((overlay) => overlay.setMap(null));
  }, [routes, center, zoom]);

  return <div ref={elementRef} className="size-full" />;
}
