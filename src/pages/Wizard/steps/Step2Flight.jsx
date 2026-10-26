import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import FlightBookedForm from '../flight/FlightBookedForm';
import { EMPTY_FLIGHT, validateFlight } from '../flight/flightOptions';
import FlightSearch from '../flight/FlightSearch';
import RadioCardGroup from '../RadioCardGroup';
import WizardNav from '../WizardNav';

const FLIGHT_STATUSES = ['booked', 'searching'];

// STEP2 항공 (47·49, 추가 기능). 이미 예약했으면 직접 입력, 아직이면 목업에서 고르고 외부 사이트로 예약하러 간다.
// 한국 여행은 대부분 비행기를 타지 않아서 목업 목록 없이 직접 입력만 두고 건너뛰기를 안내한다.
// 고른 시각은 STEP7 저장 때 플랜 store(C)로 넘어가고, 일정 시간 반영(48)은 플래너가 맡는다.
export default function Step2Flight({ onPrev, onNext }) {
  const { t } = useTranslation();
  const draft = useWizardStore((state) => state.draft);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  const [errorKey, setErrorKey] = useState(null);
  const isDomestic = draft.country === 'KR';
  // 한국 여행은 고르는 칸 없이 항상 직접 입력이다. 직접 입력 값이 아니면(없거나, 예전 검색 값이 남았으면)
  // 빈 직접 입력으로 본다 — 국내 화면에는 검색으로 바꿀 방법이 없어서 검색 값이 남으면 고칠 수 없다.
  const flight =
    isDomestic && draft.flight?.status !== 'booked'
      ? { ...EMPTY_FLIGHT, status: 'booked' }
      : draft.flight;

  const saveFlight = (nextFlight) => {
    updateDraft({ flight: nextFlight });
    setErrorKey(null);
  };

  const handleChange = (patch) => saveFlight({ ...flight, ...patch });

  // 건너뛰기 = 항공 정보 없음. 골라 둔 값도 지운다 (STEP4와 같은 규칙).
  const handleSkip = () => {
    saveFlight(null);
    onNext();
  };

  const handleNext = () => {
    const nextError = validateFlight(flight, { isSameDay: draft.startDate === draft.endDate });
    if (nextError) {
      setErrorKey(nextError);
      return;
    }
    onNext();
  };

  const trip = {
    city: draft.city,
    startDate: draft.startDate,
    endDate: draft.endDate,
    people: draft.people,
  };

  return (
    <div className="flex flex-col gap-5">
      {isDomestic ? (
        <p className="rounded-2xl bg-bg-soft p-4 text-body-sm break-keep">
          {t('wizard.flight.domesticNotice')}
        </p>
      ) : (
        <RadioCardGroup
          legend={t('wizard.flight.question')}
          options={FLIGHT_STATUSES.map((status) => ({
            value: status,
            title: t(`wizard.flight.status.${status}.title`),
            description: t(`wizard.flight.status.${status}.description`),
          }))}
          value={flight?.status ?? null}
          onChange={(status) => saveFlight({ ...EMPTY_FLIGHT, status })}
        />
      )}

      {flight?.status === 'booked' && (
        <FlightBookedForm
          flight={flight}
          startDate={draft.startDate}
          endDate={draft.endDate}
          onChange={handleChange}
        />
      )}
      {flight?.status === 'searching' && (
        <FlightSearch flight={flight} trip={trip} onSelect={saveFlight} />
      )}

      <p className="text-body-sm text-text/70 break-keep">{t('wizard.flight.hint')}</p>
      {errorKey && (
        <p role="alert" className="text-body-sm text-error">
          {t(errorKey)}
        </p>
      )}
      <WizardNav onPrev={onPrev} onSkip={handleSkip} onNext={handleNext} />
    </div>
  );
}
