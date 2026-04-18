"use client";
// Utils
import styles from "./page.module.css";
import { createClient } from "@/_lib/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const page = () => {
  const [userData, setUserData] = useState([]);
  const supabase = createClient();
  const params = useParams();

  useEffect(() => {
    const get_user = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, nickname, avatar_url, steam_url, games (name), game_players (civilizations (name))",
        )
        .eq("nickname", params.nickname)
        .single();
      setUserData(data);

      if (error) toast.error("Erro ao carregar dados. Tente novamente");
    };

    get_user();
  }, []);

  // NÃO DEIXAR CONSOLE.LOG() NO CÓDIGO :)

  return (
    <>
      <div className={styles.main_user_info}>
        {userData.avatar_url ? (
          <div className={styles.user_avatar}>
            <Image
              src={userData.avatar_url}
              width={150}
              height={150}
              style={{ borderRadius: "50%" }}
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
      </div>
    </>
  );
};

export default page;
