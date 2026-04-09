"use client";
// Utils
import styles from "../layout.module.css";
import { createClient } from "@/_lib/supabase/client";
import { useState } from "react";

// Hooks
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
  const [errors, setErrors] = useState({});

  const supabase = createClient();
  const router = useRouter();

  const handle_signup = async (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const email = form.get("email");
    const password = form.get("password");
    const confirm_password = form.get("confirm_password");
    const username = form.get("username");

    if (password !== confirm_password) {
      console.error("Senhas não coincidem");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      console.error(error.message);
      return;
    }

    console.log(data);
    router.push("/home");
  };

  return (
    <>
      <h1 className={styles.auth_title}>Signup</h1>

      <form onSubmit={handle_signup} className={styles.form}>
        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="username">
            Nome de usuário
          </label>
          <input
            className={styles.input_container}
            type="text"
            id="username"
            name="username"
            placeholder="Máximo de 50 caracteres"
            maxLength={50}
          />
        </div>

        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input_container}
            type="email"
            id="email"
            name="email"
            placeholder="exemplo@gmail.com"
          />
        </div>

        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="password">
            Senha
          </label>
          <input
            className={styles.input_container}
            type="password"
            name="password"
            id="password"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="password">
            Confirme sua senha
          </label>
          <input
            className={styles.input_container}
            type="password"
            name="confirm_password"
            id="confirm_password"
          />
        </div>

        <button type="submit" className={styles.submit_btn}>
          Criar Conta
        </button>
      </form>

      <div className={styles.divider}>
        <div className={styles.line}></div>
        <p>Ou</p>
        <div className={styles.line}></div>
      </div>

      <p className={styles.account_advice}>
        Já possui uma conta?{" "}
        <Link className={styles.link_to} href="/login">
          Entrar
        </Link>
      </p>
    </>
  );
};

export default page;
