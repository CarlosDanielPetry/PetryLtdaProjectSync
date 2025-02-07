export interface Produto {
    id: string;
    prod_codigo: number;
    prod_descricao: string;
    prod_codBarras?: string;
    prod_estoque: number;
    prod_grupo?: string;
    prod_marca?: string;
    prod_situacao: 'A' | 'I';
    prod_vmd: number;
    imagem_url?: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
  }
