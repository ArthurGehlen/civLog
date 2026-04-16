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

  const validate = ({ username, email, password, confirmPassword }) => {
    const errors = {};
    if (!username || username.trim().length < 3)
      errors.username = "Nome de usuário deve ter pelo menos 3 caracteres.";
    if (username && username.trim().length > 30)
      errors.username = "Nome de usuário deve ter no máximo 30 caracteres.";
    if (!email) errors.email = "Email é obrigatório.";
    if (!password || password.length < 8)
      errors.password = "Senha deve ter pelo menos 8 caracteres.";
    if (password !== confirmPassword)
      errors.confirmPassword = "As senhas não coincidem.";
    return errors;
  };

  const handle_signup = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Confirme que você não é um robô :)");
      return;
    }

    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    const errors = validate({ username, email, password, confirmPassword });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username }, captchaToken },
    });

    if (error) {
      if (error.message.includes("already registered"))
        toast.error("Este email já está cadastrado.");
      else toast.error("Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    toast.success("Conta criada com sucesso!");
    router.push("/home");
  };

  return (
    <>
      <h1 className={styles.auth_title}>Criar conta</h1>

      <form onSubmit={handle_signup} className={styles.form}>
        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="username">
            Nome de usuário
          </label>
          <input
            className={`${styles.input_container} ${fieldErrors.username ? styles.input_invalid : ""}`}
            type="text"
            id="username"
            name="username"
            placeholder="Mínimo 3 caracteres"
            maxLength={30}
          />
          {fieldErrors.username && (
            <span className={styles.field_error}>{fieldErrors.username}</span>
          )}
        </div>

        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="email">
            Email
          </label>
          <input
            className={`${styles.input_container} ${fieldErrors.email ? styles.input_invalid : ""}`}
            type="email"
            id="email"
            name="email"
            placeholder="exemplo@gmail.com"
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
            name="password"
            id="password"
            placeholder="Mínimo 8 caracteres"
          />
          {fieldErrors.password && (
            <span className={styles.field_error}>{fieldErrors.password}</span>
          )}
        </div>

        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="confirmPassword">
            Confirme sua senha
          </label>
          <input
            className={`${styles.input_container} ${fieldErrors.confirmPassword ? styles.input_invalid : ""}`}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
          />
          {fieldErrors.confirmPassword && (
            <span className={styles.field_error}>
              {fieldErrors.confirmPassword}
            </span>
          )}
        </div>

        <Captcha onVerify={(token) => setCaptchaToken(token)} />

        <button type="submit" className={styles.submit_btn} disabled={loading}>
          {loading ? "Criando conta..." : "Criar Conta"}
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
