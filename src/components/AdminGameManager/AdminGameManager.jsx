"use client";

// Utils
import styles from "./AdminGameManager.module.css";

// Hooks
import { createClient } from "@/_lib/supabase/client";
import { useMemo, useState } from "react";

// Components
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { key: "Agendado", style: "agendado" },
  { key: "Em Andamento", style: "andamento" },
  { key: "Concluído", style: "concluido" },
];

const VICTORY_TYPES = [
  "Dominação",
  "Ciência",
  "Cultura",
  "Religião",
  "Pontuação",
];

const AdminGameManager = ({ game, players = [], onUpdated }) => {
  const supabase = createClient();

  const [status, setStatus] = useState(game.status ?? "Agendado");
  const [organization, setOrganization] = useState(game.organization ?? "");
  const [scheduledDate, setScheduledDate] = useState(game.scheduled_date ?? "");
  const [continuationDate, setContinuationDate] = useState(
    game.continuation_date ?? "",
  );
  const [winners, setWinners] = useState(game.winners ?? {});
  const [loading, setLoading] = useState(false);

  const is_completed = status === "Concluído";

  const winnersCount = Object.keys(winners).length;

  const winnersText = useMemo(() => {
    const entries = Object.entries(winners);

    if (!entries.length) return "";

    const names = entries.map(([playerId, victoryType]) => {
      const player = players.find((p) => String(p.id) === String(playerId));

      return `${player?.name ?? "Jogador"} (${victoryType})`;
    });

    return entries.length === 1
      ? `Vencedor: ${names.join(", ")}`
      : `Vencedores: ${names.join(", ")}`;
  }, [winners, players]);

  const toggleWinner = (playerId) => {
    setWinners((prev) => {
      const next = { ...prev };

      if (next[playerId]) {
        delete next[playerId];
      } else {
        next[playerId] = "Dominação";
      }

      return next;
    });
  };

  const setVictoryType = (playerId, victoryType) => {
    setWinners((prev) => ({
      ...prev,
      [playerId]: victoryType,
    }));
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const updates = {
      status,
      is_completed,
      organization: organization.trim() || null,
      scheduled_date: scheduledDate || null,
      continuation_date: continuationDate || null,
      winners: is_completed ? winners : {},
    };

    const { error } = await supabase
      .from("games")
      .update(updates)
      .eq("id", game.id);

    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Erro ao atualizar partida.");
      return;
    }

    toast.success(
      winnersCount > 0
        ? `Partida atualizada! ${winnersCount} vencedor${winnersCount > 1 ? "es" : ""} registrado${winnersCount > 1 ? "s" : ""}.`
        : "Partida atualizada com sucesso!",
    );

    onUpdated?.();
  };

  const handle_cancel = () => {
    setStatus(game.status ?? "Agendado");

    setOrganization(game.organization ?? "");

    setScheduledDate(game.scheduled_date ?? "");

    setContinuationDate(game.continuation_date ?? "");

    setWinners(game.winners ?? {});
  };

  return (
    <form onSubmit={handle_submit} className={styles.panel}>
      <header className={styles.panel_header}>
        <div className={styles.panel_title}>Gerenciar Partida</div>

        <div className={styles.header_right}>
          <span className={styles.game_name}>{game.name}</span>

          <span
            className={`${styles.status_pill} ${
              styles[status.toLowerCase().replaceAll(" ", "_")]
            }`}
          >
            <span className={styles.dot} />
            {status}
          </span>
        </div>
      </header>

      {/* STATUS */}
      <p className={styles.section_label}>Status da partida</p>

      <div className={styles.status_grid}>
        {STATUS_OPTIONS.map(({ key, style }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setStatus(key);

              if (key !== "Concluído") {
                setWinners({});
              }
            }}
            className={`${styles.status_btn} ${
              status === key ? styles[`active_${style}`] : ""
            }`}
          >
            <span className={styles.sbdot} />
            {key}
          </button>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* ORGANIZAÇÃO */}
      <p className={styles.section_label}>Organização</p>

      <div className={styles.input_wrapper}>
        <input
          type="text"
          className={styles.input_field}
          placeholder=""
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </div>

      <hr className={styles.divider} />

      {/* DATAS */}
      <div className={styles.dates_grid}>
        <div className={styles.input_wrapper}>
          <label htmlFor="scheduled-date" className={styles.input_label}>
            Data de início
          </label>

          <input
            id="scheduled-date"
            type="date"
            className={styles.input_field}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="continuation-date" className={styles.input_label}>
            Data de {is_completed ? "conclusão" : "continuação"}
          </label>

          <input
            id="continuation-date"
            type="date"
            className={styles.input_field}
            value={continuationDate}
            onChange={(e) => setContinuationDate(e.target.value)}
          />
        </div>
      </div>

      {/* WINNERS */}
      {is_completed && (
        <>
          <hr className={styles.divider} />

          <section className={styles.winners_section}>
            <p className={styles.section_label}>Vencedores</p>

            <p className={styles.winners_hint}>
              Selecione os jogadores vencedores e o tipo de vitória.
            </p>

            <div className={styles.player_list}>
              {players.map((player) => {
                const isWinner = winners[player.id] !== undefined;

                return (
                  <div
                    key={player.id}
                    onClick={() => toggleWinner(player.id)}
                    className={`${styles.player_row} ${
                      isWinner ? styles.winner : ""
                    }`}
                  >
                    <div className={styles.avatar}>
                      {player.avatar_url ? (
                        <img src={player.avatar_url} alt={player.name} />
                      ) : (
                        player.name?.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className={styles.player_info}>
                      <div className={styles.player_name}>{player.name}</div>

                      <div className={styles.player_civ}>
                        {player.civilization ?? "Sem civilização"}
                      </div>
                    </div>

                    <select
                      value={winners[player.id] ?? "Dominação"}
                      className={styles.victory_select}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setVictoryType(player.id, e.target.value)
                      }
                    >
                      {VICTORY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            {winnersCount > 0 && (
              <div className={styles.winners_summary}>
                <span>{winnersText}</span>
              </div>
            )}
          </section>
        </>
      )}

      <div className={styles.footer_btns}>
        <button
          type="button"
          className={styles.cancel_btn}
          onClick={handle_cancel}
          disabled={loading}
        >
          Cancelar
        </button>

        <button type="submit" className={styles.save_btn} disabled={loading}>
          {loading ? <>Salvando...</> : <>Salvar alterações</>}
        </button>
      </div>
    </form>
  );
};

export default AdminGameManager;
