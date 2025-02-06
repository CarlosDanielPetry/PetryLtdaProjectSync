import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Produto } from '../types';

export default function GerenciarProdutos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    prod_descricao: '',
    prod_codBarras: '',
    prod_Estoque: '',
    prod_Grupo: '',
    prod_marca: '',
    prod_situacao: 'A'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate field lengths
    if (formData.prod_descricao.length > 100) {
      setError('A descrição deve ter no máximo 100 caracteres');
      setLoading(false);
      return;
    }

    if (formData.prod_codBarras && formData.prod_codBarras.length > 13) {
      setError('O código de barras deve ter no máximo 13 caracteres');
      setLoading(false);
      return;
    }

    if (formData.prod_Grupo && formData.prod_Grupo.length > 30) {
      setError('O grupo deve ter no máximo 30 caracteres');
      setLoading(false);
      return;
    }

    if (formData.prod_marca && formData.prod_marca.length > 30) {
      setError('A marca deve ter no máximo 30 caracteres');
      setLoading(false);
      return;
    }

    // Validate numeric fields
    const estoque = parseFloat(formData.prod_Estoque);
    if (isNaN(estoque)) {
      setError('O estoque deve ser um número válido');
      setLoading(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase.from('produtos').insert([{
        prod_descricao: formData.prod_descricao.trim(),
        prod_codBarras: formData.prod_codBarras.trim() || null,
        prod_Estoque: estoque,
        prod_Grupo: formData.prod_Grupo.trim() || null,
        prod_marca: formData.prod_marca.trim() || null,
        prod_situacao: formData.prod_situacao,
        prod_vmd: 0 // Default value for new products
      }]);

      if (supabaseError) {
        console.error('Erro do Supabase:', supabaseError);
        throw new Error('Erro ao cadastrar produto. Por favor, verifique os dados e tente novamente.');
      }

      setSuccess(true);
      setFormData({
        prod_descricao: '',
        prod_codBarras: '',
        prod_Estoque: '',
        prod_Grupo: '',
        prod_marca: '',
        prod_situacao: 'A'
      });
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      setError(error.message || 'Erro ao cadastrar produto. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Cadastro de Produtos</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Produto cadastrado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição (máx. 100 caracteres)
          </label>
          <input
            type="text"
            value={formData.prod_descricao}
            onChange={(e) => setFormData({ ...formData, prod_descricao: e.target.value })}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Barras (máx. 13 caracteres)
          </label>
          <input
            type="text"
            value={formData.prod_codBarras}
            onChange={(e) => setFormData({ ...formData, prod_codBarras: e.target.value })}
            maxLength={13}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estoque
          </label>
          <input
            type="number"
            step="0.00001"
            value={formData.prod_Estoque}
            onChange={(e) => setFormData({ ...formData, prod_Estoque: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grupo (máx. 30 caracteres)
          </label>
          <input
            type="text"
            value={formData.prod_Grupo}
            onChange={(e) => setFormData({ ...formData, prod_Grupo: e.target.value })}
            maxLength={30}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca (máx. 30 caracteres)
          </label>
          <input
            type="text"
            value={formData.prod_marca}
            onChange={(e) => setFormData({ ...formData, prod_marca: e.target.value })}
            maxLength={30}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Situação
          </label>
          <select
            value={formData.prod_situacao}
            onChange={(e) => setFormData({ ...formData, prod_situacao: e.target.value as 'A' | 'I' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="A">Ativo</option>
            <option value="I">Inativo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </form>
    </div>
  );
}
