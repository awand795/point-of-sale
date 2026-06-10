import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('bikinpos-theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [animating, setAnimating] = useState(false);
    const transitioningRef = useRef(false);

    // Set CSS custom properties for circle reveal click position
    // Falls back to center (50%, 50%) when clientX/clientY not provided
    const setClickPosition = useCallback((clientX, clientY) => {
        const root = document.documentElement;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cx = clientX ?? vw / 2;
        const cy = clientY ?? vh / 2;
        root.style.setProperty('--click-x', `${(cx / vw) * 100}%`);
        root.style.setProperty('--click-y', `${(cy / vh) * 100}%`);
    }, []);

    // Apply theme class to document
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('bikinpos-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    // Allow external code to set the theme directly (e.g., from server sync)
    const setTheme = useCallback((dark) => {
        setIsDark(dark);
    }, []);

    const toggleTheme = useCallback((clientX, clientY) => {
        if (transitioningRef.current) return;
        transitioningRef.current = true;

        const root = document.documentElement;
        
        // Set click position for circle reveal
        setClickPosition(clientX, clientY);

        // Add transitioning class for smooth CSS transitions
        root.classList.add('theme-transitioning');
        setAnimating(true);

        // Try View Transitions API first (modern browsers)
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                setIsDark(prev => !prev);
            }).ready.then(() => {
                // Remove transitioning class after view transition starts
                setTimeout(() => {
                    root.classList.remove('theme-transitioning');
                    setAnimating(false);
                    transitioningRef.current = false;
                }, 600);
            }).catch(() => {
                // Fallback if view transition fails
                root.classList.remove('theme-transitioning');
                setAnimating(false);
                transitioningRef.current = false;
            });
        } else {
            // Fallback: toggle directly with CSS crossfade
            setIsDark(prev => !prev);
            
            // Remove transitioning class after animation completes
            setTimeout(() => {
                root.classList.remove('theme-transitioning');
                setAnimating(false);
                transitioningRef.current = false;
            }, 500);
        }
    }, [setClickPosition]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme, animating }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
