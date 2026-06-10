import { BarChart3, RefreshCw } from 'lucide-react';

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
        <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
            <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-white/[0.04] flex items-center justify-center mb-5 border border-slate-100 dark:border-white/[0.06]">
                <Icon size={28} className="text-slate-300 dark:text-slate-600" />
            </div>
            <div className="text-center max-w-sm">
                <h3 className="text-base font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                    {title}
                </h3>
                <p className="text-sm text-slate-300 dark:text-slate-600 leading-relaxed">
                    {description}
                </p>
            </div>
            {action && onAction && (
                <button
                    onClick={onAction}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all active:scale-[0.98] shadow-sm"
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
    <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.06]">
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i} className="px-4 py-3">
                                <div className="h-3 w-16 bg-slate-100 dark:bg-white/[0.06] rounded animate-pulse" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, r) => (
                        <tr key={r} className="border-t border-slate-50 dark:border-white/[0.04]">
                            {Array.from({ length: cols }).map((_, c) => (
                                <td key={c} className="px-4 py-3">
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
 * A loading spinner
 */
export const LoadingSpinner = ({ text = 'Memuat data...' }) => (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-8 h-8 border-2 border-slate-200 dark:border-white/[0.06] border-t-primary-500 rounded-full animate-spin" />
        <div className="text-center">
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{text}</p>
        </div>
    </div>
);

export default EmptyState;
