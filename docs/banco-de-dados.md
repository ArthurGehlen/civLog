# Banco de dados (Supabase)

O esquema do banco vive no **Supabase** e não está versionado neste repositório
(não há migrations). O modelo abaixo foi **inferido a partir das queries no código**
— nomes de tabelas, colunas e relacionamentos usados nos `.from(...).select(...)`.
Trate-o como referência prática, não como a definição oficial do schema.

## Diagrama de relacionamentos

```
                    ┌─────────────┐
                    │  profiles   │
                    │  (jogador)  │
                    └──────┬──────┘
                           │ 1
                           │
                           │ N
                    ┌──────┴────────┐         ┌────────────────┐
        ┌──────────►│ game_players  │◄────────┤ civilizations  │
        │           │ (participação)│  N    1 │                │
        │           └──────┬────────┘         └────────────────┘
        │ N                │ N
        │                  │ 1
   ┌────┴─────┐     ┌──────┴──────┐
   │  games   │◄────┘             │
   │ (partida)│                   │
   └────┬─────┘                   │
        │ N        ┌──────────────┴──┐
        ├─────────►│ map_types       │ (1)
        ├─────────►│ map_sizes       │ (1)
        └─────────►│ game_speeds     │ (1)
```

Resumindo:

- Um **jogador** (`profiles`) participa de várias partidas via `game_players`.
- Uma **partida** (`games`) tem vários participantes via `game_players` e referencia
  um tipo de mapa, um tamanho de mapa e uma velocidade de jogo.
- Cada **participação** (`game_players`) liga um jogador a uma partida e (opcional)
  a uma civilização escolhida.

## Tabelas

### `profiles`

Perfil do jogador, vinculado ao usuário do Supabase Auth.

| Coluna | Tipo (inferido) | Notas |
| --- | --- | --- |
| `id` | uuid (PK) | Chave primária do perfil. Referenciada por `game_players.profile_id`. |
| `auth_user_id` | uuid | FK para `auth.users.id`. Usada para casar a sessão com o perfil. |
| `nickname` | text | Nome de usuário. **Único** (tentar repetir gera erro `23505`). Usado como slug em `/perfis/[nickname]`. |
| `avatar_url` | text \| null | URL do avatar (Cloudinary ou Supabase Storage). |
| `steam_url` | text \| null | Link do perfil Steam (opcional). |
| `is_admin` | boolean | Define acesso ao painel admin e ao link "Admin" no header. |

Criação: no `signUp` o `username` é passado em `options.data.username`. A linha em
`profiles` é criada a partir daí (provavelmente por um trigger no Supabase que lê o
metadado do usuário).

### `games`

Uma partida de Civilization VI.

| Coluna | Tipo (inferido) | Notas |
| --- | --- | --- |
| `id` | uuid (PK) | Identificador da partida. |
| `name` | text | Nome da partida. |
| `status` | text | `"Agendado"`, `"Em Andamento"` ou `"Concluído"`. |
| `is_completed` | boolean | `true` quando a partida terminou. |
| `organization` | text \| null | Texto livre (quem organizou / contexto). |
| `scheduled_date` | date \| null | Data de início. |
| `continuation_date` | date \| null | Data de continuação (ou de conclusão, quando `is_completed`). |
| `winners` | jsonb | Mapa `{ playerId: tipoDeVitória }` gravado pelo `AdminGameManager`. |
| `created_at` | timestamp | Usado para ordenar (`order("created_at", desc)`). |
| `created_by` | uuid (FK → profiles) | Quem criou a partida (no detalhe vem `created_by (nickname, avatar_url)`). |
| `map_type` | FK → `map_types` | Relacionamento `map_types (name)`. |
| `map_size` | FK → `map_sizes` | Relacionamento `map_sizes (name, max_players)`. |
| `game_speed` | FK → `game_speeds` | Relacionamento `game_speeds (name)`. |

