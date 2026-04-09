// Utils
import styles from "./layout.module.css";

// Context
import { UserProvider } from "@/_lib/context/UserContext";

// Components
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";

const layout = ({ children }) => {
  return (
    <UserProvider>
      <div className={styles.page}>
        <Header />
        {children}
        <Footer />
      </div>
    </UserProvider>
  );
};

export default layout;
