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
    prod_situacao: 'A',
    prod_vmd: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase.from('produtos').insert([{
        ...formData,
        prod_Estoque: parseInt(formData.prod_Estoque),
        prod_vmd: parseFloat(formData.prod_vmd)
      }]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        prod_descricao: '',
        prod_codBarras: '',
        prod_Estoque: '',
        prod_Grupo: '',
        prod_marca: '',
        prod_situacao: 'A',
        prod_vmd: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      setError('Erro ao cadastrar produto. Por favor, tente novamente.');
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
            Descrição
          </label>
          <input
            type="text"
            value={formData.prod_descricao}
            onChange={(e) => setFormData({ ...formData, prod_descricao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Barras
          </label>
          <input
            type="text"
            value={formData.prod_codBarras}
            onChange={(e) => setFormData({ ...formData, prod_codBarras: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estoque
          </label>
          <input
            type="number"
            value={formData.prod_Estoque}
            onChange={(e) => setFormData({ ...formData, prod_Estoque: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grupo
          </label>
          <input
            type="text"
            value={formData.prod_Grupo}
            onChange={(e) => setFormData({ ...formData, prod_Grupo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <input
            type="text"
            value={formData.prod_marca}
            onChange={(e) => setFormData({ ...formData, prod_marca: e.target.value })}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VMD (Venda Média Diária)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.prod_vmd}
            onChange={(e) => setFormData({ ...formData, prod_vmd: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
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