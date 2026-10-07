import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Trash2, 
  Briefcase, 
  Building2,
  X, 
  Loader2
} from 'lucide-react';
import { goalAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Goal Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    category: 'placement',
    targetDate: '',
    tasksText: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Placement Tracker state
  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('saathi_companies');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 1, name: 'Amazon', role: 'SDE Intern', status: 'OA Cleared', date: 'Oct 2026', notes: 'Need to review Trees and Dynamic Programming questions' },
      { id: 2, name: 'Microsoft', role: 'Software Engineer', status: 'Applied', date: 'Nov 2026', notes: 'Referred by senior on LinkedIn' },
      { id: 3, name: 'Deloitte', role: 'Consultant / Analyst', status: 'Interview Tomorrow', date: 'Oct 2026', notes: 'Technical + HR preparation' },
    ];
  });

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    role: 'SDE',
    status: 'Applied',
    notes: '',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    localStorage.setItem('saathi_companies', JSON.stringify(companies));
  }, [companies]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await goalAPI.getAll();
      setGoals(res.data.data.goals || []);
    } catch {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;

    setSubmitting(true);
    try {
      const tasks = goalForm.tasksText
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((title) => ({ title, isCompleted: false }));

      const payload = {
        title: goalForm.title,
        category: goalForm.category,
        targetDate: goalForm.targetDate || undefined,
        tasks: tasks.length > 0 ? tasks : [{ title: 'Start first milestone', isCompleted: false }],
      };

      await goalAPI.create(payload);
      toast.success('Goal created!');
      setIsModalOpen(false);
      setGoalForm({ title: '', category: 'placement', targetDate: '', tasksText: '' });
      fetchGoals();
    } catch {
      toast.error('Failed to create goal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTask = async (goal, taskIndex) => {
    const updatedTasks = [...goal.tasks];
    updatedTasks[taskIndex].isCompleted = !updatedTasks[taskIndex].isCompleted;
    const allCompleted = updatedTasks.every((t) => t.isCompleted);

    try {
      await goalAPI.update(goal._id, {
        tasks: updatedTasks,
        status: allCompleted ? 'completed' : 'in-progress',
      });
      setGoals(
        goals.map((g) =>
          g._id === goal._id
            ? { ...g, tasks: updatedTasks, status: allCompleted ? 'completed' : 'in-progress' }
            : g
        )
      );
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalAPI.delete(id);
      setGoals(goals.filter((g) => g._id !== id));
      toast.success('Goal deleted');
    } catch {
      toast.error('Failed to delete goal');
    }
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (!companyForm.name.trim()) return;

    const newComp = {
      id: Date.now(),
      name: companyForm.name,
      role: companyForm.role,
      status: companyForm.status,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      notes: companyForm.notes,
    };

    setCompanies([newComp, ...companies]);
    setIsCompanyModalOpen(false);
    setCompanyForm({ name: '', role: 'SDE', status: 'Applied', notes: '' });
    toast.success('Company application added');
  };

  const handleDeleteCompany = (id) => {
    setCompanies(companies.filter((c) => c.id !== id));
    toast.success('Company removed');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Goals & Placement Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay accountable to your semester milestones and company recruitment pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'goals' ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Set Goal</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Track Company</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'goals'
              ? 'bg-[#4F46E5] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          Semester Goals ({goals.length})
        </button>
        <button
          onClick={() => setActiveTab('placements')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'placements'
              ? 'bg-[#4F46E5] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          Placement Pipeline ({companies.length})
        </button>
      </div>

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs">Loading goals...</span>
            </div>
          ) : goals && goals.length > 0 ? (
            goals.map((g) => {
              const completedTasks = g.tasks?.filter((t) => t.isCompleted)?.length || 0;
              const totalTasks = g.tasks?.length || 0;
              const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={g._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {g.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-2">{g.title}</h3>
                    </div>

                    <button
                      onClick={() => handleDeleteGoal(g._id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-600">
                      <span>Progress</span>
                      <span className="font-bold text-indigo-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-1.5 pt-1">
                    {g.tasks?.map((task, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleToggleTask(g, idx)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={`text-xs ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-2">
              <Target className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No goals set yet</h3>
              <p className="text-xs text-slate-500">Create a goal to stay focused on upcoming campus placement drives.</p>
            </div>
          )}
        </div>
      )}

      {/* Placement Tab */}
      {activeTab === 'placements' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.role}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold text-[10px]">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{c.notes || '—'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteCompany(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Set New Goal</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Title</label>
                <input
                  required
                  type="text"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  placeholder="e.g. Master Binary Search & Trees on LeetCode"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Milestones (1 per line)</label>
                <textarea
                  rows={3}
                  value={goalForm.tasksText}
                  onChange={(e) => setGoalForm({ ...goalForm, tasksText: e.target.value })}
                  placeholder={`Solve 15 Tree problems\nRead DFS/BFS traversals`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  {submitting ? 'Saving...' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Track Company Application</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  required
                  type="text"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="e.g. Amazon, Deloitte, Google"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={companyForm.status}
                  onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Wishlist">Wishlist</option>
                  <option value="Applied">Applied</option>
                  <option value="OA Cleared">OA Cleared</option>
                  <option value="Interview Tomorrow">Interview Tomorrow</option>
                  <option value="Offer Received">Offer Received</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={companyForm.notes}
                  onChange={(e) => setCompanyForm({ ...companyForm, notes: e.target.value })}
                  placeholder="Technical + HR preparation"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
