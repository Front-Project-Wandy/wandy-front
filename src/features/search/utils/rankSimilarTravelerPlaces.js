// 비슷한 성향 여행자들이 많이 간 장소 (요구사항 102) — 사용자 기반 협업 필터링.
// 1) 내 성향과 여행자마다의 비슷한 정도(0~1)를 구하고, 2) 가장 비슷한 이웃 몇 명을 고른 뒤,
// 3) 이웃이 다녀간 장소를 비슷한 정도로 가중해서 순위를 매긴다.
// 2단계에서 서버가 실제 사용자 데이터로 같은 규칙을 쓴다 (recommendService 안만 바뀐다).
//
// profile: { style, companion, budget, preferredCategories } — 마법사 STEP1 값(처음엔 프로필에서 채워진다)
// travelers: [{ id, style, companion, budget, preferredCategories, visitedPlaceIds }]
// likedPlaceIds: 다녀와서 좋았다고 평가한 곳(97). 같은 곳을 다녀간 여행자일수록 더 비슷하다고 본다.
// → { mode: 'similar' | 'popular', neighborCount, places: [{ placeId, visitedCount, score }] }
//   mode 'popular': 취향 정보가 하나도 없어서 이 도시 여행자 전체의 인기 순으로 대신 보여 준다.

const DEFAULT_NEIGHBOR_COUNT = 10;
const DEFAULT_LIMIT = 8;
const WEIGHTS = { categories: 0.5, style: 0.2, companion: 0.15, budget: 0.15, liked: 0.3 };

const jaccard = (a, b) => {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  const overlap = a.filter((value) => setB.has(value)).length;
  return overlap / new Set([...a, ...b]).size;
};

// 스타일은 기본값('normal')이 늘 들어 있어서, 그것만으로는 취향을 안다고 보지 않는다
const hasTaste = (profile, likedPlaceIds) =>
  (profile.preferredCategories?.length ?? 0) > 0 ||
  Boolean(profile.companion) ||
  Boolean(profile.budget) ||
  likedPlaceIds.length > 0;

export const getTravelerSimilarity = (profile, traveler, likedPlaceIds = []) => {
  const visited = new Set(traveler.visitedPlaceIds);
  const likedOverlap =
    likedPlaceIds.length > 0
      ? likedPlaceIds.filter((id) => visited.has(id)).length / likedPlaceIds.length
      : 0;
  const raw =
    WEIGHTS.categories * jaccard(profile.preferredCategories ?? [], traveler.preferredCategories) +
    WEIGHTS.style * (profile.style === traveler.style ? 1 : 0) +
    WEIGHTS.companion * (profile.companion && profile.companion === traveler.companion ? 1 : 0) +
    WEIGHTS.budget * (profile.budget && profile.budget === traveler.budget ? 1 : 0) +
    WEIGHTS.liked * likedOverlap;
  // 다녀온 곳 평가까지 합치면 1이 넘을 수 있어서 0~1로 맞춘다
  const max =
    WEIGHTS.categories + WEIGHTS.style + WEIGHTS.companion + WEIGHTS.budget + WEIGHTS.liked;
  return raw / max;
};

export const rankSimilarTravelerPlaces = ({
  profile,
  travelers,
  likedPlaceIds = [],
  excludePlaceIds = [],
  neighborCount = DEFAULT_NEIGHBOR_COUNT,
  limit = DEFAULT_LIMIT,
}) => {
  const isSimilar = hasTaste(profile, likedPlaceIds);
  const neighbors = isSimilar
    ? travelers
        .map((traveler) => ({
          traveler,
          weight: getTravelerSimilarity(profile, traveler, likedPlaceIds),
        }))
        .filter(({ weight }) => weight > 0)
        // 점수가 같으면 id 순서로 해서 매번 같은 결과가 나오게 한다
        .sort((a, b) => b.weight - a.weight || a.traveler.id.localeCompare(b.traveler.id))
        .slice(0, neighborCount)
    : travelers.map((traveler) => ({ traveler, weight: 1 }));

  const excluded = new Set(excludePlaceIds);
  const byPlace = new Map();
  neighbors.forEach(({ traveler, weight }) => {
    traveler.visitedPlaceIds.forEach((placeId) => {
      if (excluded.has(placeId)) return;
      const entry = byPlace.get(placeId) ?? { placeId, visitedCount: 0, score: 0 };
      entry.visitedCount += 1;
      entry.score += weight;
      byPlace.set(placeId, entry);
    });
  });

  const places = [...byPlace.values()]
    .sort(
      (a, b) =>
        b.score - a.score || b.visitedCount - a.visitedCount || a.placeId.localeCompare(b.placeId),
    )
    .slice(0, limit);

  return { mode: isSimilar ? 'similar' : 'popular', neighborCount: neighbors.length, places };
};
