"use client";

// Utils
import styles from "../layout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Hooks
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/_lib/supabase/client";

// Components
import { toast } from "sonner";
import Loading from "@/components/Layout/Loading/Loading";

// Images
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Page = () => {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace("/forgot-password");
      return;
    }

    const exchange = async () => {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: code,
        type: "recovery",
      });

      if (error) {
        toast.error("Link inválido ou expirado.");
        router.replace("/forgot-password");
        return;
      }

      setIsReady(true);
    };

    exchange();
  }, []);

  const handle_submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Senha atualizada com sucesso!");
    router.replace("/home");
  };

  if (!isReady) return <Loading />;

  return (
    <form onSubmit={handle_submit} className={styles.form}>
      <div className={styles.input_wrapper}>
        <label className={styles.input_label}>Nova senha</label>
        <div className={styles.input_password_wrapper}>
          <input
            className={styles.input_container}
            type={showPassword ? "text" : "password"}
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.password_toggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>
      <button type="submit" className={styles.submit_btn} disabled={loading}>
        {loading ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
};

export default Page;
