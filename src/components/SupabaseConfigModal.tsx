import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, X, Key, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseConfigModal({ isOpen, onClose }: SupabaseConfigModalProps) {
  const [url, setUrl] = useState(localStorage.getItem('custom_supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('custom_supabase_key') || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && key.trim()) {
      localStorage.setItem('custom_supabase_url', url.trim());
      localStorage.setItem('custom_supabase_key', key.trim());
      setSaved(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('custom_supabase_url');
    localStorage.removeItem('custom_supabase_key');
    setUrl('');
    setKey('');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-teal-700 to-blue-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Database className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Supabase Connection Settings</h3>
              <p className="text-xs text-teal-100">Connect your live database & auth</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            {isSupabaseConfigured ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
            )}
            <div className="text-sm">
              <p className="font-medium text-slate-900">
                Status: {isSupabaseConfigured ? 'Connected to Supabase' : 'Running in Demo / Fallback Mode'}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {isSupabaseConfigured 
                  ? 'Your database and authentication are active.'
                  : 'Enter your Supabase project credentials below to enable live persistence and secure admin access.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Supabase Anon / Publishable Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-slate-800 outline-none transition"
              />
            </div>

            {saved && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Credentials saved! Reloading application...</span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              {isSupabaseConfigured && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  Disconnect
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition shadow-md shadow-teal-700/20"
              >
                Save & Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
