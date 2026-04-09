"use client";

// Utils
import styles from "./Header.module.css";
import { createClient } from "@/_lib/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Hooks
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// Components
import Logo from "../Logo/Logo";
import Link from "next/link";

// Icons
import { faUser } from "@fortawesome/free-regular-svg-icons";

// Context
import { useUser } from "@/_lib/context/UserContext";

const Header = () => {
  const { profile } = useUser();
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  const header_links = [
    { id: 1, content: "Home", path: "/home" },
    { id: 2, content: "Partidas", path: "/partidas" },
    { id: 3, content: "Leaderboard", path: "/leaderboard" },
    { id: 4, content: "Perfis", path: "/perfis" },
  ];

  const handle_logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair. Tente novamente.");
      return;
    }
    toast.success("Logout efetuado com sucesso :)");
    router.push("/login");
  };

  return (
    <header className={styles.header_wrapper}>
      <h1>
        <Link href="/home">
          <Logo />
        </Link>
      </h1>

      {/* nav desktop */}
      <div className={styles.header_info_wrapper}>
        <ul className={styles.header_links}>
          {header_links.map((link) => (
            <li key={link.id}>
              <Link
                href={link.path}
                className={pathname === link.path ? styles.active : ""}
              >
                {link.content}
              </Link>
            </li>
          ))}
        </ul>

        {/* menu do usuário desktop */}
        <div className={styles.user_menu_wrapper}>
          <button className={styles.config_menu_btn}>
            <FontAwesomeIcon style={{ marginRight: ".4rem" }} icon={faUser} />
            {profile ? profile.nickname : "Carregando..."}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
