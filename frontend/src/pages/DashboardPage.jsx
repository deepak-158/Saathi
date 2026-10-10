import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MessageCircle, 
  Briefcase, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  RotateCw, 
  Quote,
  Smile,
  Sun,
  Coffee,
  Cloud,
  Activity
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import { checkinAPI } from '../services/api';
import toast from 'react-hot-toast';

const moodQuotes = {
  good: {
    badge: 'High Energy & Focus',
    badgeColor: 'bg-amber-100/80 text-amber-900 border-amber-200',
    containerStyle: 'border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30',
    accentColor: 'text-amber-600',
    quotes: [
      {
        quote: "Ride this positive momentum! Great energy turns difficult concepts into easy breakthroughs.",
        author: "Saathi Reflection",
        tip: "Channel this clarity into cracking a tough problem or completing a prep milestone today.",
        chatPrompt: "I'm in a great mood today! Help me tackle a challenging topic or plan today's goals.",
      },
      {
        quote: "Energy flows where focus goes. When you feel good, your learning speed and retention double.",
        author: "Daily Mindset",
        tip: "Take advantage of today's high spirits to make serious headway on your projects and prep.",
        chatPrompt: "I'm feeling energized! What's the best high-impact thing I should work on right now?",
      },
      {
        quote: "Success is the sum of small efforts, repeated day in and day out with a positive spirit.",
        author: "Robert Collier",
        tip: "A confident mindset is your best asset for technical interviews and coding rounds.",
        chatPrompt: "Feeling positive today. Can you give me a quick quiz or problem to solve?",
      },
    ],
  },
  okay: {
    badge: 'Steady & Balanced',
    badgeColor: 'bg-sky-100/80 text-sky-900 border-sky-200',
    containerStyle: 'border-sky-200/90 bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30',
    accentColor: 'text-sky-600',
    quotes: [
      {
        quote: "Steady progress is still progress. You don't have to sprint; just keep moving forward.",
        author: "Saathi Reflection",
        tip: "Consistency beats intensity every single time. Small daily habits create big results.",
        chatPrompt: "I'm having a regular, steady day. What should I prioritize to stay on track?",
      },
      {
        quote: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
        author: "John C. Maxwell",
        tip: "Keep showing up. Even a calm, standard day adds another brick to your career foundation.",
        chatPrompt: "Help me organize a balanced study schedule for the rest of today.",
      },
      {
        quote: "Do what you can, with what you have, right where you are.",
        author: "Theodore Roosevelt",
        tip: "A steady pace keeps burnout away and sets you up for long-term placement success.",
        chatPrompt: "Let's do a steady 30-minute revision or practice session together.",
      },
    ],
  },
  meh: {
    badge: 'Low Motivation',
    badgeColor: 'bg-orange-100/80 text-orange-900 border-orange-200',
    containerStyle: 'border-orange-200/90 bg-gradient-to-br from-orange-50/70 via-white to-orange-50/30',
    accentColor: 'text-orange-600',
    quotes: [
      {
        quote: "Action often precedes motivation. Commit to just 10 minutes of work, and the rest will follow.",
        author: "Saathi Reflection",
        tip: "Don't wait for inspiration to strike. Pick one tiny, easy task to break the friction.",
        chatPrompt: "I'm feeling a bit unmotivated and 'meh' today. Help me start with an easy task.",
      },
      {
        quote: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar",
        tip: "Even solving one LeetCode question or writing 10 lines of code breaks the inertia.",
        chatPrompt: "Give me a super simple 15-minute challenge to get my brain in gear.",
      },
      {
        quote: "It's completely normal to feel neutral. Give yourself permission to do the bare minimum today.",
        author: "Saathi Reflection",
        tip: "Showing up on average days is what separates consistent achievers from the rest.",
        chatPrompt: "Not feeling super driven today. Can we talk or find something fun to learn?",
      },
    ],
  },
  low: {
    badge: 'Gentle Support',
    badgeColor: 'bg-rose-100/80 text-rose-900 border-rose-200',
    containerStyle: 'border-rose-200/90 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30',
    accentColor: 'text-rose-600',
    quotes: [
      {
        quote: "One tough semester, test score, or coding round does not define your future. Be kind to yourself today.",
        author: "Saathi Reflection",
        tip: "Rest if you need to, but don't count yourself out. Progress isn't linear, and this feeling will pass.",
        chatPrompt: "I'm feeling pretty low today. Can we talk? I need some perspective.",
      },
      {
        quote: "You have survived 100% of your hardest days so far. You are stronger than your current doubts.",
        author: "Daily Compassion",
        tip: "Take things slow today. Eat well, drink some water, and remember that engineering is a marathon.",
        chatPrompt: "Things feel heavy right now. Can you share some comforting advice or motivation?",
      },
      {
        quote: "It is okay to not have everything figured out. Give yourself credit for how far you've come.",
        author: "Saathi Reflection",
        tip: "Sometimes taking a step back and disconnecting for a few hours is the most productive thing you can do.",
        chatPrompt: "I need a friendly chat without any judgment or pressure to perform.",
      },
    ],
  },
  stressed: {
    badge: 'Stress Relief & Decompression',
    badgeColor: 'bg-purple-100/80 text-purple-900 border-purple-200',
    containerStyle: 'border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30',
    accentColor: 'text-purple-600',
    quotes: [
      {
        quote: "Breathe. You do not have to solve your entire placement, attendance, and exam roadmap today. Just focus on the next hour.",
        author: "Saathi Reflection",
        tip: "When overwhelm hits, shrink your horizon. What is ONE small thing you can control right now?",
        chatPrompt: "I'm feeling very stressed about college and placements. Can you help me calm down and break things down?",
      },
      {
        quote: "Pressure can polish diamonds, but prolonged stress burns you out. Take a 10-minute break away from screens.",
        author: "Mindful Engineering",
        tip: "Step away, do 4-7-8 breathing, and remind yourself that placement results don't define your self-worth.",
        chatPrompt: "I have too much on my plate right now. Help me prioritize and eliminate unnecessary stress.",
      },
      {
        quote: "Almost everything will work again if you unplug it for a few minutes — including you.",
        author: "Anne Lamott",
        tip: "Write down everything that's bothering you on paper or vent here to Saathi to lighten your mental load.",
        chatPrompt: "I need to vent about what's stressing me out right now.",
      },
    ],
  },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState(() => {
    return sessionStorage.getItem('saathi_session_mood') || null;
  });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const checkRes = await checkinAPI.getAll(1).catch(() => null);
      if (checkRes) {
        const list = checkRes.data?.data?.checkIns || checkRes.data?.data?.checkins || [];
        if (list.length > 0) {
          setHasCheckedIn(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = async (moodId) => {
    setSelectedMood(moodId);
    sessionStorage.setItem('saathi_session_mood', moodId);
    setQuoteIndex(0);
    try {
      await checkinAPI.create({ mood: moodId });
      setHasCheckedIn(true);
      toast.success('Mood logged! Here is your daily reflection.');
    } catch {
      toast.error('Failed to log check-in');
    }
  };

  const moods = [
    { id: 'good', label: 'Good', icon: Sun, color: 'bg-amber-50/80 border-amber-200/80 text-amber-900 hover:bg-amber-100/70' },
    { id: 'okay', label: 'Okay', icon: Smile, color: 'bg-sky-50/80 border-sky-200/80 text-sky-900 hover:bg-sky-100/70' },
    { id: 'meh', label: 'Meh', icon: Coffee, color: 'bg-orange-50/80 border-orange-200/80 text-orange-900 hover:bg-orange-100/70' },
    { id: 'low', label: 'Low', icon: Cloud, color: 'bg-rose-50/80 border-rose-200/80 text-rose-900 hover:bg-rose-100/70' },
    { id: 'stressed', label: 'Stressed', icon: Activity, color: 'bg-purple-50/80 border-purple-200/80 text-purple-900 hover:bg-purple-100/70' },
  ];

  const handleStartQuickChat = (action) => {
    useChatStore.getState().startNewChat();
    navigate('/chat', {
      state: {
        initialMode: action.mode,
        initialMessage: action.prompt,
        isNewChat: true,
      },
    });
  };

  const quickActions = [
    {
      title: 'Talk to me',
      desc: "Share what's on your mind",
      mode: 'talk',
      prompt: "Hey Saathi, I just want to talk and share what's on my mind today.",
      icon: MessageCircle,
      iconColor: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    },
    {
      title: 'Placement Help',
      desc: 'Interview prep, companies, resume',
      mode: 'placement',
      prompt: "Hey Saathi, I need help with placement prep — technical interviews, DSA, and resume feedback.",
      icon: Briefcase,
      iconColor: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    },
    {
      title: 'Study With Me',
      desc: 'Understand concepts, make study plan',
      mode: 'study',
      prompt: "Hey Saathi, can you help me study, understand complex concepts, and build a study plan?",
      icon: BookOpen,
      iconColor: 'bg-teal-50 text-teal-700 border border-teal-200/60',
    },
  ];

  const currentMoodData = selectedMood ? moodQuotes[selectedMood] : null;
  const currentQuote = currentMoodData
    ? currentMoodData.quotes[quoteIndex % currentMoodData.quotes.length]
    : null;

  const currentMoodObj = moods.find((m) => m.id === selectedMood);
  const CurrentMoodIcon = currentMoodObj?.icon || Smile;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Companion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Hey {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            {selectedMood ? "Here's your thought for today" : "How are you feeling today?"}
          </p>
        </div>

        <button
          onClick={loadData}
          title="Refresh"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-colors cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Mood Selector or In-Place Quote Card */}
      <div className="space-y-4">
        {!selectedMood ? (
          /* Mood Selector Cards - Shown when no mood is selected yet */
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 transition-all duration-300">
            {moods.map((m) => {
              const IconComponent = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMoodSelect(m.id)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 shadow-2xs cursor-pointer ${m.color} hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs font-bold">{m.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* In-place Related Quote Card - Replaces the mood selector once chosen */
          currentMoodData && currentQuote && (
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 shadow-2xs ${currentMoodData.containerStyle}`}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentMoodData.badgeColor}`}>
                    <CurrentMoodIcon className="w-3.5 h-3.5" />
                    <span>{currentMoodObj?.label} • {currentMoodData.badge}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Daily Thought</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const total = currentMoodData.quotes.length;
                      setQuoteIndex((prev) => (prev + 1) % total);
                    }}
                    title="Another quote"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white/80 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>New Quote</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMood(null);
                      sessionStorage.removeItem('saathi_session_mood');
                    }}
                    title="Change your mood"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/80 border border-indigo-200/60 transition-colors cursor-pointer"
                  >
                    <Smile className="w-3 h-3" />
                    <span>Change Mood</span>
                  </button>
                </div>
              </div>

              {/* Quote Text */}
              <div className="relative pl-6 sm:pl-7 py-1">
                <Quote className={`w-5 h-5 absolute left-0 top-0.5 opacity-60 ${currentMoodData.accentColor}`} />
                <blockquote className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed italic">
                  "{currentQuote.quote}"
                </blockquote>
                <div className="text-xs text-slate-500 font-medium mt-1.5">
                  — {currentQuote.author}
                </div>
              </div>

              {/* Practical Tip & Chat Button */}
              <div className="mt-4 pt-3.5 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed min-w-0">
                  <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${currentMoodData.accentColor}`} />
                  <span>{currentQuote.tip}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/chat', {
                      state: {
                        initialMessage: currentQuote.chatPrompt,
                        initialMode: selectedMood === 'stressed' || selectedMood === 'low' ? 'talk' : 'placement',
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <span>Talk to Saathi about this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Quick Actions Grid matching Screen 4 */}
      <div className="space-y-3.5">
        <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleStartQuickChat(action)}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 text-left transition-all hover:shadow-xs group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${action.iconColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {action.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>


    </div>
  );
}
