import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Produto } from '../types';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Carrega os produtos do banco de dados.
   */
  useEffect(() => {
    carregarProdutos();
  }, []);

  /**
   * Busca os produtos do Supabase e define o estado.
   */
  async function carregarProdutos() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*');

      if (error) {
        console.error('Erro ao buscar produtos do Supabase:', error.message);
        throw error;
      }

      const produtosCorretos: Produto[] = (data || []).map((item: any) => ({
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
        prod_ofstatus: item.prod_ofstatus,
        created_at: item.created_at,
        prod_codigo: '0'
      } as Produto));

      setProdutos(produtosCorretos);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Valida se a string base64 é válida.
   * @param {string} base64String
   * @returns {boolean}
   */
  const isValidBase64 = (base64String: string) => {
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    return base64String && base64String.length % 4 === 0 && base64Regex.test(base64String);
  };

  /**
   * Determina o prefixo de imagem correto com base na string Base64.
   * @param {string | null | undefined} base64String - A string Base64 da imagem.
   * @returns {string} - O prefixo de imagem correto.
   */
  const getImagePrefix = (base64String: string | null | undefined) => {
    if (!base64String || !isValidBase64(base64String)) {
      console.warn('Imagem base64 inválida:', base64String);
      return '';
    }
    if (base64String.startsWith('/9j/')) {
      return 'data:image/jpeg;base64,';
    } else {
      return 'data:image/png;base64,';
    }
  };

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
              {produto.prod_imagem && isValidBase64(produto.prod_imagem) ? (
                <img
                  src={`${getImagePrefix(produto.prod_imagem)}${produto.prod_imagem}`}
                  alt={produto.prod_descricao}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <img
                  src="/caminho/para/imagem/padrao.png" // Imagem padrão caso o base64 seja inválido
                  alt="Imagem não disponível"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{produto.prod_descricao}</h3>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    {produto.prod_ofstatus === 'S' ? (
                      <span className="text-xl font-bold text-green-500">
                        R$ {produto.prodaa_prvendaoferta?.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        R$ {produto.prod_prvenda?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
