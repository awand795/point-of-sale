import { RefreshCw, BarChart3 } from 'lucide-react';

/**
 * A beautiful empty state component for when there's no data.
 * Displays a large icon, a title, a description, and an optional action button.
 */
const EmptyState = ({
    icon: Icon = BarChart3,
    title = 'Tidak Ada Data',
    description = 'Belum ada data untuk ditampilkan. Mulai dengan menambahkan data baru atau kembali lagi nanti.',
    action,
    onAction,
    actionLabel = 'Refresh',
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-20 px-6 ${className}`}>
            {/* Decorative background */}
            <div className="relative mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-slate-200/50">
                        <Icon size={40} className="text-slate-300" />
                    </div>
                </div>
                {/* Floating dots decoration */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary-200 rounded-full animate-pulse" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Text */}
            <div className="text-center max-w-md">
                <h3 className="text-xl font-black text-slate-400 tracking-tight mb-2">
                    {title}
                </h3>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Action Button */}
            {action && onAction && (
                <button
                    onClick={onAction}
                    className="mt-8 inline-flex items-center gap-2.5 px-6 py-3 bg-primary-600 text-white text-sm font-bold rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all active:scale-[0.98] group"
                >
                    <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                    {actionLabel}
                </button>
            )}

            {/* Helpful tip */}
            {!action && (
                <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    ✨ Data akan muncul di sini setelah tersedia
                </p>
            )}
        </div>
    );
};

/**
 * A premium loading skeleton for tables
 */
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i} className="px-8 py-5">
                                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, r) => (
                        <tr key={r} className="border-t border-slate-50">
                            {Array.from({ length: cols }).map((_, c) => (
                                <td key={c} className="px-8 py-5">
                                    <div className={`h-5 bg-slate-100 rounded animate-pulse ${c === 0 ? 'w-36' : c === cols - 1 ? 'w-16 ml-auto' : 'w-24'}`} />
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
 * A premium loading spinner
 */
export const LoadingSpinner = ({ text = 'Memuat data...' }) => (
    <div className="flex flex-col items-center justify-center h-96 gap-5">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-primary-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <div className="text-center">
            <p className="text-sm font-bold text-slate-400">{text}</p>
            <p className="text-[10px] text-slate-300 font-medium mt-1">Harap tunggu sebentar</p>
        </div>
    </div>
);

/**
 * A demo badge indicator
 */
export const DemoBadge = ({ size = 'sm' }) => {
    const sizeClasses = size === 'lg'
        ? 'px-3 py-1 text-[11px]'
        : 'px-2.5 py-0.5 text-[9px]';

    return (
        <span className={`inline-flex items-center gap-1.5 ${sizeClasses} bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 font-black uppercase tracking-widest rounded-lg border border-amber-200 shadow-sm`}>
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
            </span>
            Demo
        </span>
    );
};

export default EmptyState;
