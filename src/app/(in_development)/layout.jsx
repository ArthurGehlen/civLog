"use client";
// Utils
import styles from "./layout.module.css";

// Context
import { UserProvider } from "@/_lib/context/UserContext";

// Images
import under_construction from "@/assets/under_construction.svg";

// Components
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import Image from "next/image";

const layout = ({ children }) => {
  return (
    <UserProvider>
      <div className={styles.page}>
        <Header />
        <main className={styles.content}>
          <Image
            src={under_construction}
            alt="Under Construction"
            height={200}
            width={450}
          />
          <h2>Esta página está em desenvolvimento</h2>
          <p>Volte mais tarde para novidades :)</p>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
};

export default layout;
