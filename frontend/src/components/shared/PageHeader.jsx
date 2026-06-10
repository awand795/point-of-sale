import { Plus } from 'lucide-react';

/**
 * Reusable page header with title, subtitle, and optional action buttons.
 */
const PageHeader = ({ title, subtitle, action, onAction, actionLabel, actionIcon: ActionIcon = Plus }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
                )}
            </div>
            {action && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all active:scale-[0.98] shadow-sm"
                >
                    <ActionIcon size={16} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default PageHeader;
