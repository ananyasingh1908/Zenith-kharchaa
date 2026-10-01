import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSettings, updateSettings as apiUpdateSettings } from '../api/settingsApi';
import { mockStore } from '../api/mockStore';
import { getHourlyWage } from '../utils/timeCost';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => mockStore.getSettings());
  const [loading, setLoading] = useState(true);

  const applyAppearance = useCallback((mode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else if (mode === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await getSettings();
        if (res.settings) {
          setSettings(res.settings);
          applyAppearance(res.settings.appearance);
        }
      } catch {
        applyAppearance('light');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [applyAppearance]);

  const update = useCallback(async (newFields) => {
    const res = await apiUpdateSettings(newFields);
    setSettings(res.settings);
    if (newFields.appearance) {
      applyAppearance(newFields.appearance);
    }
    return res.settings;
  }, [applyAppearance]);

  const hourlyWage = getHourlyWage(settings);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        hourlyWage,
        loading,
        updateSettings: update,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettingsContext must be used within SettingsProvider');
  return context;
}