> O campo `winners` (jsonb) coexiste com a flag `is_winner` em `game_players`. O
> `AdminGameManager` grava `winners` em `games`, mas as telas de leitura
> (home, perfil, leaderboard) usam `game_players.is_winner`. Provavelmente há um
> trigger/processo que sincroniza um com o outro — algo a confirmar no painel do
> Supabase.

### `game_players`

Tabela de junção: a participação de um jogador em uma partida.

| Coluna | Tipo (inferido) | Notas |
| --- | --- | --- |
| `game_id` | uuid (FK → games) | Partida. |
| `profile_id` | uuid (FK → profiles) | Jogador. |
| `civilization_id` | uuid (FK → civilizations) \| null | Civilização escolhida. Nula até o jogador escolher. |
| `is_winner` | boolean | Se esse jogador venceu a partida. |
| `picked_at` | timestamp | Quando o jogador entrou na partida. |

Restrições inferidas pelo tratamento de erro `23505` (unique violation) no código:

- `(game_id, profile_id)` é único → um jogador não entra duas vezes na mesma partida
  ("Você já está nesse jogo!").
- `(game_id, civilization_id)` é único → duas pessoas não pegam a mesma civ na mesma
  partida ("Essa civilização já foi escolhida por outro jogador!").

### `civilizations`

Catálogo das civilizações do jogo.

| Coluna | Tipo (inferido) | Notas |
| --- | --- | --- |
| `id` | uuid (PK) | Identificador. |
| `name` | text | Nome (ex.: "Brasil", "Roma"). Bate com as chaves de `CIV_COLORS`. |
| `icon_url` | text | Ícone (Supabase Storage, bucket `civ-icons`). |
| `is_banned` | boolean | Se `true`, aparece com 🚫 e fica desabilitada no `CivPicker`. |

### `map_types`, `map_sizes`, `game_speeds`

Tabelas de configuração da partida (lookup).

| Tabela | Colunas usadas | Notas |
| --- | --- | --- |
| `map_types` | `name` | Tipo do mapa (ex.: Continentes, Pangeia). |
| `map_sizes` | `name`, `max_players` | Tamanho do mapa e nº recomendado de jogadores. |
| `game_speeds` | `name` | Velocidade da partida (ex.: Padrão, Rápida). |

## Storage (buckets)

Pelos domínios liberados em `next.config.mjs`:

- **`civ-icons`** — ícones das civilizações.
- **`users-avatar`** — avatares de usuário hospedados no Supabase.
- Avatares também podem vir do **Cloudinary** (fluxo atual de upload no
  `AvatarUpload`).

## Consultas principais (onde cada tabela é usada)

| Tela | Query (resumo) |
| --- | --- |
| Home | `games` + `game_players (is_winner, profiles, civilizations)`, ordenado por `created_at`, `limit(3)`. |
| Partidas | mesma query da home, com `.eq("status", "Concluído")` e sem limite. |
| Detalhe da partida | `games` + `map_types`, `map_sizes`, `game_speeds`, `game_players(...)`, `created_by(...)` por `id`. |
| Leaderboard | `profiles` + `game_players (is_winner, games(...), civilizations(...))`, conta vitórias. |
| Perfis (lista) | `profiles (id, avatar_url, nickname)`. |
| Perfil | `profiles` + `game_players(...)` por `nickname`, calcula civ favorita, vitórias, derrotas e %. |
| CivPicker | `civilizations (id, name, icon_url, is_banned)`; update em `game_players.civilization_id`. |
| Configurações | update em `profiles` (`nickname`, `steam_url`, `avatar_url`). |

## Constantes ligadas ao banco

Em `src/_lib/constants.js`:

- **`CIV_COLORS`** — mapa `nome da civ → cor` usado para colorir os cartões de
  jogador. As chaves precisam **bater exatamente** com `civilizations.name`.
- **`MAIN_PLAYERS_ID`** — lista fixa de `auth.users.id` dos jogadores "principais".
  Só esses usuários veem o botão **Entrar** numa partida agendada (e, portanto,
  podem escolher civ). É um allowlist hard-coded no front.
