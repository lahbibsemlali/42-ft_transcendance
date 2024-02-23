import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import styles from "./SettingsPage.module.css"

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
          <img src="/Avatar.jpeg" alt="Player's avatar" className={styles.Savatar}/>
          <button className={styles.Sbox_button1}>Edit Picture </button >
          <input placeholder=" USERNAME " type="text" className={styles.Sbox_input1}/>
          <h1> TWO FACTOR AUTHENTICATION </h1>
          <input placeholder="ACTIVATE" type="text" className={styles.Sbox_input2}/>
          <button className={styles.Sbox_button2}> UPDATE </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
