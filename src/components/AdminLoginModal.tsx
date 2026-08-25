import React, { useState } from 'react';
import { X, Shield, Lock, Mail, AlertCircle, CheckCircle2, UserPlus, Key } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup_bootstrap'>('signin');

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (!isSupabaseConfigured) {
        // Demo mode fallback for testing admin dashboard instantly without Supabase setup
        if (email === 'admin@luminadental.com' || password === 'demo123' || true) {
          localStorage.setItem('demo_admin_auth', 'true');
          setSuccessMsg('Demo admin authenticated successfully!');
          setTimeout(() => {
            onLoginSuccess();
            onClose();
          }, 800);
          return;
        }
      }

      if (mode === 'signin') {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (authError) throw authError;
        const user = authData.user;
        if (!user) throw new Error('No user returned from authentication.');

        // Check admin_users table by user_id
        const { data: adminRecord, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error(adminError);
        }

        if (!adminRecord) {
          // If no admin record exists yet, let's auto-bootstrap for the first user if admin_users is totally empty, or show unauth
          const { count } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
          if (count === 0) {
            // Auto-insert this user as first admin!
            await supabase.from('admin_users').insert([{ user_id: user.id }]);
            setSuccessMsg('Admin privileges granted! Loading dashboard...');
            setTimeout(() => {
              onLoginSuccess();
              onClose();
            }, 1000);
            return;
          }

          throw new Error('You are signed in, but you are not authorized as an admin.');
        }

        setSuccessMsg('Welcome back, Admin!');
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 800);

      } else {
        // Signup & bootstrap admin
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password
        });

        if (authError) throw authError;
        const user = authData.user;
        if (!user) throw new Error('Signup failed.');

        // Add to admin_users
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([{ user_id: user.id }]);

        if (insertError) throw insertError;

        setSuccessMsg('Admin account created and authorized successfully!');
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 1000);
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Admin Portal</h3>
              <p className="text-xs text-slate-400">Secure dental office management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {!isSupabaseConfigured && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <span className="font-bold">Demo Mode:</span> Supabase is not connected. You can click Login directly to test the full admin dashboard!
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="manager@luminadental.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-teal-700 text-white rounded-xl font-semibold text-sm hover:bg-teal-800 transition shadow-lg shadow-teal-700/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Dashboard' : 'Create & Authorize Admin'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Need an admin account?</span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup_bootstrap' : 'signin')}
              className="text-teal-700 font-semibold hover:underline"
            >
              {mode === 'signin' ? 'Register First Admin' : 'Back to Sign In'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
