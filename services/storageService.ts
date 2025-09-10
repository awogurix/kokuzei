
import { AppData, UrgeEvent, MoodLog, AIChatMessage } from '../types';

const STORAGE_KEY = 'namiNaviData';

const getInitialData = (): AppData => ({
  urgeEvents: [],
  moodLogs: [],
  aiChatHistory: [],
  settings: {
    nickname: 'あなた',
  },
});

export const loadData = (): AppData => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return getInitialData();
    }
    const data = JSON.parse(serializedData);
    // Ensure all keys exist to prevent errors with older data structures
    const initialData = getInitialData();
    const loadedSettings = { ...initialData.settings, ...data.settings };
    return { ...initialData, ...data, settings: loadedSettings };
  } catch (error) {
    console.error('Error loading data from localStorage', error);
    return getInitialData();
  }
};

export const saveData = (data: AppData): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Error saving data to localStorage', error);
  }
};