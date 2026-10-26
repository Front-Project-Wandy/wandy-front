import { useTranslation } from 'react-i18next';
import Chip from '../../components/common/Chip';
import { PLACE_CATEGORIES } from '../../features/search/place';
import RadioCardGroup from './RadioCardGroup';
import { BUDGET_RANGES, COMPANIONS, TRAVEL_STYLES } from './tripStyleOptions';

const CHIP_GROUP_CLASS = 'flex flex-col gap-2';
const LEGEND_CLASS = 'text-body-sm font-bold';

// STEP1 여행 스타일·동행·예산·좋아하는 카테고리 (46, 65). 전부 고르지 않아도 넘어갈 수 있다.
// BasicInfoFields처럼 값은 values로 받고 바뀐 칸만 onChange({ 칸: 값 })로 알린다.
export default function TripStyleFields({ values, onChange }) {
  const { t } = useTranslation();
  const { style, companion, budget, preferredCategories } = values;

  // 동행·예산은 하나만 고르되, 고른 칩을 다시 누르면 "정하지 않음"(null)으로 돌린다.
  // 라디오로 만들면 한 번 고른 뒤 비울 방법이 없어서 칩으로 했다.
  const toggleSingle = (field, current, next) =>
    onChange({ [field]: current === next ? null : next });

  const handleCategoryClick = (category) => {
    const next = preferredCategories.includes(category)
      ? preferredCategories.filter((item) => item !== category)
      : [...preferredCategories, category];
    onChange({ preferredCategories: next });
  };

  return (
    <section className="flex flex-col gap-5 border-t border-text/10 pt-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-subtitle font-bold">{t('wizard.style.title')}</h2>
        <p className="text-body-sm text-text/70">{t('wizard.style.hint')}</p>
      </div>

      <RadioCardGroup
        legend={t('wizard.style.styleLegend')}
        options={TRAVEL_STYLES.map((value) => ({
          value,
          title: t(`wizard.style.style.${value}.title`),
          description: t(`wizard.style.style.${value}.description`),
        }))}
        value={style}
        onChange={(value) => onChange({ style: value })}
      />

      <fieldset className={CHIP_GROUP_CLASS}>
        <legend className={LEGEND_CLASS}>{t('wizard.style.companionLegend')}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMPANIONS.map((key) => (
            <Chip
              key={key}
              label={t(`wizard.style.companion.${key}`)}
              selected={companion === key}
              onClick={() => toggleSingle('companion', companion, key)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className={CHIP_GROUP_CLASS}>
        <legend className={LEGEND_CLASS}>{t('wizard.style.budgetLegend')}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {BUDGET_RANGES.map(({ key }) => (
            <Chip
              key={key}
              label={t(`wizard.style.budget.${key}`)}
              selected={budget === key}
              onClick={() => toggleSingle('budget', budget, key)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className={CHIP_GROUP_CLASS}>
        <legend className={LEGEND_CLASS}>{t('wizard.style.categoryLegend')}</legend>
        <p className="text-body-sm text-text/70">{t('wizard.style.categoryHint')}</p>
        <div className="flex flex-wrap gap-2">
          {PLACE_CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={t(`common.category.${category}`)}
              selected={preferredCategories.includes(category)}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
}
