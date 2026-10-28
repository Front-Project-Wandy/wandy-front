// 여행 날짜 날씨 (58) — Open-Meteo 예보 API. 키가 필요 없고 브라우저에서 바로 부를 수 있어서(CORS 허용) 서버를 거치지 않는다.
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
];

// 응답은 필드마다 날짜 순서대로 나란히 들어 있어서(열 모양), 날짜 하나당 한 덩어리로 바꾼다.
export function parseForecast(json) {
  const daily = json?.daily;
  if (!daily?.time) return [];
  return daily.time.map((date, i) => ({
    date,
    code: daily.weather_code?.[i] ?? null,
    tempMax: daily.temperature_2m_max?.[i] ?? null,
    tempMin: daily.temperature_2m_min?.[i] ?? null,
    rainChance: daily.precipitation_probability_max?.[i] ?? null,
  }));
}

// startDate~endDate('yyyy-mm-dd')의 날짜별 예보 → [{ date, code, tempMax, tempMin, rainChance }]
// 예보는 오늘부터 16일 뒤까지만 있어서, 범위 밖 날짜는 부르는 쪽(getForecastRange)에서 미리 잘라 넘긴다.
export async function getWeatherForecast({ lat, lng, startDate, endDate }) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: DAILY_FIELDS.join(','),
    timezone: 'auto',
    start_date: startDate,
    end_date: endDate,
  });
  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) throw new Error(`날씨 예보를 불러오지 못했어요 (${response.status})`);
  return parseForecast(await response.json());
}
