import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const LoginPage = (props: Props) => {
  const navigate = useNavigate();
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) {return;}
  const { check, setCheck } = context;

  useEffect(() => {
    if (check) setCheck(false);
    else setCheck(true);
  }, []);

  // useEffect(() => {
    if (isLoggedIn == 1) navigate("/");
  // }, [isLoggedIn]);

  return (
    <div className={styles.loginBox}>
      <h1>Account Login </h1>
      <h2>Login with your Accout </h2>
      <Link to="http://localhost:3000/auth/42">
        <button className={styles.button}></button>
      </Link>
    </div>
  );
};

export default LoginPage;
