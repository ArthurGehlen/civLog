"use client";
// Utils
import styles from "./layout.module.css";

// Hooks
import { usePathname } from "next/navigation";

// Components
import Link from "next/link";
import Divider from "@/components/Layout/Divider/Divider";

const admin_links = [
  { id: 1, content: "Admin", path: "/admin" },
  { id: 2, content: "Partidas", path: "/admin/partidas" },
  { id: 3, content: "Usuários", path: "/admin/usuarios" },
  { id: 4, content: "Civilizações", path: "/admin/civilizacoes" },
];

const layout = ({ children }) => {
  const pathname = usePathname();

  return (
    <>
      <h1>Painel do Sistema</h1>

      <ul className={styles.admin_links}>
        {admin_links.map((link) => (
          <li
            key={link.id}
            className={pathname === link.path ? `${styles.current_link}` : ""}
          >
            <Link href={link.path}>{link.content}</Link>
          </li>
        ))}
      </ul>
      <Divider />
      <div className={styles.main_content}>{children}</div>
    </>
  );
};

export default layout;
