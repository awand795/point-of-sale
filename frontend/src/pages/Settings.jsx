import { useState, useEffect } from 'react';
import { Save, Settings2, Building, Receipt, Bell, FileText, Check, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from "../components/shared/EmptyState";

const fieldLabels = {
    app_name: 'Nama Aplikasi',
    app_description: 'Deskripsi',
    currency: 'Mata Uang',
    tax_rate: 'Tarif Pajak (%)',
    language: 'Bahasa Default',
    company_name: 'Nama Perusahaan',
    company_address: 'Alamat',
    company_phone: 'Nomor Telepon',
    company_email: 'Email Perusahaan',
    tax_id: 'NPWP',
    receipt_header: 'Header Struk',
    receipt_footer: 'Footer Struk',
    show_logo: 'Tampilkan Logo',
    pdf_header_text: 'Header PDF',
    pdf_footer_text: 'Footer PDF',
    low_stock_alert: 'Notifikasi Stok Rendah',
    daily_report: 'Laporan Harian',
    email_notifications: 'Notifikasi Email',
};

const fieldDescriptions = {
    show_logo: 'Tampilkan logo perusahaan pada struk cetak',
    low_stock_alert: 'Dapatkan notifikasi saat stok produk menipis',
    daily_report: 'Terima laporan penjualan harian otomatis',
    email_notifications: 'Kirim notifikasi transaksi melalui email',
    receipt_header: 'Teks yang muncul di bagian atas struk',
    receipt_footer: 'Teks yang muncul di bagian bawah struk',
    pdf_header_text: 'Teks header yang muncul di setiap halaman PDF',
    pdf_footer_text: 'Teks footer yang muncul di setiap halaman PDF',
};

const Settings = () => {
    const { t, locale } = useLanguage();
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
        { id: 'pdf', label: 'PDF Export', icon: FileText },
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

    const renderGeneralContent = () => (
        <>
            <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] p-6 shadow-sm">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-4">App Identity</h3>
                <div className="space-y-4">
                    {['app_name', 'app_description'].map(field => (
                        <div key={field}>
                            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {fieldLabels[field] || field}
                            </label>
                            {field.includes('description') ? (
                                <textarea
                                    value={form[field] || ''}
                                    onChange={(e) => updateForm(field, e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none"
                                    rows={3}
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={form[field] || ''}
                                    onChange={(e) => updateForm(field, e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] p-6 shadow-sm mt-5">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-4">Regional</h3>
                <div className="space-y-4">
                    {['currency', 'language', 'tax_rate'].map(field => (
                        <div key={field}>
                            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {fieldLabels[field] || field}
                            </label>
                            <input
                                type={field === 'tax_rate' ? 'number' : 'text'}
                                value={form[field] || ''}
                                onChange={(e) => updateForm(field, e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const renderBusinessContent = () => (
        <>
            <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] p-6 shadow-sm">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-4">Company Info</h3>
                <div className="space-y-4">
                    {['company_name', 'company_address'].map(field => (
                        <div key={field}>
                            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {fieldLabels[field] || field}
                            </label>
                            {field === 'company_address' ? (
                                <textarea
                                    value={form[field] || ''}
                                    onChange={(e) => updateForm(field, e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none"
                                    rows={3}
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={form[field] || ''}
                                    onChange={(e) => updateForm(field, e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] p-6 shadow-sm mt-5">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-4">Contact</h3>
                <div className="space-y-4">
                    {['company_phone', 'company_email', 'tax_id'].map(field => (
                        <div key={field}>
                            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {fieldLabels[field] || field}
                            </label>
                            <input
                                type={field === 'company_email' ? 'email' : 'text'}
                                value={form[field] || ''}
                                onChange={(e) => updateForm(field, e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const renderReceiptContent = () => (
        <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] p-6 shadow-sm">
            <div className="space-y-5">
                {['receipt_header', 'receipt_footer'].map(field => (
                    <div key={field}>
                        <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            {fieldLabels[field] || field}
                        </label>
                        <textarea
                            value={form[field] || ''}
                            onChange={(e) => updateForm(field, e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none"
                            rows={4}
                        />
                        {fieldDescriptions[field] && (
                            <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1">{fieldDescriptions[field]}</p>
                        )}
                    </div>
                ))}
                <div className="border-t border-slate-100 dark:border-white/[0.06] pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200">{fieldLabels['show_logo']}</p>
                            <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">{fieldDescriptions['show_logo']}</p>
                        </div>
                        <button
                            onClick={() => updateForm('show_logo', form['show_logo'] === 'true' ? 'false' : 'true')}
                            className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                                form['show_logo'] === 'true' ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/[0.10]'
                            }`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${
                                form['show_logo'] === 'true' ? 'left-[22px]' : 'left-0.5'
                            }`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPdfContent = () => (
        <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] p-6 shadow-sm">
            <div className="space-y-5">
                {['pdf_header_text', 'pdf_footer_text'].map(field => (
                    <div key={field}>
                        <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            {fieldLabels[field] || field}
                        </label>
                        <textarea
                            value={form[field] || ''}
                            onChange={(e) => updateForm(field, e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none"
                            rows={4}
                        />
                        {fieldDescriptions[field] && (
                            <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1">{fieldDescriptions[field]}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderNotificationsContent = () => (
        <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] p-6 shadow-sm">
            <div className="space-y-0 divide-y divide-slate-100 dark:divide-white/[0.06]">
                {['low_stock_alert', 'daily_report', 'email_notifications'].map(field => (
                    <div key={field} className="flex items-center justify-between py-3.5 last:pb-0 first:pt-0">
                        <div>
                            <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200">{fieldLabels[field] || field}</p>
                            <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">{fieldDescriptions[field] || ''}</p>
                        </div>
                        <button
                            onClick={() => updateForm(field, form[field] === 'true' ? 'false' : 'true')}
                            className={`relative w-11 h-6 rounded-full transition-all duration-200 shrink-0 ${
                                form[field] === 'true' ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/[0.10]'
                            }`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${
                                form[field] === 'true' ? 'left-[22px]' : 'left-0.5'
                            }`} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'general': return renderGeneralContent();
            case 'business': return renderBusinessContent();
            case 'receipt': return renderReceiptContent();
            case 'pdf': return renderPdfContent();
            case 'notifications': return renderNotificationsContent();
            default: return renderGeneralContent();
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h1 className="text-[22px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
                        {t('sidebar.settings')}
                    </h1>
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-0.5">Configure your application settings</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Nav */}
                <nav className="w-full md:w-48 shrink-0 space-y-1">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all text-left ${
                                    activeTab === tab.id
                                        ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <Icon size={16} className={activeTab === tab.id ? 'text-primary-600' : ''} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    {error && (
                        <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl mb-5">
                            <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                                <X size={12} className="text-red-600 dark:text-red-400" />
                            </div>
                            <p className="text-[14px] font-medium text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {renderContent()}

                    {/* Save Button Area */}
                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100 dark:border-white/[0.06]">
                        {success && (
                            <div className="flex items-center gap-2 text-[14px] font-medium text-emerald-600">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Check size={12} />
                                </div>
                                Pengaturan berhasil disimpan
                            </div>
                        )}
                        {!success && <div />}
                        <button
                            onClick={handleSave}
                            disabled={saving || isDemo}
                            className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-all shadow-sm shadow-primary-500/20 active:scale-[0.97]"
                        >
                            <Save size={16} />
                            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
