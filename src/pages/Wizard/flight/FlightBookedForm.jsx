import { useTranslation } from 'react-i18next';
import Input from '../../../components/common/Input';
import { formatShortDate } from '../../../features/member/utils/tripDates';

// "이미 예약했어요" — 예약한 항공편을 직접 입력한다 (47).
// 날짜는 여행 첫날·마지막 날로 정해져 있어서 시각만 받는다. 그래야 여행 날짜와 어긋날 일이 없다.
export default function FlightBookedForm({ flight, startDate, endDate, onChange }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label={t('wizard.flight.booked.flightNo')}
        value={flight.flightNo}
        placeholder={t('wizard.flight.booked.flightNoPlaceholder')}
        maxLength={10}
        onChange={(event) => onChange({ flightNo: event.target.value.toUpperCase() })}
      />
      <Input
        label={t('wizard.flight.booked.returnFlightNo')}
        value={flight.returnFlightNo}
        placeholder={t('wizard.flight.booked.returnFlightNoPlaceholder')}
        maxLength={10}
        onChange={(event) => onChange({ returnFlightNo: event.target.value.toUpperCase() })}
      />
      <Input
        type="time"
        label={t('wizard.flight.booked.arriveTime', {
          date: formatShortDate(startDate, i18n.language),
        })}
        value={flight.arriveTime}
        onChange={(event) => onChange({ arriveTime: event.target.value })}
      />
      <Input
        type="time"
        label={t('wizard.flight.booked.departTime', {
          date: formatShortDate(endDate, i18n.language),
        })}
        value={flight.departTime}
        onChange={(event) => onChange({ departTime: event.target.value })}
      />
    </div>
  );
}
