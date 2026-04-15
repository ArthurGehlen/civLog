// Utils
import styles from "./PlayerContainer.module.css";
import { CIV_COLORS } from "@/_lib/constants";

// Components
import Link from "next/link";
import Image from "next/image";

const PlayerContainer = ({ obj }) => {
  if (!obj || obj.length === 0) return null;

  return (
    <>
      {obj.map((p, i) => (
        <div
          key={i}
          className={styles.player}
          style={{
            backgroundColor: CIV_COLORS[p.civilizations.name] ?? "#2a2a2a",
          }}
        >
          <Link className={styles.nickname} href={`/perfis/${p.profiles.nickname}`}>
            {p.profiles.nickname}
          </Link>

          <div className={styles.divider}></div>

          <div className={styles.player_civ}>
            <Image
              src={p.civilizations.icon_url}
              height={25}
              width={25}
              alt="Civ Icon"
            />
            <span>{p.civilizations.name}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default PlayerContainer;
