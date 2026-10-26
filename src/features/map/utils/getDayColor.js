import { DAY_COLOR_COUNT } from '../constants';

// 지도 선·마커에는 색 값 자체가 필요해서, 테마의 CSS 변수에서 읽어 온다 (색 코드를 따로 적지 않으려고).
const readColor = (variable) =>
  getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

export const getDayColor = (dayIndex) =>
  readColor(`--color-day-${(dayIndex % DAY_COLOR_COUNT) + 1}`);

export const getThemeColor = (name) => readColor(`--color-${name}`);
