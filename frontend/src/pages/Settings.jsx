import { useState, useEffect } from 'react';
import { Save, Settings2, Building, Receipt, Bell, Shield } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LoadingSpinner } from "../components/shared/EmptyState";
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
    const { t } = useLanguage();
    const { settings, loading, error, updateSettings } = useSettings();
    const { isDemo } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('general');
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const tabs = [
        { id: 'general', label: 'General', icon: Settings2 },
        { id: 'business', label: 'Business', icon: Building },
        { id: 'receipt', label: 'Receipt', icon: Receipt },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const handleSave = async () => {
        if (isDemo) {
            showToast('warning');
            return;
        }
        setSaving(true);
        setSuccess(false);
        try {
            const settingsArray = Object.entries(form).map(([key, value]) => ({
                key, value, group: activeTab,
            }));
            await updateSettings(settingsArray);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setSuccess(false);
        } finally {
            setSaving(false);
        }
    };

    // Sync settings into form state when data loads
    useEffect(() => {
        if (Object.keys(settings).length > 0) {
            const merged = {};
            Object.values(settings).forEach(group => {
                group.forEach(setting => {
                    merged[setting.key] = setting.value;
                });
            });
            setForm(prev => ({ ...prev, ...merged }));
        }
    }, [settings]);

    const updateForm = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <LoadingSpinner text="Memuat pengaturan..." />;

    const generalFields = ['app_name', 'app_description', 'currency', 'tax_rate', 'language'];
    const businessFields = ['company_name', 'company_address', 'company_phone', 'company_email', 'tax_id'];
    const receiptFields = ['receipt_footer', 'receipt_header', 'show_logo'];
    const notificationFields = ['low_stock_alert', 'daily_report', 'email_notifications'];

    const fieldGroups = {
        general: generalFields,
        business: businessFields,
        receipt: receiptFields,
        notifications: notificationFields,
    };

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('sidebar.settings')}</h1><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Configure your application settings</p></div>

            <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl w-fit">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                            <Icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="space-y-5">
                    {fieldGroups[activeTab]?.map(field => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 capitalize">{field.replace(/_/g, ' ')}</label>
                            {field.includes('description') || field.includes('header') || field.includes('footer') ? (
                                <textarea value={form[field] || settings[activeTab]?.find(s => s.key === field)?.value || ''} onChange={(e) => updateForm(field, e.target.value)} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" rows="3" />
                            ) : field.includes('show_logo') || field.includes('notifications') || field.includes('alert') || field.includes('report') ? (
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={form[field] === 'true' || settings[activeTab]?.find(s => s.key === field)?.value === 'true'} onChange={(e) => updateForm(field, e.target.checked ? 'true' : 'false')} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Enabled</span>
                                </div>
                            ) : (
                                <input type={field.includes('rate') || field.includes('tax') ? 'number' : 'text'} value={form[field] || settings[activeTab]?.find(s => s.key === field)?.value || ''} onChange={(e) => updateForm(field, e.target.value)} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-700">
                    {success && <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><Shield size={14} />Settings saved successfully</p>}
                    {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
                    {!success && !error && <div />}
                    <button onClick={handleSave} disabled={saving || isDemo} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-sm"><Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
