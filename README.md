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
├── .gitattributes          # Arquivo de atributos do Git
├── .gitignore              # Arquivo para ignorar arquivos no Git
├── eslint.config.js        # Arquivo de configuração do ESLint
├── index.html              # Arquivo HTML principal
├── netlify.toml            # Arquivo de configuração do Netlify
├── package-lock.json       # Arquivo de lock das dependências do NPM
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
│   │   ├── Cadastros       # Diretório referente a cadastros
│   │   │   ├── Login.tsx             # Página de login
│   │   │   ├── GerenciarProdutos.tsx # Página de gerenciamento de produtos
│   │   │   └── Registro.tsx          # Página de registro
│   │   ├── Produtos.tsx    # Página de produtos
│   │   ├── Checkout.tsx    # Página de checkout
│   │   ├── Relatorios.tsx  # Página de relatórios
│   ├── store               # Diretório com os stores do Zustand
│   │   ├── authStore.ts    # Store de autenticação
│   │   └── cartStore.ts    # Store do carrinho de compras
│   ├── styles              # Diretório com os estilos
│   │   ├── global.css      # Estilos globais
│   │   ├── theme           # Diretório com o tema
│   │   │   ├── colors.ts   # Cores do tema
│   │   │   ├── components.ts # Estilos dos componentes
│   │   │   ├── images.ts   # Imagens do tema
│   │   │   ├── index.ts    # Arquivo de índice do tema
│   │   │   ├── spacing.ts  # Espaçamentos do tema
│   │   │   └── typography.ts # Tipografia do tema
│   ├── types               # Diretório com as definições de tipo
│   │   └── index.ts        # Definições de tipo
│   ├── vite-env.d.ts       # Definições de tipo do Vite
│   └── main.tsx            # Arquivo de entrada da aplicação
├── tailwind.config.js      # Arquivo de configuração do Tailwind CSS
├── tsconfig.app.json       # Arquivo de configuração do TypeScript para a aplicação
├── tsconfig.json           # Arquivo de configuração do TypeScript
├── tsconfig.node.json      # Arquivo de configuração do TypeScript para o Node
└── vite.config.ts          # Arquivo de configuração do Vite
```
# Agradecimentos

Ricardo Petry			  - Ricardopettry@gmail.com 										 - Responsável: Backend  
Juliano dos Santos  - ju.neno@hotmail.com 	  										 - Responsável: Backend/frontend  
Carlos Daniel Petry - Carlosdanielpetry@outlook.com.br 						 - Responsável: Backend/frontend
