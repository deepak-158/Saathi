import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Briefcase, 
  Target, 
  Code, 
  GraduationCap, 
  Heart, 
  X, 
  Check, 
  Loader2 
} from 'lucide-react';
import { memoryAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function MemoriesPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    category: 'PLACEMENT',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, [activeFilter]);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await memoryAPI.getAll(activeFilter === 'all' ? null : activeFilter);
      setMemories(res.data.data.memories || []);
    } catch {
      toast.error('Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMemory(null);
    setFormData({ title: '', text: '', category: 'PLACEMENT' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mem) => {
    setEditingMemory(mem);
    setFormData({
      title: mem.category || 'Memory',
      text: mem.text || mem.content || '',
      category: mem.category || 'PLACEMENT',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    setSubmitting(true);
    try {
      if (editingMemory) {
        await memoryAPI.update(editingMemory._id, {
          text: formData.text.trim(),
          category: formData.category,
        });
        toast.success('Memory updated');
      } else {
        await memoryAPI.create({
          text: formData.text.trim(),
          category: formData.category,
        });
        toast.success('Memory added to Saathi vault');
      }
      setIsModalOpen(false);
      fetchMemories();
    } catch {
      toast.error('Failed to save memory');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want Saathi to forget this fact?')) return;
    try {
      await memoryAPI.delete(id);
      setMemories(memories.filter((m) => m._id !== id));
      toast.success('Memory removed');
    } catch {
      toast.error('Failed to delete memory');
    }
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'personal', label: 'Personal' },
    { id: 'academics', label: 'Academics' },
    { id: 'career', label: 'Career' },
    { id: 'placement', label: 'Placement' },
  ];

  const getCategoryMeta = (cat) => {
    const c = (cat || '').toUpperCase();
    if (c.includes('CAREER') || c.includes('GOAL')) {
      return {
        icon: Briefcase,
        bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        title: 'Career Goal',
      };
    }
    if (c.includes('CHALLENGE') || c.includes('STRESS') || c.includes('PLACEMENT')) {
      return {
        icon: Target,
        bg: 'bg-rose-50 text-rose-600 border-rose-100',
        title: 'Placement & Prep',
      };
    }
    if (c.includes('SKILL') || c.includes('TECH')) {
      return {
        icon: Code,
        bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        title: 'Technical Skills',
      };
    }
    if (c.includes('ACADEMIC') || c.includes('COLLEGE')) {
      return {
        icon: GraduationCap,
        bg: 'bg-teal-50 text-teal-600 border-teal-100',
        title: 'College & Academics',
      };
    }
    return {
      icon: Heart,
      bg: 'bg-pink-50 text-pink-600 border-pink-100',
      title: 'Preferences',
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 font-sans">
      {/* Header matching Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Things Saathi remembers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            You can edit or delete these memories anytime.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Filter Pills matching Screen 6 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Memory Cards matching Screen 6 */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs">Loading memories...</span>
          </div>
        ) : memories && memories.length > 0 ? (
          memories.map((mem) => {
            const meta = getCategoryMeta(mem.category);
            const Icon = meta.icon;
            const dateStr = new Date(mem.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={mem._id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Colored circular badge on left matching Screen 6 */}
                  <div className={`w-10 h-10 rounded-full border ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 capitalize">
                      {meta.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mem.text || mem.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                    {dateStr}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(mem)}
                      title="Edit"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(mem._id)}
                      title="Delete"
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
            <Target className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No memories in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              As you discuss placements, exam goals, and college life with Saathi, key details will appear here automatically.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Add first memory
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingMemory ? 'Edit Memory' : 'Add Memory'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="CAREER">Career Goal</option>
                  <option value="PLACEMENT">Current Challenge / Placement</option>
                  <option value="ACADEMICS">College & Academics</option>
                  <option value="PERSONAL">Personal & Wellbeing</option>
                  <option value="PREFERENCES">Preferences</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Memory Detail
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="e.g. Target SDE intern at Amazon, comfortable with Java and React..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs"
                >
                  {submitting ? 'Saving...' : 'Save Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
