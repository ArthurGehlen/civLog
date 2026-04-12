// Utils
import styles from "./GameCard.module.css";

// Components
import Link from "next/link";

const GameCard = ({ game_obj }) => {
  const date_formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return (
    <div className={styles.game_card}>
      <header className={styles.game_info}>
        <h3>Jogo 1</h3>
        <span>{game_obj.is_completed ? "Concluída" : "Agendada"}</span>
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
      <div className="game_card_content">
        <p>Vencedor(res):</p>
        <p>Jogadores:</p>
        <p>{game_obj.organization}</p>
        <Link href={`/partidas/${game_obj.id}`}>Ver Detalhes</Link>
      </div>
    </div>
  );
};

export default GameCard;
