import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MessageCircle, 
  BookOpen, 
  Target, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage({ onOpenCrisisModal }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4 fill-indigo-600" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">Saathi</span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-slate-900 transition-colors">Home</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#modes" className="hover:text-slate-900 transition-colors">AI Modes</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Features */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-950 leading-[1.15]">
                Your AI <br />
                <span className="text-[#4F46E5]">Student Companion</span>
              </h1>
              <p className="text-xl sm:text-2xl font-normal text-slate-700">
                Talk, plan, and grow through college life.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Saathi helps you with studies, placements, career decisions and personal challenges — and remembers your journey so the guidance always feels personal.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
              >
                <span>Start Talking</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-300/80 shadow-xs transition-colors"
              >
                <span>Learn More</span>
              </Link>
            </div>

            {/* 3 Core Value Props in Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200/80">
              {/* Prop 1 */}
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Talk Freely</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Share your thoughts anytime without fear of judgment.
                </p>
              </div>

              {/* Prop 2 */}
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Get Guidance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Help with studies, placements and career roadmaps.
                </p>
              </div>

              {/* Prop 3 */}
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Stay on Track</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Set goals, track companies, and make steady progress.
                </p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                  R
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                  A
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                  P
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                  D
                </div>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Trusted by engineering & college students across India
              </span>
            </div>
          </div>

          {/* Right Column: Cozy Study Scene Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-indigo-50/50 p-6 border border-amber-200/50 shadow-xl">
              {/* Background natural warm glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

              {/* Framed Quote Card 1 */}
              <div className="mb-4 bg-white/90 backdrop-blur-xs border border-amber-200/60 p-3.5 rounded-2xl shadow-xs max-w-[220px] ml-auto rotate-1 hover:rotate-0 transition-transform">
                <div className="text-[10px] font-bold text-amber-800 tracking-wider uppercase mb-0.5">
                  Same Thoughts
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  Different Perspective
                </div>
              </div>

              {/* Study Desk Simulation Card */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-200/80 space-y-4">
                {/* Mock Laptop Screen */}
                <div className="bg-[#0F172A] rounded-xl p-4 text-white shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold tracking-tight">Saathi</span>
                    </div>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                      Placement Mode
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-300">
                    <div className="p-2 rounded-lg bg-slate-800/80 text-white self-end text-right">
                      "I have my Amazon OA in 3 days. What should I prioritize?"
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 space-y-1">
                      <p className="font-semibold text-white">Based on what I remember:</p>
                      <p>• You already mastered DFS/BFS and Binary Search.</p>
                      <p>• Focus on 0/1 Knapsack & Sliding Window questions today.</p>
                    </div>
                  </div>
                </div>

                {/* Desk details */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center gap-2.5">
                    <span className="text-xl">☕</span>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Focus Session</div>
                      <div className="text-[10px] text-slate-500">25m Pomodoro</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-2.5">
                    <span className="text-xl">📚</span>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Memory Vault</div>
                      <div className="text-[10px] text-slate-500">Active Recall On</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Framed Quote Card 2 */}
              <div className="mt-4 bg-white/90 backdrop-blur-xs border border-indigo-200/60 p-3.5 rounded-2xl shadow-xs max-w-[210px] -rotate-1 hover:rotate-0 transition-transform">
                <div className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase mb-0.5">
                  Better Students
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  Happier People
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <span className="font-bold text-slate-800">Saathi</span>
            <span>— Your AI Student Companion</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            {onOpenCrisisModal && (
              <button
                onClick={onOpenCrisisModal}
                className="text-rose-600 hover:underline font-semibold"
              >
                Tele-MANAS Student Helpline (14416)
              </button>
            )}
            <span>•</span>
            <span>Made for college students</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
