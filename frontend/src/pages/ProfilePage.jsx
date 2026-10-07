import React, { useState, useEffect } from 'react';
import { Camera, Plus, X, Check, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { profileAPI } from '../services/api';
import toast from 'react-hot-toast';

const yearOptions = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Recent Graduate',
];

const careerGoalOptions = [
  'Top Product Companies (Amazon, Microsoft, Atlassian)',
  'High-Growth Tech Startups / FinTech',
  'Software Engineer',
  'Full Stack Developer',
  'Data Scientist / AI Engineer',
  'Product Manager',
  'Core Engineering & R&D',
  'GATE, Masters or Higher Studies',
  'Mass Recruiters & IT Services (TCS Digital, Infosys, Wipro)',
];

const normalizeYear = (val) => {
  if (!val) return '3rd Year';
  const str = String(val).trim();
  if (str === '1' || str.startsWith('1st')) return '1st Year';
  if (str === '2' || str.startsWith('2nd')) return '2nd Year';
  if (str === '3' || str.startsWith('3rd')) return '3rd Year';
  if (str === '4' || str.startsWith('4th')) return '4th Year';
  if (str.toLowerCase().includes('grad')) return 'Recent Graduate';
  return str;
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || 'B.Tech',
    branch: user?.branch || '',
    year: normalizeYear(user?.year),
    graduationYear: user?.graduationYear || (new Date().getFullYear() + 1),
    cgpa: user?.cgpa !== null && user?.cgpa !== undefined ? user.cgpa : '',
    careerGoal: user?.careerGoal || 'Software Engineer',
    skills: Array.isArray(user?.skills) ? user.skills : [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch fresh profile from backend on mount
  useEffect(() => {
    let isMounted = true;
    const fetchFreshProfile = async () => {
      try {
        const res = await profileAPI.get();
        const freshUser = res.data?.data?.user;
        if (freshUser && isMounted) {
          useAuthStore.setState({ user: freshUser });
          setFormData({
            name: freshUser.name || '',
            college: freshUser.college || '',
            degree: freshUser.degree || 'B.Tech',
            branch: freshUser.branch || '',
            year: normalizeYear(freshUser.year),
            graduationYear: freshUser.graduationYear || (new Date().getFullYear() + 1),
            cgpa: freshUser.cgpa !== null && freshUser.cgpa !== undefined ? freshUser.cgpa : '',
            careerGoal: freshUser.careerGoal || 'Software Engineer',
            skills: Array.isArray(freshUser.skills) ? freshUser.skills : [],
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchFreshProfile();
    return () => { isMounted = false; };
  }, []);

  // Sync if user in store updates
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name ?? prev.name,
        college: user.college ?? prev.college,
        degree: user.degree ?? prev.degree,
        branch: user.branch ?? prev.branch,
        year: user.year ? normalizeYear(user.year) : prev.year,
        graduationYear: user.graduationYear ?? prev.graduationYear,
        cgpa: user.cgpa !== null && user.cgpa !== undefined ? user.cgpa : prev.cgpa,
        careerGoal: user.careerGoal ?? prev.careerGoal,
        skills: Array.isArray(user.skills) ? user.skills : prev.skills,
      }));
    }
  }, [user]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
    }
    setNewSkill('');
    setShowSkillInput(false);
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      ...formData,
      cgpa: formData.cgpa === '' ? null : Number(formData.cgpa),
      graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null,
    };
    const result = await updateProfile(payload);
    setIsSaving(false);
    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6 font-sans">
      {/* Header matching Screen 5 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          This helps Saathi give you better personalized guidance and career advice.
        </p>
      </div>

      {/* Main Form Card matching Screen 5 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs space-y-6">
        {/* Avatar centered */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 font-bold text-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              {formData.name?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your Full Name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* College & Degree */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              College / University
            </label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              placeholder="e.g. VIT Bhopal / SRM / IIT"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Degree
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="e.g. B.Tech / BCA / MCA"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Branch / Specialization
          </label>
          <input
            type="text"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            placeholder="e.g. Computer Science & Engineering"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Year & Graduation Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Graduation Year
            </label>
            <select
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CGPA */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            CGPA (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            min={0}
            max={10}
            value={formData.cgpa}
            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value === '' ? '' : e.target.value })}
            placeholder="e.g. 8.5"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Career Goal */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Career Goal
          </label>
          <select
            value={formData.careerGoal}
            onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
          >
            {careerGoalOptions.map((cg) => (
              <option key={cg} value={cg}>{cg}</option>
            ))}
            {formData.careerGoal && !careerGoalOptions.includes(formData.careerGoal) && (
              <option value={formData.careerGoal}>{formData.careerGoal}</option>
            )}
          </select>
        </div>

        {/* Skills with interactive tags matching Screen 5 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Skills (Optional)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {formData.skills && formData.skills.length > 0 ? (
              formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-indigo-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No skills added yet</span>
            )}

            {showSkillInput ? (
              <div className="inline-flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g. C++"
                  className="px-2.5 py-1 rounded-full border border-indigo-400 text-xs text-slate-900 focus:outline-none w-24"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="p-1 rounded-full bg-indigo-600 text-white cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSkillInput(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-slate-300 text-slate-600 text-xs font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Submit Button matching Screen 5 */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
