import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  ClipboardList, 
  Sliders, 
  Lightbulb, 
  Info, 
  Menu, 
  X, 
  Brain,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceAssistant } from '../components/VoiceAssistant';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Welcome', href: '/', icon: Home, description: 'Overview & introduction' },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart2, description: 'Wellness analytics hub' },
    { name: 'Assessment', href: '/assessment', icon: ClipboardList, description: 'Digital habit assessment' },
    { name: 'Habit Simulator', href: '/simulator', icon: Sliders, description: 'Simulate daily routine changes' },
    { name: 'Recommendations', href: '/recommendations', icon: Lightbulb, description: 'Personalized action plans' },
    { name: 'About', href: '/about', icon: Info, description: 'Platform details & science' },
  ];

  // Helper to determine active route
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen mesh-bg overflow-hidden text-slate-800">
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/50 z-20">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100/50">
          <div className="p-2 bg-blue-50/60 text-blue-600 rounded-xl">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">MindSync AI</h1>
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Digital Wellness</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-start gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors ${
                  active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
                <div>
                  <div className="text-sm font-medium leading-none mb-0.5">{item.name}</div>
                  <span className={`text-[10px] block leading-none ${
                    active ? 'text-blue-500/80' : 'text-slate-400'
                  }`}>
                    {item.description}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-4 rounded-xl border border-dashed">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-700">Support Platform</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            MindSync AI provides empirical wellness guidance and prediction models.
          </p>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="flex items-center justify-between md:hidden bg-white border-b border-slate-200 px-6 py-4 z-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-md tracking-tight">MindSync AI</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-30 md:hidden"
              />
              
              {/* Drawer Content */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 bg-white z-40 shadow-2xl flex flex-col md:hidden"
              >
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-md">MindSync AI</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-start gap-3.5 px-4 py-3.5 rounded-xl transition-colors ${
                          active
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          active ? 'text-blue-600' : 'text-slate-400'
                        }`} />
                        <div>
                          <div className="text-sm font-medium leading-none mb-0.5">{item.name}</div>
                          <span className={`text-[10px] block leading-none ${
                            active ? 'text-blue-500/80' : 'text-slate-400'
                          }`}>
                            {item.description}
                          </span>
                        </div>
                      </NavLink>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-4 rounded-xl">
                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    © 2026 MindSync AI. All rights reserved.
                  </p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative focus:outline-none focus:ring-0">
          <div className="h-full py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <VoiceAssistant />
    </div>
  );
};
