import { TRAVEL_STYLES } from '../constants.js';
import { normalizePreferences } from './preferences.js';

// 새 여행을 시작하는 순간에만 호출한다. 이어서 만드는 여행에는 저장된 초안을 그대로 쓴다.
// 사용자가 이번 여행에서 직접 고른 값(빈 카테고리 배열 포함)이 프로필보다 우선한다.
export function createPreferredTripDraft(basicInfo, preferences) {
  const defaults = normalizePreferences(preferences);
  const selected = normalizePreferences({
    style: TRAVEL_STYLES.includes(basicInfo.style) ? basicInfo.style : defaults.style,
    categories: Array.isArray(basicInfo.preferredCategories)
      ? basicInfo.preferredCategories
      : defaults.categories,
  });

  return { ...basicInfo, style: selected.style, preferredCategories: selected.categories };
}
