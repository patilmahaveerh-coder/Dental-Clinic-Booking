import React, { useState } from 'react';
import { Shield, Lock, Mail, AlertCircle, CheckCircle2, ArrowLeft, Stethoscope, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (path: string) => void;
}

export function AdminLoginPage({ onLoginSuccess, onNavigate }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup_bootstrap'>('signin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (!isSupabaseConfigured) {
        // Demo mode fallback when Supabase is not configured
        if (email.trim() && password.length >= 4) {
          localStorage.setItem('demo_admin_auth', 'true');
          setSuccessMsg('Demo admin authenticated successfully! Redirecting...');
          setTimeout(() => {
            onLoginSuccess();
            onNavigate('/admin');
          }, 800);
          return;
        } else {
          throw new Error('Please enter valid demo credentials (any email, password >= 4 chars).');
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

        // Check admin_users table
        const { data: adminRecord, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error(adminError);
        }

        if (!adminRecord) {
          // Check if any admins exist; if zero, auto-bootstrap first admin
          const { count } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
          if (count === 0) {
            await supabase.from('admin_users').insert([{ user_id: user.id }]);
            setSuccessMsg('Admin privileges granted! Redirecting to dashboard...');
            setTimeout(() => {
              onLoginSuccess();
              onNavigate('/admin');
            }, 1000);
            return;
          }
          throw new Error('You are authenticated, but not authorized as a clinic administrator.');
        }

        setSuccessMsg('Login successful! Redirecting to admin dashboard...');
        setTimeout(() => {
          onLoginSuccess();
          onNavigate('/admin');
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

        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([{ user_id: user.id }]);

        if (insertError) {
          console.error(insertError);
          // If insert fails due to RLS, let user know or if first user success
        }

        setSuccessMsg('Admin account created successfully! Redirecting...');
        setTimeout(() => {
          onLoginSuccess();
          onNavigate('/admin');
        }, 1000);
      }

    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-600/20">
            <Stethoscope className="h-7 w-7" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Clinic Administrator Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Lumina Dental Secure Management Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          <button
            onClick={() => onNavigate('/')}
            className="mb-6 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Public Website
          </button>

          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed">
              <span className="font-semibold block mb-1">Demo Mode Active</span>
              Supabase is not configured yet. You can log in with any email and password (min 4 characters) to test the fully functional admin dashboard.
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@luminadental.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-slate-900"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    {mode === 'signin' ? 'Sign In to Dashboard' : 'Create Admin Account'}
                  </span>
                )}
              </button>
            </div>
          </form>

          {isSupabaseConfigured && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup_bootstrap' : 'signin')}
                className="text-xs text-slate-500 hover:text-teal-600 font-medium transition-colors"
              >
                {mode === 'signin' 
                  ? "First time setup? Create new admin account" 
                  : "Already have an admin account? Sign in"}
              </button>
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-xs text-slate-400">
              Protected area for authorized medical and administrative personnel only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
