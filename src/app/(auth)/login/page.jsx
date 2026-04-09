"use client";
// Utils
import styles from "../layout.module.css";
import { createClient } from "@/_lib/supabase/client";

// Hooks
import { useState } from "react";
import { useRouter } from "next/navigation";

// Components
import Link from "next/link";
import Captcha from "@/components/captcha/Captcha";
import { toast } from "sonner";

const page = () => {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);

  const validate = ({ email, password }) => {
    const errors = {};
    if (!email) errors.email = "Email é obrigatório.";
    if (!password) errors.password = "Senha é obrigatória.";
    return errors;
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Confirme que você não é um robô :)");
      return;
    }

    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    const errors = validate({ email, password });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    });

    if (error) {
      toast.error("Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    toast.success("Login efetuado com sucesso!");
    router.push("/home");
  };

  return (
    <>
      <h1 className={styles.auth_title}>Login</h1>

      <form onSubmit={handle_submit} className={styles.form}>
        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="email">
            Email
          </label>
          <input
            className={`${styles.input_container} ${fieldErrors.email ? styles.input_invalid : ""}`}
            type="email"
            id="email"
            name="email"
            placeholder="Digite o seu email"
          />
          {fieldErrors.email && (
            <span className={styles.field_error}>{fieldErrors.email}</span>
          )}
        </div>

        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="password">
            Senha
          </label>
          <input
            className={`${styles.input_container} ${fieldErrors.password ? styles.input_invalid : ""}`}
            type="password"
            id="password"
            name="password"
            placeholder="Digite sua senha"
          />
          {fieldErrors.password && (
            <span className={styles.field_error}>{fieldErrors.password}</span>
          )}
        </div>

        <Captcha onVerify={(token) => setCaptchaToken(token)} />

        <button type="submit" className={styles.submit_btn} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className={styles.divider}>
        <div className={styles.line}></div>
        <p>Ou</p>
        <div className={styles.line}></div>
      </div>

      <p className={styles.account_advice}>
        Ainda não possui uma conta?{" "}
        <Link className={styles.link_to} href="/signup">
          Crie uma
        </Link>
      </p>
    </>
  );
};

export default page;
