import styles from "./Login.module.css";
import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) {return;}
  const { check, setCheck } = context;

  useEffect(() => {
    if (check) setCheck(false);
    else setCheck(true);
  }, []);



    if (isLoggedIn == 1) navigate("/");

  const endpoint = `http://${import.meta.env.VITE_DOMAIN}:8000/api/auth/42`;
  return (
    <div className={styles.loginBox}>
      <h1>Account Login </h1>
      <h2>Login with your Accout </h2>
      <a href={endpoint}>
        <button className={styles.button}></button>
        <img style={{width: "50px", position: "absolute", left: "45%"}} src="https://cdn.intra.42.fr/doorkeeper/application/image/234/ic_launcher-web.png"></img>
      </a>
    </div>
  );
};

export default LoginPage;
