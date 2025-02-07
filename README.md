# Ardor & Arte - E-commerce Whitelabel

Este é um projeto de e-commerce whitelabel desenvolvido com React, TypeScript, Vite e Supabase.

## Como usar

1.  **Instalação:**

```bash
npm install
```

2.  **Configuração das variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```
VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA_DO_SUPABASE
```

Substitua `SUA_URL_DO_SUPABASE` e `SUA_CHAVE_ANONIMA_DO_SUPABASE` pelas suas credenciais do Supabase.

3.  **Execução:**

```bash
npm run dev
```

Isso iniciará o servidor de desenvolvimento.

## Estrutura do projeto

```
├── .env                    # Arquivo de configuração das variáveis de ambiente
├── .gitignore              # Arquivo para ignorar arquivos no Git
├── index.html              # Arquivo HTML principal
├── package.json            # Arquivo de configuração do projeto
├── postcss.config.js       # Arquivo de configuração do PostCSS
├── README.md               # Este arquivo
├── src                     # Diretório com o código fonte
│   ├── App.tsx             # Componente principal da aplicação
│   ├── assets              # Diretório com os assets (imagens, etc.)
│   │   └── images.ts       # Arquivo com as referências das imagens
│   ├── components          # Diretório com os componentes reutilizáveis
│   │   └── Navbar.tsx      # Componente da barra de navegação
│   ├── lib                 # Diretório com as bibliotecas
│   │   └── supabase.ts     # Cliente Supabase
│   ├── pages               # Diretório com as páginas da aplicação
│   │   ├── Inicio.tsx      # Página inicial
│   │   ├── Login.tsx       # Página de login
│   │   ├── Produtos.tsx    # Página de produtos
│   │   └── ...             # Outras páginas
│   ├── store               # Diretório com os stores do Zustand
│   │   ├── authStore.ts    # Store de autenticação
│   │   └── cartStore.ts    # Store do carrinho de compras
│   ├── styles              # Diretório com os estilos
│   │   ├── global.css      # Estilos globais
│   │   ├── theme           # Diretório com o tema
│   │   │   ├── colors.ts   # Cores do tema
│   │   │   └── ...         # Outros arquivos do tema
│   ├── types               # Diretório com as definições de tipo
│   │   └── index.ts        # Definições de tipo
│   ├── vite-env.d.ts       # Definições de tipo do Vite
│   └── main.tsx            # Arquivo de entrada da aplicação
├── tailwind.config.js      # Arquivo de configuração do Tailwind CSS
├── tsconfig.json           # Arquivo de configuração do TypeScript
└── vite.config.ts          # Arquivo de configuração do Vite
```

## Arquivo de referências de imagens (`src/assets/images.ts`)

Este arquivo contém um objeto chamado `images` que centraliza as URLs das imagens usadas no site.

**Como usar:**

1.  Importe o objeto `images` nos componentes onde você precisa usar as imagens:

```typescript
import { images } from '@/assets/images';
```

2.  Use as URLs das imagens nos seus componentes:

```typescript
<img src={images.logo} alt="Logo" />
<img src={images.heroBanner} alt="Banner Principal" />
```

Dessa forma, você terá um local centralizado para gerenciar as imagens do seu site e poderá facilmente alterar as URLs ou adicionar novas imagens no futuro.

## Deploy no Netlify

1.  **Instale a CLI do Netlify (se necessário):**

```bash
npm install -g netlify-cli
```

2.  **Faça login no Netlify:**

```bash
netlify login
```

3.  **Execute o deploy:**

```bash
netlify deploy --prod
```

## Deploy no Netlify

Siga estes passos para fazer o deploy do projeto no Netlify:

1.  **Instale a CLI do Netlify (se necessário):**

    ```bash
    npm install -g netlify-cli
    ```

2.  **Faça login no Netlify:**

    ```bash
    netlify login
    ```

3.  **Crie um arquivo `netlify.toml` na raiz do projeto com o seguinte conteúdo:**

    ```toml
    [build]
      publish = "dist"
      command = "npm run build"
    ```

4.  **Execute o deploy:**

    ```bash
    netlify deploy --prod
    ```

Isso irá construir o projeto e fazer o deploy para o Netlify.

## Agradecimentos

Carlos Daniel Petry - Carlosdanielpetry@outlook.com.br - Responsável: Frontend  
Juliano dos Santos  - ju.neno@hotmail.com              - Responsável: Backend/front  
Ricardo Petry       - Ricardopettry@hotmail.com        - Responsável: Backend  
