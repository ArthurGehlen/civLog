"use client";

// Utils
import styles from "../layout.module.css";

// Components
import { toast } from "sonner";
import Captcha from "@/components/captcha/Captcha";

// Hooks
import { createClient } from "@/_lib/supabase/client";
import { useState } from "react";

const Page = () => {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const handle_submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const redirectTo = `${window.location.origin}/auth/callback?type=recovery`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      captchaToken,
      redirectTo: redirectTo,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Email de recuperação de senha enviado com sucesso!");
  };

  return (
    <>
      <h1 className={styles.auth_title}>Esqueceu a senha</h1>

      <form onSubmit={handle_submit} className={styles.form}>
        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input_container}
            type="email"
            id="email"
            name="email"
            placeholder="Digite o seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Captcha onVerify={(token) => setCaptchaToken(token)} />

        <button type="submit" className={styles.submit_btn} disabled={loading}>
          {loading ? "Enviando email..." : "Enviar Email"}
        </button>
      </form>
    </>
  );
};

export default Page;
