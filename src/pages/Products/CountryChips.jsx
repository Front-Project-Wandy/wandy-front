import { useTranslation } from 'react-i18next';
import { COUNTRIES } from '../../features/search/place';

const CHIP_VALUES = [null, ...COUNTRIES];

// 상품 목록 나라 필터. null = 전체.
export default function CountryChips({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div role="group" aria-label={t('product.country.label')} className="flex gap-2">
      {CHIP_VALUES.map((country) => {
        const selected = value === country;
        return (
          <button
            key={country ?? 'all'}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(country)}
            className={`h-11 shrink-0 rounded-full px-4 text-body-sm ${selected ? 'bg-primary font-bold text-white' : 'bg-bg-soft text-text'}`}
          >
            {country ? t(`common.country.${country}`) : t('product.country.all')}
          </button>
        );
      })}
    </div>
  );
}
