import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Produto, Product } from '../types';
import { useCartStore } from '../store/cartStore';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Todos os Produtos</h2>
      {loading ? (
        <div className="text-center">Carregando produtos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={produto.imagem_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                alt={produto.prod_descricao}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{produto.prod_descricao}</h3>
                <p className="text-gray-600 mt-2">{produto.prod_marca}</p>
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
                        stock: produto.prod_Estoque,
                        created_at: produto.created_at
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
