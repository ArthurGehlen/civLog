"use client";
// Utils
import styles from "./page.module.css";
import { date_formatter } from "@/_lib/date_formatter";

// Hooks
import { useState, useEffect } from "react";
import { createClient } from "@/_lib/supabase/client";
import { useParams } from "next/navigation";

// Components
import Divider from "@/components/Layout/Divider/Divider";
import { toast } from "sonner";
import PlayerContainer from "@/components/Layout/PlayerContainer/PlayerContainer";
import Link from "next/link";

const page = () => {
  const [gameData, setGameData] = useState(null);
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    const get_game_details = async () => {
      const { data, error } = await supabase
        .from("games")
        .select(
          `id, name, organization, is_completed, status, scheduled_date, continuation_date, map_types (name), map_sizes (name, max_players), game_speeds (name), game_players (
            is_winner,
            profiles ( nickname, avatar_url ),
            civilizations ( name, icon_url )
          )`,
        )
        .eq("id", params.id)
        .single();

      if (error) toast.error(error.message);

      setGameData(data);
    };
    get_game_details();
  }, []);

  const winners = gameData?.game_players.filter((p) => p.is_winner);

  const format_date = (value) =>
    value ? date_formatter.format(new Date(value)) : null;

  return (
    <>
      <header className={styles.game_info}>
        <h2>{gameData?.name}</h2>
        <div
          className={gameData?.is_completed ? styles.completed : styles.pending}
        >
          <div className={styles.status_dot}></div>
          <span>{gameData?.status}</span>
        </div>
        <span>{gameData?.organization}</span>
      </header>

      <Divider />

      <div className={styles.details}>
        <div className={styles.game_dates}>
          <p>Data de início: {format_date(gameData?.scheduled_date)}</p>
          {gameData?.is_completed ? (
            <p>Data de conclusão: {format_date(gameData?.continuation_date)}</p>
          ) : (
            <p>
              Data de continuação: {format_date(gameData?.continuation_date)}
            </p>
          )}
        </div>

        <div className={styles.player_wrapper}>
          {winners?.length > 1 ? "Vencedores" : "Vencedor"}:
          <PlayerContainer obj={winners} />
        </div>

        {/* containers dos jogadores */}
        <div className={styles.player_wrapper}>
          Jogadores: <PlayerContainer obj={gameData?.game_players} />
        </div>

        <div className={styles.map_detail}>
          Tipo do mapa: <span>{gameData?.map_types.name}</span>
        </div>
        <div className={styles.map_detail}>
          Tamanho do mapa:{" "}
          <p>
            {gameData?.map_sizes.name} |{" "}
            <span className={styles.players_num_recommended}>
              Recomendado para {gameData?.map_sizes.max_players} jogadores
            </span>
          </p>
        </div>
        <div className={styles.map_detail}>
          Velocidade da partida: <span>{gameData?.game_speeds.name}</span>
        </div>
      </div>
    </>
  );
};

export default page;
