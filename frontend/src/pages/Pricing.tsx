import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Check, Zap, Sparkles, Store } from 'lucide-react';
import { useState } from 'react';
import PublicNavbar from '../components/layout/PublicNavbar';

const Pricing = () => {
  const { t, locale } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const plans = t('pricing.plans');

  return (
    <div className="min-h-screen bg-surface text-slate-900 dark:text-white overflow-x-hidden font-['Geist',system-ui,sans-serif]">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-full mb-8">
            <Sparkles size={14} className="text-primary-600 dark:text-primary-400" />
            <span className="text-[13px] font-medium text-primary-700 dark:text-primary-300">{t('pricing.popular')}</span>
          </div>
          <h1 className="text-[48px] md:text-[64px] font-bold tracking-[-0.03em] text-slate-900 dark:text-white leading-[0.95] mb-6">
            {t('pricing.title')}
          </h1>
          <p className="max-w-2xl mx-auto text-[16px] text-slate-500 dark:text-slate-400 leading-relaxed mb-12">
            {t('pricing.subtitle')}
          </p>

          {/* Toggle Monthly/Yearly */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-[14px] font-medium ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'} transition-colors`}>{t('pricing.monthly')}</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                isYearly ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/[0.10]'
              }`}
            >
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                isYearly ? 'left-7.5' : 'left-0.5'
              }`}></div>
            </button>
            <span className={`text-[14px] font-medium ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'} transition-colors`}>{t('pricing.yearly')}</span>
            {isYearly && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                Hemat 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, idx) => {
              const price = isYearly ? Math.round((locale === 'id' ? plan.priceId : plan.priceEn) * 0.8) : (locale === 'id' ? plan.priceId : plan.priceEn);
              const isPopular = idx === 1;

              return (
                <div
                  key={idx}
                  className={`relative bg-white dark:bg-surface-raised rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isPopular
                      ? 'border-primary-300 dark:border-primary-500/40 shadow-md shadow-primary-100 dark:shadow-primary-900/20'
                      : 'border-slate-200 dark:border-white/[0.06]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-[11px] font-semibold px-5 py-1 rounded-full shadow-sm">
                      {t('pricing.popular')}
                    </div>
                  )}
                  <div className="p-7">
                    <div className="mb-6">
                      <h3 className="text-[18px] font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">{plan.name}</h3>
                      <p className="text-[14px] text-slate-500 dark:text-slate-400">{plan.desc}</p>
                    </div>
                    <div className="mb-7">
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-[14px] font-medium text-slate-400">Rp</span>
                        <span className="text-[48px] font-bold tracking-[-0.03em] text-slate-900 dark:text-white">
                          {price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-400">/{isYearly ? 'tahun' : 'bulan'}</p>
                    </div>
                    <Link
                      to={idx === 2 ? '/contact' : '/login?demo=true'}
                      className={`w-full py-3 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 mb-8 ${
                        isPopular
                          ? 'bg-[#FF6B35] text-white hover:bg-[#E55A2B] shadow-sm shadow-[#FF6B35]/25'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                      }`}
                    >
                      <Zap size={16} />
                      {idx === 2 ? t('pricing.contactSales') : t('pricing.getStarted')}
                    </Link>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-md bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={10} className="text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="text-[14px] text-slate-600 dark:text-slate-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer (matches Landing) */}
      <footer className="bg-surface border-t border-slate-200 dark:border-white/[0.06] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-bold text-[15px] tracking-[-0.03em]">
                Bikin<span className="text-primary-500">POS</span>
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[14px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="text-[14px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t('footer.terms')}</a>
            </div>
            <p className="text-[14px] text-slate-400">
              {t('footer.createdBy')}{' '}
              <Link to="/about" className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">bikinsite</Link>
            </p>
          </div>
          <p className="text-center mt-8 text-[13px] text-slate-300 dark:text-slate-600">
            {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
