import { useState, type FormEvent } from 'react';

import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';

import { supabase } from '../../lib/supabase';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      onLoginSuccess();
    } catch (error: unknown) {
      console.error('Erro no login:', error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Não foi possível iniciar sessão. Verifique as suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#e6dec5] p-8 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-[#2b1810] font-serif tracking-wide">
            VEYRA
          </h1>

          <p className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">
            Painel Administrativo
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-center font-medium"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-email"
              className="text-xs font-bold text-[#2b1810]"
            >
              E-mail
            </label>

            <div className="relative">
              <Mail
                aria-hidden="true"
                className="w-4 h-4 text-[#8c5338] absolute left-3.5 top-3.5"
              />

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@veyra.ao"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="text-xs font-bold text-[#2b1810]"
            >
              Palavra-passe
            </label>

            <div className="relative">
              <Lock
                aria-hidden="true"
                className="w-4 h-4 text-[#8c5338] absolute left-3.5 top-3.5"
              />

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#2b1810] hover:bg-[#5c3524] text-[#c5a059] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md border border-[#c5a059]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2
                  aria-hidden="true"
                  className="w-4 h-4 animate-spin"
                />

                <span>A entrar...</span>
              </>
            ) : (
              <>
                <span>Entrar no Painel</span>

                <ArrowRight
                  aria-hidden="true"
                  className="w-4 h-4"
                />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <span className="text-[10px] text-[#8c5338]">
            Veyra Confeitaria Artesanal • M1 Visual
          </span>
        </div>
      </div>
    </div>
  );
}