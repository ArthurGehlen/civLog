# Arquitetura

CivLog é um app **Next.js 16** usando o **App Router**. Quase toda a lógica vive no
cliente (`"use client"`): as páginas buscam dados diretamente do Supabase pelo
navegador. O Next aparece principalmente para roteamento, otimização de imagens e o
middleware de autenticação.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19, React Compiler ligado (`reactCompiler: true` em `next.config.mjs`) |
| Auth / Banco / Storage | Supabase (Postgres, Auth, Storage) via `@supabase/ssr` |
| Upload de imagem | Cloudinary (upload unsigned via REST) |
| Captcha | Cloudflare Turnstile (`@marsidev/react-turnstile`) |
| Estilo | CSS Modules (`*.module.css`) + MUI/Emotion |
| Gráficos | Chart.js + react-chartjs-2 |
| Notificações | Sonner (toasts) |
| Ícones | FontAwesome |
| Fonte | Poppins (`next/font/google`) |

## Estrutura de pastas

```
src/
├── app/                      # App Router (rotas)
│   ├── layout.jsx            # Layout raiz: fonte, fontawesome, <Toaster>
│   ├── page.jsx              # Landing page ("/")
│   ├── loading.jsx           # Loading global
│   ├── globals.css
│   │
│   ├── (auth)/               # Route group: telas de autenticação
│   │   ├── layout.jsx        # Fundo com slideshow de imagens
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── update-password/
│   │
│   ├── auth/callback/route.js # Route handler do fluxo de recuperação de senha
│   │
│   ├── (app)/                # Route group: app autenticado
│   │   ├── layout.jsx        # <UserProvider> + <Header>
│   │   ├── home/             # Últimas 3 partidas
│   │   ├── partidas/         # Lista de partidas concluídas
│   │   │   └── [id]/         # Detalhe de uma partida
│   │   ├── leaderboard/      # Ranking de vitórias + gráfico
│   │   ├── perfis/           # Lista de jogadores
│   │   │   └── [nickname]/   # Perfil + estatísticas
│   │   ├── configuracoes/    # Editar perfil, avatar, logout
│   │   └── admin/            # Painel admin (em construção)
│   │       ├── layout.jsx
│   │       ├── page.jsx
│   │       ├── partidas/
│   │       ├── usuarios/
│   │       └── civilizacoes/
│   │
│   └── (in_development)/     # Route group: páginas "em construção"
│       ├── layout.jsx        # Mostra ilustração "under construction"
│       └── civilizacoes/
│
├── components/               # Componentes React (ver componentes.md)
├── hooks/                    # Hooks customizados (useIsMobile)
├── _lib/                     # Utilitários, contexto, clients do Supabase
│   ├── supabase/
│   │   ├── client.js         # createBrowserClient (cliente)
│   │   └── server.js         # createServerClient (server components)
│   ├── context/UserContext.jsx
│   ├── constants.js          # Cores das civs + IDs dos jogadores principais
│   ├── date_formatter.js
│   ├── formatNickname.js
│   ├── sliceNickname.js
│   └── fontawesome.js
│
├── assets/                   # Imagens (.avif, .svg)
└── proxy.js                  # Middleware do Next (auth + proteção de rotas)
```

> O alias `@/*` aponta para `src/*` (ver `jsconfig.json`), então imports usam
> `@/components/...`, `@/_lib/...`, etc.

## Route groups

O App Router usa **route groups** (pastas entre parênteses) para aplicar layouts
diferentes sem afetar a URL:

- **`(auth)`** — telas de login/cadastro/recuperação. Layout com slideshow de fundo
  e um cartão centralizado.
- **`(app)`** — o app em si. O layout envolve tudo em `UserProvider` e renderiza o
  `Header`. É aqui que ficam home, partidas, leaderboard, perfis, configurações e
  admin.
- **`(in_development)`** — placeholder para páginas ainda não prontas (ex.:
  `/civilizacoes`), mostrando uma ilustração de "em construção".

