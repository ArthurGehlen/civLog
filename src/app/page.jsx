"use client";
// Utils
import styles from "./page.module.css";
import { createClient } from "@/_lib/supabase/client";

// Hooks
import Link from "next/link";
import { useEffect, useMemo } from "react";

// Components
import Logo from "@/components/layout/Logo/Logo";

const page = () => {
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetch_data = async () => {
      const { data, error } = await supabase.from("civilizations").select("*");

      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    };

    fetch_data();
  }, [supabase]);

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
