# Como publicar sua loja na Vercel

## Passo 1 — Subir os arquivos para o GitHub
1. Entre em github.com e faça login.
2. Clique no "+" no canto superior direito → **New repository**.
3. Dê um nome, por exemplo `loja-virtuosa`. Deixe como **Public**. Clique em **Create repository**.
4. Na página do repositório, clique no link **"uploading an existing file"**.
5. Arraste estes 4 arquivos para a caixa: `index.html`, `style.css`, `script.js`, `data.json`.
6. Role para baixo e clique em **Commit changes**.

## Passo 2 — Publicar na Vercel
1. Entre em vercel.com e faça login usando sua conta do GitHub.
2. Clique em **Add New... → Project**.
3. Encontre o repositório `loja-virtuosa` e clique em **Import**.
4. Não precisa mudar nenhuma configuração — clique em **Deploy**.
5. Em menos de 1 minuto sua loja estará no ar em um endereço tipo `loja-virtuosa.vercel.app`.

## Passo 3 — Conectar seu domínio
1. Dentro do projeto na Vercel, vá em **Settings → Domains**.
2. Digite seu domínio (ex: `virtuosainspiracao.com.br`) e clique em **Add**.
3. A Vercel vai mostrar um ou dois registros para você copiar (tipo "A" e "CNAME").
4. Entre no painel do **Registro.com.br**, procure a área de **DNS / Zona DNS** do seu domínio.
5. Cole exatamente os valores que a Vercel te mostrou.
6. Aguarde — geralmente funciona em minutos, mas pode levar até 24 horas.

## Como editar produtos depois
Tudo o que aparece na loja vem do arquivo **data.json**. Para mudar um produto:

1. No GitHub, abra o repositório `loja-virtuosa` e clique no arquivo `data.json`.
2. Clique no ícone de lápis (editar) no canto superior direito do arquivo.
3. Altere o texto que quiser (veja o guia de campos abaixo).
4. Role para baixo e clique em **Commit changes**.
5. Pronto — a Vercel atualiza o site sozinha em cerca de 1 minuto.

### Campos de cada produto
```
"name"           → nome do produto
"price"          → preço atual (use ponto, não vírgula: 129.90)
"compareAtPrice" → preço "de", riscado, para mostrar desconto (deixe 0 se não tiver)
"category"       → uma das categorias: Roupas, Calçados, Acessórios, Perfumaria, Utilidades para o Lar
"sizes"          → tamanhos separados por vírgula, ex: "P, M, G" (deixe vazio "" se não tiver)
"description"    → descrição curta
"imageUrl"       → link de uma imagem (deixe "" se não tiver foto ainda)
"novidade"       → true ou false — se true, aparece na coluna Novidades
"maisVendido"    → true ou false — se true, aparece na coluna Mais Vendidos
```

### Para adicionar um produto novo
Copie um bloco `{ ... }` inteiro de um produto existente, cole logo depois (separado por vírgula),
troque o `"id"` para algo único (ex: `"p10"`) e ajuste os campos.

### Para mudar nome, banner, WhatsApp, Instagram ou e-mail da loja
Esses ficam no início do arquivo, dentro de `"info"`. É só editar o texto entre aspas.

**Importante:** o arquivo precisa continuar em formato JSON válido — toda linha (exceto a última de um
grupo) termina com vírgula, e todo texto fica entre aspas duplas. Se não tiver certeza depois de editar,
volte aqui no chat e me manda o que você mudou que eu confiro pra você.
