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
// 이 시각 이후에 하루를 시작하면 점심은 건너뛴다 (늦게 도착한 날 점심·저녁이 붙어 들어가지 않게)
const LUNCH_UNTIL = 14 * 60;
// 도착 후 입국 심사·짐 찾기·시내 이동, 출발 전 공항 이동·탑승 수속(국제선은 2시간 전 도착)에 쓰는 시간
const ARRIVAL_BUFFER = 120;
const DEPARTURE_BUFFER = 180;
// 다음 장소는 추천 순서 앞쪽 몇 곳 중에서 가장 가까운 곳을 고른다 — 선호와 동선을 같이 본다.
const NEXT_SPOT_CHOICES = 5;

const MEAL_CATEGORIES = new Set(['food', 'cafe']);
// 비 오는 날(79) 대체. Place에는 실내·실외 정보가 없어서 카테고리로 나눈다.
// 쇼핑·온천은 실내, 자연·야경은 실외로 보고 뺀다. 관광(sight)은 사찰·전망대·박물관이 섞여 있어 그대로 남긴다.
// 2단계 Gemini는 장소별로 실내인지 판단할 수 있어서 같은 조건(rainy)만 넘기면 된다.
const INDOOR_CATEGORIES = new Set(['shop', 'onsen']);
const OUTDOOR_CATEGORIES = new Set(['nature', 'night']);

const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// 'YYYY-MM-DDTHH:mm' → { date, minutes }. 형식이 틀리면 항공편이 없는 것처럼 본다.
const parseDateTime = (value) => {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/.exec(typeof value === 'string' ? value : '');
  return match ? { date: match[1], minutes: Number(match[2]) * 60 + Number(match[3]) } : null;
};

const roundUpToHalfHour = (minutes) => Math.ceil(minutes / 30) * 30;

// 그 DAY에 일정을 넣을 수 있는 시간. 도착 전·출발 후 날짜는 null이다.
// 도착일은 도착 + 여유 시간부터, 출발일은 출발 - 여유 시간까지만 넣는다.
const getDayRange = (date, flight) => {
  const range = { start: DAY_START, end: DAY_END };
  if (!date) return range;
  const arrive = parseDateTime(flight?.arriveAt);
  const depart = parseDateTime(flight?.departAt);
  if (arrive) {
    if (date < arrive.date) return null;
    if (date === arrive.date)
      range.start = Math.max(range.start, roundUpToHalfHour(arrive.minutes + ARRIVAL_BUFFER));
  }
  if (depart) {
    if (date > depart.date) return null;
    if (date === depart.date) range.end = Math.min(range.end, depart.minutes - DEPARTURE_BUFFER);
  }
  return range;
};

const pickNearest = (candidates, from) =>
  from
    ? candidates.reduce((nearest, place) =>
        getDistanceMeters(from, place) < getDistanceMeters(from, nearest) ? place : nearest,
      )
    : candidates[0];

// conditions.days: [{ date, itemCount }] — 이미 장소가 있는 DAY는 건드리지 않고 비어 있는 DAY만 채운다.
// conditions.flight: { arriveAt, departAt } | null — 도착일·출발일은 비행기 시간을 피해서 넣는다.
// conditions.rainy: true면 비 오는 날 일정 — 실내 장소를 먼저, 자연·야경은 빼고 넣는다 (79).
// places: 그 도시의 장소 전체 (placeService.getCityPlaces)
export function buildMockItinerary(conditions, places) {
  const {
    style = 'normal',
    preferredCategories = [],
    days = [],
    excludePlaceIds = [],
    likedPlaceIds = [],
    flight = null,
    rainy = false,
  } = conditions;
  const rule = STYLE_RULES[style] ?? STYLE_RULES.normal;
  const used = new Set(excludePlaceIds);
  const isFree = (place) => !used.has(place.id);
  // 다녀와서 좋았다고 평가한 곳(97)은 관광지 후보 맨 앞, 식사는 그중에서 먼저 고른다.
  const liked = new Set(likedPlaceIds);
  const isLiked = (place) => liked.has(place.id);
  // 비 오는 날(79)은 바깥 장소를 빼고 실내 장소를 앞에 둔다. 식사는 원래 실내라 그대로 둔다.
  const isAllowedSpot = (place) =>
    !MEAL_CATEGORIES.has(place.category) && !(rainy && OUTDOOR_CATEGORIES.has(place.category));
  const preferredSpots = prioritizePreferredPlaces(
    places.filter(isAllowedSpot),
    preferredCategories,
  );
  const isIndoor = (place) => rainy && INDOOR_CATEGORIES.has(place.category);
  const spotPool = [
    ...preferredSpots.filter(isLiked),
    ...preferredSpots.filter((place) => !isLiked(place) && isIndoor(place)),
    ...preferredSpots.filter((place) => !isLiked(place) && !isIndoor(place)),
  ];
  const foodPool = places.filter((place) => place.category === 'food');

  // 야경 장소는 저녁 이후에만 넣는다. 저녁에는 야경을 먼저 쓰고, 야경이 없으면 낮 장소를 쓴다.
  const isNight = (place) => place.category === 'night';
  const hasFreeNight = () => spotPool.some((place) => isFree(place) && isNight(place));
  const takeSpot = (from, time) => {
    const free = spotPool.filter(isFree);
    const night = free.filter(isNight);
    const daytime = free.filter((place) => !isNight(place));
    const candidates = time >= DINNER_FROM && night.length > 0 ? night : daytime;
    if (candidates.length === 0) return null;
    const place = pickNearest(from ? candidates.slice(0, NEXT_SPOT_CHOICES) : candidates, from);
    used.add(place.id);
    return place;
  };
  const takeMeal = (from) => {
    const candidates = foodPool.filter(isFree);
    if (candidates.length === 0) return null;
    const likedMeals = candidates.filter(isLiked);
    const place = pickNearest(likedMeals.length > 0 ? likedMeals : candidates, from);
    used.add(place.id);
    return place;
  };

  const result = [];
  days.forEach((day, dayIndex) => {
    if (day.itemCount > 0) return;
    const range = getDayRange(day.date, flight);
    if (!range) return;
    const items = [];
    let time = range.start;
    let last = null;
    let hadLunch = time >= LUNCH_UNTIL;
    let hadDinner = false;

    const addMeal = () => {
      if (time + MEAL_MINUTES > range.end) return;
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
      if (time + rule.stayMinutes > range.end) break;
      let spot = takeSpot(last, time);
      // 낮에 갈 곳이 다 떨어졌어도 야경이 남아 있으면, 낮에 넣지 않고 저녁으로 건너뛰어 넣는다.
      if (!spot && time < DINNER_FROM && hasFreeNight()) {
        time = DINNER_FROM;
        // 건너뛴 사이에 점심 시간이 지났다. 표시하지 않으면 저녁 뒤에 점심이 들어간다.
        hadLunch = true;
        if (!hadDinner) {
          hadDinner = true;
          addMeal();
        }
        if (time + rule.stayMinutes > range.end) break;
        spot = takeSpot(last, time);
      }
      if (!spot) break;
      items.push({ name: spot.name, startTime: toTime(time), stayMinutes: rule.stayMinutes });
      time += rule.stayMinutes + MOVE_MINUTES;
      last = spot;
    }
    // 장소를 다 넣고도 저녁 전이면 저녁 식사로 하루를 마친다.
    if (!hadDinner && time >= DINNER_FROM && time + MEAL_MINUTES <= range.end) addMeal();

    if (items.length > 0) result.push({ dayIndex, items });
  });

  return { days: result };
}
