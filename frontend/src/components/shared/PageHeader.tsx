import { Plus } from 'lucide-react';

/**
 * Reusable page header with title, subtitle, and optional action buttons.
 */
const PageHeader = ({ title, subtitle, action, onAction, actionLabel, actionIcon: ActionIcon = Plus }) => {
    return (
        <div className="flex items-start justify-between mb-2">
            <div>
                <h1 className="text-[22px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white
                        text-[14px] font-semibold rounded-xl hover:bg-primary-600 transition-all
                        active:scale-[0.97] shadow-sm shadow-primary-500/20 whitespace-nowrap"
                >
                    {ActionIcon && <ActionIcon size={16} />}
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default PageHeader;
