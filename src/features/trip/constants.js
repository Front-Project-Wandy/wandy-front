// 체류 시간 입력 범위(분). 최소 10분은 잠깐 들르는 곳, 최대 12시간은 하루 종일 머무는 곳 기준.
export const MIN_STAY_MINUTES = 10;
export const MAX_STAY_MINUTES = 720;
export const MAX_MEMO_LENGTH = 100;

// 날씨를 조회할 때 쓰는 도시 중심 좌표. 숙소·장소 좌표가 아직 없을 때만 쓴다 (58).
export const CITY_CENTERS = {
  seoul: { lat: 37.5665, lng: 126.978 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
};
