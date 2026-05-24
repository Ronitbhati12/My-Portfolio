import { useState, useEffect } from 'react';
import { ThemeContext } from './theme-context';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [aura, setAura] = useState('blue');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-aura', aura);
  }, [aura]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, aura, setAura }}>
      {children}
    </ThemeContext.Provider>
  );
}
