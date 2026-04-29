"use client";
// Utils
import { createClient } from "@/_lib/supabase/client";
import styles from "./page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Icons
import { faUser } from "@fortawesome/free-regular-svg-icons";

const page = () => {
  const [users, setUsers] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const load_users = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, avatar_url, nickname");
      setUsers(data);

      if (error) toast.error("Erro ao carregar dados. Tente novamente");
    };
    load_users();
  }, []);

  return (
    <>
      <div className={styles.users_container}>
        {users.map((user) => (
          <div key={user.id} className={styles.user_container}>
            <div className={styles.user_info}>
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  width={30}
                  height={30}
                  alt="User Icon"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} size="lg" />
              )}
              <span>{user.nickname}</span>
            </div>
            <Link
              className={styles.more_details_link}
              href={`/perfis/${user.nickname}`}
            >
              Ver Perfil
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default page;
