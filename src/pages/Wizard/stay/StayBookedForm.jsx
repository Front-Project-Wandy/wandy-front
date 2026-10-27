import { useTranslation } from 'react-i18next';
import Input from '../../../components/common/Input';
import { formatShortDate } from '../../../features/member/utils/tripDates';
import StayAreaChips from './StayAreaChips';

// "이미 예약했어요" — 예약한 숙소를 직접 입력한다 (50).
// 위치는 지역 칩으로 받아 그 지역 중심 좌표를 동선 기준점으로 쓰고, 주소는 참고용 글자로만 받는다.
// 체크인·체크아웃은 날짜가 여행 첫날·마지막 날로 정해져 있어서 시각만 받는다 (51).
export default function StayBookedForm({ stay, city, startDate, endDate, onChange }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t('wizard.stay.booked.name')}
        value={stay.name}
        placeholder={t('wizard.stay.booked.namePlaceholder')}
        maxLength={40}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <StayAreaChips
        city={city}
        value={stay.area}
        legend={t('wizard.stay.areaLegend')}
        hint={t('wizard.stay.booked.areaHint')}
        onChange={(area) => onChange({ area: area.key, lat: area.lat, lng: area.lng })}
      />
      <Input
        label={t('wizard.stay.booked.address')}
        value={stay.address}
        placeholder={t('wizard.stay.booked.addressPlaceholder')}
        maxLength={80}
        onChange={(event) => onChange({ address: event.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="time"
          label={t('wizard.stay.booked.checkIn', {
            date: formatShortDate(startDate, i18n.language),
          })}
          value={stay.checkInTime}
          onChange={(event) => onChange({ checkInTime: event.target.value })}
        />
        <Input
          type="time"
          label={t('wizard.stay.booked.checkOut', {
            date: formatShortDate(endDate, i18n.language),
          })}
          value={stay.checkOutTime}
          onChange={(event) => onChange({ checkOutTime: event.target.value })}
        />
      </div>
    </div>
  );
}
