import { BarChart3, RefreshCw, X } from 'lucide-react';

/**
 * A clean empty state component for when there's no data.
 */
const EmptyState = ({
    icon: Icon = BarChart3,
    title = 'Tidak Ada Data',
    description = 'Belum ada data untuk ditampilkan.',
    action,
    onAction,
    actionLabel = 'Refresh',
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.04]
                border border-slate-200/60 dark:border-white/[0.06]
                flex items-center justify-center mb-4">
                {Icon && <Icon size={32} className="text-slate-300 dark:text-slate-600" />}
            </div>
            <p className="text-[16px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {title}
            </p>
            <p className="text-[14px] text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
                {description}
            </p>
            {action && onAction && (
                <button
                    onClick={onAction}
                    className="mt-6 px-5 py-2.5 bg-primary-500 text-white text-[14px]
                        font-semibold rounded-xl hover:bg-primary-600 transition-all
                        shadow-sm shadow-primary-500/20 active:scale-[0.97] flex items-center gap-2"
                >
                    <RefreshCw size={14} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

/**
 * A loading skeleton for tables
 */
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02]">
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i} className="px-5 py-3.5">
                                <div className="h-3 w-16 bg-slate-100 dark:bg-white/[0.06] rounded animate-pulse" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, r) => (
                        <tr key={r} className="border-t border-slate-50 dark:border-white/[0.04]">
                            {Array.from({ length: cols }).map((_, c) => (
                                <td key={c} className="px-5 py-3.5">
                                    <div className={`h-4 bg-slate-50 dark:bg-white/[0.04] rounded animate-pulse ${c === 0 ? 'w-32' : c === cols - 1 ? 'w-12 ml-auto' : 'w-20'}`} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

/**
 * A branded loading spinner
 */
export const LoadingSpinner = ({ text = 'Memuat...' }) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4
                border-slate-200 dark:border-white/[0.08]" />
            <div className="absolute inset-0 rounded-full border-4
                border-primary-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-[14px] font-medium text-slate-400 dark:text-slate-500">{text}</p>
    </div>
);

/**
 * Error state component for inline errors
 */
export const ErrorState = ({ error, onRetry }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 dark:bg-red-500/10
        border border-red-100 dark:border-red-500/20 rounded-xl">
        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20
            flex items-center justify-center shrink-0">
            <X size={12} className="text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
            <p className="text-[14px] font-medium text-red-700 dark:text-red-400">{error}</p>
        </div>
        {onRetry && (
            <button
                onClick={onRetry}
                className="text-[13px] font-semibold text-red-600 dark:text-red-400
                    hover:text-red-700 dark:hover:text-red-300 transition-colors shrink-0"
            >
                Ulangi
            </button>
        )}
    </div>
);

export default EmptyState;
