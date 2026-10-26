// 한 줄 요청 해석 1단계 가짜 AI (56). 2단계에서는 서버의 Gemini가 같은 모양의 JSON을 돌려준다.
// 정해진 단어만 찾아서, 모르는 말은 null(또는 빈 배열)로 둔다. 값이 맞는지는 normalizeTripRequest가 다시 본다.
// 돌려주는 모양: { city, days, people, style, categories: [], companion }

// 도시 이름 (한글·영문). 같은 도시를 가리키는 말을 모두 적는다.
const CITY_WORDS = {
  seoul: ['서울', 'seoul'],
  busan: ['부산', 'busan'],
  jeju: ['제주', 'jeju'],
  tokyo: ['도쿄', '동경', 'tokyo'],
  osaka: ['오사카', 'osaka'],
  fukuoka: ['후쿠오카', 'fukuoka'],
};

const STYLE_WORDS = {
  packed: ['빡빡', '알차게', '꽉', '부지런'],
  relaxed: ['느긋', '여유', '힐링', '천천히', '쉬엄쉬엄'],
};

const CATEGORY_WORDS = {
  food: ['먹방', '맛집', '먹거리', '미식', '음식'],
  cafe: ['카페', '디저트'],
  shop: ['쇼핑'],
  night: ['야경'],
  nature: ['자연', '산책', '공원', '등산'],
  onsen: ['온천', '료칸'],
  sight: ['관광', '명소', '구경'],
};

// 여러 개가 같이 나오면 앞에 있는 것이 이긴다 ("가족이랑 아이" → 아이와 함께)
const COMPANION_WORDS = [
  ['kids', ['아이', '아기', '애들', '키즈']],
  ['couple', ['커플', '연인', '부부', '신혼', '데이트']],
  ['family', ['가족', '부모님', '엄마', '아빠', '효도']],
  ['friends', ['친구', '우정']],
  ['solo', ['혼자', '나홀로', '혼행']],
];

// 「이틀」처럼 숫자 없이 쓰는 기간
const DAY_WORDS = [
  ['당일', 1],
  ['하루', 1],
  ['이틀', 2],
  ['사흘', 3],
  ['나흘', 4],
];

const hasAny = (text, words) => words.some((word) => text.includes(word));

const findDays = (text) => {
  const nightsAndDays = /(\d+)\s*박\s*(\d+)\s*일/.exec(text);
  if (nightsAndDays) return Number(nightsAndDays[2]);
  const nights = /(\d+)\s*박/.exec(text);
  if (nights) return Number(nights[1]) + 1;
  const days = /(\d+)\s*일/.exec(text);
  if (days) return Number(days[1]);
  return DAY_WORDS.find(([word]) => text.includes(word))?.[1] ?? null;
};

const findPeople = (text, companion) => {
  const count = /(\d+)\s*(명|인)/.exec(text);
  if (count) return Number(count[1]);
  if (companion === 'solo') return 1;
  if (companion === 'couple') return 2;
  return null;
};

// 「11월 3일 출발」 같은 날짜를 기간(3일)으로 읽지 않게 먼저 지운다
const removeDates = (text) => text.replace(/\d+\s*월\s*\d+\s*일/g, ' ');

export function buildMockTripRequest(text) {
  const lower = removeDates(typeof text === 'string' ? text.toLowerCase() : '');
  const city = Object.keys(CITY_WORDS).find((key) => hasAny(lower, CITY_WORDS[key])) ?? null;
  const style = Object.keys(STYLE_WORDS).find((key) => hasAny(lower, STYLE_WORDS[key])) ?? null;
  const categories = Object.keys(CATEGORY_WORDS).filter((key) =>
    hasAny(lower, CATEGORY_WORDS[key]),
  );
  const companion = COMPANION_WORDS.find(([, words]) => hasAny(lower, words))?.[0] ?? null;

  return {
    city,
    days: findDays(lower),
    people: findPeople(lower, companion),
    style,
    categories,
    companion,
  };
}
