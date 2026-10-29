const STORAGE_PREFIX = 'wandy-prep-checks:';

// 여행별로 체크한 준비물 id 목록을 읽는다. 저장소를 못 쓰거나 값이 깨져 있으면 빈 목록으로 본다.
export const readPrepChecks = (tripId) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${tripId}`));
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

export const writePrepChecks = (tripId, checkedIds) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${tripId}`, JSON.stringify(checkedIds));
  } catch {
    // 시크릿 모드 등에서 저장이 막혀도 화면 동작은 그대로 둔다
  }
};

// 나라의 준비물 목록에 실제로 있는 항목 수와, 그중 체크한 수
export const countPrepProgress = (groups, checkedIds) => {
  const allIds = groups.flatMap((group) => group.items.map((item) => item.id));
  return {
    total: allIds.length,
    checked: allIds.filter((id) => checkedIds.includes(id)).length,
  };
};
