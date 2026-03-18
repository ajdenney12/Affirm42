
import React from 'react';
import { BRAND } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  onAdminClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true, onAdminClick }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {showHeader && (
        <header className="wave-bg pt-8 pb-20 px-6 relative shadow-lg">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <img 
                  src={BRAND.LOGO_URL} 
                  alt="Williamsburg Landing Logo" 
                  className="w-[160px] h-auto block"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-white">
                <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white leading-none uppercase">
                  WILLIAMSBURG LANDING®
                </h1>
                <p className="text-[10px] md:text-xs font-sans font-bold opacity-90 uppercase tracking-[0.2em] mt-1">
                  Resident Portal
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={onAdminClick}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full border border-white/30 transition-all text-xs font-bold uppercase tracking-widest backdrop-blur-sm"
                aria-label="Admin Access"
              >
                Admin Access
              </button>
            </div>
          </div>
        </header>
      )}
      <main className={`flex-1 flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full relative z-20 ${showHeader ? '-mt-12' : ''}`}>
        {children}
      </main>
      <footer className="bg-brand-primary text-white p-12 mt-auto border-t-4 border-brand-gold">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-white text-2xl mb-3 font-display">Williamsburg Landing</h2>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
              A prestigious coastal Virginia community dedicated to providing an elegant and warm environment for our residents.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="h-1 w-16 bg-brand-gold mb-2"></div>
            <p className="text-xs text-white/40 font-medium">© {new Date().getFullYear()} Williamsburg Landing. All rights reserved.</p>
            <div className="flex gap-4 text-[10px] text-white/30 uppercase tracking-widest">
              <a href="#" className="hover:text-brand-gold transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-brand-gold transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
