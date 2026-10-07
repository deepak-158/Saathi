import React from 'react';
import { ShieldAlert, Phone, ExternalLink, X, HeartHandshake } from 'lucide-react';

export default function CrisisModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const helplines = [
    {
      name: 'Tele-MANAS (Govt of India)',
      number: '14416 / 1800 891 4416',
      hours: '24/7 • Toll-free, Multilingual',
      desc: 'National mental health helpline operated by NIMHANS',
    },
    {
      name: 'Vandrevala Foundation',
      number: '+91 9999 666 555',
      hours: '24/7 • Free & Confidential',
      desc: 'Free 24x7 psychological counseling across India',
    },
    {
      name: 'KIRAN (Govt Helpline)',
      number: '1800-599-0019',
      hours: '24/7 • Toll-free',
      desc: 'Mental health rehabilitation and crisis intervention',
    },
    {
      name: 'AASRA',
      number: '+91 98204 66726',
      hours: '24/7 • Confidential crisis hotline',
      desc: 'Support for individuals undergoing emotional and mental crisis',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f172a] border border-rose-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-rose-950/40 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">You Are Not Alone</h3>
            <p className="text-xs text-rose-300 font-medium">Confidential Student Help & Crisis Resources</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-5 leading-relaxed">
          College stress, exams, placements, and family expectations can feel overwhelming at times. If you or a friend are feeling distressed, please talk to trained counselors who care and want to help:
        </p>

        <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
          {helplines.map((h, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">{h.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{h.desc}</p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {h.hours.split('•')[0].trim()}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <a
                  href={`tel:${h.number.split('/')[0].replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-mono text-sm font-semibold tracking-wide"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {h.number}
                </a>
                <span className="text-xs text-slate-400 font-medium">{h.hours}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <a
            href="https://telemanas.mohfw.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-lg shadow-rose-600/30"
          >
            Visit Tele-MANAS Portal
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
