# Funcionalidades (por rota)

Visão de cada página do CivLog: o que ela mostra, o que o usuário pode fazer e quais
dados/queries estão por trás.

## Mapa de rotas

| URL | Arquivo | Acesso |
| --- | --- | --- |
| `/` | `app/page.jsx` | Público (landing) |
| `/login` | `app/(auth)/login/page.jsx` | Só deslogado |
| `/signup` | `app/(auth)/signup/page.jsx` | Só deslogado |
| `/forgot-password` | `app/(auth)/forgot-password/page.jsx` | Só deslogado |
| `/update-password` | `app/(auth)/update-password/page.jsx` | Fluxo de recuperação |
| `/auth/callback` | `app/auth/callback/route.js` | Route handler (redirect) |
| `/home` | `app/(app)/home/page.jsx` | Autenticado |
| `/partidas` | `app/(app)/partidas/page.jsx` | Autenticado |
| `/partidas/[id]` | `app/(app)/partidas/[id]/page.jsx` | Autenticado |
| `/leaderboard` | `app/(app)/leaderboard/page.jsx` | Autenticado |
| `/perfis` | `app/(app)/perfis/page.jsx` | Autenticado |
| `/perfis/[nickname]` | `app/(app)/perfis/[nickname]/page.jsx` | Autenticado |
| `/configuracoes` | `app/(app)/configuracoes/page.jsx` | Autenticado |
| `/admin` (+ subrotas) | `app/(app)/admin/...` | Só admin (em construção) |
| `/civilizacoes` | `app/(in_development)/civilizacoes/page.jsx` | Em construção |

