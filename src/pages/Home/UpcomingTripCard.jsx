import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { getDaysUntil } from '../../features/member/utils/tripDates';
import { useAllTrips } from '../../store/plan/useAllTrips';
import { formatDateRange } from './formatDraft';
import { pickUpcomingTrip } from './pickUpcomingTrip';

// 출발 D-day (91). 저장한 여행 중 여행 중이거나 가장 가까운 예정 여행 하나를 홈에 보여준다.
// D-day 계산은 마이페이지 내 여행(B)과 같은 함수를 써서 두 화면의 숫자가 어긋나지 않게 하고,
// 날짜 표기는 바로 아래 이어서 만들기 카드와 같은 formatDateRange로 맞춘다.
// 브라우저 푸시 알림은 서버가 필요해서(확장) 여기서는 홈 카드로만 알린다.
export default function UpcomingTripCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // 지금 열린 여행(trip)만 보면 지난 여행을 열어 본 뒤 카드가 사라져서, 보관함까지 합친 목록에서 고른다 (#59).
  const picked = pickUpcomingTrip(useAllTrips());

  // 날짜 미정·끝난 여행만 있으면 알릴 게 없어서 그리지 않는다.
  if (!picked) return null;
  const { trip, status } = picked;

  const title = trip.title || t('home.upcoming.cityTrip', { city: t(`common.city.${trip.city}`) });
  // 출발 당일부터는 getTripStatus가 'ongoing'이라 D-day는 항상 1 이상이다.
  const badge =
    status === 'ongoing'
      ? t('home.upcoming.ongoing')
      : t('home.upcoming.dday', { count: getDaysUntil(trip.startDate) });

  return (
    <section aria-labelledby="upcoming-trip-title" className="flex flex-col gap-3">
      <h2 id="upcoming-trip-title" className="text-subtitle font-bold">
        {t(status === 'ongoing' ? 'home.upcoming.titleOngoing' : 'home.upcoming.title')}
      </h2>
      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {/* point 색은 작은 배지에만 쓴다. point 글자는 연한 배경에서 대비가 부족해서(약 2.6:1)
              배경을 point로 칠하고 글자는 진한 ink로 둔다(약 5.7:1). 흰 글자는 primary 위에서만 쓰는 규칙.
              text는 다크모드에서 밝아져 point 위에서 흐려지므로 테마와 상관없이 진한 ink를 쓴다. */}
          <span className="shrink-0 rounded-full bg-point px-3 py-1 text-body-sm font-bold text-ink">
            {badge}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-body font-bold">{title}</p>
            <p className="text-body-sm text-text/70">
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/trip/${trip.id}`)} className="w-full sm:w-auto">
          {t('home.upcoming.action')}
        </Button>
      </Card>
    </section>
  );
}
