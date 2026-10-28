import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import { isCityAvailable, POPULAR_CITIES } from './popularCityList';
import StartTripConfirmModal from './StartTripConfirmModal';
import { useStartTrip } from './useStartTrip';

// 홈 "지금 떠나고 싶은 도시" (61). 누르면 그 나라·도시가 골라진 채로 마법사 STEP1이 열린다.
// 데이터가 없는 도시는 흐리게 "준비 중"으로 보여 주고 누를 수 없다 (마법사 STEP 2·3과 같은 방식).
// 이용 가능한 도시는 큰 사진으로, 준비 중인 도시는 작은 흑백 사진에 「준비 중」 표시로 구분한다.
export default function PopularCities() {
  const { t } = useTranslation();
  const { requestStart, isConfirmOpen, confirmStart, continueDraft, cancelStart } = useStartTrip();

  return (
    <section aria-labelledby="popular-cities-title" className="flex flex-col gap-3">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-caption font-bold tracking-widest text-primary">
            {t('home.editorial.citiesEyebrow')}
          </p>
          <h2 id="popular-cities-title" className="text-title font-bold lg:text-display">
            {t('home.cities.title')}
          </h2>
          <p className="mt-3 text-body-sm text-text/60">{t('home.editorial.citiesDescription')}</p>
        </div>
        <Link
          to="/places"
          className="rounded-xl py-2 text-body-sm font-bold text-link focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t('home.editorial.more')} <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {[
          ...POPULAR_CITIES.filter(isCityAvailable),
          ...POPULAR_CITIES.filter((item) => !isCityAvailable(item)),
        ].map((item) => {
          const cityName = t(`common.city.${item.city}`);
          const isAvailable = isCityAvailable(item);
          const content = (
            <>
              <div className="relative overflow-hidden">
                <img
                  src={`/images/home/${item.city}.jpg`}
                  alt={t(`home.editorial.${item.city}.alt`)}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-500 ${isAvailable ? 'aspect-video group-hover:scale-105' : 'aspect-3/2 grayscale-60'}`}
                />
                {isAvailable ? null : (
                  <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-caption font-bold text-white">
                    {t('home.cities.comingSoon')}
                  </span>
                )}
              </div>
              <div
                className={`flex items-center justify-between gap-3 ${isAvailable ? 'p-5 sm:p-6' : 'p-4'}`}
              >
                <div>
                  <span className="text-caption text-text/60">
                    {t(`common.country.${item.country}`)}
                  </span>
                  <span className="mt-1 block text-subtitle font-bold">{cityName}</span>
                </div>
                {isAvailable ? (
                  <span aria-hidden="true" className="text-title text-primary">
                    ↗
                  </span>
                ) : null}
              </div>
            </>
          );

          return (
            <li key={item.city} className={isAvailable ? 'col-span-2' : ''}>
              {isAvailable ? (
                <Card
                  className="group h-full"
                  aria-label={t('home.cities.startLabel', { city: cityName })}
                  onClick={() => requestStart({ country: item.country, city: item.city })}
                >
                  {content}
                </Card>
              ) : (
                <Card aria-disabled="true" className="opacity-70">
                  {content}
                </Card>
              )}
            </li>
          );
        })}
      </ul>
      <StartTripConfirmModal
        open={isConfirmOpen}
        onConfirm={confirmStart}
        onContinue={continueDraft}
        onClose={cancelStart}
      />
    </section>
  );
}
