import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ decryptedPassword: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user as User || null });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user as User || null });
      });
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (email, password) => {
    try {
      // Consulta a senha do usuário no banco de dados
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('usua_senha')
        .eq('usua_email', email.toLowerCase().trim())
        .single();

      if (userError) {
        console.error('Erro ao consultar usuário:', userError);
        throw new Error('Falha na autenticação');
      }

      if (!userData?.usua_senha) {
        throw new Error('Email ou senha inválidos');
      }

      // Verifica a senha usando bcrypt
      const isValidPassword = await bcrypt.compare(password, userData.usua_senha);
      if (!isValidPassword) {
        throw new Error('Email ou senha inválidos');
      }

      // Se a senha for válida, prossegue com a autenticação do Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Dados do usuário não retornados');

      set({ user: data.user as User });
      
      // Retorna a senha descriptografada
      return { decryptedPassword: password };
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    }
  },
  signUp: async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));