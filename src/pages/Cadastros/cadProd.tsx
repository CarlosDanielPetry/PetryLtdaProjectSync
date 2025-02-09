import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Produto } from '../../types';

export default function CadProd() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    prod_descricao: '',
    prod_codBarras: '',
    prod_estoque: '',
    prod_grupo: '',
    prod_marca: '',
    prod_situacao: 'A',
    prod_imagem: ''
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  /**
   * Lida com o envio do formulário para criar um novo produto.
   * @param {React.FormEvent} e - O evento de envio do formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validações
    if (formData.prod_descricao.length > 100) {
      setError('A descrição deve ter no máximo 100 caracteres');
      setLoading(false);
      return;
    }

    if (formData.prod_codBarras && formData.prod_codBarras.length !== 13) {
      setError('O código de barras deve ter 13 caracteres');
      setLoading(false);
      return;
    }

    if (formData.prod_grupo && formData.prod_grupo.length > 30) {
      setError('O grupo deve ter no máximo 30 caracteres');
      setLoading(false);
      return;
    }

    if (formData.prod_marca && formData.prod_marca.length > 30) {
      setError('A marca deve ter no máximo 30 caracteres');
      setLoading(false);
      return;
    }

    if (!formData.prod_estoque) {
      setError('O estoque é obrigatório');
      setLoading(false);
      return;
    }

    const estoque = parseFloat(formData.prod_estoque);
    if (isNaN(estoque)) {
      setError('O estoque deve ser um número válido');
      setLoading(false);
      return;
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('produtos')
        .insert([
          {
            prod_descricao: formData.prod_descricao.trim(),
            prod_codBarras: formData.prod_codBarras.trim() || null,
            prod_estoque: estoque,
            prod_grupo: formData.prod_grupo.trim() || null,
            prod_marca: formData.prod_marca.trim() || null,
            prod_situacao: formData.prod_situacao,
            prod_vmd: 0, // Valor padrão
            prod_imagem: formData.prod_imagem || null
          }
        ])
        .select();

      if (supabaseError) {
        console.error('Erro do Supabase:', supabaseError);
        setError(`Erro ao cadastrar produto: ${supabaseError.message}`);
        return;
      }

      setSuccess(true);
      setFormData({
        prod_descricao: '',
        prod_codBarras: '',
        prod_estoque: '',
        prod_grupo: '',
        prod_marca: '',
        prod_situacao: 'A',
        prod_imagem: ''
      });
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      setError('Erro inesperado. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lida com o evento de mudança no input do código de barras.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    setFormData({ ...formData, prod_codBarras: value });
  };

  /**
   * Lida com o evento de mudança no input do estoque.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleEstoqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    setFormData({ ...formData, prod_estoque: value });
  };

  /**
   * Converte um arquivo de imagem para uma URL de dados PNG.
   * @param {File} file - O arquivo de imagem a ser convertido.
   * @returns {Promise<string>} - Uma promessa que resolve com a URL de dados PNG.
   */
  const convertImageToPng = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          resolve(pngDataUrl);
        };
        img.onerror = (error) => {
          reject(error);
        };
        img.src = event?.target?.result as string;
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * Lida com o evento de mudança no input da imagem.
   * Converte a imagem selecionada para PNG e a armazena como uma string Base64.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const pngDataUrl = await convertImageToPng(file);
        const base64String = pngDataUrl.substring(pngDataUrl.indexOf(',') + 1);
        setFormData({ ...formData, prod_imagem: base64String });
      } catch (error) {
        console.error('Erro ao converter imagem para PNG:', error);
        setError('Erro ao processar a imagem. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Cadastro de Produtos</h2>

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

        <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={handleBarcodeChange}
              maxLength={13}
              inputMode="numeric"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque
            </label>
            <input
              type="number"
              value={formData.prod_estoque}
              onChange={handleEstoqueChange}
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
              value={formData.prod_grupo}
              onChange={(e) => setFormData({ ...formData, prod_grupo: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Produto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ref={imageInputRef}
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
    </div>
  );
}
