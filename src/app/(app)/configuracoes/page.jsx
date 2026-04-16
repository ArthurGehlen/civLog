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
import { toast } from "sonner";

const page = () => {
  const supabase = createClient();
  const router = useRouter();
  const { profile } = useUser();

  const handle_logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Erro ao sair. Tente novamente.");
      return;
    }

    toast.success("Logout efetuado com sucesso :)");
    router.push("/login");
  };

  return (
    <>
      <h2>{profile?.nickname}</h2>
      <button onClick={handle_logout} className={styles.logout_btn}>
        <FontAwesomeIcon icon={faSignOut} size="sm" />
        Logout
      </button>
    </>
  );
};

export default page;