Como os parênteses são ignorados na URL, `(app)/home/page.jsx` responde em `/home` e
`(in_development)/civilizacoes/page.jsx` responde em `/civilizacoes`.

## Clientes Supabase

Há dois jeitos de criar o client, ambos lendo `NEXT_PUBLIC_SUPABASE_URL` e
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`:

- **`_lib/supabase/client.js`** → `createBrowserClient`. Usado em componentes
  `"use client"` (a grande maioria das páginas).
- **`_lib/supabase/server.js`** → `createServerClient`, integrado aos cookies do
  Next (`next/headers`). Disponível para server components, embora hoje o app use
  quase sempre o client do navegador.

## Middleware: `src/proxy.js`

No Next.js 16 o arquivo de middleware passou a se chamar `proxy.js` (antes
`middleware.js`). Ele roda antes das rotas listadas em `config.matcher` e cuida de
toda a proteção de rotas:

1. **Cria um client Supabase por request** ligando os cookies de entrada/saída,
   para conseguir ler a sessão do usuário.
2. **Caso especial de recuperação de senha:** se a URL é `/update-password` e tem
   `?code=...`, deixa passar direto.
3. **Usuário logado em tela de auth** (`/login`, `/signup`, `/forgot-password`) →
   redireciona para `/home`.
4. **Usuário deslogado em `/update-password`** → manda para `/forgot-password`.
5. **Usuário deslogado** tentando qualquer rota protegida → redireciona para
   `/login`.
6. **Proteção do admin:** se a rota começa com `/admin`, consulta
   `profiles.is_admin`; se não for admin, redireciona para `/home`.

O `config.matcher` lista exatamente quais caminhos passam pelo middleware
(`/login`, `/signup`, `/home`, `/leaderboard`, `/configuracoes`, `/partidas/*`,
`/perfis/*`, `/admin/*`, etc.).

## Fluxo de autenticação

```
Cadastro (/signup)
  └─ supabase.auth.signUp({ email, password, options:{ data:{ username }, captchaToken } })
       └─ Supabase envia email de confirmação
            └─ usuário confirma → faz login

Login (/login)
  └─ supabase.auth.signInWithPassword({ email, password, options:{ captchaToken } })
       └─ sessão criada → redireciona para /home

Recuperação de senha
  /forgot-password  → resetPasswordForEmail(email, { redirectTo: /auth/callback?type=recovery })
  /auth/callback    → route handler redireciona para /update-password?code=...
  /update-password  → verifyOtp({ token_hash: code, type: "recovery" }) → updateUser({ password })
```

O estado do usuário logado é mantido pelo [`UserContext`](./componentes.md#usercontext),
que carrega o `user` (auth) e o `profile` (linha em `profiles`) e reage a eventos
`SIGNED_IN` / `SIGNED_OUT` / `TOKEN_REFRESHED`.

## Imagens remotas

`next.config.mjs` libera estes domínios para o `next/image`:

- `*.supabase.co/storage/v1/object/public/civ-icons/**` — ícones das civilizações.
- `*.supabase.co/storage/v1/object/public/users-avatar/**` — avatares (bucket do Supabase).
- `res.cloudinary.com/<cloud>/image/upload/**` — avatares enviados via Cloudinary.

## Observações / pontos em aberto

- O painel **admin** (`/admin`, `/admin/partidas`, `/admin/usuarios`,
  `/admin/civilizacoes`) ainda é placeholder. A lógica real de gerenciar uma partida
  já existe no componente `AdminGameManager`, mas ele está **comentado** dentro do
  `GameCard` ("atualização futura").
- A página `/civilizacoes` está no grupo `(in_development)` e só mostra a tela de
  "em construção".
- O status da partida é escrito de formas levemente diferentes em lugares diferentes
  (`"Em Andamento"` no `AdminGameManager` vs. `"Em andamento"` no `GameCard`), o que
  pode quebrar a cor do status — ver [funcionalidades.md](./funcionalidades.md).
