import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MessageSquare, 
  BrainCircuit, 
  Target, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X,
  Compass,
  LifeBuoy
} from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Navbar({ onOpenCrisisModal }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Memories', path: '/memories', icon: BrainCircuit },
    { name: 'Goals & Prep', path: '/goals', icon: Target },
    { name: 'Wellness', path: '/checkins', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-950/40 bg-[#020617]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-[#090d1f] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Saathi
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Companion
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Built for College & B.Tech</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        {isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#memory-system" className="hover:text-white transition-colors">AI Memory</a>
            <a href="#modes" className="hover:text-white transition-colors">Modes</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Student Stories</a>
          </div>
        )}

        {/* Right CTA / User controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {onOpenCrisisModal && (
                <button
                  type="button"
                  onClick={onOpenCrisisModal}
                  title="Crisis & Helpline Support"
                  className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <LifeBuoy className="w-4 h-4" />
                  <span className="hidden xl:inline">Helpline</span>
                </button>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-200 transition-colors text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <span className="max-w-[100px] truncate font-medium">{user?.name || 'Student'}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && onOpenCrisisModal && (
            <button
              onClick={onOpenCrisisModal}
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
            >
              <LifeBuoy className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-indigo-950/40 bg-[#090d1f] px-4 pt-3 pb-5 space-y-2">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-400" />
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-base"
                >
                  <User className="w-5 h-5 text-indigo-400" />
                  Profile & Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg text-base"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-lg bg-slate-800 text-slate-200 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white font-semibold shadow-md"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
