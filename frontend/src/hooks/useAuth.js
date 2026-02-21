import { useState, useEffect, useCallback } from "react";
import { authApi } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = useCallback(async () => {
        try {
            const response = await authApi.me();
            setUser(response.data.data);
        } catch (err) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.login(credentials);
            const {user, token} = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            navigate("/");
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
            setUser(null);
            navigate("/login");
        }
    }, [navigate]);

    const isAuthenticated = !!user;
    const isAdmin = user?.roles?.some(role => role.name === "ROLE_ADMIN");
    const isCashier = user?.roles?.some(role => role.name === "ROLE_CASHIER");

    return{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isCashier,
        loading,
        error,
    };
};