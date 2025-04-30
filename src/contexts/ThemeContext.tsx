
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  userPreferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: boolean) => void;
};

export type UserPreferences = {
  darkMode: boolean;
  dailyReminders: boolean;
  activitySuggestions: boolean;
  soundEffects: boolean;
  dataCollection: boolean;
};

const defaultPreferences: UserPreferences = {
  darkMode: false,
  dailyReminders: false,
  activitySuggestions: false,
  soundEffects: false,
  dataCollection: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  const isDarkMode = userPreferences.darkMode;

  useEffect(() => {
    // Update localStorage when preferences change
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    
    // Update the document class for dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userPreferences, isDarkMode]);

  const toggleDarkMode = () => {
    setUserPreferences(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  const updatePreference = (key: keyof UserPreferences, value: boolean) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      userPreferences,
      updatePreference
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
