// Utils
import styles from "./GameCard.module.css";

// Components
import Link from "next/link";
import Image from "next/image";

const GameCard = ({ game_obj }) => {
  const date_formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const winners = game_obj.game_players.filter((p) => p.is_winner);

  return (
    <div className={styles.game_card}>
      <header className={styles.game_info}>
        <h2>{game_obj.name}</h2>
        <span
          className={`${game_obj.is_completed} ? ${styles.completed} : ${styles.pending}`}
        >
          {game_obj.is_completed ? "Concluída" : "Agendada"}
        </span>
      </header>
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
        <p>
          {winners.length > 1 ? "Vencedores" : "Vencedor"}:{" "}
          {winners.map((p, i) => (
            <span key={i}>
              {p.profiles.nickname} — {p.civilizations?.name}
            </span>
          ))}
        </p>
        <p>
          Jogadores:{" "}
          {game_obj.game_players.map((p, i) => (
            <span key={i}>
              {p.profiles.nickname} ({p.civilizations?.name ?? "Sem civ"})
            </span>
          ))}
        </p>
        <p>{game_obj.organization}</p>
        <Link href={`/partidas/${game_obj.id}`}>Ver Detalhes</Link>
      </div>
    </div>
  );
};

export default GameCard;
