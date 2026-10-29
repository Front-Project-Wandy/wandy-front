const STORAGE_PREFIX = 'wandy-visited:';

// 여행별로 「다녀옴」 체크한 장소 id 목록 (요구사항 #93). 저장소를 못 쓰거나 값이 깨져 있으면 빈 목록으로 본다.
export const readVisitedIds = (tripId) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${tripId}`));
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

export const writeVisitedIds = (tripId, visitedIds) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${tripId}`, JSON.stringify(visitedIds));
  } catch {
    // 시크릿 모드 등에서 저장이 막혀도 화면 동작은 그대로 둔다
  }
};
