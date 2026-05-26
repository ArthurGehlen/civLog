"use client";
// Utils
import styles from "./layout.module.css";

// Images
import indexPageBackground1 from "@/assets/indexPageBackground.avif";
import indexPageBackground2 from "@/assets/indexPageBackground2.avif";
import indexPageBackground3 from "@/assets/indexPageBackground3.avif";

// Hooks
import { useEffect, useState } from "react";

const backgrounds = [
  indexPageBackground1,
  indexPageBackground2,
  indexPageBackground3,
];

const layout = ({ children }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      {backgrounds.map((bg, i) => (
        <div
          key={i}
          className={`${styles.bg_slide} ${i === index ? styles.active : ""}`}
          style={{ backgroundImage: `url(${bg.src})` }}
        />
      ))}

      {/* Overlay de sombra */}
      <div className={styles.overlay} />

      <div className={styles.auth_container}>{children}</div>
    </div>
  );
};

export default layout;
