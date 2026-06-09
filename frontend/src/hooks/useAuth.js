import { useState, useEffect, useCallback } from "react";
import { authApi } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isDemo = localStorage.getItem("isDemo") === "true";

    useEffect(() => {
        const token = localStorage.getItem("token");
        const cachedUser = localStorage.getItem("user");
        if (token && cachedUser) {
            try {
                setUser(JSON.parse(cachedUser));
            } catch {
                fetchUser();
                return;
            }
            setLoading(false);
        } else if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = useCallback(async () => {
        try {
            const response = await authApi.me();
            setUser(response.data.data);
            localStorage.setItem("user", JSON.stringify(response.data.data));
        } catch (err) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (credentials, isDemo = false) => {
        setLoading(true);
        setError(null);

        // Demo mode: login completely offline with mock data
        if (isDemo) {
            const demoUserData = {
                id: 1,
                name: 'Demo User',
                email: 'demo@example.com',
                phone: '081234567890',
                is_active: true,
                last_login_at: new Date().toISOString(),
                roles: [{ id: 1, name: 'admin', guard_name: 'web' }],
            };
            localStorage.setItem("token", "demo-token-luxepos");
            localStorage.setItem("user", JSON.stringify(demoUserData));
            localStorage.setItem("isDemo", "true");
            setUser(demoUserData);
            navigate("/dashboard");
            setLoading(false);
            return { success: true };
        }

        try {
            const response = await authApi.login(credentials);
            const {user, token} = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            navigate("/dashboard");
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            return { success: false, error: err.response?.data?.message || "Login failed" };
        } finally {
            setLoading(false);
        }
    },[navigate]);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.log(err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isDemo");
            setUser(null);
            navigate("/");
        }
    }, [navigate]);

    const isAuthenticated = !!user;
    const isAdmin = user?.roles?.some(role => role.name === "admin");
    const isCashier = user?.roles?.some(role => role.name === "cashier");

    return{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isCashier,
        isDemo,
        loading,
        error,
    };
};
