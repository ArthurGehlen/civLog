// Utils
import styles from "./layout.module.css";

// Components
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";

const layout = ({ children }) => {
  return (
    <div className={styles.page}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
