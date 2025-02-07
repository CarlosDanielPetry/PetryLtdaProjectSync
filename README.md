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
