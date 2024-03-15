import { useContext, useEffect } from "react";
import { isLogin, reCheck } from "../Authorization/Authorization";
import Header from "../Header/Header";
import styles from "./SettingsPage.module.css";
import StCenter from "./StCenter";
import LoginPage from "../LoginPage/LoginPage";

const SettingsPage = () => {
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) {
    return;
  }
  const { check, setCheck } = context;

  useEffect(() => {
    if (check) setCheck(false);
    else setCheck(true);
  }, []);

  if (isLoggedIn == 2) return <LoginPage />;
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
