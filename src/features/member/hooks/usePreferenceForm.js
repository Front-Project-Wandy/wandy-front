import { useState } from 'react';
import { arePreferencesEqual } from '../utils/preferences.js';
import { usePreferenceStore } from './usePreferenceStore.js';

export function usePreferenceForm() {
  const preferences = usePreferenceStore((state) => state.preferences);
  const save = usePreferenceStore((state) => state.save);
  const [draft, setDraft] = useState(preferences);
  const [status, setStatus] = useState('');
  // 다른 곳(지난 여행 취향 카드, 66)에서 취향을 바꾸면, 고치던 내용이 없을 때만 폼도 새 값으로 맞춘다.
  // 고치던 중이면 사용자가 고른 값을 지우지 않는다.
  const [syncedPreferences, setSyncedPreferences] = useState(preferences);
  if (preferences !== syncedPreferences) {
    setSyncedPreferences(preferences);
    if (arePreferencesEqual(draft, syncedPreferences)) {
      setDraft(preferences);
      setStatus('');
    }
  }
  const isDirty = !arePreferencesEqual(draft, preferences);

  const handleStyleChange = (style) => {
    setDraft((current) => ({ ...current, style }));
    setStatus('');
  };

  const handleCategoryToggle = (category) => {
    setDraft((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
    setStatus('');
  };

  const handleCancel = () => {
    setDraft(preferences);
    setStatus('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isDirty) return;
    setStatus(save(draft) ? 'saved' : 'error');
  };

  return {
    draft,
    status,
    isDirty,
    handleStyleChange,
    handleCategoryToggle,
    handleCancel,
    handleSubmit,
  };
}
