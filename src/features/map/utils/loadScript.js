const loading = new Map();

// 같은 주소의 스크립트는 한 번만 불러온다. 지도가 여러 번 그려져도 SDK가 중복으로 들어가지 않게 한다.
export const loadScript = (src) => {
  if (loading.has(src)) return loading.get(src);

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // 실패한 기록을 남기면 다시 시도해도 계속 실패로 돌려주므로 지운다
      loading.delete(src);
      script.remove();
      reject(new Error('MAP_SCRIPT_LOAD_FAILED'));
    };
    document.head.appendChild(script);
  });

  loading.set(src, promise);
  return promise;
};
