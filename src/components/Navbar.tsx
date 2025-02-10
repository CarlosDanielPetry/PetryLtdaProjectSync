import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Home, Menu, User, ShoppingBag, History, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';
import { Usuario } from '../types';

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/registro';

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setLoading(false);
      setUserProfile(null);
    }
  }, [user]);

  async function loadUserProfile() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await signOut();
      setUserProfile(null);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Verifica se o usuário tem permissão para acessar o cadastro de produtos
  const canManageProducts = userProfile?.usua_cargo && ['D', 'A', 'F'].includes(userProfile.usua_cargo);

  if (loading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-800">
              E-commerce
            </Link>
            <div className="text-gray-600">Carregando...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              E-commerce
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && userProfile ? (
              <>
                {/* Apenas usuários com cargo D, A, F podem ver o link de produtos */}
                {canManageProducts && (
                  <Link to="/produtos" className="text-gray-600 hover:text-gray-800">
                    Produtos
                  </Link>
                )}
                
                {canManageProducts && (
                  <>
                    <Link to="/cadProd" className="text-gray-600 hover:text-gray-800">
                      Cadastro de Produtos
                    </Link>
                    <Link to="/relatorios" className="text-gray-600 hover:text-gray-800">
                      Relatórios
                    </Link>
                  </>
                )}

                <Link to="/checkout" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {items.length}
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Home className="h-6 w-6" />
                </Link>
                {!isLoginPage && (
                  <Link
                    to="/login"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                )}
                {!isRegisterPage && (
                  <Link
                    to="/registro"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Cadastrar-se
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
