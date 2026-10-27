import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Chip from '../../../components/common/Chip';
import { PLACE_CATEGORIES } from '../../search/place';
import { TRAVEL_STYLES } from '../constants';
import { usePreferenceForm } from '../hooks/usePreferenceForm';

export default function ProfilePreferences() {
  const { t } = useTranslation();
  const id = useId();
  const {
    draft,
    status,
    isDirty,
    handleStyleChange,
    handleCategoryToggle,
    handleCancel,
    handleSubmit,
  } = usePreferenceForm();

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="rounded-2xl border border-text/10 p-4 sm:p-6"
    >
      <div className="mb-6 space-y-2">
        <h2 id={`${id}-title`} className="text-subtitle font-bold">
          {t('my.preferences.title')}
        </h2>
        <p id={`${id}-notice`} className="text-body-sm text-text/70">
          {t('my.preferences.notice')}
        </p>
      </div>

      <form onSubmit={handleSubmit} aria-describedby={`${id}-notice`} className="space-y-6">
        <fieldset className="min-w-0">
          <legend className="mb-3 font-bold">{t('my.preferences.styleLabel')}</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {TRAVEL_STYLES.map((style) => (
              <label key={style} className="relative cursor-pointer">
                <input
                  type="radio"
                  name={`${id}-style`}
                  value={style}
                  checked={draft.style === style}
                  onChange={() => handleStyleChange(style)}
                  aria-describedby={`${id}-${style}-description`}
                  className="peer sr-only"
                />
                <span className="flex h-full flex-col gap-1 rounded-xl border border-text/20 p-4 peer-checked:border-primary peer-checked:bg-bg-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                  <span className="font-bold">{t(`my.preferences.styles.${style}.label`)}</span>
                  <span id={`${id}-${style}-description`} className="text-body-sm text-text/70">
                    {t(`my.preferences.styles.${style}.description`)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0" aria-describedby={`${id}-categories-help`}>
          <legend className="mb-2 font-bold">{t('my.preferences.categoriesLabel')}</legend>
          <p id={`${id}-categories-help`} className="mb-3 text-body-sm text-text/70">
            {t('my.preferences.categoriesHelp')}
          </p>
          <div className="flex flex-wrap gap-2">
            {PLACE_CATEGORIES.map((category) => (
              <Chip
                key={category}
                label={t(`common.category.${category}`)}
                selected={draft.categories.includes(category)}
                onClick={() => handleCategoryToggle(category)}
              />
            ))}
          </div>
        </fieldset>

        <div className="space-y-3 border-t border-text/10 pt-4">
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!isDirty}>
              {t('my.preferences.save')}
            </Button>
            <Button variant="ghost" disabled={!isDirty} onClick={handleCancel}>
              {t('my.preferences.cancel')}
            </Button>
          </div>
          <p role="status" className="text-body-sm text-text/70">
            {status === 'saved'
              ? t('my.preferences.saved')
              : isDirty && status !== 'error'
                ? t('my.preferences.unsaved')
                : ''}
          </p>
          {status === 'error' && (
            <p role="alert" className="text-body-sm text-text">
              {t('my.preferences.error')}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
