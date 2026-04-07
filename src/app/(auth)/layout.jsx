// Utils
import styles from "./layout.module.css";

const layout = ({ children }) => {
  return (
    <div className={styles.page}>
      <div className={styles.auth_container}>{children}</div>
    </div>
  );
};

export default layout;
