import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import styles from "./SettingsPage.module.css"
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";

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

  const fetcher = async (url: string) => {
    console.log("heer");
    try {
      const res = await axios(url, {
        headers: {
          Authorization: `bearer ${Cookies.get('jwt')}`
        }
      });
      console.log(res.data)
      return res.data
    }
    catch (err) {
      console.log("error is ::", err)
    }
  }

  const {data} = useSWR(`${import.meta.env.VITE_DOMAIN}:8000/api/user/getAvatar`, fetcher)

  console.log(`${import.meta.env.VITE_DOMAIN}:8000/api/user/getAvatar`, "------===------", data)

  if (isLoggedIn == 2) return <LoginPage />;

  return (
    <div>
      <Header />
      <div className={styles.Profile}>
        <div className={styles.Sbox}>
          <img src={data.avatar} alt="Player's avatar" className={styles.Savatar}/>
          <label className={styles.Sbox_button1}>Upload image
            <input name="myImage" type="file" accept="image/*"/>
          </label>
          {/* <button className={styles.Sbox_button1}>Edit Picture </button > */}
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
