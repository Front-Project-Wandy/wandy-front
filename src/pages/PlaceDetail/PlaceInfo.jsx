import { useTranslation } from 'react-i18next';
import FavoriteButton from '../../features/member/components/FavoriteButton';
import GoogleAttribution from '../../features/search/components/GoogleAttribution';
import PopularTimes from '../../features/search/components/PopularTimes';

// 장소 상세 정보 (10) + 지도 앱에서 보기 링크 (11, 한국은 평점이 없어서 네이버 지도로 보완).
export default function PlaceInfo({ place }) {
  const { t } = useTranslation();
  const categoryLabel = t(`common.category.${place.category}`);
  const isGoogle = place.source === 'google';

  return (
    <article className="min-w-0 space-y-4">
      {place.imageUrl ? (
        <img
          src={place.imageUrl}
          alt={place.name}
          className="aspect-video w-full rounded-2xl object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid aspect-video w-full place-items-center rounded-2xl bg-bg-soft text-subtitle font-bold text-link"
        >
          {categoryLabel}
        </div>
      )}

      <header className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-title font-bold">{place.name}</h1>
          <FavoriteButton place={place} />
        </div>
        <p className="flex items-center gap-2 text-body-sm">
          <span className="rounded-full bg-bg-soft px-3 py-1">{categoryLabel}</span>
          {place.rating !== null ? (
            <span className="font-bold text-point">
              <span aria-hidden="true">★ {place.rating}</span>
              <span className="sr-only">{t('search.card.rating', { rating: place.rating })}</span>
            </span>
          ) : null}
        </p>
      </header>

      <dl className="space-y-3 rounded-2xl border border-text/10 p-4">
        <div>
          <dt className="text-caption font-bold text-text/70">{t('place.info.address')}</dt>
          <dd className="text-body">{place.address}</dd>
        </div>
        {place.openingHours ? (
          <div>
            <dt className="text-caption font-bold text-text/70">{t('place.info.hours')}</dt>
            <dd>
              <ul className="text-body-sm">
                {place.openingHours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>

      <PopularTimes category={place.category} />

      {place.externalUrl ? (
        <a
          href={place.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-body font-bold text-white lg:w-auto lg:inline-flex"
        >
          {isGoogle ? t('place.link.google') : t('place.link.naver')}
        </a>
      ) : null}
      {isGoogle ? <GoogleAttribution /> : null}
    </article>
  );
}
