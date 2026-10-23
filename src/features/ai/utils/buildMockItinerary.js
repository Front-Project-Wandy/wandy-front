import { getDistanceMeters } from '../../search/utils/geo';
import { prioritizePreferredPlaces } from '../../search/utils/prioritizePreferredPlaces';

// 1단계 가짜 AI (55). 2단계에서는 서버의 Gemini가 같은 모양의 JSON을 돌려준다.
// Gemini는 우리 Place.id를 모르니 장소 이름만 돌려주고, 이름 → Place 확인은 validateItinerary가 한다.
// 돌려주는 모양: { days: [{ dayIndex, items: [{ name, startTime: 'HH:MM', stayMinutes }] }] }

// 하루에 넣을 관광지 수와 한 곳에 머무는 시간 (식사는 따로)
const STYLE_RULES = {
  relaxed: { spots: 3, stayMinutes: 120 },
  normal: { spots: 4, stayMinutes: 90 },
  packed: { spots: 5, stayMinutes: 60 },
};
const DAY_START = 10 * 60;
const MOVE_MINUTES = 30;
const MEAL_MINUTES = 60;
// 이 시각이 지나면 다음 장소보다 식사를 먼저 넣는다 (12시·18시 식사)
const LUNCH_FROM = 11 * 60 + 30;
const DINNER_FROM = 17 * 60 + 30;
const DAY_END = 21 * 60;
// 다음 장소는 추천 순서 앞쪽 몇 곳 중에서 가장 가까운 곳을 고른다 — 선호와 동선을 같이 본다.
const NEXT_SPOT_CHOICES = 5;

const MEAL_CATEGORIES = new Set(['food', 'cafe']);

const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const pickNearest = (candidates, from) =>
  from
    ? candidates.reduce((nearest, place) =>
        getDistanceMeters(from, place) < getDistanceMeters(from, nearest) ? place : nearest,
      )
    : candidates[0];

// conditions.days: [{ itemCount }] — 이미 장소가 있는 DAY는 건드리지 않고 비어 있는 DAY만 채운다.
// places: 그 도시의 장소 전체 (placeService.getCityPlaces)
export function buildMockItinerary(conditions, places) {
  const {
    style = 'normal',
    preferredCategories = [],
    days = [],
    excludePlaceIds = [],
  } = conditions;
  const rule = STYLE_RULES[style] ?? STYLE_RULES.normal;
  const used = new Set(excludePlaceIds);
  const isFree = (place) => !used.has(place.id);
  const spotPool = prioritizePreferredPlaces(
    places.filter((place) => !MEAL_CATEGORIES.has(place.category)),
    preferredCategories,
  );
  const foodPool = places.filter((place) => place.category === 'food');

  // 야경 장소는 저녁 이후에 넣는다. 저녁에는 야경을 먼저, 낮에는 야경 말고 남은 곳이 없을 때만 쓴다.
  const takeSpot = (from, time) => {
    const free = spotPool.filter(isFree);
    const night = free.filter((place) => place.category === 'night');
    const daytime = free.filter((place) => place.category !== 'night');
    const preferred = time >= DINNER_FROM ? night : daytime;
    const candidates = preferred.length > 0 ? preferred : free;
    if (candidates.length === 0) return null;
    const place = pickNearest(from ? candidates.slice(0, NEXT_SPOT_CHOICES) : candidates, from);
    used.add(place.id);
    return place;
  };
  const takeMeal = (from) => {
    const candidates = foodPool.filter(isFree);
    if (candidates.length === 0) return null;
    const place = pickNearest(candidates, from);
    used.add(place.id);
    return place;
  };

  const result = [];
  days.forEach((day, dayIndex) => {
    if (day.itemCount > 0) return;
    const items = [];
    let time = DAY_START;
    let last = null;
    let hadLunch = false;
    let hadDinner = false;

    const addMeal = () => {
      const meal = takeMeal(last);
      if (!meal) return;
      items.push({ name: meal.name, startTime: toTime(time), stayMinutes: MEAL_MINUTES });
      time += MEAL_MINUTES + MOVE_MINUTES;
      last = meal;
    };

    for (let count = 0; count < rule.spots; count += 1) {
      if (!hadLunch && time >= LUNCH_FROM) {
        hadLunch = true;
        addMeal();
      }
      if (!hadDinner && time >= DINNER_FROM) {
        hadDinner = true;
        addMeal();
      }
      if (time + rule.stayMinutes > DAY_END) break;
      const spot = takeSpot(last, time);
      if (!spot) break;
      items.push({ name: spot.name, startTime: toTime(time), stayMinutes: rule.stayMinutes });
      time += rule.stayMinutes + MOVE_MINUTES;
      last = spot;
    }
    // 장소를 다 넣고도 저녁 전이면 저녁 식사로 하루를 마친다.
    if (!hadDinner && time >= DINNER_FROM && time + MEAL_MINUTES <= DAY_END) addMeal();

    if (items.length > 0) result.push({ dayIndex, items });
  });

  return { days: result };
}
