import { PLACE_CATEGORIES } from '../../search/place.js';
import { PREFERENCES_STORAGE_KEY, TRAVEL_STYLES } from '../constants.js';

// 오래된 값이나 잘못 저장된 값이 선택 UI와 이후 추천 기능에 전달되지 않게 한다.
export function normalizePreferences(value) {
  return {
    style: TRAVEL_STYLES.includes(value?.style) ? value.style : 'normal',
    categories: PLACE_CATEGORIES.filter(
      (category) => Array.isArray(value?.categories) && value.categories.includes(category),
    ),
  };
}

export function loadPreferences() {
  try {
    return normalizePreferences(JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY)));
  } catch {
    return normalizePreferences(null);
  }
}

export function savePreferences(value) {
  const preferences = normalizePreferences(value);
  // 저장소 접근이 막히거나 용량이 부족하면 호출부에서 실패를 안내한다.
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  return preferences;
}

export function arePreferencesEqual(left, right) {
  return (
    left.style === right.style &&
    left.categories.length === right.categories.length &&
    left.categories.every((category) => right.categories.includes(category))
  );
}
