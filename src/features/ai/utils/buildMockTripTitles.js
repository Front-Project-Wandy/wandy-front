// 여행 제목 추천 1단계 가짜 AI (78). 2단계에서는 서버의 Gemini가 같은 모양의 JSON을 돌려준다.
// 문구는 번역 키(ai.title.*) 템플릿으로 만든다. t는 i18next의 t — 밖에서 받아서 Node에서도 그대로 돌려 볼 수 있다.
// 돌려주는 모양: { titles: ['도쿄 2박 3일 먹방 여행', '여유롭게 걷는 도쿄', '친구와 떠나는 도쿄 여행'] }
import { PLACE_CATEGORIES } from '../../search/place';

// 마법사 STEP7 제목 입력칸(maxLength 40)에 그대로 넣을 수 있게 길이를 맞춘다.
export const TITLE_MAX_LENGTH = 40;
export const TITLE_COUNT = 3;

const STYLES = ['relaxed', 'normal', 'packed'];
const COMPANIONS = ['solo', 'couple', 'friends', 'family', 'kids'];

const formatDuration = (days, t) =>
  days === 1 ? t('ai.title.dayTrip') : t('ai.title.nightsDays', { nights: days - 1, days });

// 기간·테마가 있으면 넣고, 없으면 뺀 문장을 쓴다 — 「도쿄 2박 3일 먹방 여행」 → 「도쿄 먹방 여행」 → 「도쿄 여행」
const buildMainTitle = (city, duration, theme, t) => {
  if (duration && theme) return t('ai.title.durationTheme', { city, duration, theme });
  if (duration) return t('ai.title.duration', { city, duration });
  if (theme) return t('ai.title.themeOnly', { city, theme });
  return t('ai.title.plain', { city });
};

// conditions: { city, days(일수), style, companion, preferredCategories }
// city는 꼭 있어야 한다(제목의 중심이라서). 나머지는 없거나 모르는 값이면 그 후보만 건너뛴다.
export function buildMockTripTitles(conditions, t) {
  const { city, days, style, companion, preferredCategories } = conditions ?? {};
  if (!city) throw new Error('MISSING_CITY');

  const cityName = t(`common.city.${city}`, { defaultValue: city });
  const duration = Number.isInteger(days) && days > 0 ? formatDuration(days, t) : null;
  const themes = (preferredCategories ?? [])
    .filter((category) => PLACE_CATEGORIES.includes(category))
    .map((category) => t(`ai.title.theme.${category}`));

  // 앞에 있는 후보가 먼저 뽑힌다. 조건이 모자라도 3개가 채워지게 맨 뒤에 늘 쓸 수 있는 문장을 둔다.
  const candidates = [
    buildMainTitle(cityName, duration, themes[0], t),
    STYLES.includes(style)
      ? t('ai.title.style', { city: cityName, style: t(`ai.title.styleWord.${style}`) })
      : null,
    COMPANIONS.includes(companion)
      ? t('ai.title.companion', {
          city: cityName,
          companion: t(`ai.title.companionWord.${companion}`),
        })
      : null,
    themes.length > 1
      ? t('ai.title.themePair', { city: cityName, theme: themes[0], nextTheme: themes[1] })
      : null,
    t('ai.title.memory', { city: cityName }),
    t('ai.title.again', { city: cityName }),
  ];

  const titles = [
    ...new Set(
      candidates.filter(Boolean).map((title) => title.trim().slice(0, TITLE_MAX_LENGTH).trim()),
    ),
  ];
  return { titles: titles.slice(0, TITLE_COUNT) };
}
