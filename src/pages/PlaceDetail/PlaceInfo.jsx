import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import GoogleAttribution from '../../features/search/components/GoogleAttribution';
import PopularTimes from '../../features/search/components/PopularTimes';

const ICON_PATHS = {
  address: 'M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  hours: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2',
};

// 장소 이용 정보(주소·영업시간, 10) + 지도 앱에서 보기 링크 (11, 한국은 평점이 없어서 네이버 지도로 보완) + 붐비는 시간 (99).
// 사진·이름은 위쪽 PlaceHero가 그린다.
export default function PlaceInfo({ place }) {
  const { t } = useTranslation();
  const titleId = useId();
  const isGoogle = place.source === 'google';
  const rows = [
    { key: 'address', label: t('place.info.address'), value: place.address },
    place.openingHours
      ? { key: 'hours', label: t('place.info.hours'), value: place.openingHours }
      : null,
  ].filter(Boolean);

  return (
    <div className="min-w-0 space-y-12">
      <section aria-labelledby={titleId} className="space-y-5">
        <h2 id={titleId} className="text-title font-bold">
          {t('place.info.title')}
        </h2>
        <dl className="divide-y divide-text/10 rounded-2xl bg-bg-soft px-5">
          {rows.map(({ key, label, value }) => (
            <div key={key} className="flex gap-4 py-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background text-primary">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={ICON_PATHS[key]} />
                </svg>
              </span>
              <div className="min-w-0">
                <dt className="text-caption font-bold text-text/60">{label}</dt>
                <dd className="mt-1">
                  {Array.isArray(value) ? (
                    <ul className="space-y-0.5 text-body-sm">
                      {value.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-body break-keep">{value}</span>
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
        {place.externalUrl ? (
          <a
            href={place.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-body font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:inline-flex sm:w-auto"
          >
            {isGoogle ? t('place.link.google') : t('place.link.naver')}
            <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        {isGoogle ? <GoogleAttribution /> : null}
      </section>

      <PopularTimes category={place.category} />
    </div>
  );
}
