"use client";
// Utils
import styles from "./page.module.css";
import { createClient } from "@/_lib/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CIV_COLORS } from "@/_lib/constants";

// Components
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

// Icons
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faSteam } from "@fortawesome/free-brands-svg-icons";

// Hooks
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const [userData, setUserData] = useState([]);
  const [playedCivilizations, setPlayedCivilizations] = useState([]);
  const [playedGames, setPlayedGames] = useState([]);
  const [gamesCount, setGamesCount] = useState({
    Total: 0,
    Venceu: 0,
    Perdeu: 0,
    Porcentagem: 0,
  });
  const games_count_label = {
    Total: "Total de Partidas Jogadas",
    Venceu: "Total de Vitórias",
    Perdeu: "Total de Derrotas",
    Porcentagem: "% de Vitórias",
  };
  const [favoriteCiv, setFavoriteCiv] = useState(null);
  const supabase = createClient();
  const params = useParams();
  const nickname = decodeURIComponent(params.nickname).normalize("NFC");
  const router = useRouter();

  useEffect(() => {
    const get_user_data = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `id, nickname, avatar_url, steam_url, 
          game_players
           (is_winner, games (name), civilizations (name, icon_url))`,
        )
        .eq("nickname", nickname)
        .maybeSingle();
      setUserData(data);

      if (data?.game_players) {
        const civs = data.game_players
          .map((civ_obj) => civ_obj.civilizations)
          .filter(Boolean);

        const played_games = data.game_players.map((civ_obj) => ({
          ...civ_obj.games,
          is_winner: civ_obj.is_winner,
        }));

        // conta quantos jogos o usuário jogou com aquela civilização
        const civ_count = civs.reduce((acc, civ) => {
          acc[civ.name] = (acc[civ.name] || 0) + 1; // sim isso é uma obra de arte :)
          return acc;
        }, {});

        // retorna a civilização que o usuário mais jogou
        const favorite_civ = civs.reduce((most, civ) =>
          civ_count[civ.name] > civ_count[most.name] ? civ : most,
        );

        const total_winner = data.game_players.filter(
          (g) => g.is_winner,
        ).length;
        const total_loser = data.game_players.filter(
          (g) => !g.is_winner,
        ).length;
        const percentage_of_winning = `${(data.game_players.length / total_winner) * 100}%`;

        setGamesCount({
          Total: data.game_players.length,
          Venceu: total_winner,
          Perdeu: total_loser,
          Porcentagem: percentage_of_winning,
        });
        setPlayedCivilizations(civs);
        setPlayedGames(played_games);
        setFavoriteCiv(favorite_civ);
      }

      if (error) toast.error("Erro ao carregar dados. Tente novamente");
    };

    get_user_data();
  }, []);

  // NÃO DEIXAR CONSOLE.LOG() NO CÓDIGO :)

  // IDEIAS: eventualmente colocar um sistema de patente?

  return (
    <>
      <button className={styles.back_btn} onClick={() => router.back()}>
        Voltar
      </button>
      <div className={styles.main_user_info}>
        {userData?.avatar_url ? (
          <div className={styles.user_avatar}>
            <Image
              src={userData?.avatar_url}
              width={150}
              height={150}
              style={{ borderRadius: "50%" }}
              alt="Avatar URL"
              loading="eager"
            />
          </div>
        ) : (
          <div
            className={styles.user_avatar}
            style={{ border: "1px solid #fff", borderRadius: "50%" }}
          >
            <FontAwesomeIcon icon={faUser} size="6x" />
          </div>
        )}
        <h2>
          {userData?.nickname}
          {userData?.steam_url && (
            <Link
              href={`${userData.steam_url}`}
              target="_blank"
              className={styles.steam_link}
            >
              <FontAwesomeIcon
                icon={faSteam}
                size="lg"
                className={styles.steam_icon}
                fill="#fff"
              />
            </Link>
          )}
        </h2>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <main className={styles.user_main_stats}>
        <div className={styles.column}>
          <h3 className={styles.column_title}>Civilizações jogadas</h3>
          <div className={styles.civs_played}>
            {playedCivilizations.map((civ) => (
              <div
                className={styles.civ_container}
                key={civ.name}
                style={{ backgroundColor: CIV_COLORS[civ.name] }}
              >
                <Image
                  src={civ.icon_url}
                  width={30}
                  height={30}
                  alt="Civ Icon"
                  loading="lazy"
                />
                <p>{civ.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.column_title}>Estatísticas</h3>
          <div className={styles.stat_container}>
            Civilização Favorita:
            {favoriteCiv && (
              <div
                className={styles.civ_container}
                style={{ backgroundColor: CIV_COLORS[favoriteCiv.name] }}
              >
                <Image
                  src={favoriteCiv.icon_url}
                  width={30}
                  height={30}
                  alt="Civ Icon"
                />
                <p>{favoriteCiv.name}</p>
              </div>
            )}
          </div>

          <div
            className={styles.stat_container}
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {Object.keys(gamesCount).map((key, index) => (
              <p key={index}>
                {games_count_label[key]}: <b>{gamesCount[key]}</b>
              </p>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.column_title}>Partidas Jogadas</h3>
          {playedGames.map((game) => (
            <div className={styles.played_game_container} key={game.name}>
              <h3>{game.name}</h3>
              {game.is_winner ? (
                <span className={styles.winner}>Venceu</span>
              ) : (
                <span className={styles.loser}>Perdeu</span>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default page;
