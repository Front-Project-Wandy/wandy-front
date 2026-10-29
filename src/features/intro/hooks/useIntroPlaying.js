import { createContext, useContext } from 'react';

// 인트로가 도는 동안인지. 홈 화면은 인트로 뒤에 미리 그려져 있어서, 그동안 배너가 자동으로 넘어가면
// 인트로가 끝났을 때 노트북 화면 속 사진(첫 장)과 다른 사진이 보인다. 그래서 배너가 이 값을 보고 멈춘다.
export const IntroPlayingContext = createContext(false);

export const useIntroPlaying = () => useContext(IntroPlayingContext);
