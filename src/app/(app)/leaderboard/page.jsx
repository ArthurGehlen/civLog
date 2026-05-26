"use client";
// Utils
import styles from "./page.module.css";
import { useUser } from "@/_lib/context/UserContext";
import format_nickname from "@/_lib/formatNickname";

// Hooks
import { useState, useEffect } from "react";
import { createClient } from "@/_lib/supabase/client";

// Images
import { faUser } from "@fortawesome/free-regular-svg-icons";

// Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { toast } from "sonner";
import LeaderboardChart from "@/components/LeaderboardChart/LeaderboardChart";
import Link from "next/link";
import Divider from "@/components/Layout/Divider/Divider";

const page = () => {
  const [userData, setUserData] = useState(null);
  const { profile } = useUser();
  const supabase = createClient();

  useEffect(() => {
    let active = true;

    const get_all_users = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `id, avatar_url, nickname, game_players (is_winner, games (name, is_completed), civilizations (name, icon_url))`,
        );

      if (error) return toast.error(error.message);

      const formatted = data.map((user) => ({
        name: user.nickname,
        avatar_url: user.avatar_url,
        wins: user.game_players.filter((gp) => gp.is_winner).length,
      }));

      setUserData(formatted);
    };

    get_all_users();
    return () => {
      active = false;
    };
  }, []);

  // verifica quantos players tem mais vitórias que o primeiro
  // com isso é feito o sistema de empate
  const players_with_rank = [...(userData ?? [])]
    .sort((a, b) => b.wins - a.wins)
    .map((player, _, arr) => ({
      ...player,
      rank: arr.filter((p) => p.wins > player.wins).length + 1,
    }));

  return (
    <>
      <h1>Leaderboard</h1>

      <div className={styles.leaderboard_table}>
        {players_with_rank.map((player, index) => (
          <div
            key={player.id ?? index}
            className={`${styles.player_info} ${
              player.name === profile?.nickname ? styles.current_user : ""
            }`}
          >
            <header className={styles.player_info_header}>
              <span className={styles.position}>{player.rank}°</span>
              <div className={styles.user_label}>
                {player.avatar_url ? (
                  <Image
                    src={player.avatar_url}
                    loading="lazy"
                    width={25}
                    height={25}
                    alt="User Icon"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <FontAwesomeIcon style={{ flexShrink: 0 }} icon={faUser} />
                )}
                <Link href={`/perfis/${player.name}`}>
                  <span>{format_nickname(player.name, 13)}</span>
                </Link>
              </div>
            </header>
            <span>{player.wins} vitórias</span>
          </div>
        ))}
      </div>

      <Divider />

      {userData && <LeaderboardChart players={userData} />}
    </>
  );
};

export default page;
