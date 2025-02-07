import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetRequestTime, setResetRequestTime] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { initialize } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Primeiro tenta fazer login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (authError) {
        console.error('Erro na autenticação:', authError);
        throw new Error('Email ou senha inválidos');
      }

      if (!authData.user) {
        throw new Error('Email ou senha inválidos');
      }

      // Se o login no Auth foi bem sucedido, busca o perfil do usuário
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('usua_cargo')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (userError || !userData) {
        console.error('Erro ao buscar perfil:', userError);
        // Faz logout do auth já que não encontrou o perfil
        await supabase.auth.signOut();
        throw new Error('Erro ao carregar perfil do usuário');
      }

      // Redireciona com base no cargo
      const userCargo = userData.usua_cargo;
      if (userCargo === 'C') {
        navigate('/'); // Cliente
      } else {
        navigate('/relatorios'); // Desenvolvedor, Funcionário ou Administrador
      }
      initialize();
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor, digite seu email primeiro');
      return;
    }

    if (resetRequestTime) {
      const waitTimeInSeconds = 60;
      const timeSinceLastRequest = (Date.now() - resetRequestTime) / 1000;
      
      if (timeSinceLastRequest < waitTimeInSeconds) {
        const remainingTime = Math.ceil(waitTimeInSeconds - timeSinceLastRequest);
        setError(`Por favor, aguarde ${remainingTime} segundos antes de solicitar novamente.`);
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      const normalizedEmail = email.toLowerCase().trim();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        if (resetError.status === 429) {
          throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente.');
        }
        throw resetError;
      }

      setResetRequestTime(Date.now());
      alert('Se existe uma conta com este email, você receberá instruções para redefinir sua senha.');
      
    } catch (error: any) {
      console.error('Erro ao recuperar senha:', error);
      setError(error?.message || 'Erro ao processar a solicitação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="mt-4 text-center space-y-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className={`text-blue-500 hover:text-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Esqueceu sua senha?
            </button>
            <div>
              <Link to="/registro" className="text-blue-500 hover:text-blue-600">
                Não tem uma conta? Cadastre-se aqui
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
