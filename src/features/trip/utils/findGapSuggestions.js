import { checkVisitHours } from '../../search/utils/openingHours';
import { prioritizePreferredPlaces } from '../../search/utils/prioritizePreferredPlaces';
import { getDistanceMeters } from '../../search/utils/geo';
import { isSamePlace } from '../../search/utils/samePlace';
import { estimateTransport } from '../../transport/utils/estimateTransport';
import { formatClock, toMinutes } from './buildTimeline';

// 빈 시간대에 끼워 넣을 장소는 이만큼(분) 머문다고 본다. 카테고리별 근거 자료가 없어서 하나로 둔다.
export const SUGGEST_STAY_MINUTES = 60;
export const MAX_SUGGESTIONS_PER_GAP = 3;
// 시작 시각은 시간 선택(5분 단위)과 맞춘다
const TIME_STEP_MINUTES = 5;

const hasCoords = (place) => Number.isFinite(place?.lat) && Number.isFinite(place?.lng);

// 이미 일정에 있는 장소인지. 구글 장소는 이름을 저장하지 않아서(null) placeId로만 같은 곳을 본다.
const isAlreadyPlanned = (place, plannedItems, country) =>
  plannedItems.some(
    (item) =>
      item.placeId === place.id ||
      isSamePlace(place, {
        id: item.placeId,
        country,
        name: item.name ?? '',
        address: '',
        lat: item.lat,
        lng: item.lng,
      }),
  );

// 앞 장소(prev)와 다음 장소(next) 사이에 후보 한 곳을 끼워도 시간이 맞는지 보고, 맞으면 추천 값을 돌려준다.
const fitCandidate = ({ place, prev, next, prevEnd, nextStart, date, country, transportMode }) => {
  const legIn = estimateTransport({ from: prev, to: place, country, transportMode });
  const legOut = estimateTransport({ from: place, to: next, country, transportMode });
  if (!legIn || !legOut) return null;

  const startMinutes = Math.ceil((prevEnd + legIn.minutes) / TIME_STEP_MINUTES) * TIME_STEP_MINUTES;
  if (startMinutes + SUGGEST_STAY_MINUTES + legOut.minutes > nextStart) return null;

  const startTime = formatClock(startMinutes);
  const closed = checkVisitHours({
    openingHours: place.openingHours,
    date,
    startTime,
    stayMinutes: SUGGEST_STAY_MINUTES,
  });
  if (closed) return null;

  const detour =
    getDistanceMeters(prev, place) + getDistanceMeters(place, next) - getDistanceMeters(prev, next);
  return {
    place,
    startTime,
    travelInMinutes: legIn.minutes,
    travelOutMinutes: legOut.minutes,
    detour,
  };
};

// 한 DAY의 장소 사이 빈 시간대마다 끼워 넣을 만한 장소를 찾는다 (요구사항 #77).
// 앞 장소가 끝나는 시각 ~ 다음 장소 시작 사이에 「앞→후보 이동 + 60분 + 후보→다음 이동」이 들어가는 후보만 남긴다.
// 이미 일정에 있는 장소, 좌표 없는 장소, 그 시각에 영업하지 않는 장소는 뺀다.
// 돌아가는 거리가 짧은 순으로, 마법사에서 고른 선호 카테고리를 앞세워 틈마다 최대 3곳을 돌려준다.
// 돌려주는 값: [{ afterIndex, gapStart, gapEnd, gapMinutes, suggestions }] (afterIndex = 이 장소 바로 뒤의 틈, 시각은 'HH:mm').
// 후보가 하나도 없는 틈은 빼고, 순서와 시간이 어긋났거나(다음이 먼저 시작) 빈 시간이 없는 틈도 뺀다.
export const findGapSuggestions = ({
  day,
  plannedItems,
  candidates,
  country,
  transportMode,
  preferredCategories,
}) => {
  const items = day.items;
  const gaps = [];

  for (let index = 0; index < items.length - 1; index += 1) {
    const prev = items[index];
    const next = items[index + 1];
    const prevStart = toMinutes(prev.startTime);
    const nextStart = toMinutes(next.startTime);
    if (prevStart === null || nextStart === null || nextStart <= prevStart) continue;
    const prevEnd = prevStart + prev.stayMinutes;
    if (nextStart - prevEnd < SUGGEST_STAY_MINUTES) continue;

    const fitted = candidates
      .filter((place) => hasCoords(place) && !isAlreadyPlanned(place, plannedItems, country))
      .map((place) =>
        fitCandidate({
          place,
          prev,
          next,
          prevEnd,
          nextStart,
          date: day.date,
          country,
          transportMode,
        }),
      )
      .filter(Boolean)
      .sort((a, b) => a.detour - b.detour);
    if (fitted.length === 0) continue;

    const orderedPlaces = prioritizePreferredPlaces(
      fitted.map((entry) => entry.place),
      preferredCategories,
    );
    const suggestions = orderedPlaces
      .slice(0, MAX_SUGGESTIONS_PER_GAP)
      .map((place) => fitted.find((entry) => entry.place === place));

    gaps.push({
      afterIndex: index,
      gapStart: formatClock(prevEnd),
      gapEnd: formatClock(nextStart),
      gapMinutes: nextStart - prevEnd,
      suggestions,
    });
  }
  return gaps;
};
