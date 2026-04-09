// Utils
import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icons
import { faCopyright } from "@fortawesome/free-regular-svg-icons";

// Components
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        <FontAwesomeIcon
          icon={faCopyright}
          size="sm"
          style={{ marginRight: ".2rem" }}
        />
        <Logo /> - 2026
      </p>
    </footer>
  );
};

export default Footer;
