import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';

/**
 * ThemeSync lives inside <Router> so it can access useAuth.
 * On mount/user change, it loads the user's server-side theme preference.
 * On theme change (triggered by manual toggle), it syncs to the backend.
 */
const ThemeSync = () => {
    const { isDark, setTheme } = useTheme();
    const { user, isDemo } = useAuth();

    // Load theme from server whenever user changes
    useEffect(() => {
        if (!user || !user.theme) return;
        // Server theme takes priority — only apply if explicitly set
        setTheme(user.theme === 'dark');
    }, [user?.id, user?.theme, setTheme]);

    // Sync theme changes to backend (skip demo mode, skip user-less state)
    useEffect(() => {
        if (!user || isDemo) return;

        const themeValue = isDark ? 'dark' : 'light';

        const syncTimer = setTimeout(() => {
            authApi.updateTheme(themeValue).catch(() => {
                // Silently fail — localStorage fallback still works
            });
        }, 300); // Debounce to avoid rapid requests during animation

        return () => clearTimeout(syncTimer);
    }, [isDark, user, isDemo]);

    return null;
};

export default ThemeSync;
