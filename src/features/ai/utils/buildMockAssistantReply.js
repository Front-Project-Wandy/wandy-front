// 1단계 가짜 여행 비서 (101). Gemini 키가 없거나 배포판일 때 정해진 모양의 말만 알아듣고 Gemini와 같은 모양으로 답한다.
// → { reply, actions: [{ type, ref, placeName, day, startTime }] } — 진짜 응답처럼 validateAssistantActions를 거쳐 쓴다.
// 문구는 번역 키(ai.assistant.mock.*) 템플릿으로 만든다. t를 밖에서 받아서 Node에서도 그대로 돌려 볼 수 있다.

const normalize = (text) => text.replace(/\s+/g, '').toLowerCase();

// "2일차", "2일째", "DAY 2", "day2", "둘째 날"은 숫자만 알아듣는다
const parseDay = (text) => {
  const match = /(\d+)\s*(?:일\s*차|일\s*째|번째\s*날)|day\s*(\d+)/i.exec(text);
  return match ? Number(match[1] ?? match[2]) : null;
};

// "14:30", "14시", "오후 2시 30분" → 'HH:MM'
const parseTime = (text) => {
  const colon = /(\d{1,2}):(\d{2})/.exec(text);
  if (colon) return `${colon[1].padStart(2, '0')}:${colon[2]}`;
  const korean = /(오전|오후)?\s*(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분|\s*반)?/.exec(text);
  if (!korean) return null;
  let hour = Number(korean[2]);
  if (korean[1] === '오후' && hour < 12) hour += 12;
  const minute = korean[3] ? Number(korean[3]) : /시\s*반/.test(korean[0]) ? 30 : 0;
  if (hour > 23 || minute > 59) return null;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const allItems = (context) => context.days.flatMap((day) => day.items);

// 문장에 이름이 들어 있는 일정 장소 / 후보 장소 (긴 이름부터 봐서 "도쿄타워"가 "도쿄"보다 먼저 걸리게)
const findByName = (list, text) => {
  const target = normalize(text);
  return (
    [...list]
      .filter((entry) => entry.name)
      .sort((a, b) => b.name.length - a.name.length)
      .find((entry) => target.includes(normalize(entry.name))) ?? null
  );
};

const summarizeDays = (context, t) =>
  context.days
    .map((day) =>
      t('ai.assistant.mock.dayLine', {
        day: day.day,
        places:
          day.items.map((item) => item.name ?? t('ai.assistant.mock.unknownPlace')).join(', ') ||
          t('ai.assistant.mock.emptyDay'),
      }),
    )
    .join('\n');

export const buildMockAssistantReply = (text, context, t) => {
  const item = findByName(allItems(context), text);
  const day = parseDay(text);
  const time = parseTime(text);

  if (item && /(빼|삭제|지워|취소)/.test(text)) {
    return {
      reply: t('ai.assistant.mock.remove', { name: item.name }),
      actions: [{ type: 'remove', ref: item.ref }],
    };
  }
  if (item && day && /(옮|이동|보내)/.test(text)) {
    return {
      reply: t('ai.assistant.mock.move', { name: item.name, day }),
      actions: [{ type: 'move', ref: item.ref, day }],
    };
  }
  if (item && time) {
    return {
      reply: t('ai.assistant.mock.updateTime', { name: item.name, time }),
      actions: [{ type: 'updateTime', ref: item.ref, startTime: time }],
    };
  }
  // 이름을 말하지 않고 "하나 추가해 줘"라고 하면 추천 후보 맨 앞의 곳을, 장소가 가장 적은 날에 넣자고 한다
  const wantsAdd = /(추가|넣|담|가고\s*싶|가\s*보고)/.test(text);
  const candidate =
    findByName(context.candidatePlaces, text) ?? (wantsAdd ? context.candidatePlaces[0] : null);
  if (candidate && wantsAdd) {
    const emptiest = [...context.days].sort((a, b) => a.items.length - b.items.length)[0];
    const targetDay = day ?? emptiest?.day ?? 1;
    return {
      reply: t('ai.assistant.mock.add', { name: candidate.name, day: targetDay }),
      actions: [
        {
          type: 'add',
          placeName: candidate.name,
          day: targetDay,
          ...(time ? { startTime: time } : {}),
        },
      ],
    };
  }
  if (/(비용|얼마|예산|돈)/.test(text)) {
    const cost = context.estimatedCost;
    return {
      reply: cost
        ? t('ai.assistant.mock.cost', {
            amount: cost.total.toLocaleString('ko-KR'),
            currency: cost.currency,
          })
        : t('ai.assistant.mock.noCost'),
      actions: [],
    };
  }
  if (/(일정|뭐\s*해|알려|남은|동선|계획)/.test(text)) {
    return {
      reply: t('ai.assistant.mock.summary', { days: summarizeDays(context, t) }),
      actions: [],
    };
  }
  return { reply: t('ai.assistant.mock.help'), actions: [] };
};
