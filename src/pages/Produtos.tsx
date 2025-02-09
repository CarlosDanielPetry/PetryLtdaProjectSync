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
        .select('id, prod_descricao, prod_prvenda, prodaa_prvendaoferta, prod_imagem, prod_codBarras, prod_Estoque, prod_Grupo, prod_marca, prod_situacao, prod_vmd, created_at')
        .order('created_at', { ascending: false });

    if (error) throw error;

    const produtosCorretos: Produto[] = (data || []).map((item/* erro */) => ({
      // const produtosCorretos: Produto[] = (data || []).map((item: Produto) => ({
      id: item.id,
      prod_descricao: item.prod_descricao,
      prod_prvenda: item.prod_prvenda,
      prodaa_prvendaoferta: item.prodaa_prvendaoferta,
      prod_imagem: item.prod_imagem,
      prod_codBarras: item.prod_codBarras,
      prod_Estoque: item.prod_Estoque,
      prod_Grupo: item.prod_Grupo,
      prod_marca: item.prod_marca,
      prod_situacao: item.prod_situacao,
      prod_vmd: item.prod_vmd,
      created_at: item.created_at
    }));

    setProdutos(produtosCorretos);
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
              {produto.prod_imagem && (
                <img
                  src={`data:image/png;base64,${produto.prod_imagem}`}
                  alt={produto.prod_descricao}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{produto.prod_descricao}</h3>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    {produto.prodaa_prvendaoferta ? (
                      <>
                        <span className="text-xl font-bold text-green-500">
                          R$ {produto.prodaa_prvendaoferta?.toFixed(2)}
                        </span>
                        <span className="text-gray-500 line-through ml-2">
                          R$ {produto.prod_prvenda?.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        R$ {produto.prod_prvenda?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const product: Product = {
                        id: produto.id,
                        name: produto.prod_descricao,
                        description: produto.prod_descricao,
                        price: produto.prodaa_prvendaoferta || produto.prod_prvenda || 0,
                        image_url: produto.prod_imagem ? `data:image/png;base64,${produto.prod_imagem}` : '',
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
