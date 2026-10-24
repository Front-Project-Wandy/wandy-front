import { useState } from 'react';
import { arePreferencesEqual } from '../utils/preferences.js';
import { usePreferenceStore } from './usePreferenceStore.js';

export function usePreferenceForm() {
  const preferences = usePreferenceStore((state) => state.preferences);
  const save = usePreferenceStore((state) => state.save);
  const [draft, setDraft] = useState(preferences);
  const [status, setStatus] = useState('');
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
