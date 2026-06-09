import { useState, useEffect, useCallback } from 'react';
import { settingApi } from '../api/setting';

export const useSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await settingApi.getAll();
            setSettings(response.data.data || {});
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSettings = async (settingsData) => {
        setError(null);
        try {
            const response = await settingApi.update({ settings: settingsData });
            setSettings(response.data.data || {});
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update settings');
            throw err;
        }
    };

    return {
        settings, loading, error,
        updateSettings, fetchSettings,
    };
};
