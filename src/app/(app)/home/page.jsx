"use client";
// Utils
import { createClient } from "@/_lib/supabase/client";
import styles from "./page.module.css";

// Hooks
import { useState, useEffect } from "react";

// Components
import GameCard from "@/components/GameCard/GameCard";
import { toast } from "sonner";
import Divider from "@/components/Layout/Divider/Divider";

// Context
import { useUser } from "@/_lib/context/UserContext";
import Loading from "@/components/Layout/Loading/Loading";

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
          status,
          organization,
          game_players (
            is_winner,
            profiles ( nickname, avatar_url ),
            civilizations ( name, icon_url )
          )`,
        ) // nome_da_tabela (valores)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) {
        toast.error(error.message);
        return;
      }

      setLastMatches(data);
    };

    load_last_matches();
  }, []);

  // NÃO DEIXAR CONSOLE.LOG() NO CÓDIGO :)
  // Quantas vezes eu deixei console.log() no código: 2

  return (
    <>
      {loading && <Loading />}
      <div className={styles.last_matches_played_wrapper}>
        <h1>Últimas 3 partidas</h1>
        <Divider />
        <div className={styles.last_matches_container}>
          {lastMatches.map((match, index) => (
            <div
              key={match.id}
              className={styles.card_item}
              style={{ animationDelay: `${80 + index * 110}ms` }}
            >
              <GameCard game_obj={match} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
