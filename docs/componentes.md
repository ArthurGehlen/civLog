# Componentes, hooks e utilitários

Referência do que existe em `src/components`, `src/hooks` e `src/_lib`.

## Componentes

### GameCard
`src/components/GameCard/GameCard.jsx`

Cartão que resume uma partida. É o componente central da home e da lista de partidas.

- **Props:** `game_obj` (a partida com `game_players` aninhados).
- Mostra nome, status (com bolinha colorida), organização, datas, vencedor(es) e
  jogadores (via `PlayerContainer`).
- Verifica se o usuário atual já entrou na partida (`check_if_user_already_joined`
  consultando `game_players`).
- Renderiza o **botão Entrar** quando: a partida está "Agendado", não está concluída,
  o usuário está em `MAIN_PLAYERS_ID` e ainda não entrou. Entrar insere em
  `game_players`.
- Renderiza o **`CivPicker`** quando o usuário já entrou numa partida agendada.
- Tem o `AdminGameManager` **comentado** (feature futura para admins).
- Link "Ver Detalhes" → `/partidas/[id]`.

### CivPicker
`src/components/CivPicker/CivPicker.jsx`

Seletor de civilização para uma partida.

- **Props:** `game_players`, `game_id`.
- Carrega todas as `civilizations` e remove as já escolhidas na partida.
- Civs com `is_banned` aparecem com 🚫 e ficam desabilitadas.
- Ao confirmar, faz `update` em `game_players.civilization_id` para o perfil atual;
  trata duplicidade (`23505`).

### AdminGameManager
`src/components/AdminGameManager/AdminGameManager.jsx`

Painel (form) para um admin gerenciar uma partida. **Hoje está comentado no
`GameCard`**, mas a lógica está pronta.

- **Props:** `game`, `players`, `onUpdated`.
- Permite mudar **status** (Agendado / Em Andamento / Concluído), **organização** e
  **datas** (início e continuação/conclusão).
- Quando o status é "Concluído", mostra a seção de **vencedores**: seleciona
  jogadores e o **tipo de vitória** (Dominação, Ciência, Cultura, Religião,
  Pontuação).
- Salva via `update` em `games` (incluindo o objeto `winners`).
- Botões Cancelar (restaura valores originais) e Salvar.

### Captcha
`src/components/Captcha/Captcha.jsx`

Wrapper do Cloudflare Turnstile (`@marsidev/react-turnstile`).

- **Props:** `onVerify` (recebe o token).
- Usa `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Usado em login, signup e forgot-password.

### LeaderboardChart
`src/components/LeaderboardChart/LeaderboardChart.jsx`

Gráfico de barras horizontal (Chart.js) com as vitórias por jogador.

- **Props:** `players` (`[{ name, wins }]`).
- Ordena por vitórias e pinta os 3 primeiros com cores de pódio.
- Registra só os módulos necessários do Chart.js (tree-shaking).

### Layout/Header
`src/components/Layout/Header/Header.jsx`

Cabeçalho de navegação do app autenticado.

- Links: Home, Partidas, Leaderboard, Perfis, Civilizações (e **Admin** se
  `profile.is_admin`).
- Destaca o link da rota atual (`usePathname`).
- Mostra avatar + nickname (link para `/configuracoes`).
- **Responsivo:** usa `useIsMobile` para encurtar o nickname e tem um menu
  hambúrguer que abre/fecha em telas pequenas.

### Layout/PlayerContainer
`src/components/Layout/PlayerContainer/PlayerContainer.jsx`

Renderiza uma lista de jogadores (chips), cada um colorido pela cor da sua
civilização (`CIV_COLORS`), com link para o perfil e ícone da civ. Reutilizado em
GameCard e no detalhe da partida.

### Layout/AvatarUpload
`src/components/Layout/AvatarUpload/AvatarUpload.jsx`

Upload de avatar usado em `/configuracoes`.

- **Props:** `userId`, `currentAvatar`.
- Envia o arquivo ao **Cloudinary** (upload unsigned com `upload_preset` e
  `public_id` único), pega a `secure_url` e grava em `profiles.avatar_url`.
- Mostra preview, estado de "enviando" e trata erros com toast.

### Layout/Logo, Divider, Loading
- **Logo** — o texto "CivLog" com "Civ" em dourado.
- **Divider** — uma linha horizontal estilizada (estilo inline).
- **Loading** — spinner com texto "Carregando..." (também usado em `app/loading.jsx`).

---

## Hooks

### useIsMobile
`src/hooks/useIsMobile.js`

Retorna `true` quando a largura da tela é ≤ `breakpoint` (padrão 969px). Usa
`window.matchMedia` e escuta mudanças. Usado no `Header`.

---

## Contexto

### UserContext
`src/_lib/context/UserContext.jsx`

Provê o estado de autenticação para todo o app (`(app)/layout.jsx` envolve tudo no
`UserProvider`).

- Cria um único client Supabase (`useMemo`).
- Carrega `user` (do Supabase Auth) e `profile` (linha em `profiles` com
  `id, nickname, avatar_url, is_admin`).
- Reage a eventos de auth (`SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`) recarregando
  os dados.
- Expõe `{ user, profile, loading, refresh_profile }` via hook `useUser()`.

> `refresh_profile` tem bugs conhecidos (ver
> [funcionalidades.md](./funcionalidades.md#observações--inconsistências-notadas-no-código)).

---

## Utilitários (`src/_lib`)

| Arquivo | O que faz |
| --- | --- |
| `supabase/client.js` | `createBrowserClient` para uso no navegador. |
| `supabase/server.js` | `createServerClient` integrado aos cookies do Next. |
| `constants.js` | `CIV_COLORS` (cor por civilização) e `MAIN_PLAYERS_ID` (allowlist de jogadores que podem entrar em partidas). |
| `date_formatter.js` | `Intl.DateTimeFormat` pt-BR (`dd/mm/aaaa`, timezone UTC). |
| `formatNickname.js` | Corta o nickname pelo **primeiro nome** com um máximo de caracteres. |
| `sliceNickname.js` | Corta o nickname por **nº de caracteres** (máx. 15). |
| `fontawesome.js` | Configura o FontAwesome (`autoAddCss = false`) para evitar CSS duplicado. |

> Cuidado para não confundir `formatNickname` (corta pelo primeiro nome) com
> `sliceNickname` (corta por nº total de caracteres) — os próprios comentários do
> código avisam sobre isso.
