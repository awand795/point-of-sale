import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
    }, []);

    const showToast = useCallback((type = 'warning', message = '') => {
        const id = ++toastId;
        const toast = { id, type, message, entering: true };

        setToasts(prev => [...prev, toast]);

        // Remove entering class after animation
        requestAnimationFrame(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, entering: false } : t));
        });

        // Auto dismiss after 4 seconds
        timersRef.current[id] = setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            setTimeout(() => removeToast(id), 300);
        }, 4000);

        return id;
    }, [removeToast]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(clearTimeout);
        };
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}

            {/* Toast Container */}
            <div
                className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
                style={{ maxWidth: '420px' }}
            >
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const iconMap = {
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        titleColor: 'text-amber-800',
        descColor: 'text-amber-700',
        progress: 'bg-amber-400',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800',
        descColor: 'text-red-700',
        progress: 'bg-red-400',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
    success: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        titleColor: 'text-emerald-800',
        descColor: 'text-emerald-700',
        progress: 'bg-emerald-400',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800',
        descColor: 'text-blue-700',
        progress: 'bg-blue-400',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
    },
};

const ToastItem = ({ toast, onDismiss }) => {
    const { type, message, entering, exiting } = toast;
    const styles = iconMap[type] || iconMap.info;

    // Extract title and description from message
    const isDemoMsg = message?.includes('Mode demo');
    const title = isDemoMsg ? '🔒 Mode Demo' : type.charAt(0).toUpperCase() + type.slice(1);
    const desc = isDemoMsg ? 'Fitur ini tidak tersedia dalam mode demo. Silakan login dengan akun sebenarnya untuk melakukan perubahan data.' : (message || '');

    return (
        <div
            className={`
                pointer-events-auto
                relative overflow-hidden
                ${styles.bg} ${styles.border}
                border-2 rounded-2xl
                shadow-2xl shadow-amber-900/10
                backdrop-blur-md
                transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${entering ? 'translate-x-[120%] opacity-0 scale-90' : exiting ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}
            `}
        >
            {/* Progress bar */}
            <div className={`absolute bottom-0 left-0 h-1 ${styles.progress} rounded-full animate-shrink`}
                style={{ animation: 'shrink 4s linear forwards' }}
            />

            <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center ${styles.iconColor} shrink-0`}>
                    {styles.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black ${styles.titleColor} uppercase tracking-tight`}>
                        {title}
                    </p>
                    <p className={`text-xs font-medium ${styles.descColor} mt-0.5 leading-relaxed`}>
                        {desc}
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={onDismiss}
                    className={`w-7 h-7 rounded-lg ${styles.iconBg} ${styles.iconColor} flex items-center justify-center hover:opacity-80 transition-opacity shrink-0`}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

// Add the progress bar animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
    }
`;
document.head.appendChild(style);

export default ToastProvider;
