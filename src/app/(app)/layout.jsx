// Utils
import styles from "./layout.module.css";

// Context
import { UserProvider } from "@/_lib/context/UserContext";

// Components
import Header from "@/components/layout/Header/Header";

const layout = ({ children }) => {
  return (
    <UserProvider>
      <div className={styles.page}>
        <Header />
        <main className={styles.main_content}>{children}</main>
      </div>
    </UserProvider>
  );
};

export default layout;
