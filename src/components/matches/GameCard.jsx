// Utils
import styles from "./GameCard.module.css";

// Components
import Link from "next/link";
import PlayerContainer from "../layout/PlayerContainer/PlayerContainer";

const GameCard = ({ game_obj }) => {
  const date_formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const winners = game_obj.game_players.filter((p) => p.is_winner);

  return (
    <div className={styles.game_card}>
      {/* header */}
      <header className={styles.game_info}>
        <h2>{game_obj.name}</h2>
        <span
          className={game_obj.is_completed ? styles.completed : styles.pending}
        >
          {game_obj.is_completed ? "Concluído" : "Agendada"}
        </span>
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
          Jogadores: <PlayerContainer obj={game_obj.game_players} />
        </div>

        {/* link para mais detalhes */}
        <Link
          className={styles.link_to_details}
          href={`/partidas/${game_obj.id}`}
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
