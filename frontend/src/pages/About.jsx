import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Store, ArrowLeft, Globe, Code, Palette, ShoppingBag, Search, ExternalLink, Target, Heart, Users, Lightbulb, CheckCircle } from 'lucide-react';

const About = () => {
  const { t, locale } = useLanguage();

  const values = [
    { icon: <Target size={24} />, title: t('about.valuesList.0.title'), desc: t('about.valuesList.0.desc'), color: 'from-primary-500 to-violet-600' },
    { icon: <Lightbulb size={24} />, title: t('about.valuesList.1.title'), desc: t('about.valuesList.1.desc'), color: 'from-amber-500 to-orange-600' },
    { icon: <Heart size={24} />, title: t('about.valuesList.2.title'), desc: t('about.valuesList.2.desc'), color: 'from-emerald-500 to-teal-600' },
    { icon: <Users size={24} />, title: t('about.valuesList.3.title'), desc: t('about.valuesList.3.desc'), color: 'from-blue-500 to-indigo-600' },
  ];

  const services = [
    { icon: <Globe size={28} />, text: t('about.bikinsite.servicesList.0') },
    { icon: <ShoppingBag size={28} />, text: t('about.bikinsite.servicesList.1') },
    { icon: <Palette size={28} />, text: t('about.bikinsite.servicesList.2') },
    { icon: <Search size={28} />, text: t('about.bikinsite.servicesList.3') },
    { icon: <Code size={28} />, text: t('about.bikinsite.servicesList.4') },
  ];

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
            <Link to="/pricing" className="hover:text-primary-600 transition-colors">{t('nav.pricing')}</Link>
            <Link to="/about" className="text-primary-600">{t('nav.about')}</Link>
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
      <section className="relative pt-40 pb-24 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-50">
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-100 rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('about.creator')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-6">
            {t('about.title')}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission + Story */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-8">
                <Target size={32} className="text-primary-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">{t('about.mission')}</h2>
              <p className="text-slate-500 font-medium leading-relaxed text-lg">{t('about.missionText')}</p>
            </div>
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-8">
                <Lightbulb size={32} className="text-violet-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">{t('about.story')}</h2>
              <p className="text-slate-500 font-medium leading-relaxed text-lg">{t('about.storyText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* BikinSite Section */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px]"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
                <div className="w-20 h-20 bg-primary-500/20 rounded-[1.25rem] flex items-center justify-center shrink-0 backdrop-blur-xl border border-white/10">
                  <Globe size={40} className="text-primary-400" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tight mb-2">{t('about.bikinsite.title')}</h2>
                  <p className="text-slate-300 font-medium text-lg leading-relaxed max-w-3xl">
                    {t('about.bikinsite.desc')}
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-black text-primary-300 uppercase tracking-[0.2em] mb-6">{t('about.bikinsite.services')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all">
                        {service.icon}
                      </div>
                      <span className="font-bold text-sm">{service.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://bikinsite.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-xl"
                >
                  <ExternalLink size={16} />
                  bikinsite.vercel.app
                </a>
                <a
                  href="https://instagram.com/bikinsite.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl"
                >
                  <ExternalLink size={16} />
                  @bikinsite.id
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adnawaa Section */}
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shrink-0 rotate-3">
                <span className="text-white text-3xl font-black -rotate-3">A</span>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{t('about.adnawaa.title')}</h2>
                <p className="text-slate-500 font-medium leading-relaxed text-lg mb-6">{t('about.adnawaa.desc')}</p>
                <a
                  href="https://instagram.com/adnawaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  <ExternalLink size={16} />
                  @adnawaa
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('about.values')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${val.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <div className="text-white">{val.icon}</div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{val.desc}</p>
              </div>
            ))}
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

export default About;
