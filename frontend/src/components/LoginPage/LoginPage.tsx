import styles from "./Login.module.css";
import { Link } from "react-router-dom";

type Props = {};

const LoginPage = (props: Props) => {
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
