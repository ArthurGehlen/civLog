"use client";
// Utils
import styles from "./page.module.css";

// Hooks
import { useEffect, useState } from "react";
import { createClient } from "@/_lib/supabase/client";

// Components
import GameCard from "@/components/GameCard/GameCard";
import Divider from "@/components/Layout/Divider/Divider";

const page = () => {
  const [matches, setMatches] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const get_all_matches = async () => {
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
        )
        .eq("status", "Concluído")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error(error.message);
        return;
      }

      setMatches(data);
    };

    get_all_matches();
  }, []);

  return (
    <>
      <h1>Partidas</h1>

      <Divider />

      <div className={styles.games_wrapper}>
        {matches.map((match) => (
          <div key={match.id} className={styles.card_item}>
            <GameCard game_obj={match} />
          </div>
        ))}
      </div>
    </>
  );
};

export default page;
