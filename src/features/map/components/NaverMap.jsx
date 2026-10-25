import { useEffect, useRef } from 'react';

// 한국 지도 (네이버). SDK가 준비된 뒤에만 그려진다.
export default function NaverMap({ center, zoom }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);

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
