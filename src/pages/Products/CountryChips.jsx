import { useTranslation } from 'react-i18next';
import Chip from '../../components/common/Chip';
import { COUNTRIES } from '../../features/search/place';

const CHIP_VALUES = [null, ...COUNTRIES];

// 상품 목록 나라 필터. null = 전체.
export default function CountryChips({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div role="group" aria-label={t('product.country.label')} className="flex gap-2">
      {CHIP_VALUES.map((country) => (
        <Chip
          key={country ?? 'all'}
          label={country ? t(`common.country.${country}`) : t('product.country.all')}
          selected={value === country}
          onClick={() => onChange(country)}
        />
      ))}
    </div>
  );
}
