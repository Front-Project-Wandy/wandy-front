import { useEffect, useRef } from 'react';

// 일본 지도 (구글). SDK가 준비된 뒤에만 그려진다.
export default function GoogleMap({ center, zoom }) {
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

  return <div ref={elementRef} className="size-full" />;
}
