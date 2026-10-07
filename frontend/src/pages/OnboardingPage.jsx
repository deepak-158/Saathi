import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  Target, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  Briefcase,
  Zap,
  Check
} from 'lucide-react';
import { memoryAPI, profileAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [careerGoal, setCareerGoal] = useState('Top Product Companies (Amazon, Microsoft, Atlassian)');
  const [currentPressure, setCurrentPressure] = useState('DSA & Coding Rounds (LeetCode consistency)');
  const [preferredTone, setPreferredTone] = useState('Friendly Dost');
  const [techStack, setTechStack] = useState('C++, Python, React');

  const careerOptions = [
    'Top Product Companies (Amazon, Microsoft, Atlassian)',
    'High-Growth Tech Startups / FinTech',
    'Mass Recruiters & IT Services (TCS Digital, Infosys, Wipro)',
    'Core Engineering & R&D (ECE/Mechanical/Electrical)',
    'GATE, Masters or Higher Studies',
    'Data Science & AI / ML Roles',
  ];

  const pressureOptions = [
    'DSA & Coding Rounds (LeetCode consistency)',
    'Low CGPA / Clearing Semester Backlogs',
    'Project portfolio & Resume building',
    'Placement Anxiety & Comparison with Friends',
    '75% Attendance & College workload balance',
  ];

  const toneOptions = [
    {
      title: 'Friendly Dost',
      icon: HeartHandshake,
      iconColor: 'bg-amber-50 text-amber-600 border-amber-200',
      desc: 'Warm, empathetic, uses relatable college slang and Hinglish analogies.',
    },
    {
      title: 'Placement Coach',
      icon: Briefcase,
      iconColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      desc: 'Focused on actionable tech feedback, resume bullet points, and interview patterns.',
    },
    {
      title: 'Strict Mentor',
      icon: Zap,
      iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
      desc: 'No sugar-coating. Pushes you to meet your daily targets and overcome procrastination.',
    },
  ];

  const suggestedSkills = ['C++', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'DSA', 'Go'];

  const handleToggleSkill = (skill) => {
    const list = techStack.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.includes(skill)) {
      setTechStack(list.filter((s) => s !== skill).join(', '));
    } else {
      setTechStack(list.concat(skill).join(', '));
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // 1. Seed initial memories in the Memory Vault
      await Promise.all([
        memoryAPI.create({
          category: 'CAREER',
          text: `Target Career Path: ${careerGoal}`,
          importance: 5,
        }),
        memoryAPI.create({
          category: 'CHALLENGES',
          text: `Current Major Pressure: ${currentPressure}`,
          importance: 4,
        }),
        memoryAPI.create({
          category: 'SKILLS',
          text: `Tech Stack & Background: ${techStack || 'Engineering fundamentals'}`,
          importance: 3,
        }),
        memoryAPI.create({
          category: 'PREFERENCES',
          text: `Preferred Companion Tone: ${preferredTone}`,
          importance: 4,
        }),
      ]);

      // 2. Update profile with preferences and skills
      const parsedSkills = techStack
        ? techStack.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await updateProfile({
        careerGoal,
        skills: parsedSkills,
        preferences: {
          tone: preferredTone.includes('Strict') ? 'strict' : preferredTone.includes('Coach') ? 'coach' : 'friendly',
        },
      });

      toast.success('Preferences saved to Memory Vault!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding preferences', err);
      toast.error('Saved with minor errors, continuing to dashboard');
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Soft botanical ambient background accents matching Mockup */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative leaf motifs (SVG) in corners */}
      <div className="absolute -top-10 -left-10 w-44 h-44 opacity-20 pointer-events-none text-emerald-800">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M20,80 Q50,20 80,80 Q50,50 20,80 Z" />
        </svg>
      </div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 opacity-20 pointer-events-none text-emerald-800 rotate-180">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M20,80 Q50,20 80,80 Q50,50 20,80 Z" />
        </svg>
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4 fill-indigo-600" />
            </div>
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">Saathi</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Your AI Student Companion</p>
        </div>

        {/* White Main Card matching Screen 2 & Mockup */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          {/* Progress Indicator Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900">Personalize Saathi</h1>
                <p className="text-xs text-slate-500 font-medium">Step {step} of 3</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Goals */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">What is your dream target?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Saathi uses this to tailor technical questions and study schedules.
                </p>
              </div>

              <div className="space-y-2 mt-4">
                {careerOptions.map((opt) => {
                  const isSelected = careerGoal === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCareerGoal(opt)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950 font-semibold shadow-2xs'
                          : 'bg-slate-50/70 border-slate-200/90 text-slate-700 hover:bg-slate-100/70 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{opt}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 fill-indigo-100" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-slate-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                  Your Primary Programming Languages / Tools
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. C++, Java, Python, React, SQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-slate-900 text-sm transition-all placeholder:text-slate-400"
                />

                {/* Quick chip suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Quick add:</span>
                  {suggestedSkills.map((skill) => {
                    const active = techStack.split(',').map((s) => s.trim().toLowerCase()).includes(skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Next: Current Challenges</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Challenges */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">What's on your mind right now?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Be honest — Saathi will keep this in mind whenever you discuss work.
                </p>
              </div>

              <div className="space-y-2.5 mt-4">
                {pressureOptions.map((opt) => {
                  const isSelected = currentPressure === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCurrentPressure(opt)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950 font-semibold shadow-2xs'
                          : 'bg-slate-50/70 border-slate-200/90 text-slate-700 hover:bg-slate-100/70 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{opt}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 fill-indigo-100" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-slate-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>Next: Companion Personality</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Companion Tone */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Choose your default companion vibe</h2>
                <p className="text-xs text-slate-500 mt-1">
                  You can change or switch this anytime inside the chat.
                </p>
              </div>

              <div className="space-y-3 mt-4">
                {toneOptions.map((t) => {
                  const isSelected = preferredTone === t.title;
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.title}
                      onClick={() => setPreferredTone(t.title)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50/60 border-indigo-600 shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-100/60 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg border ${t.iconColor} flex items-center justify-center`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className={`font-bold text-sm ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                            {t.title}
                          </h3>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-2 pl-11 leading-relaxed">{t.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Memory Vault Info Callout */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  All your selections will be automatically saved to your <strong className="font-semibold text-emerald-950">Memory Vault</strong>!
                </span>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinish}
                  className="flex-1 py-3.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving to Memory Vault...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete & Enter Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
