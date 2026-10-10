import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MessageCircle, 
  BookOpen, 
  Target, 
  ArrowRight,
  ShieldCheck,
  Brain,
  Clock,
  Briefcase,
  Compass,
  Zap,
  ChevronDown,
  ChevronUp,
  Heart
} from 'lucide-react';

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200/80 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors pr-4">
          {question}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>
      {open && (
        <p className="text-xs text-slate-600 leading-relaxed pb-5 -mt-1">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function LandingPage({ onOpenCrisisModal }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-3.5 h-3.5 fill-indigo-600" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">Saathi</span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#modes" className="hover:text-slate-900 transition-colors">AI Modes</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Subtle status badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-indigo-700">Built for Indian college students</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-950 leading-[1.1]">
            Your AI companion{' '}
            <br className="hidden sm:block" />
            <span className="text-indigo-600">through college life</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto">
            Talk about studies, placements, career decisions, or just vent.
            Saathi remembers your journey and gives guidance that actually feels personal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <span>Start a conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 shadow-xs transition-colors"
            >
              <span>Sign in</span>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {['R', 'A', 'P', 'D'].map((letter, i) => {
                const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-600'];
                return (
                  <div
                    key={letter}
                    className={`w-7 h-7 rounded-full border-2 border-[#FAFAF8] ${colors[i]} text-white font-bold text-[10px] flex items-center justify-center`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Trusted by engineering students across India
            </span>
          </div>
        </div>

        {/* Conversation Preview Card */}
        <div className="max-w-xl mx-auto mt-16">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white fill-white" />
                </div>
                <span className="text-xs font-bold text-slate-800">Saathi</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-semibold">
                Placement Mode
              </span>
            </div>

            {/* Chat messages */}
            <div className="p-5 space-y-3 bg-slate-50/40">
              <div className="flex justify-end">
                <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-indigo-600 text-white text-xs leading-relaxed max-w-[80%]">
                  I have my Amazon OA in 3 days. What should I prioritize?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-slate-200/80 text-xs text-slate-700 leading-relaxed max-w-[88%] space-y-1.5">
                  <p className="font-semibold text-slate-900">Based on what I remember about your prep:</p>
                  <p className="text-slate-600">You already cleared DFS/BFS and Binary Search patterns. Focus on Dynamic Programming (especially 0/1 Knapsack) and Sliding Window today.</p>
                  <p className="text-slate-600">I can create a 3-day revision plan if you want.</p>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-3">
              <div className="flex-1 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center px-3">
                <span className="text-xs text-slate-400">Type a message...</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">What makes Saathi different</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
              Everything a college student needs
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Designed for the realities of B.Tech life — from placements to personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: MessageCircle,
                iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                title: 'Talk freely',
                desc: 'Share your thoughts anytime, without judgment. Saathi listens and responds like a trusted friend.',
              },
              {
                icon: Brain,
                iconBg: 'bg-violet-50 text-violet-600 border-violet-100',
                title: 'Remembers you',
                desc: 'Your goals, skills, prep progress, and struggles. Saathi builds context over time for better advice.',
              },
              {
                icon: BookOpen,
                iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
                title: 'Study guidance',
                desc: 'Get help understanding concepts, building study plans, and preparing for exams and OAs.',
              },
              {
                icon: Target,
                iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
                title: 'Stay on track',
                desc: 'Set placement goals, track company pipelines, and make steady progress every single day.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-[#FAFAF8] border border-slate-200/60 space-y-3 hover:border-slate-300 transition-colors">
                  <div className={`w-10 h-10 rounded-xl border ${feature.iconBg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Modes Section */}
      <section id="modes" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Focused Companionship</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
              Three essential conversation modes
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              No clutter or gimmickry. Saathi gives you dedicated focus for every part of your college journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { 
                icon: Heart, 
                label: 'Dost Mode', 
                desc: 'A non-judgmental friend for venting, hostel life, exam stress, and honest conversations.', 
                bg: 'bg-pink-50 text-pink-600 border-pink-100' 
              },
              { 
                icon: Briefcase, 
                label: 'Placement Mode', 
                desc: 'Targeted preparation for technical interviews, DSA problem breakdowns, and resume polish.', 
                bg: 'bg-blue-50 text-blue-600 border-blue-100' 
              },
              { 
                icon: BookOpen, 
                label: 'Academic Mode', 
                desc: 'Deep concept explanations, step-by-step walkthroughs, and syllabus-to-exam study roadmaps.', 
                bg: 'bg-teal-50 text-teal-600 border-teal-100' 
              },
            ].map((mode, i) => {
              const Icon = mode.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/60 flex flex-col gap-4 hover:border-indigo-200 hover:shadow-xs transition-all">
                  <div className={`w-11 h-11 rounded-xl border ${mode.bg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900">{mode.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{mode.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Questions</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
              Frequently asked questions
            </h2>
          </div>

          <div className="divide-y divide-slate-200/80">
            <FAQItem
              question="Is Saathi free to use?"
              answer="Yes, Saathi is completely free for college students. We believe every student deserves access to personalized guidance without financial barriers."
            />
            <FAQItem
              question="How does the memory system work?"
              answer="Saathi remembers key facts from your conversations — your college, branch, career goals, preparation progress, and personal preferences. This context makes every interaction more relevant and helpful."
            />
            <FAQItem
              question="Is my data private and secure?"
              answer="Absolutely. Your conversations and personal data are encrypted and stored securely. We never share your data with third parties. You can delete your memories anytime."
            />
            <FAQItem
              question="Can Saathi help with placement preparation?"
              answer="Yes. Saathi can help you with DSA practice strategies, mock interview patterns, resume feedback, company-specific preparation, and system design basics tailored to your target companies."
            />
            <FAQItem
              question="What if I'm feeling stressed or low?"
              answer="Saathi is built to be a safe space. You can talk openly about stress, anxiety, or feeling overwhelmed. Saathi also provides access to professional crisis helplines like Tele-MANAS and Vandrevala Foundation."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Ready to start?
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Create your free account and start talking to Saathi in under a minute.
          </p>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <span>Create free account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#FAFAF8] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span className="font-bold text-slate-800">Saathi</span>
            <span className="text-slate-400">--</span>
            <span>Your AI Student Companion</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            {onOpenCrisisModal && (
              <button
                onClick={onOpenCrisisModal}
                className="text-rose-600 hover:underline font-semibold cursor-pointer"
              >
                Tele-MANAS Student Helpline (14416)
              </button>
            )}
            <span className="hidden sm:inline">|</span>
            <span>Made for college students</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
