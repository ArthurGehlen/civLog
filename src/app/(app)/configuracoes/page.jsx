"use client";
// Utils
import styles from "./page.module.css";
import { createClient } from "@/_lib/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import format_nickname from "@/_lib/formatNickname";

// Hooks
import { useState } from "react";

// Icons
import { faSignOut, faSpinner } from "@fortawesome/free-solid-svg-icons";

// Context
import { useUser } from "@/_lib/context/UserContext";

// Components
import AvatarUpload from "@/components/Layout/AvatarUpload/AvatarUpload";
import { toast } from "sonner";

const STEAM_PROFILE_URL = "https://steamcommunity.com/profiles/";
const USERNAME_MIN = 3;
const USERNAME_MAX = 30;
const STEAM_URL_MAX = 70;

// movendo pra fora da "main function"
const validate = ({ username, steam_url }) => {
  const errors = {};

  if (!username || username.trim().length < USERNAME_MIN) {
    errors.new_username = `Nome de usuário deve ter pelo menos ${USERNAME_MIN} caracteres.`;
  } else if (username.trim().length > USERNAME_MAX) {
    errors.new_username = `Nome de usuário deve ter no máximo ${USERNAME_MAX} caracteres.`;
  }

  if (steam_url) {
    const trimmed = steam_url.trim();
    if (!trimmed.includes(STEAM_PROFILE_URL)) {
      errors.steam_url =
        "URL Steam inválida. Use o formato: https://steamcommunity.com/profiles/SEU_ID";
    }
  }

  return errors;
};

const page = () => {
  const supabase = createClient();
  const { profile, user, refresh_profile } = useUser();
  const [loading, setLoading] = useState(false);

  const handle_logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Erro ao sair. Tente novamente.");
      return;
    }

    toast.success("Logout efetuado com sucesso :)");
    window.location.reload();
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    const form_data = new FormData(e.currentTarget);
    const new_username = form_data.get("new_username")?.trim();
    const new_steam_url = form_data.get("new_steam_url")?.trim();

    if (!new_username && !new_steam_url) {
      toast.info("Nenhuma alteração para salvar.");
      return;
    }

    const errors = validate({
      username: new_username,
      steam_url: new_steam_url,
    });

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => toast.error(msg));
      return;
    }

    setLoading(true);

    // melhorando a estrutura de atualização pq a antiga tava uma desgraça :)
    try {
      const updates = {};
      if (new_username) updates.nickname = new_username;
      if (new_steam_url) updates.steam_url = new_steam_url;

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("auth_user_id", user.id);

      if (error) {
        const friendly_errors = {
          23505: "Este nome de usuário já está em uso.",
        };

        const message =
          friendly_errors[error.code] ??
          error.message ??
          "Erro desconhecido ao atualizar perfil.";

        toast.error(message);
        return;
      }

      toast.success("Perfil atualizado com sucesso!");
      refresh_profile();
    } catch (err) {
      toast.error("Erro inesperado. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className={styles.config_header}>
        <h2>{format_nickname(profile?.nickname, 15)}</h2>
        <button
          onClick={handle_logout}
          className={styles.logout_btn}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faSignOut} size="sm" />
          Logout
        </button>
      </header>

      <h2 style={{ marginTop: "2rem" }}>Personalizar Perfil</h2>
      <hr style={{ margin: "2rem 0" }} />

      <form onSubmit={handle_submit} className={styles.custom_profile}>
        <div className={styles.custom_profile_container}>
          <AvatarUpload userId={user?.id} currentAvatar={profile?.avatar_url} />
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="new_username">Trocar nome de usuário:</label>
          <input
            type="text"
            id="new_username"
            name="new_username"
            className={styles.custom_profile_container_input}
            placeholder="Máximo de 30 caracteres"
            maxLength={USERNAME_MAX}
            disabled={loading}
          />
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="new_steam_url">URL da steam:</label>
          <input
            type="text"
            id="new_steam_url"
            name="new_steam_url"
            className={styles.custom_profile_container_input}
            placeholder="https://steamcommunity.com/profiles/SEU_ID"
            maxLength={STEAM_URL_MAX}
            disabled={loading}
          />
        </div>

        <button className={styles.submit_btn} type="submit" disabled={loading}>
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin size="sm" />
              Salvando...
            </>
          ) : (
            "Atualizar"
          )}
        </button>
      </form>
    </>
  );
};

export default page;
