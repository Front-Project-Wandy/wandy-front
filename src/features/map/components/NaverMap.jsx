import { useEffect, useRef } from 'react';
import {
  DAY_BORDER_CLASSES,
  FIT_PADDING,
  MARKER_SIZE,
  ROUTE_STROKE_OPACITY,
  ROUTE_STROKE_WEIGHT,
  SELECTED_MIN_ZOOM,
  SELECTED_Z_INDEX,
  SINGLE_POINT_ZOOM,
} from '../constants';
import { getDayColor } from '../utils/getDayColor';

// 번호는 숫자뿐이라 HTML에 그대로 넣어도 안전하다. 색은 DAY 번호로 정한 테두리 클래스로 준다.
// 선택된 마커는 커지고 primary 색 고리가 생긴다.
const createMarkerContent = (number, dayIndex, isSelected) =>
  `<div class="grid size-8 place-items-center rounded-full border-4 bg-background text-body-sm font-bold text-text shadow-md ${DAY_BORDER_CLASSES[dayIndex % DAY_BORDER_CLASSES.length]} ${isSelected ? 'scale-125 ring-4 ring-primary' : ''}">${number}</div>`;

// 한국 지도 (네이버). SDK가 준비된 뒤에만 그려진다. routes는 DAY별 번호 마커와 동선 선이다 (14).
// selectedId의 마커를 강조하고, 마커를 누르면 onSelectMarker(id)를 부른다 (15).
export default function NaverMap({ center, zoom, routes = [], selectedId = null, onSelectMarker }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  // 마커 id → { marker, number, dayIndex }. 선택이 바뀔 때 마커를 다시 그리지 않고 모양만 바꾸려고 둔다.
  const markersRef = useRef(new Map());
  // 마커를 다시 그릴 때(장소가 바뀔 때) 지금 선택된 것을 처음부터 강조하고, 클릭 처리는 항상 최신 함수를 부른다
  const selectedIdRef = useRef(selectedId);
  const onSelectRef = useRef(onSelectMarker);
  useEffect(() => {
    selectedIdRef.current = selectedId;
    onSelectRef.current = onSelectMarker;
  });

  // 지도는 한 번만 만들고 이후에는 중심만 옮긴다. 다시 만들면 같은 자리에 지도가 겹쳐 쌓인다.
  useEffect(() => {
    const { maps } = window.naver;
    const position = new maps.LatLng(center.lat, center.lng);
    if (!mapRef.current) {
      mapRef.current = new maps.Map(elementRef.current, { center: position, zoom });
    } else {
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // 장소가 바뀔 때마다 마커·선을 지우고 다시 그린 뒤 모든 장소가 보이도록 지도를 맞춘다
  useEffect(() => {
    const map = mapRef.current;
    const { maps } = window.naver;
    const overlays = [];
    const markers = markersRef.current;
    const bounds = new maps.LatLngBounds();
    let pointCount = 0;

    routes.forEach(({ dayIndex, points }) => {
      const path = points.map(({ lat, lng }) => new maps.LatLng(lat, lng));
      if (path.length > 1) {
        overlays.push(
          new maps.Polyline({
            map,
            path,
            strokeColor: getDayColor(dayIndex),
            strokeWeight: ROUTE_STROKE_WEIGHT,
            strokeOpacity: ROUTE_STROKE_OPACITY,
          }),
        );
      }
      points.forEach(({ id, number }, index) => {
        const isSelected = id === selectedIdRef.current;
        const marker = new maps.Marker({
          map,
          position: path[index],
          zIndex: isSelected ? SELECTED_Z_INDEX : 0,
          icon: {
            content: createMarkerContent(number, dayIndex, isSelected),
            anchor: new maps.Point(MARKER_SIZE / 2, MARKER_SIZE / 2),
          },
        });
        maps.Event.addListener(marker, 'click', () => onSelectRef.current?.(id));
        markers.set(id, { marker, number, dayIndex });
        overlays.push(marker);
        bounds.extend(path[index]);
        pointCount += 1;
      });
    });

    if (pointCount === 0) {
      map.setCenter(new maps.LatLng(center.lat, center.lng));
      map.setZoom(zoom);
    } else if (pointCount === 1) {
      map.setCenter(bounds.getCenter());
      map.setZoom(SINGLE_POINT_ZOOM);
    } else {
      map.fitBounds(bounds, {
        top: FIT_PADDING,
        right: FIT_PADDING,
        bottom: FIT_PADDING,
        left: FIT_PADDING,
      });
    }

    return () => {
      overlays.forEach((overlay) => overlay.setMap(null));
      markers.clear();
    };
  }, [routes, center, zoom]);

  // 선택이 바뀌면 마커 모양만 바꾸고, 선택된 장소로 지도를 옮긴다 (경로가 바뀐 경우는 위에서 이미 맞췄다)
  useEffect(() => {
    const map = mapRef.current;
    const { maps } = window.naver;
    markersRef.current.forEach(({ marker, number, dayIndex }, id) => {
      const isSelected = id === selectedId;
      marker.setIcon({
        content: createMarkerContent(number, dayIndex, isSelected),
        anchor: new maps.Point(MARKER_SIZE / 2, MARKER_SIZE / 2),
      });
      marker.setZIndex(isSelected ? SELECTED_Z_INDEX : 0);
    });
    const selected = markersRef.current.get(selectedId);
    if (selected) {
      map.morph(selected.marker.getPosition(), Math.max(map.getZoom(), SELECTED_MIN_ZOOM));
    }
  }, [selectedId]);

  // 개발 모드는 효과를 한 번 껐다 켜서, 지운 지도를 다시 쓰지 않게 비워 둔다
  useEffect(
    () => () => {
      mapRef.current?.destroy();
      mapRef.current = null;
    },
    [],
  );

  return <div ref={elementRef} className="size-full" />;
}
