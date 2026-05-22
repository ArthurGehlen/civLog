"use client";
// Utils
import styles from "./GameCard.module.css";
import { MAIN_PLAYERS_ID } from "@/_lib/constants";
import { useUser } from "@/_lib/context/UserContext";

// Hooks
import { useEffect, useState } from "react";
import { createClient } from "@/_lib/supabase/client";

// Components
import Link from "next/link";
import Loading from "../layout/Loading/Loading";
import PlayerContainer from "../layout/PlayerContainer/PlayerContainer";
import { toast } from "sonner";
import CivPicker from "../civilizations/CivPicker";

const GameCard = ({ game_obj }) => {
  const { user, profile } = useUser();
  const supabase = createClient();
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const date_formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

  const check_if_user_already_joined = async (game_id) => {
    const { data, error } = await supabase
      .from("game_players")
      .select("game_id")
      .eq("profile_id", profile?.id)
      .eq("game_id", game_id)
      .single();

    if (error && error.code !== "PGRST116") {
      toast.error(error.message);
      return;
    }

    setAlreadyJoined(!!data);
  };

  useEffect(() => {
    if (profile?.id) check_if_user_already_joined(game_obj.id);
  }, [profile]);

  if (!user || !profile) return <Loading />;

  const winners = game_obj.game_players.filter((p) => p.is_winner);

  const join_game_action = async () => {
    const { error } = await supabase.from("game_players").insert({
      game_id: game_obj?.id,
      profile_id: profile?.id,
      picked_at: new Date().toISOString(),
    });

    if (error) {
      if (error.code === "23505") {
        // unique violation
        toast.error("Você já está nesse jogo!");
        return;
      }
      toast.error(error.message);
      return;
    }

    toast.success("Você entrou no jogo!");
    window.location.reload();
  };

  return (
    <div className={styles.game_card}>
      {/* header */}
      <header className={styles.game_info}>
        <h2>{game_obj.name}</h2>
        <div
          className={game_obj.is_completed ? styles.completed : styles.pending}
        >
          <div className={styles.status_dot}></div>
          <span>{game_obj.is_completed ? "Concluído" : "Agendado"}</span>
        </div>
        <span>{game_obj.organization}</span>
      </header>

      {/* datas */}
      <div className={styles.game_dates}>
        <p>
          Data de início:{" "}
          {date_formatter.format(new Date(game_obj.scheduled_date))}
        </p>
        {game_obj.is_completed ? (
          <p>
            Data de conclusão:{" "}
            {date_formatter.format(new Date(game_obj.continuation_date))}
          </p>
        ) : (
          <p>
            Data de continuação:{" "}
            {date_formatter.format(new Date(game_obj.continuation_date))}
          </p>
        )}
      </div>

      <div className={styles.game_card_content}>
        {/* vencedores */}
        <div className={styles.player_wrapper}>
          {winners.length > 1 ? "Vencedores" : "Vencedor"}:
          <PlayerContainer obj={winners} />
        </div>

        {/* containers dos jogadores */}
        <div className={styles.player_wrapper}>
          Jogadores: <PlayerContainer obj={game_obj?.game_players} />
        </div>

        {!game_obj?.is_completed && alreadyJoined && (
          <div className={styles.civ_picker_container}>
            <CivPicker
              game_players={game_obj.game_players}
              game_id={game_obj.id}
            />
          </div>
        )}

        {/* container para mais opções */}
        <div className={styles.game_options}>
          {/* link para mais detalhes */}
          <Link
            className={styles.link_to_details}
            href={`/partidas/${game_obj?.id}`}
          >
            Ver Detalhes
          </Link>
          {/* botão pra ingressar no jogo */}
          {!game_obj?.is_completed &&
            MAIN_PLAYERS_ID.includes(user?.id) &&
            !alreadyJoined && (
              <div className={styles.join_game_container}>
                <button
                  type="submit"
                  onClick={join_game_action}
                  className={styles.join_game_btn}
                >
                  Entrar
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
