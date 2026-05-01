"use client";

// Utils
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Hooks
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

// Components
import Logo from "../Logo/Logo";
import Link from "next/link";
import Image from "next/image";

// Icons
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// Context
import { useUser } from "@/_lib/context/UserContext";

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { profile } = useUser();
  const pathname = usePathname();
  const is_mobile = useIsMobile();

  const header_links = [
    { id: 1, content: "Home", path: "/home" },
    { id: 2, content: "Partidas", path: "/partidas" },
    { id: 3, content: "Leaderboard", path: "/leaderboard" },
    { id: 4, content: "Perfis", path: "/perfis" },
  ];

  function format_nickname(nickname) {
    if (!nickname) return "...";

    const firstName = nickname.split(" ")[0];

    return firstName.length > 8 ? firstName.slice(0, 6) + "…" : firstName;
  }

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
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  width={25}
                  height={25}
                  className={styles.user_avatar}
                  alt="User Icon"
                  loading="lazy"
                />
              ) : (
                <FontAwesomeIcon style={{ flexShrink: 0 }} icon={faUser} />
              )}
              <span className={styles.nickname_displayer}>
                {is_mobile
                  ? format_nickname(profile?.nickname)
                  : (profile?.nickname ?? "...")}
              </span>
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
