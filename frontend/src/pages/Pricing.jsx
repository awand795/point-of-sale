import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Store, ArrowLeft, Check, Zap } from 'lucide-react';
import { useState } from 'react';

const Pricing = () => {
  const { t, locale } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const plans = t('pricing.plans');

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100 rotate-3">
              <Store size={22} className="text-white -rotate-3" />
            </div>
            <h1 className="font-black text-xl tracking-tighter leading-none">LUXE<span className="text-primary-500">POS</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">{t('nav.features')}</Link>
            <Link to="/pricing" className="text-primary-600">{t('nav.pricing')}</Link>
            <Link to="/about" className="hover:text-primary-600 transition-colors">{t('nav.about')}</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">{t('nav.signIn')}</Link>
            <Link to="/login?demo=true" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-primary-600 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2">
              {t('nav.tryDemo')} <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-50">
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-100 rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('pricing.popular')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-6">
            {t('pricing.title')}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed mb-12">
            {t('pricing.subtitle')}
          </p>

          {/* Toggle Monthly/Yearly */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'} transition-colors`}>{t('pricing.monthly')}</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                isYearly ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                isYearly ? 'left-9' : 'left-1'
              }`}></div>
            </button>
            <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'} transition-colors`}>{t('pricing.yearly')}</span>
            {isYearly && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Hemat 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => {
              const price = isYearly ? Math.round((locale === 'id' ? plan.priceId : plan.priceEn) * 0.8) : (locale === 'id' ? plan.priceId : plan.priceEn);
              const isPopular = idx === 1;

              return (
                <div
                  key={idx}
                  className={`relative bg-white rounded-[2.5rem] border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                    isPopular
                      ? 'border-primary-200 shadow-xl shadow-primary-100/50 ring-2 ring-primary-500/20'
                      : 'border-slate-100'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-violet-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-1.5 rounded-full shadow-lg">
                      {t('pricing.popular')}
                    </div>
                  )}
                  <div className="p-10">
                    <div className="mb-8">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{plan.name}</h3>
                      <p className="text-sm text-slate-500 font-medium">{plan.desc}</p>
                    </div>
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-400">Rp</span>
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{price.toLocaleString('id-ID')}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-1">/{isYearly ? 'tahun' : 'bulan'}</p>
                    </div>
                    <Link
                      to={idx === 2 ? '/contact' : '/login?demo=true'}
                      className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mb-10 ${
                        isPopular
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-200'
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'
                      }`}
                    >
                      <Zap size={14} />
                      {idx === 2 ? t('pricing.contactSales') : t('pricing.getStarted')}
                    </Link>
                    <ul className="space-y-4">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} className="text-primary-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-600">{feature}</span>
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                <Store size={18} className="text-white" />
              </div>
              <h1 className="font-black text-lg tracking-tighter">LUXE<span className="text-primary-500">POS</span></h1>
            </Link>
            <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-primary-600 transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-primary-600 transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-primary-600 transition-colors">{t('footer.contact')}</a>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400">
                {t('footer.createdBy')} <Link to="/about" className="text-slate-900 font-black tracking-tighter hover:text-primary-600 transition-colors">bikinsite</Link>
              </p>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">{t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
