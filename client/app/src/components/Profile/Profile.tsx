import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import styles from "./Profile.module.css";
import BoxContainer from "./BoxContainer";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import NotFound from "../NotFound/NotFound";
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`

const Profile = () => {
  const { id } = useParams() 
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) {
    return;
  }
  const { check, setCheck } = context;

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await axios(`${backend}/user/isBlocked?id=${id}`, {
          headers: {
            Authorization: `bearer ${Cookies.get('jwt')}`
          }
        })
        setCheck(res.data.isBlocked)
      }
      catch (err) {
        setCheck(true)
      }
    }
    fetcher()
  }, []);

  if (isLoggedIn == 2) return <LoginPage />;
  if (check) return <NotFound/>

  return (
    <div>
      <Header />
      <div className={styles.Home}>
        <div><BoxContainer prop={id}/></div>
      </div>
    </div>
  );
};

export default Profile;
