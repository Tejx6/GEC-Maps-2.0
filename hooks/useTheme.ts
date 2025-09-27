
import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types';

export const useTheme = (): [Theme, () => void] => {
    const getInitialTheme = (): Theme => {
        if (typeof window !== 'undefined') {
            const storedTheme = window.localStorage.getItem('theme') as Theme;
            if (storedTheme) {
                return storedTheme;
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    };

    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    return [theme, toggleTheme];
};
