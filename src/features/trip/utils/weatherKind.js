// 비 올 확률(%)이 이 값 이상인 날은 우산 안내를 붙인다
export const RAIN_ALERT_PERCENT = 60;

// WMO 날씨 코드 → 종류 (Open-Meteo가 쓰는 표준 코드). 종류마다 번역 키(planner.weather.kind.*)와 아이콘이 있다.
export function getWeatherKind(code) {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunder';
  return 'unknown';
}

export const WEATHER_ICONS = {
  clear: '☀️',
  partly: '⛅',
  cloudy: '☁️',
  fog: '🌫️',
  drizzle: '🌦️',
  rain: '🌧️',
  snow: '❄️',
  thunder: '⛈️',
  unknown: '–',
};

export const isRainAlert = (rainChance) =>
  Number.isFinite(rainChance) && rainChance >= RAIN_ALERT_PERCENT;
