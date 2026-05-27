"use client";
// Utils
import styles from "./page.module.css";

// Components
import Link from "next/link";
import Logo from "@/components/Layout/Logo/Logo";
import Image from "next/image";

// Images
import indexPageBackground1 from "@/assets/indexPageBackground.avif";
import test from "@/assets/civilizationLogo.avif";

const page = () => {
  return (
    <div className={styles.page}>
      <div
        className={styles.bg_slide}
        style={{ backgroundImage: `url(${indexPageBackground1.src})` }}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.main_title}>
          Bem-Vindo ao <Logo />
        </h1>
        <Link className={styles.link_to_login} href="/login">
          Entrar
        </Link>
      </div>
    </div>
  );
};

export default page;
