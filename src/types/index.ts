export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Usuario {
  id: string;
  usua_email: string;
  usua_nome: string;
  usua_cargo: 'C' | 'F' | 'D' | 'A';
  usua_data_cadastro: string;
  auth_user_id: string;
}

export interface Produto {
  id: string;
  prod_descricao: string;
  prod_codBarras: string;
  prod_Estoque: number;
  prod_Grupo: string;
  prod_marca: string;
  prod_situacao: 'A' | 'I';
  prod_vmd: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  items: CartItem[];
}
