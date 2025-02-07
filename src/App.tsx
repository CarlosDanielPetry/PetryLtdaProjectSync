import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Produtos from './pages/Produtos';
import GerenciarProdutos from './pages/GerenciarProdutos';
import Checkout from './pages/Checkout';
import Relatorios from './pages/Relatorios';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { Usuario } from './types';

function App() {
  const { user, loading, initialize } = useAuthStore();
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setProfileLoading(false);
      setUserProfile(null);
    }
  }, [user]);

  async function loadUserProfile() {
    setProfileLoading(true);
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
      setProfileLoading(false);
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  // Verifica se o usuário tem permissão para acessar áreas restritas
  const canAccessRestrictedAreas = userProfile?.usua_cargo && ['D', 'A', 'F'].includes(userProfile.usua_cargo);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rotas protegidas que requerem permissões específicas */}
            {canAccessRestrictedAreas ? (
              <>
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/gerenciar-produtos" element={<GerenciarProdutos />} />
                <Route path="/relatorios" element={<Relatorios />} />
              </>
            ) : null}

            {/* Rotas que requerem apenas autenticação */}
            {user && (
              <Route path="/checkout" element={<Checkout />} />
            )}

            {/* Redireciona para home se tentar acessar rota não autorizada */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}