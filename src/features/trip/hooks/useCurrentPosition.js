import { useState } from 'react';

// 현재 위치 한 번 읽기 (요구사항 #93). 권한 창은 버튼을 눌렀을 때만 띄운다.
// status: 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported' | 'error'
export function useCurrentPosition() {
  const [state, setState] = useState({ status: 'idle', position: null });

  const request = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({ status: 'unsupported', position: null });
      return;
    }
    setState({ status: 'loading', position: null });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setState({ status: 'ready', position: { lat: coords.latitude, lng: coords.longitude } }),
      (error) =>
        setState({
          status: error.code === error.PERMISSION_DENIED ? 'denied' : 'error',
          position: null,
        }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  return { ...state, request };
}
