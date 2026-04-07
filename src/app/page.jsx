import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

const page = () => {
  return (
    <div className={styles.page}>
      <h1>
        Bem-Vindo ao <span className={styles.civ_style}>Civ</span>Log
      </h1>
      <Link className={styles.link_to_login} href="/login">
        Entrar
      </Link>
    </div>
  );
};

export default page;
