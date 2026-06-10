import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable data table with sorting and pagination.
 */
const DataTable = ({
    columns = [],
    data = [],
    pageSize = 10,
    currentPage: controlledPage,
    totalPages: controlledTotalPages,
    onPageChange,
    emptyState,
    loading,
}) => {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [localPage, setLocalPage] = useState(1);

    const isControlled = controlledPage !== undefined;
    const page = isControlled ? controlledPage : localPage;

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortKey] ?? '';
            const bVal = b[sortKey] ?? '';
            const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, sortKey, sortDir]);

    const totalPages = isControlled ? controlledTotalPages : Math.ceil(sortedData.length / pageSize);
    const start = (page - 1) * pageSize;
    const pageData = isControlled ? sortedData : sortedData.slice(start, start + pageSize);

    const goTo = (p) => {
        if (p < 1 || p > totalPages) return;
        if (isControlled) onPageChange(p);
        else setLocalPage(p);
    };

    if (loading) {
        return (
            <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
                <div className="p-8 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-slate-200 dark:border-white/[0.06] border-t-primary-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (data.length === 0 && emptyState) {
        return emptyState;
    }

    return (
        <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/[0.06]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 ${
                                        col.sortable ? 'cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none' : ''
                                    } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    style={col.width ? { width: col.width } : undefined}
                                >
                                    <div className="inline-flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && sortKey === col.key && (
                                            sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                        {pageData.map((row, i) => (
                            <tr
                                key={row.id ?? i}
                                className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-4 py-3 text-sm ${
                                            col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                                        }`}
                                    >
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/[0.06]">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        Showing {start + 1}–{Math.min(start + pageSize, data.length)} of {data.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => goTo(page - 1)}
                            disabled={page <= 1}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => goTo(p)}
                                className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-all ${
                                    page === p
                                        ? 'bg-primary-500 text-white'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => goTo(page + 1)}
                            disabled={page >= totalPages}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
