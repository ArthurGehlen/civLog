"use client";
import { createClient } from "@/_lib/supabase/client";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import styles from "./page.module.css";

const page = () => {
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetch_data = async () => {
      const { data, error } = await supabase
        .from("civilizations")
        .select("*");

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
        Bem-Vindo ao <span className={styles.civ_style}>Civ</span>Log
      </h1>
      <Link className={styles.link_to_login} href="/login">
        Entrar
      </Link>
    </div>
  );
};

export default page;