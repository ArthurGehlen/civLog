"use client";
// Utils
import styles from "./page.module.css";
import { createClient } from "@/_lib/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Hooks
import { useRouter } from "next/navigation";

// Icons
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

// Context
import { useUser } from "@/_lib/context/UserContext";

// Components
import AvatarUpload from "@/components/layout/AvatarUpload/AvatarUpload";
import { toast } from "sonner";

const page = () => {
  const supabase = createClient();
  const router = useRouter();
  const { profile, user, refresh_profile } = useUser();

  const handle_logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Erro ao sair. Tente novamente.");
      return;
    }

    toast.success("Logout efetuado com sucesso :)");
    router.push("/login");
  };

  const validate_steam_link = (url) => {
    if (typeof url != "string") toast.error("A URL Steam deve ser um texto!");
    const trimmed = url.trim();
    if (trimmed === "") return false;

    const default_steam_url = "https://steamcommunity.com/profiles/"; // toda url steam deve começar assim e prosseguir com o id steam

    // ctz q vai ter uns engraçadinho :)

    return trimmed.includes(default_steam_url);
  };

  const validate = ({ username, steam_url }) => {
    const errors = {};
    if (!username || username.trim().length < 3)
      errors.new_username = "Nome de usuário deve ter pelo menos 3 caracteres.";
    if (username && username.trim().length > 30)
      errors.new_username = "Nome de usuário deve ter no máximo 30 caracteres.";
    if (steam_url && !validate_steam_link(steam_url)) {
      errors.steam_url = "URL steam inválida!";
    }
    return errors;
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    const form_data = new FormData(e.currentTarget);
    const new_username = form_data.get("new_username");
    const new_steam_url = form_data.get("new_steam_url");

    const errors = validate({
      username: new_username,
      steam_url: new_steam_url,
    });

    // se tiver erro nos inputs
    if (Object.keys(errors).length > 0) {
      if (errors.new_username) {
        toast.error(errors.new_username);
        return;
      }

      if (errors.steam_url) {
        toast.error(errors.steam_url);
        return;
      }

      return;
    }

    if (new_username) {
      const { error } = await supabase
        .from("profiles")
        .update({ nickname: new_username })
        .eq("auth_user_id", user.id);

      if (error) toast.error(error.message); // se tiver erro no supabase

      toast.success("Nome de usuário atualizado com sucesso!");
      refresh_profile();
    }

    if (new_steam_url) {
      const { error } = await supabase
        .from("profiles")
        .update({ steam_url: new_steam_url })
        .eq("auth_user_id", user.id);

      if (error) toast.error(error.message);

      toast.success("URL da steam atualizada com sucesso!");
      refresh_profile();
    }
  };

  return (
    <>
      <header className={styles.config_header}>
        <h2>{profile?.nickname}</h2>
        <button onClick={handle_logout} className={styles.logout_btn}>
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
            maxLength={30}
          />
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="new_steam_url">URL da steam:</label>
          <input
            type="text"
            id="new_steam_url"
            name="new_steam_url"
            className={styles.custom_profile_container_input}
            placeholder="Adicione a sua URL da steam"
            maxLength={70}
          />
        </div>

        <button className={styles.submit_btn} type="submit">
          Atualizar
        </button>
      </form>
    </>
  );
};

export default page;
