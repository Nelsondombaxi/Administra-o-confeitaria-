import { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('admin@veyra.ao');
  const [password, setPassword] = useState('********');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#e6dec5] p-8 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-[#2b1810] font-serif tracking-wide">VEYRA</h1>
          <p className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2b1810]">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8c5338] absolute left-3.5 top-3.5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2b1810]">Palavra-passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8c5338] absolute left-3.5 top-3.5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#2b1810] hover:bg-[#5c3524] text-[#c5a059] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md border border-[#c5a059]/30"
          >
            <span>Entrar no Painel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <span className="text-[10px] text-[#8c5338]">Veyra Confeitaria Artesanal • M1 Visual</span>
        </div>
      </div>
    </div>
  );
}