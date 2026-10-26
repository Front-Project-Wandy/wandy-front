import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { formatPrice } from '../../../features/product/utils/formatPrice';
import RadioCardGroup from '../RadioCardGroup';
import { getFlightSearchLinks } from './flightLinks';
import { EMPTY_FLIGHT, flightFromMock, KR_AIRPORTS } from './flightOptions';
import { useMockFlights } from './useMockFlights';

const EXTERNAL_LINK_CLASS =
  'inline-flex h-11 items-center justify-center gap-1 rounded-xl border border-primary px-4 text-body font-bold text-primary transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// "아직 안 했어요" — 출발 공항을 고르면 목업 항공편(B01)을 보여주고, 고르면 시각이 자동으로 채워진다.
// 출발 공항은 처음에 비워 둔다(사용자가 고름). 실제 예약은 외부 사이트 검색 링크로 보낸다 (49).
export default function FlightSearch({ flight, trip, onSelect }) {
  const { t } = useTranslation();
  const from = flight.departureAirport;
  const { data, isPending, isError, refetch } = useMockFlights({ city: trip.city, from });
  const links = getFlightSearchLinks({ from, ...trip });

  const airportName = (code) => t(`wizard.flight.airport.${code}`);

  const handleAirport = (code) =>
    onSelect({ ...EMPTY_FLIGHT, status: 'searching', departureAirport: code });

  const handlePick = (mockId) => {
    const mock = data.find((item) => item.id === mockId);
    onSelect(flightFromMock(mock, links[0]?.href ?? null));
  };

  const renderFlights = () => {
    if (!from)
      return <p className="text-body-sm text-text/70">{t('wizard.flight.search.pickAirport')}</p>;
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={() => refetch()} />;
    if (data.length === 0) {
      return (
        <EmptyState
          title={t('wizard.flight.search.emptyTitle', { airport: airportName(from) })}
          description={t('wizard.flight.search.emptyDescription')}
        />
      );
    }
    return (
      <RadioCardGroup
        legend={t('wizard.flight.search.listLegend')}
        options={data.map((mock) => ({
          value: mock.id,
          title: t('wizard.flight.search.outbound', {
            airline: mock.airline,
            flightNo: mock.outbound.flightNo,
            depart: mock.outbound.departTime,
            arrive: mock.outbound.arriveTime,
            to: airportName(mock.to),
          }),
          description: t('wizard.flight.search.inbound', {
            flightNo: mock.inbound.flightNo,
            depart: mock.inbound.departTime,
            price: formatPrice(mock.priceKrw),
          }),
        }))}
        value={flight.mockId}
        onChange={handlePick}
      />
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="text-body-sm font-bold">
          {t('wizard.flight.search.airportLegend')}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {KR_AIRPORTS.map((code) => (
            <Chip
              key={code}
              label={airportName(code)}
              selected={from === code}
              onClick={() => handleAirport(code)}
            />
          ))}
        </div>
      </fieldset>

      {renderFlights()}
      <p className="text-caption text-text/70">{t('wizard.flight.search.mockNotice')}</p>

      {links.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={EXTERNAL_LINK_CLASS}
            >
              {t(`wizard.flight.search.link.${link.key}`)}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">{t('wizard.flight.search.newTab')}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
