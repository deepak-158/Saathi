import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  LifeBuoy, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Loader2 
} from 'lucide-react';
import { checkinAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function CheckInPage({ onOpenCrisisModal }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState('good');
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    setLoading(true);
    try {
      const res = await checkinAPI.getAll(30);
      setCheckins(res.data.data.checkIns || res.data.data.checkins || []);
    } catch {
      toast.error('Failed to load check-ins');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        mood: selectedMood,
        tags: selectedTags,
        note: note.trim(),
      };
      await checkinAPI.create(payload);
      toast.success('Check-in saved!');
      setNote('');
      setSelectedTags([]);
      fetchCheckins();
    } catch {
      toast.error('Failed to save check-in');
    } finally {
      setSubmitting(false);
    }
  };

  const moods = [
    { id: 'good', label: 'Good', emoji: '😄', color: 'bg-[#FEF3C7]/90 border-amber-200 text-amber-900' },
    { id: 'okay', label: 'Okay', emoji: '🙂', color: 'bg-[#E0F2FE]/90 border-sky-200 text-sky-900' },
    { id: 'meh', label: 'Meh', emoji: '😐', color: 'bg-[#FFEDD5]/90 border-orange-200 text-orange-900' },
    { id: 'low', label: 'Low', emoji: '🙁', color: 'bg-[#FFE4E6]/90 border-rose-200 text-rose-900' },
    { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'bg-[#FEE2E2]/90 border-red-200 text-red-900' },
  ];

  const tagOptions = [
    'LeetCode / Coding',
    'Exams & Mid-sems',
    '75% Attendance',
    'Hostel Life',
    'Peer Pressure',
    'Lack of Sleep',
    'Placement Rejection',
    'Family Expectations',
    'Good Workout / Healthy',
    'Cleared an Exam / Milestone',
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daily Wellness & Reflection Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Engineering isn't just about code and grades. Checking in with yourself keeps burnout away.
          </p>
        </div>

        {onOpenCrisisModal && (
          <button
            onClick={onOpenCrisisModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors self-start sm:self-auto"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>24/7 Helplines</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900">How are you feeling right now?</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mood buttons matching Screen 4 */}
              <div className="grid grid-cols-5 gap-2">
                {moods.map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m.id)}
                      className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${m.color} ${
                        isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.03]' : ''
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-[10px] font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Influencing factors tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  What factors are active today?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tagOptions.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reflection note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Personal Reflection Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Practiced trees for 2 hours, took a short walk with hostel friends..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving check-in...</span>
                  </>
                ) : (
                  <>
                    <span>Log Daily Check-in</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Reflections Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Recent Reflections</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                {checkins.length} Total
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-xs">Loading history...</span>
              </div>
            ) : checkins.length > 0 ? (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {checkins.map((item) => {
                  const moodObj = moods.find((m) => m.id === item.mood) || moods[0];
                  return (
                    <div
                      key={item._id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{moodObj.emoji}</span>
                          <span className="font-bold text-slate-800 capitalize">{item.mood}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {item.note && (
                        <p className="text-slate-600 italic leading-relaxed">"{item.note}"</p>
                      )}

                      {item.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.aiNote && (
                        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{item.aiNote}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No reflections logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
