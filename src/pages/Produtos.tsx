import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Produto, Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Trash2 } from 'lucide-react';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  useEffect(() => {
    carregarProdutos();
    if (user) {
      carregarPerfilUsuario();
    }
  }, [user]);

  async function carregarPerfilUsuario() {
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
    }
  }

  async function carregarProdutos() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('prod_situacao', 'A')
        .order('prod_descricao');

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function excluirProduto(codigo: number) {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      // query exclusão
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('prod_codigo', codigo);

      if (error) {
        console.error('Erro ao excluir:', error);
        throw error;
      }

      // Atualiza a lista de produtos após a exclusão
      await carregarProdutos();
      alert('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Tente novamente.');
    }
  }

  const podeExcluir = userProfile?.usua_cargo && ['D', 'A'].includes(userProfile.usua_cargo);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Todos os Produtos</h2>
      {loading ? (
        <div className="text-center">Carregando produtos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto: Produto) => (
            <div
              key={produto.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                <img
                  src={produto.imagem_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                  alt={produto.prod_descricao}
                  className="w-full h-48 object-cover"
                />
                {podeExcluir && (
                  <button
                    onClick={() => excluirProduto(produto.prod_codigo)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Excluir produto"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{produto.prod_descricao}</h3>
                <p className="text-gray-600 mt-2">{produto.prod_marca}</p>
                <p className="text-sm text-gray-500 mt-1">Estoque: {produto.prod_Estoque || 0}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">
                    R$ {produto.prod_vmd?.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      const product: Product = {
                        id: produto.id,
                        name: produto.prod_descricao,
                        description: produto.prod_descricao,
                        price: produto.prod_vmd || 0,
                        image_url: produto.imagem_url || '',
                        stock: produto.prod_Estoque || 0,
                        created_at: ''
                      };
                      addItem(product);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}