O controle de acesso (logado / admin) é feito pelo middleware `src/proxy.js` — ver
[arquitetura.md](./arquitetura.md#middleware-srcproxyjs).

---

## Landing (`/`)

Tela de boas-vindas com imagem de fundo, o logo `CivLog` e um botão **Entrar** que
leva a `/login`. Se o usuário já estiver logado e tentar acessar telas de auth, o
middleware o joga para `/home`.

## Autenticação

### Login (`/login`)
- Email + senha, com toggle de mostrar/esconder senha.
- **Captcha Turnstile obrigatório** — sem token o submit é bloqueado.
- `signInWithPassword({ email, password, options:{ captchaToken } })`.
- Trata "Email not confirmed" ("Confirme seu email antes de entrar.") e credenciais
  inválidas ("Email ou senha incorretos.").
- Sucesso → `router.push("/home")`.

### Cadastro (`/signup`)
- Campos: nome de usuário, email, senha e confirmação.
- Validação no cliente: usuário 3–30 caracteres, senha ≥ 8, senhas iguais.
- Captcha Turnstile obrigatório.
- `signUp({ email, password, options:{ data:{ username }, captchaToken } })`.
- O `username` vai no metadado do usuário e vira o `nickname` do perfil.
- Sucesso → toast pedindo para confirmar o email.

### Esqueci a senha (`/forgot-password`)
- Campo de email + captcha.
- `resetPasswordForEmail(email, { captchaToken, redirectTo: "<origin>/auth/callback?type=recovery" })`.

### Callback (`/auth/callback`)
- Route handler (server). Lê `type` e `code` da URL.
- Se `type === "recovery"` e há `code`, redireciona para
  `/update-password?code=...`; senão volta para `/forgot-password`.

### Nova senha (`/update-password`)
- Lê `code` da query. Sem code → volta para `/forgot-password`.
- Troca o code pela sessão: `verifyOtp({ token_hash: code, type: "recovery" })`.
- Code inválido/expirado → toast e volta para `/forgot-password`.
- Com a sessão válida, `updateUser({ password })` e redireciona para `/home`.

---

## App autenticado

Todas estas páginas ficam dentro do layout `(app)`, que renderiza o `Header` e
envolve tudo no `UserProvider`.

### Home (`/home`)
- Mostra as **últimas 3 partidas** (`order created_at desc`, `limit 3`).
- Cada partida é um `GameCard` com animação de entrada escalonada.
- Mostra um `Loading` enquanto o contexto do usuário carrega.

### Partidas (`/partidas`)
- Lista **todas as partidas concluídas** (`.eq("status", "Concluído")`).
- Mesma estrutura de cartões da home, sem limite de quantidade.

### Detalhe da partida (`/partidas/[id]`)
- Carrega uma partida por `id` com todas as configurações:
  nome, status, organização, datas, **vencedor(es)**, lista de jogadores
  (com civ de cada um), tipo/tamanho/velocidade do mapa e quem criou a partida.
- Botão **Voltar** (`router.back()`).
- O `created_by` vira link para o perfil do criador.

### Leaderboard (`/leaderboard`)
- Carrega todos os `profiles` com suas participações e conta `is_winner` → total de
  vitórias por jogador.
- **Sistema de ranking com empate:** o rank de um jogador é
  `(quantos têm mais vitórias que ele) + 1`, então jogadores empatados dividem a
  mesma posição.
- A linha do **usuário atual** é destacada.
- Abaixo da tabela, um **gráfico de barras horizontal** (`LeaderboardChart`) com
  cores de pódio (ouro/prata/bronze) para os 3 primeiros.

### Perfis (`/perfis`)
- Grade com todos os jogadores (avatar + nickname) e link **Ver Perfil**.

### Perfil do jogador (`/perfis/[nickname]`)
- Busca o perfil por `nickname` (decodificado e normalizado para `NFC`, já que
  nicknames podem ter acentos).
- Mostra avatar, nickname e (se houver) link da **Steam**.
- **Civilizações jogadas:** civs únicas que o jogador já usou, cada uma colorida com
  `CIV_COLORS`.
- **Estatísticas:**
  - *Civilização favorita* — a civ mais jogada (contagem por nome).
  - *Total de partidas jogadas* — só partidas concluídas (`is_completed`).
  - *Total de vitórias* — `is_winner === true`.
  - *Total de derrotas* — partidas concluídas em que não venceu.
  - *% de vitórias* — vitórias / total de partidas concluídas.
- **Partidas jogadas:** lista com "Venceu"/"Perdeu" por partida.

### Configurações (`/configuracoes`)
- Mostra o nickname atual e botão de **Logout** (`signOut` + reload).
- **Upload de avatar** via `AvatarUpload` (Cloudinary → grava URL em `profiles`).
- **Trocar nome de usuário** (3–30 caracteres). Erro de nickname duplicado (`23505`)
  vira "Este nome de usuário já está em uso.".
- **URL da Steam** — validada para conter `https://steamcommunity.com/profiles/`.
- Ao salvar, faz `update` em `profiles` e chama `refresh_profile()`.

### Admin (`/admin`, `/admin/partidas`, `/admin/usuarios`, `/admin/civilizacoes`)
- Acesso restrito a `is_admin` (garantido pelo middleware).
- O layout tem uma navegação por abas (Admin / Partidas / Usuários / Civilizações).
- **Status atual: em construção.** As páginas são placeholders. A lógica real de
  gerenciar partida já existe no componente `AdminGameManager` (status, datas,
  organização e marcação de vencedores com tipo de vitória), mas ele está
  **comentado** dentro do `GameCard` aguardando a "atualização futura".

### Civilizações (`/civilizacoes`)
- Está no grupo `(in_development)`: renderiza apenas a tela de "página em
  desenvolvimento".
- O link já aparece no `Header`.

---

## Fluxo principal: entrar numa partida e escolher civ

Acontece dentro do `GameCard` (ver [componentes.md](./componentes.md#gamecard)):

1. A partida está **Agendada** e não concluída.
2. O usuário é um dos **`MAIN_PLAYERS_ID`** → vê o botão **Entrar**.
3. Ao entrar, cria uma linha em `game_players` (`picked_at = agora`).
4. Depois de entrar, aparece o **`CivPicker`**: um select com as civilizações ainda
   não escolhidas na partida (as banidas aparecem com 🚫 e desabilitadas).
5. Escolher a civ faz `update` em `game_players.civilization_id`. Se outra pessoa já
   pegou aquela civ, o erro `23505` vira "Essa civilização já foi escolhida por
   outro jogador!".

---

## Observações / inconsistências notadas no código

- **Status "Em andamento" vs "Em Andamento":** o `GameCard.format_status` compara com
  `"Em andamento"` (m minúsculo), mas o `AdminGameManager` grava `"Em Andamento"`
  (M maiúsculo). Como a comparação é exata, uma partida em andamento pode não receber
  a classe de cor correta no cartão.
- **`refresh_profile` no `UserContext`** tem dois problemas: um caractere solto
  (`setProfile(data);w`) e um `.select("nickname","avatar_url","is_admin")` que passa
  argumentos separados em vez de uma string única — então o refresh do perfil sem
  reload provavelmente não funciona como esperado.
- **`console.log` esquecidos:** há um `console.log(data)` no detalhe da partida e
  comentários de lembrete ("NÃO DEIXAR CONSOLE.LOG NO CÓDIGO") espalhados.
- **Toaster sem import:** `partidas/page.jsx` chama `toast.error(...)` no `catch` mas
  não importa `toast` (só quebraria se a query falhasse).

Esses pontos são só observações da documentação — nenhum deles foi alterado.
