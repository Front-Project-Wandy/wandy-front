// i18n 설정 (A파트 담당) — 지금은 한국어만. 영·일(88)은 A파트가 붙인다.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './ko.json';

i18n.use(initReactI18next).init({
  resources: { ko: { translation: ko } },
  lng: 'ko',
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

export default i18n;
