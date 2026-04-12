"use client";

// Utils
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Hooks
import { usePathname } from "next/navigation";
import { useState } from "react";

// Components
import Logo from "../Logo/Logo";
import Link from "next/link";

// Icons
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// Context
import { useUser } from "@/_lib/context/UserContext";

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { profile } = useUser();
  const pathname = usePathname();

  const header_links = [
    { id: 1, content: "Home", path: "/home" },
    { id: 2, content: "Partidas", path: "/partidas" },
    { id: 3, content: "Leaderboard", path: "/leaderboard" },
    { id: 4, content: "Perfis", path: "/perfis" },
  ];

  return (
    <header className={styles.header_wrapper}>
      <h1>
        <Link href="/home">
          <Logo />
        </Link>
      </h1>

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

        <div className={styles.user_menu_wrapper}>
          <div className={styles.upper_menu}>
            <Link className={styles.config_link_btn} href="/configuracoes">
              <FontAwesomeIcon style={{ marginRight: ".4rem" }} icon={faUser} />
              {profile ? profile.nickname : "..."}
            </Link>
            <button
              className={styles.active_menu_btn}
              style={{ color: "white" }}
              onClick={() => setToggleMenu(!toggleMenu)}
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
          </div>
          {toggleMenu && (
            <div className={styles.menu}>
              <ul>
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
