"use client";
// Utils
import styles from "./CivPicker.module.css";
import { CIV_COLORS } from "@/_lib/constants";

// Hooks
import { createClient } from "@/_lib/supabase/client";
import { useState } from "react";

const CivPicker = () => {
  const supabase = createClient();

  const get_all_civs = async () => {
    const { data, error } = await supabase
      .from("civilizations")
      .select("id, name, icon_url, is_banned");
  };

  return <div className={styles.civ_picker}>CivPicker</div>;
};

export default CivPicker;
