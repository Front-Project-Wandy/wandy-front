import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import { useAllTrips } from '../../../store/plan/useAllTrips';
import { usePreferenceStore } from '../hooks/usePreferenceStore';
import { buildTravelProfile } from '../utils/buildTravelProfile';
import { arePreferencesEqual, normalizePreferences } from '../utils/preferences';

// 마이페이지 "지난 여행으로 본 내 취향" (66). 저장한 여행에서 자주 담은 장소·하루 일정·이동·식사 스타일을 보여 주고,
// [이 취향으로 설정]을 누르면 스타일·카테고리를 여행 취향(37)에 저장해 다음 여행 기본값(65)으로 쓴다.
// 플랜 store는 읽기만 한다.
export default function TravelProfile() {
  const { t } = useTranslation();
  const titleId = useId();
  const profile = buildTravelProfile(useAllTrips());
  const preferences = usePreferenceStore((state) => state.preferences);
  const save = usePreferenceStore((state) => state.save);
  const [status, setStatus] = useState('');

  const renderBody = () => {
    if (!profile) {
      return (
        <EmptyState
          title={t('my.profile.emptyTitle')}
          description={t('my.profile.emptyDescription')}
        />
      );
    }

    const next = normalizePreferences({
      style: profile.density.style,
      categories: profile.categories.map(({ category }) => category),
    });
    const isApplied = arePreferencesEqual(next, preferences);
    const handleApply = () => setStatus(save(next) ? 'saved' : 'error');

    const rows = [
      {
        key: 'categories',
        value: profile.categories
          .map(({ category, percent }) =>
            t('my.profile.categoryPercent', {
              category: t(`common.category.${category}`),
              percent,
            }),
          )
          .join(' · '),
      },
      {
        key: 'density',
        value: t('my.profile.densityValue', {
          count: profile.density.spotsPerDay,
          style: t(`my.preferences.styles.${profile.density.style}.label`),
        }),
      },
      profile.transportMode && {
        key: 'transport',
        value: t(`wizard.transport.mode.${profile.transportMode}.title`),
      },
      profile.mealStyle && { key: 'meal', value: t(`my.profile.mealStyle.${profile.mealStyle}`) },
    ].filter(Boolean);

    return (
      <div className="space-y-4">
        <p className="text-body-sm text-text/70">
          {t('my.profile.basis', { trips: profile.tripCount, places: profile.placeCount })}
        </p>
        <dl className="space-y-2">
          {rows.map(({ key, value }) => (
            <div key={key} className="flex gap-3">
              <dt className="w-24 shrink-0 text-body-sm text-text/70">
                {t(`my.profile.label.${key}`)}
              </dt>
              <dd className="min-w-0 text-body-sm font-bold break-keep">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-2 border-t border-text/10 pt-4">
          <Button variant="secondary" disabled={isApplied} onClick={handleApply}>
            {t('my.profile.apply')}
          </Button>
          <p role="status" className="text-body-sm text-text/70 break-keep">
            {status === 'saved'
              ? t('my.profile.applied')
              : isApplied
                ? t('my.profile.alreadyApplied')
                : t('my.profile.applyHint')}
          </p>
          {status === 'error' && (
            <p role="alert" className="text-body-sm text-text">
              {t('my.preferences.error')}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId} className="rounded-2xl border border-text/10 p-4 sm:p-6">
      <h2 id={titleId} className="mb-4 text-subtitle font-bold">
        {t('my.profile.title')}
      </h2>
      {renderBody()}
    </section>
  );
}
