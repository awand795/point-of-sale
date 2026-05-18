import { Link } from 'react-router-dom';
import { 
    Store, 
    ShoppingCart, 
    Package, 
    BarChart3, 
    ShieldCheck, 
    Zap, 
    ArrowRight,
    ChevronRight,
    MousePointer2,
    MonitorSmartphone,
    Globe
} from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100 rotate-3">
                            <Store size={22} className="text-white -rotate-3" />
                        </div>
                        <h1 className="font-black text-xl tracking-tighter leading-none">LUXE<span className="text-primary-500">POS</span></h1>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                        <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
                        <a href="#demo" className="hover:text-primary-600 transition-colors">Pricing</a>
                        <a href="#about" className="hover:text-primary-600 transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Sign In</Link>
                        <Link 
                            to="/login?demo=true" 
                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-primary-600 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
                        >
                            Try Demo <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-50">
                    <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-100 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full mb-8 animate-bounce-slow">
                        <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Now with Inventory Intel</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
                        The Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">Premium</span> POS <br />
                        for Modern Retail.
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed mb-12">
                        Effortlessly manage sales, track inventory in real-time, and gain deep business insights with a stunning executive interface designed for high-end commerce.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            to="/login?demo=true" 
                            className="w-full sm:w-auto px-10 py-5 bg-primary-600 text-white font-black uppercase tracking-widest text-sm rounded-3xl hover:bg-primary-700 shadow-2xl shadow-primary-200 transition-all flex items-center justify-center gap-3"
                        >
                            <Zap size={18} /> Launch Free Demo
                        </Link>
                        <button className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-800 font-black uppercase tracking-widest text-sm rounded-3xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3">
                            <MonitorSmartphone size={18} /> Watch Preview
                        </button>
                    </div>

                    <div className="mt-20 relative px-4">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-violet-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden shadow-slate-900/30 ring-1 ring-white/10">
                            <div className="aspect-video bg-slate-800 rounded-[1.5rem] flex items-center justify-center relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2000" 
                                    alt="POS Dashboard Preview" 
                                    className="w-full h-full object-cover rounded-[1.5rem] opacity-60 group-hover:scale-[1.02] transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <MousePointer2 size={32} fill="white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">Features Overview</h2>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Everything you need to grow.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <ShoppingCart className="text-primary-600" />,
                                title: "Smart POS Terminal",
                                desc: "Lightning fast checkout with category filtering, automated tax calculation, and various payment integrations."
                            },
                            {
                                icon: <Package className="text-violet-600" />,
                                title: "Live Inventory tracking",
                                desc: "Real-time stock monitoring with low-stock alerts, automatic decrementing, and SKU management."
                            },
                            {
                                icon: <BarChart3 className="text-emerald-600" />,
                                title: "Executive Analytics",
                                desc: "Visualize your revenue, best-selling products, and transaction history in a stunning executive dashboard."
                            },
                            {
                                icon: <ShieldCheck className="text-orange-600" />,
                                title: "Secure Transactions",
                                desc: "Enterprise-grade security for your data, role-based access control, and complete transaction auditing."
                            },
                            {
                                icon: <Zap className="text-blue-600" />,
                                title: "Instant Performance",
                                desc: "Built with modern stack for sub-second response times and high-concurrency transaction processing."
                            },
                            {
                                icon: <Globe className="text-slate-600" />,
                                title: "Cross-Platform Access",
                                desc: "Access your business from anywhere. Mobile, tablet, or desktop—the experience stays premium."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-black text-slate-800 mb-4">{feature.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                                <Store size={18} className="text-white" />
                            </div>
                            <h1 className="font-black text-lg tracking-tighter">LUXE<span className="text-primary-500">POS</span></h1>
                        </div>

                        <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">Contact Support</a>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-400">
                                Created with ❤️ by <span className="text-slate-900 font-black tracking-tighter hover:text-primary-600 transition-colors cursor-pointer">bikinsite</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-16 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">© 2026 LuxePOS Enterprise. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;