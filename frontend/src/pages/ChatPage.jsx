import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  Edit2, 
  ChevronDown, 
  Check, 
  Copy, 
  User, 
  Loader2,
  Trash2,
  MessageSquare,
  Plus,
  Search,
  ArrowRight
} from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const {
    currentConversation,
    conversations,
    messages,
    isLoadingMessages,
    isLoadingConversations,
    isStreaming,
    streamingContent,
    error,
    fetchMessages,
    fetchConversations,
    sendMessage,
    renameConversation,
    deleteConversation,
    clearError,
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState('placement');
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSentInitial, setHasSentInitial] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Handle initial mode/message from Quick Actions navigation
  useEffect(() => {
    if (location.state?.initialMode) {
      setSelectedMode(location.state.initialMode);
    }
    if (location.state?.initialMessage && !hasSentInitial) {
      setInputMessage(location.state.initialMessage);
    }
  }, [location.state]);

  // Auto-send the initial message from Quick Actions
  useEffect(() => {
    if (
      location.state?.initialMessage &&
      !hasSentInitial &&
      !id &&
      !isStreaming
    ) {
      const timer = setTimeout(async () => {
        const text = location.state.initialMessage.trim();
        if (!text) return;
        setHasSentInitial(true);
        setInputMessage('');
        const mode = location.state?.initialMode || selectedMode;
        const newId = await sendMessage(text, null, mode);
        if (newId) {
          // Replace current entry so back button goes to dashboard, not to /chat with stale state
          navigate(`/chat/${newId}`, { replace: true });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.state, hasSentInitial, id, isStreaming]);

  // Load conversation when ID is present
  useEffect(() => {
    if (id) {
      fetchMessages(id);
    } else if (location.state?.isNewChat) {
      // Explicitly triggered new chat (sidebar or in-page button)
      useChatStore.getState().startNewChat();
      setInputMessage('');
      setHasSentInitial(false);
      fetchConversations();
    } else if (!location.state?.initialMessage) {
      // No ID and no initial message → show chat history
      useChatStore.getState().startNewChat();
      fetchConversations();
    }
  }, [id, location.state?.isNewChat, location.state?.ts]);

  // Sync mode from loaded conversation
  useEffect(() => {
    if (currentConversation?.mode) {
      setSelectedMode(currentConversation.mode);
    }
  }, [currentConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isStreaming) return;

    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const newId = await sendMessage(text, id || null, selectedMode);
    if (!id && newId) {
      navigate(`/chat/${newId}`, { replace: true });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRename = () => {
    if (!currentConversation) return;
    const newTitle = prompt('Enter new conversation title:', currentConversation.title);
    if (newTitle && newTitle.trim()) {
      renameConversation(currentConversation._id, newTitle.trim());
    }
  };

  const handleDeleteChat = async (e, convId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return;
    await deleteConversation(convId);
    toast.success('Conversation deleted');
    fetchConversations();
  };

  const handleStartNewChat = () => {
    useChatStore.getState().startNewChat();
    navigate('/chat', { state: { isNewChat: true, ts: Date.now() } });
    setInputMessage('');
    setSelectedMode('talk');
  };

  const modes = [
    { id: 'talk', label: 'Dost Mode' },
    { id: 'placement', label: 'Placement Mode' },
    { id: 'study', label: 'Academic Mode' },
    { id: 'career', label: 'Career Guidance' },
    { id: 'motivation', label: 'Motivation Mode' },
    { id: 'strict', label: 'Strict Mentor' },
  ];

  const getModeLabel = (mId) => {
    if (mId === 'talk') return 'Dost Mode';
    if (mId === 'placement') return 'Placement Mode';
    if (mId === 'study' || mId === 'tutor') return 'Academic Mode';
    if (mId === 'career') return 'Career Guidance';
    if (mId === 'motivation') return 'Motivation Mode';
    if (mId === 'strict') return 'Strict Mentor';
    return modes.find((m) => m.id === mId)?.label || 'Dost Mode';
  };

  const getChatModeBadge = (mode) => {
    switch (mode) {
      case 'placement':
        return { label: 'Placement', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '💼' };
      case 'study':
      case 'tutor':
        return { label: 'Academic', color: 'bg-teal-50 text-teal-700 border-teal-200', icon: '📚' };
      case 'career':
        return { label: 'Career', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🧭' };
      case 'strict':
        return { label: 'Strict Mentor', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '⚡' };
      case 'motivation':
        return { label: 'Motivation', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: '🔥' };
      case 'talk':
      default:
        return { label: 'Dost', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '💬' };
    }
  };

  const quickChips = [
    'DSA questions',
    'System Design basics',
    'HR questions',
    'Company specific',
  ];

  // ─── CHAT HISTORY VIEW (no conversation ID, no initial message, not a fresh new chat) ───
  const showHistoryView = !id && !location.state?.initialMessage && !location.state?.isNewChat && !isStreaming && messages.length === 0;

  if (showHistoryView) {
    const filteredConversations = (conversations || []).filter((c) => {
      if (!searchQuery.trim()) return true;
      return (c.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <div className="flex flex-col h-full bg-[#FBFBFC] text-slate-800">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">All Chats</h2>
            <span className="text-xs text-slate-400 font-medium">
              {conversations?.length || 0} conversations
            </span>
          </div>
          <button
            type="button"
            onClick={handleStartNewChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Chat</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="px-6 pt-5 pb-2">
          <div className="relative max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {isLoadingConversations ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs">Loading chats...</span>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 shadow-2xs overflow-hidden">
              {filteredConversations.map((c) => {
                const badge = getChatModeBadge(c.mode);
                return (
                  <Link
                    key={c._id}
                    to={`/chat/${c._id}`}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-xl border ${badge.color} flex items-center justify-center text-base shrink-0`}>
                        {badge.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {c.title || 'Conversation with Saathi'}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label} Mode
                          </span>
                          <span className="text-[11px] text-slate-400">
                            • {c.messageCount || 0} messages
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                        {new Date(c.lastMessageAt || c.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteChat(e, c._id)}
                        title="Delete conversation"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 mb-4">
                <MessageSquare className="w-7 h-7" />
              </div>
              {searchQuery ? (
                <>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No matching chats</h3>
                  <p className="text-xs text-slate-500">Try a different search term</p>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No conversations yet</h3>
                  <p className="text-xs text-slate-500 mb-4">Start your first chat with Saathi</p>
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    Start a new chat
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── ACTIVE CONVERSATION VIEW ───
  return (
    <div className="flex flex-col h-full bg-[#FBFBFC] text-slate-800">
      {/* Chat Top Header matching Screen 3 */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {currentConversation?.title || 'New Conversation with Saathi'}
          </h2>
          <button
            onClick={handleRename}
            title="Rename Chat"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Selector Pill matching Screen 3 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200/60 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>{getModeLabel(selectedMode)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
          </button>

          {modeDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMode(m.id);
                    setModeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                    selectedMode === m.id
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Message Thread Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-6">
        <div className="max-w-4xl lg:max-w-5xl mx-auto w-full space-y-6">
          {isLoadingMessages ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs">Loading conversation...</span>
            </div>
          ) : messages.length === 0 && !streamingContent ? (
            /* Empty state starter */
            <div className="max-w-xl mx-auto py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                <Sparkles className="w-6 h-6 fill-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">How can Saathi help you today?</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                I remember your college, branch, and placement targets. Ask a doubt, practice mock interviews, or prepare for tomorrow!
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const timeString = new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={msg._id || index}
                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Assistant Avatar matching Screen 3 */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 fill-white" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`space-y-1 ${
                        isUser
                          ? 'max-w-[85%] sm:max-w-xl'
                          : 'w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl'
                      }`}
                    >
                      <div
                        className={`rounded-2xl text-sm leading-relaxed ${
                          isUser
                            ? 'bg-[#6366F1] text-white rounded-tr-none px-5 py-3.5 shadow-xs'
                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none px-5 sm:px-6 py-4 shadow-xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <MarkdownRenderer content={msg.content} />
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className={`text-[10px] text-slate-400 ${isUser ? 'text-right' : 'text-left px-1'}`}>
                        {timeString}
                      </div>
                    </div>

                    {/* User Avatar on right matching Screen 3 */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Live Streaming Message Bubble */}
              {isStreaming && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 animate-spin fill-white" />
                  </div>
                  <div className="w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-white border border-slate-200/90 text-slate-800 rounded-2xl rounded-tl-none px-5 sm:px-6 py-4 text-sm leading-relaxed shadow-xs">
                    {streamingContent ? (
                      <MarkdownRenderer content={streamingContent} />
                    ) : (
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 typing-dot" />
                        <span className="w-2 h-2 rounded-full bg-indigo-500 typing-dot" />
                        <span className="w-2 h-2 rounded-full bg-indigo-500 typing-dot" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="underline text-[11px] font-semibold">
                Dismiss
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestion Chips matching Screen 3 */}
      <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(chip)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium whitespace-nowrap shadow-2xs transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar matching Screen 3 */}
      <div className="p-4 sm:p-6 pt-2 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 bg-[#F8F9FA] border border-slate-200/90 rounded-2xl px-4 py-2 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <button
              type="button"
              title="Attach File"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-0 resize-none text-slate-800 text-sm px-2 py-1.5 focus:outline-none max-h-36 placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputMessage.trim() || isStreaming}
              className="p-2.5 rounded-xl bg-[#6366F1] hover:bg-indigo-600 disabled:opacity-40 text-white transition-all shadow-sm active:scale-95 shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
