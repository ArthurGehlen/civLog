"use client";

// Utils
import styles from "./Header.module.css";

// Hooks
import { usePathname } from "next/navigation";

// Components
import Logo from "../Logo/Logo";
import Link from "next/link";

// Context
import { useUser } from "@/_lib/context/UserContext";

const Header = () => {
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


        <button>user</button>
      </div>
    </header>
  );
};

export default Header;
