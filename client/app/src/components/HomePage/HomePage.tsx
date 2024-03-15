import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import styles from "./HomePage.module.css";
import BoxContainer from "./BoxContainer";

const HomePage = () => {
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
      <div className={styles.Home}>
        <div><BoxContainer/></div>
      </div>
    </div>
  );
};

export default HomePage;
