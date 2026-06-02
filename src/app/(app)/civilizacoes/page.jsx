"use client";
// Utils
import { createClient } from "@/_lib/supabase/client";
import styles from "./page.module.css";
import { CIV_COLORS } from "@/_lib/constants";

// Components
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Divider from "@/components/Layout/Divider/Divider";

const page = () => {
  const [civilizations, setCivilizations] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const load_civilizations = async () => {
      const { data, error } = await supabase
        .from("civilizations")
        .select("id, name, leader, icon_url, is_banned");
      setCivilizations(data);

      if (error) toast.error("Erro ao carregar dados. Tente novamente");
    };
    load_civilizations();
  }, []);

  return (
    <>
      <h1>Civilizações</h1>
      <p
        style={{ color: "#c9a84c", fontWeight: "bold", letterSpacing: ".2rem" }}
      >
        Apenas civilizações disponíveis no vanilla :)
      </p>
      <Divider />
      <div className={styles.civilizations_container}>
        {civilizations.map((civ) => (
          <div
            key={civ.id}
            className={`${styles.civ_container} ${styles.card_item}`}
          >
            <div className={styles.civ_info}>
              {civ.icon_url && (
                <Image
                  src={civ.icon_url}
                  width={30}
                  height={30}
                  alt="Civ Icon"
                  style={{ borderRadius: "50%" }}
                />
              )}
              <div className={styles.divider}></div>
              <div className={styles.civ_details}>
                <div
                  style={{ backgroundColor: CIV_COLORS[civ.name] }}
                  className={styles.civ_colordot}
                ></div>
                <p
                  className={styles.civ_name}
                  style={
                    civ.is_banned ? { textDecoration: "line-through" } : {}
                  }
                >
                  {civ.name} -{" "}
                  <span style={{ fontStyle: "italic" }}>{civ.leader}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default page;
