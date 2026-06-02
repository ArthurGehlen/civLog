# CivLog

CivLog é um site para **registrar e acompanhar partidas de Civilization VI** jogadas
entre um grupo de amigos. Cada partida tem jogadores, civilizações escolhidas,
configurações de mapa e vencedores; a partir desses dados o site monta perfis de
jogadores, estatísticas e um leaderboard.

> Projeto pessoal/paralelo — feito para o Arthur e os amigos. Não é um produto
> "sério", então algumas áreas (painel admin, página de civilizações) ainda estão
> em construção.

## Visão geral

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) + React 19, com o
  [React Compiler](https://react.dev/learn/react-compiler) habilitado.
- **Backend / banco / auth:** [Supabase](https://supabase.com)
  (Postgres + Auth + Storage), acessado direto do cliente via
  [`@supabase/ssr`](https://supabase.com/docs/guides/auth/server-side).
- **Upload de avatares:** [Cloudinary](https://cloudinary.com).
- **Proteção anti-bot:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/).
- **UI:** CSS Modules, [MUI](https://mui.com), [FontAwesome](https://fontawesome.com),
  [Chart.js](https://www.chartjs.org) (leaderboard) e [Sonner](https://sonner.emilkowal.ski/)
  (toasts).
- **Idioma:** todo o produto e o código (nomes de variáveis, comentários) estão em
  português.

## Documentação

A documentação detalhada está na pasta [`docs/`](./docs):

| Documento | Conteúdo |
| --- | --- |
| [Arquitetura](./docs/arquitetura.md) | Estrutura de pastas, App Router, route groups, o middleware (`proxy.js`) e o fluxo de autenticação. |
| [Banco de dados](./docs/banco-de-dados.md) | Modelo de dados inferido do código: tabelas, colunas e relacionamentos no Supabase. |
| [Funcionalidades](./docs/funcionalidades.md) | Descrição de cada página/rota e do que ela faz. |
| [Componentes](./docs/componentes.md) | Referência dos componentes, hooks e utilitários em `src/`. |

## Como rodar localmente

Pré-requisitos: **Node.js 22+** e **npm**.

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo de variáveis de ambiente (veja a seção abaixo)
cp .env.example .env.local   # depois preencha os valores

# 3. Subir o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

> Sem as variáveis de ambiente do Supabase o login não funciona e você é
> redirecionado para `/login` automaticamente pelo middleware.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento (`next dev`). |
| `npm run build` | Gera o build de produção (`next build`). |
| `npm run start` | Sobe o build de produção (`next start`). |
| `npm run lint` | Roda o ESLint (`eslint-config-next` + core-web-vitals). |

## Variáveis de ambiente

Todas as variáveis usadas são `NEXT_PUBLIC_*` porque o app fala com o Supabase,
Cloudinary e Turnstile diretamente do navegador. Defina-as em `.env.local`:

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave pública (publishable/anon) do Supabase. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key do Cloudflare Turnstile (captcha). |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nome do cloud do Cloudinary (upload de avatar). |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset (unsigned) do Cloudinary. |

> Como tudo é `NEXT_PUBLIC_*`, essas chaves ficam expostas no bundle do cliente.
> Isso é aceitável apenas para chaves públicas: a segurança real depende das
> políticas de **Row Level Security (RLS)** configuradas no Supabase e do
> upload preset do Cloudinary.

## Deploy

O projeto é pensado para deploy na [Vercel](https://vercel.com). Lembre-se de
cadastrar as variáveis de ambiente acima no painel da Vercel e de liberar os
domínios de imagem remota já configurados em [`next.config.mjs`](./next.config.mjs)
(Supabase Storage e Cloudinary).
