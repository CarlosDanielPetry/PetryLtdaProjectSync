
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