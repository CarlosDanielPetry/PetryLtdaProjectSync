import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Produto } from '../types';
import { ShoppingBag } from 'lucide-react';

interface GroupedProducts {
  [key: string]: Produto[];
}

export default function Inicio() {
  const { user } = useAuthStore();
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('prod_situacao', 'A')
        .order('prod_descricao');

      if (error) throw error;

      // Group products by prod_grupo
      const grouped = (data || []).reduce((acc: GroupedProducts, product) => {
        const group = product.prod_Grupo || 'Sem Categoria';
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(product);
        return acc;
      }, {});

      setGroupedProducts(grouped);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nossos Produtos
        </h1>
        <p className="text-lg text-gray-600">
          Explore nossa seleção de produtos por categoria
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedProducts).map(([group, products]) => (
          <div key={group} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">
              {group}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                      <ShoppingBag className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.prod_descricao}
                    </h3>
                    {product.prod_marca && (
                      <p className="text-sm text-gray-600 mb-2">
                        Marca: {product.prod_marca}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      Código: {product.prod_codBarras || 'N/A'}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium text-gray-600">
                        Estoque: {product.prod_Estoque}
                      </span>
                      {product.prod_vmd > 0 && (
                        <span className="text-sm font-medium text-primary-600">
                          VMD: {product.prod_vmd}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
