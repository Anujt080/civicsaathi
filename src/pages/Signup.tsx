import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';
import { AlertCircle, Lock, Mail, User, Loader2, ArrowRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export const Signup: React.FC = () => {
  const { signUp, user, isConfigured } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate('/profile', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError(t('auth.errors.fullNameRequired'));
      return;
    }
    if (!email.trim()) {
      setError(t('auth.errors.emailRequired'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(t('auth.errors.emailRequired'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.errors.passwordTooShort'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    setLoading(true);
    const { error: signUpError, user: newUser } = await signUp(
      email.trim(),
      password,
      fullName.trim()
    );
    setLoading(false);

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes('user already registered')) {
        setError('An account with this email already exists. Please log in.');
      } else if (msg.includes('weak') || msg.includes('short')) {
        setError('Please choose a stronger password.');
      } else if (msg.includes('credentials are not configured')) {
        setError('Supabase is not configured yet. Please configure SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
      } else {
        setError(signUpError.message || 'Unable to create account. Please try again.');
      }
      return;
    }

    if (newUser) {
      navigate('/profile', { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <Link to="/" className="hover:opacity-90 transition">
            <BrandLogo size="lg" />
          </Link>
          <div className="pt-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('auth.signupTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              {t('auth.signupSubtitle')}
            </p>
          </div>
        </div>

        {!isConfigured && (
          <div className="mb-6 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>
              Supabase environment variables not configured in <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">.env</code>. Connect your Supabase project to register.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.fullNameLabel')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('auth.fullNamePlaceholder')}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                disabled={loading}
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.confirmPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>{t('common.loading')}</span>
              </>
            ) : (
              <>
                <span>{t('auth.signUpBtn')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-900 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>{t('auth.hasAccount')} </span>
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-bold ml-1">
            {t('auth.signInLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};
