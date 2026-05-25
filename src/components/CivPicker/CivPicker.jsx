"use client";
// Utils
import styles from "./CivPicker.module.css";
import { CIV_COLORS } from "@/_lib/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "@/_lib/context/UserContext";

// Components
import { toast } from "sonner";

// Images
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

// Hooks
import { createClient } from "@/_lib/supabase/client";
import { useState, useEffect } from "react";

const CivPicker = ({ game_players, game_id }) => {
  const [selectedCiv, setSelectedCiv] = useState("");
  const [civilizations, setCivilizations] = useState(null);
  const { profile } = useUser();
  const supabase = createClient();

  const get_all_civs = async () => {
    const { data, error } = await supabase
      .from("civilizations")
      .select("id, name, icon_url, is_banned");

    if (error) return toast.error(error.message);

    setCivilizations(data);
    setSelectedCiv(data[0]?.id);
  };

  useEffect(() => {
    get_all_civs();
  }, []);

  const taken_civs = game_players.map((p) => p.civilization_id).filter(Boolean);

  const handle_submit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("game_players")
      .update({ civilization_id: selectedCiv })
      .eq("profile_id", profile?.id)
      .eq("game_id", game_id);

    if (error) {
      if (error.code === "23505") {
        toast.error("Essa civilização já foi escolhida por outro jogador!");
        return;
      }
      toast.error(error.message);
      return;
    }

    toast.success("Civilização escolhida com sucesso!");
    window.location.reload();
  };

  return (
    <form className={styles.civ_picker} onSubmit={handle_submit}>
      <h2>Selecione sua civilização:</h2>
      <div className={styles.options}>
        <div className={styles.select_wrapper}>
          <select
            name="civilization"
            id="civilization"
            value={selectedCiv}
            onChange={(e) => setSelectedCiv(e.target.value)}
          >
            {civilizations &&
              civilizations
                .filter((civ) => !taken_civs.includes(civ.id))
                .map((civ) => (
                  <option key={civ.id} value={civ.id} disabled={civ.is_banned}>
                    {civ.is_banned ? `🚫 ${civ.name}` : civ.name}
                  </option>
                ))}
          </select>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={styles.select_icon}
          />
        </div>
        <button type="submit" className={styles.submit_btn}>
          Selecionar
        </button>
      </div>
    </form>
  );
};

export default CivPicker;
