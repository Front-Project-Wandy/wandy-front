import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { formatPrice } from '../../../features/product/utils/formatPrice';
import ExternalSearchLinks from '../ExternalSearchLinks';
import RadioCardGroup from '../RadioCardGroup';
import StayAreaChips from './StayAreaChips';
import StayAreaRecommendation from './StayAreaRecommendation';
import { getStaySearchLinks } from './stayLinks';
import { EMPTY_STAY, findStayArea, stayFromMock } from './stayOptions';
import { useMockStays } from './useMockStays';

// "아직 안 했어요" — 지역을 고르면 목업 숙소(B02)를 보여주고, 고르면 이름·좌표·체크인/아웃이 채워진다.
// 실제 예약은 그 지역으로 검색한 외부 사이트 링크로 보낸다 (49).
export default function StaySearch({ stay, trip, onSelect }) {
  const { t } = useTranslation();
  const area = findStayArea(trip.city, stay.area);
  const { data, isPending, isError, refetch } = useMockStays({ city: trip.city, area: stay.area });
  const links = getStaySearchLinks({ searchName: area?.searchName, ...trip });

  const handleArea = (nextArea) =>
    onSelect({ ...EMPTY_STAY, status: 'searching', area: nextArea.key });

  const handlePick = (mockId) => {
    const mock = data.find((item) => item.id === mockId);
    onSelect(stayFromMock(mock, links[0]?.href ?? null));
  };

  const renderStays = () => {
    if (!area)
      return <p className="text-body-sm text-text/70">{t('wizard.stay.search.pickArea')}</p>;
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={() => refetch()} />;
    if (data.length === 0) {
      return (
        <EmptyState
          title={t('wizard.stay.search.emptyTitle')}
          description={t('wizard.stay.search.emptyDescription')}
        />
      );
    }
    return (
      <RadioCardGroup
        legend={t('wizard.stay.search.listLegend')}
        options={data.map((mock) => ({
          value: mock.id,
          title: mock.name,
          description: t('wizard.stay.search.detail', {
            price: formatPrice(mock.pricePerNightKrw),
            checkIn: mock.checkIn,
            checkOut: mock.checkOut,
          }),
        }))}
        value={stay.mockId}
        onChange={handlePick}
      />
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <StayAreaRecommendation trip={trip} selectedArea={stay.area} onSelect={handleArea} />
      <StayAreaChips
        city={trip.city}
        value={stay.area}
        legend={t('wizard.stay.areaLegend')}
        onChange={handleArea}
      />
      {renderStays()}
      <p className="text-caption text-text/70">{t('wizard.stay.search.mockNotice')}</p>
      <ExternalSearchLinks links={links} labelKey={(key) => `wizard.stay.search.link.${key}`} />
    </div>
  );
}
