import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Chip from '../../../components/common/Chip';
import ErrorState from '../../../components/common/ErrorState';
import Input from '../../../components/common/Input';
import { usePreferenceStore } from '../../member/hooks/usePreferenceStore';
import { getLocalDateString } from '../../member/utils/tripDates';
import { useFillItinerary } from '../hooks/useFillItinerary';
import { useParseTripRequest } from '../hooks/useParseTripRequest';
import {
  buildOneLineFillConditions,
  getEndDate,
  listTripDates,
  toWizardSpots,
} from '../utils/buildOneLineSpots';

const EXAMPLE_KEYS = ['example1', 'example2', 'example3'];
const DEFAULT_PEOPLE = 2;

// 한 줄 요청으로 여행 만들기 (56). "2박3일 도쿄 먹방"을 알아듣고, 가는 날만 고르면 마법사를 시작한다.
// [이걸로 시작]을 누르면 onStart(values)로 홈 시작 영역과 같은 모양의 값을 넘긴다 (useStartTrip.requestStart).
// values: { country, city, startDate, endDate, people, style?, preferredCategories?, companion?, spots? }
// 문장에서 못 찾은 스타일·카테고리는 넘기지 않아서 프로필 기본값(65)이 들어간다.
// 「장소도 AI가 미리 담아 두기」를 켜면 AI 빈 일정 채우기(55)로 고른 장소를 spots로 같이 넘긴다.
export default function OneLineTripForm({ onStart }) {
  const { t } = useTranslation();
  const titleId = useId();
  const dateErrorId = useId();
  const preferences = usePreferenceStore((state) => state.preferences);
  const parse = useParseTripRequest();
  const fill = useFillItinerary();
  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [shouldFillSpots, setShouldFillSpots] = useState(true);
  const [dateError, setDateError] = useState(null);
  // [이걸로 시작] 뒤 AI가 장소를 고르는 동안 문장·날짜·옵션을 바꾸면, 늦게 온 결과로 바뀌기 전 여행을 열지 않게
  // 입력이 바뀔 때마다 번호를 올리고, 결과가 왔을 때 번호가 같을 때만 시작한다.
  const inputVersion = useRef(0);
  const markInputChanged = () => {
    inputVersion.current += 1;
  };
  const request = parse.data;

  const handleTextChange = (value) => {
    markInputChanged();
    setText(value);
    // 문장이 바뀌면 이전에 알아들은 내용은 맞지 않아서 지운다
    parse.reset();
  };

  const handleParse = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    parse.mutate(text, {
      onSuccess: (result) => {
        if (result.days && startDate) setEndDate(getEndDate(startDate, result.days));
      },
    });
  };

  const handleStartDateChange = (value) => {
    markInputChanged();
    setStartDate(value);
    setDateError(null);
    // 기간을 알아들었으면 오는 날을 맞춰 준다 (직접 고칠 수도 있다)
    if (value && request?.days) setEndDate(getEndDate(value, request.days));
  };

  const validateDates = () => {
    if (!startDate || !endDate) return 'wizard.basic.error.dates';
    if (startDate < getLocalDateString()) return 'wizard.basic.error.pastDate';
    if (endDate < startDate) return 'wizard.basic.error.dateOrder';
    return null;
  };

  const handleStart = async () => {
    const version = inputVersion.current;
    const nextError = validateDates();
    setDateError(nextError);
    if (nextError) return;

    const { country, city, people, style, preferredCategories, companion } = request;
    const values = {
      country,
      city,
      startDate,
      endDate,
      people: people ?? DEFAULT_PEOPLE,
      ...(style ? { style } : {}),
      ...(preferredCategories.length > 0 ? { preferredCategories } : {}),
      ...(companion ? { companion } : {}),
    };

    if (shouldFillSpots) {
      // 마법사가 넣을 프로필 기본값과 같은 값으로 AI에 요청한다
      const result = await fill
        .mutateAsync(
          buildOneLineFillConditions({
            country,
            city,
            style: style ?? preferences.style ?? 'normal',
            preferredCategories:
              preferredCategories.length > 0 ? preferredCategories : preferences.categories,
            dates: listTripDates(startDate, endDate),
          }),
        )
        .catch(() => null);
      if (!result || inputVersion.current !== version) return;
      values.spots = toWizardSpots(result.days);
    }
    onStart(values);
  };

  const renderValue = (label, value) => (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-body-sm text-text/70">{label}</dt>
      <dd className="min-w-0 text-body-sm font-bold">{value ?? t('ai.oneLine.notSet')}</dd>
    </div>
  );

  const renderDays = (days) => {
    if (!days) return null;
    return days === 1
      ? t('ai.oneLine.dayTrip')
      : t('ai.oneLine.nightsDays', { nights: days - 1, days });
  };

  const renderResult = () => {
    if (parse.isError) return <ErrorState onRetry={() => parse.mutate(text)} />;
    if (!request) return null;

    const cityName = request.city ? t(`common.city.${request.city}`) : null;
    const cityMessage = !request.city
      ? t('ai.oneLine.missingCity')
      : !request.isCityAvailable
        ? t('ai.oneLine.unavailableCity', { city: cityName })
        : null;

    return (
      <div className="flex flex-col gap-4 rounded-2xl bg-bg-soft p-4">
        <h3 className="text-body font-bold">{t('ai.oneLine.resultTitle')}</h3>
        <dl className="flex flex-col gap-1">
          {renderValue(t('ai.oneLine.city'), cityName)}
          {renderValue(t('ai.oneLine.days'), renderDays(request.days))}
          {renderValue(
            t('ai.oneLine.style'),
            request.style ? t(`wizard.style.style.${request.style}.title`) : null,
          )}
          {renderValue(
            t('ai.oneLine.categories'),
            request.preferredCategories.length > 0
              ? request.preferredCategories
                  .map((category) => t(`common.category.${category}`))
                  .join(', ')
              : null,
          )}
          {renderValue(
            t('ai.oneLine.companion'),
            request.companion ? t(`wizard.style.companion.${request.companion}`) : null,
          )}
          {renderValue(
            t('ai.oneLine.people'),
            request.people ? t('ai.oneLine.peopleValue', { count: request.people }) : null,
          )}
        </dl>

        {cityMessage ? (
          <p role="alert" className="text-body-sm font-bold text-text break-keep">
            {cityMessage}
          </p>
        ) : (
          <>
            {request.days ? null : (
              <p className="text-body-sm text-text/70 break-keep">{t('ai.oneLine.missingDays')}</p>
            )}
            {/* 360px에서 두 칸으로 나누면 날짜가 「2026. 11.」까지만 보여서 좁은 화면은 위아래로 둔다 */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="date"
                label={t('ai.oneLine.startDate')}
                value={startDate}
                min={getLocalDateString()}
                onChange={(event) => handleStartDateChange(event.target.value)}
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? dateErrorId : undefined}
              />
              <Input
                type="date"
                label={t('ai.oneLine.endDate')}
                value={endDate}
                min={startDate || getLocalDateString()}
                onChange={(event) => {
                  markInputChanged();
                  setEndDate(event.target.value);
                  setDateError(null);
                }}
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? dateErrorId : undefined}
              />
            </div>
            {dateError ? (
              <p id={dateErrorId} role="alert" className="text-body-sm text-error">
                {t(dateError)}
              </p>
            ) : null}
            <label className="flex items-start gap-2 text-body-sm">
              <input
                type="checkbox"
                checked={shouldFillSpots}
                onChange={(event) => {
                  markInputChanged();
                  setShouldFillSpots(event.target.checked);
                }}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-bold">{t('ai.oneLine.fillSpots')}</span>
                <span className="text-text/70 break-keep">{t('ai.oneLine.fillSpotsHint')}</span>
              </span>
            </label>
            {fill.isError ? (
              <p role="alert" className="text-body-sm text-error break-keep">
                {t('ai.oneLine.fillError')}
              </p>
            ) : null}
            <Button size="lg" className="w-full" loading={fill.isPending} onClick={handleStart}>
              {t('ai.oneLine.start')}
            </Button>
          </>
        )}
        <p className="text-caption text-text/70">{t('ai.oneLine.mockNotice')}</p>
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <h2 id={titleId} className="text-subtitle font-bold">
        {t('ai.oneLine.title')}
      </h2>
      <form onSubmit={handleParse} className="flex flex-col gap-3">
        <Input
          label={t('ai.oneLine.label')}
          value={text}
          onChange={(event) => handleTextChange(event.target.value)}
          placeholder={t('ai.oneLine.placeholder')}
          enterKeyHint="done"
        />
        <div className="flex flex-col gap-2">
          <p className="text-body-sm text-text/70">{t('ai.oneLine.examplesLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_KEYS.map((key) => (
              <Chip
                key={key}
                label={t(`ai.oneLine.${key}`)}
                selected={text === t(`ai.oneLine.${key}`)}
                onClick={() => handleTextChange(t(`ai.oneLine.${key}`))}
              />
            ))}
          </div>
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          loading={parse.isPending}
          disabled={!text.trim()}
        >
          {t('ai.oneLine.submit')}
        </Button>
      </form>
      {renderResult()}
    </section>
  );
}
