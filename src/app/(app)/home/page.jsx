"use client";
// Utils
import { createClient } from "@/_lib/supabase/client";
import styles from "./page.module.css";

// Hooks
import { useState, useEffect } from "react";

// Components
import GameCard from "@/components/matches/GameCard";

// Context
import { useUser } from "@/_lib/context/UserContext";
import Loading from "@/components/layout/Loading/Loading";

const Page = () => {
  const [lastMatches, setLastMatches] = useState([]);
  const supabase = createClient();
  const { loading } = useUser();

  useEffect(() => {
    const load_last_matches = async () => {
      const { data, error } = await supabase
        .from("games")
        .select(
          `
          id,
          name,
          scheduled_date,
          continuation_date,
          is_completed,
          organization,
          map_types ( name ),
          map_sizes ( name ),
          game_speeds ( name ),
          game_players (
            is_winner,
            profiles ( nickname, avatar_url ),
            civilizations ( name, icon_url )
          )`,
        ) // nome_da_tabela (valores) 
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) {
        console.error(error);
        return;
      }

      setLastMatches(data);
    };

    load_last_matches();
  }, []);

  // NÃO DEIXAR CONSOLE.LOG() NO CÓDIGO :)
  // Quantas vezes eu deixei console.log() no código: 1

  return (
    <>
      {loading && <Loading />}
      <div className={styles.last_matches_played_wrapper}>
        <h2>Últimas 3 partidas</h2>
        <hr style={{ margin: "2rem 0" }} />
        <div className={styles.last_matches_container}>
          {lastMatches.map((match) => (
            <GameCard key={match.id} game_obj={match} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
