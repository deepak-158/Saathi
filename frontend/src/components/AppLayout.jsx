import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Plus, 
  User, 
  Bookmark, 
  BrainCircuit, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Target,
  Sparkles,
  LifeBuoy
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';

export default function AppLayout({ children, onOpenCrisisModal }) {
  const { user, logout } = useAuthStore();
  const { conversations, fetchConversations, startNewChat } = useChatStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleNewChat = () => {
    startNewChat();
    navigate('/chat');
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'My Memories', path: '/memories', icon: Bookmark },
    { label: 'Goals & Prep', path: '/goals', icon: Target },
  ];

  return (
    <div className="flex h-screen bg-[#FBFBFC] text-slate-800 overflow-hidden font-sans">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4 fill-indigo-600" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Saathi</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: + New Chat */}
        <div className="p-4 pb-2">
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Navigation & Recent Chats */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {/* Main Links */}
          <nav className="space-y-0.5">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-indigo-50/80 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname.startsWith('/chat')
                  ? 'bg-indigo-50/80 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </Link>
          </nav>

          {/* Recent Chats Section */}
          <div>
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recent Chats
            </div>
            <div className="space-y-0.5 mt-1">
              {conversations && conversations.length > 0 ? (
                conversations.slice(0, 6).map((c) => {
                  const isActive = location.pathname === `/chat/${c._id}`;
                  return (
                    <Link
                      key={c._id}
                      to={`/chat/${c._id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block w-full px-3 py-2 rounded-xl text-xs transition-colors truncate ${
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-700 font-semibold border border-indigo-100/60'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal'
                      }`}
                    >
                      {c.title || 'Conversation'}
                    </Link>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-[11px] text-slate-400">
                  No recent chats
                </div>
              )}
            </div>
          </div>

          {/* Secondary Pages (Profile, Memories, Goals) */}
          <div className="pt-2 border-t border-slate-100 space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname === '/profile'
                  ? 'bg-indigo-50/80 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>

            <Link
              to="/memories"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname === '/memories'
                  ? 'bg-indigo-50/80 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>My Memories</span>
            </Link>

            <Link
              to="/goals"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname === '/goals'
                  ? 'bg-indigo-50/80 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Goals & Prep</span>
            </Link>

            {onOpenCrisisModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCrisisModal();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LifeBuoy className="w-4 h-4 text-rose-500" />
                <span>Helpline (24/7)</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Profile Pill */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 min-w-0"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {user?.name || 'Student'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.year ? `${user.year} • ` : ''}{user?.branch ? (user.branch.includes('Computer') ? 'CSE' : user.branch) : user?.college || 'B.Tech'}
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Top Header (only on screens < lg) */}
        <div className="lg:hidden h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span className="font-bold text-slate-900 text-base">Saathi</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Page Inner Container */}
        <div className="flex-1 overflow-y-auto bg-[#FBFBFC]">
          {children}
        </div>

        {/* Mobile Bottom Tab Bar (matching Screen 7 in mockup) */}
        <div className="lg:hidden h-14 bg-white border-t border-slate-200/80 px-4 flex items-center justify-around shrink-0">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/chat"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname.startsWith('/chat') ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </Link>
          <Link
            to="/memories"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname === '/memories' ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Memories</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname === '/profile' ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
