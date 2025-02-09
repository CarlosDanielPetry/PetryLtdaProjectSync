import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const checkEmailExists = async (email: string) => {
    try {
      // Primeiro verifica no Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-for-check'
      });

      // Se não der erro de "Invalid login credentials", significa que o email existe
      if (!authError || !authError.message.includes('Invalid login credentials')) {
        return true;
      }

      // Depois verifica na tabela usuarios
      const { data, error: dbError } = await supabase
        .from('usuarios')
        .select('usua_email')
        .eq('usua_email', email)
        .maybeSingle();

      if (dbError) throw dbError;

      return data !== null;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  };

  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Erro ao obter IP:', error);
      return '0.0.0.0'; // IP padrão em caso de erro
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Verifica se o email já existe
      const emailExists = await checkEmailExists(normalizedEmail);
      if (emailExists) {
        throw new Error('Este email já está cadastrado');
      }

      // Obtém o IP do usuário
      const userIP = await getUserIP();

      // Cria o usuário no auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        console.error('Erro ao criar usuário:', signUpError);
        if (signUpError.message.includes('already registered')) {
          throw new Error('Este email já está cadastrado');
        }
        throw new Error('Erro ao criar conta. Por favor, tente novamente.');
      }

      if (!authData.user) {
        throw new Error('Erro ao criar conta. Por favor, tente novamente.');
      }

      // Hash da senha antes de salvar
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o perfil do usuário com o IP
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([
          {
            usua_email: normalizedEmail,
            usua_nome: fullName,
            usua_cargo: 'C',
            auth_user_id: authData.user.id,
            usua_senha: hashedPassword,
            usua_IP: userIP
          },
        ]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Se houver erro ao criar o perfil, remove o usuário do auth
        await supabase.auth.signOut();
        throw new Error('Erro ao criar perfil de usuário. Por favor, tente novamente.');
      }

      // Sucesso! Redireciona para o login
      navigate('/login');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao criar conta. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Cadastro de Usuário</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
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
                minLength={8}
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

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-500 hover:text-blue-600">
              Já tem uma conta? Faça login aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
