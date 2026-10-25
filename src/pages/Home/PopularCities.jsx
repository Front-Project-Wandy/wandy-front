import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import { isCityAvailable, POPULAR_CITIES } from './popularCityList';
import StartTripConfirmModal from './StartTripConfirmModal';
import { useStartTrip } from './useStartTrip';

// 홈 "지금 떠나고 싶은 도시" (61). 누르면 그 나라·도시가 골라진 채로 마법사 STEP1이 열린다.
// 데이터가 없는 도시는 흐리게 "준비 중"으로 보여 주고 누를 수 없다 (마법사 STEP 2·3과 같은 방식).
// 도시 사진이 생기기 전까지는 사진 자리에 연한 배경과 도시 이름을 둔다.
export default function PopularCities() {
  const { t } = useTranslation();
  const { requestStart, isConfirmOpen, confirmStart, continueDraft, cancelStart } = useStartTrip();

  return (
    <section aria-labelledby="popular-cities-title" className="flex flex-col gap-3">
      <h2 id="popular-cities-title" className="text-subtitle font-bold">
        {t('home.cities.title')}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {POPULAR_CITIES.map((item) => {
          const cityName = t(`common.city.${item.city}`);
          const isAvailable = isCityAvailable(item);
          const content = (
            <div className="flex aspect-video flex-col items-center justify-center gap-1 bg-bg-soft p-3">
              <span className="text-subtitle font-bold text-primary">{cityName}</span>
              <span className="text-caption text-text/70">
                {isAvailable ? t(`common.country.${item.country}`) : t('home.cities.comingSoon')}
              </span>
            </div>
          );

          return (
            <li key={item.city}>
              {isAvailable ? (
                <Card
                  aria-label={t('home.cities.startLabel', { city: cityName })}
                  onClick={() => requestStart({ country: item.country, city: item.city })}
                >
                  {content}
                </Card>
              ) : (
                <Card aria-disabled="true" className="opacity-50">
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
