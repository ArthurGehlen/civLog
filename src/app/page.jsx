"use client";
// Utils
import styles from "./page.module.css";

// Hooks
import Link from "next/link";

// Components
import Logo from "@/components/Layout/Logo/Logo";

const page = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.main_title}>
        Bem-Vindo ao <Logo />
      </h1>
      <Link className={styles.link_to_login} href="/login">
        Entrar
      </Link>
    </div>
  );
};

export default page;
