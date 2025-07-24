import { useState, useEffect } from 'react';
import { Theme } from '../types';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('shivaya-theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Store theme preference
    localStorage.setItem('shivaya-theme', theme);
    
    // Update document attributes for theme switching
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Update body class for additional styling
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};