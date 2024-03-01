import Header from "../Header/Header";
import styles from "./SettingsPage.module.css";
import StCenter from "./StCenter";

const SettingsPage = () => {
  return (
    <div>
      <Header />
      <div className={styles.Profile}>
        <div className={styles.Sbox}>
          {/* {isTwoFa && <Qr />} */}
          {<StCenter />}
        </div> 
      </div>
    </div>
  );
};

export default SettingsPage;
