import { useCallback, useState } from 'react';

// 복사·공유 동작과 결과 안내 (요구사항 #72).
// 공유는 브라우저의 공유 시트(Web Share API)를 쓴다. 휴대폰에서는 카카오톡·LINE이 목록에 같이 나와서 SDK나 키가 필요 없다.
// 지원하지 않는 브라우저에서는 canShare가 false라서 버튼을 숨긴다.
export function useShareActions({ title, text }) {
  const [status, setStatus] = useState(null);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('copyFailed');
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, text });
      setStatus(null);
    } catch (error) {
      // 사용자가 공유 창을 닫은 것(AbortError)은 실패가 아니다
      if (error?.name !== 'AbortError') setStatus('shareFailed');
    }
  };

  // 창이 열릴 때 effect에서 쓰므로 매번 새로 만들어지지 않게 한다
  const resetStatus = useCallback(() => setStatus(null), []);

  return { status, canShare, copy, share, resetStatus };
}
