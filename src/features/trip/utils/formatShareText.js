import { formatDayDate } from './formatDay';

const toDotDate = (dateString) => dateString?.replaceAll('-', '.') ?? '';

// buildShareData의 결과를 복사·공유할 글로 만든다. 글자는 t로 받아서 번역을 따른다.
// 인쇄 화면(PrintableTrip)도 같은 라벨을 쓰도록, 줄 단위 조각을 따로 내보낸다.
export function formatItemLine({ item, t }) {
  const name = item.name ?? t('planner.share.googlePlace');
  const memo = item.memo ? ` — ${item.memo}` : '';
  return `${item.startTime} ${name}${memo}`;
}

export function formatShareText({ data, t, locale }) {
  const lines = [
    data.title || t('planner.share.untitled'),
    t('planner.share.period', {
      start: toDotDate(data.startDate),
      end: toDotDate(data.endDate),
      people: data.people,
    }),
  ];

  data.days.forEach((day, index) => {
    lines.push(
      '',
      t('planner.day.title', { number: index + 1 }) + ` · ${formatDayDate(day.date, locale)}`,
    );
    if (day.items.length === 0) lines.push(t('planner.share.emptyDay'));
    day.items.forEach((item) => lines.push(formatItemLine({ item, t })));
  });

  if (data.hasHiddenName) lines.push('', t('planner.share.googleNote'));
  lines.push('', t('planner.share.footer'));
  return lines.join('\n');
}
